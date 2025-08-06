// backend/controllers/eventController.js - Updated for SQL Server
const { Event, EventRegistration } = require('../models');

const eventController = {
  // Get all events
  getAllEvents: async (req, res) => {
    try {
      const { category, status, limit } = req.query;
      const conditions = {};
      
      if (category) conditions.category = category;
      if (status) conditions.status = status;
      
      const events = await Event.findAll(conditions, 'event_date DESC', limit ? parseInt(limit) : null);
      
      res.json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({
        success: false,
        message: '获取活动列表失败'
      });
    }
  },

  // Get single event
  getEventById: async (req, res) => {
    try {
      const event = await Event.findById(parseInt(req.params.id));
      
      if (!event) {
        return res.status(404).json({ 
          success: false, 
          message: '活动不存在' 
        });
      }
      
      res.json({ 
        success: true, 
        data: event 
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({
        success: false,
        message: '获取活动详情失败'
      });
    }
  },

  // Create new event
  createEvent: async (req, res) => {
    try {
      const eventData = {
        ...req.body,
        status: 'upcoming',
        current_participants: 0
      };

      const newEvent = await Event.create(eventData);
      
      res.status(201).json({ 
        success: true, 
        data: newEvent 
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({
        success: false,
        message: '创建活动失败'
      });
    }
  },

  // Register for event
  registerForEvent: async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await Event.findById(eventId);
      
      if (!event) {
        return res.status(404).json({ 
          success: false, 
          message: '活动不存在' 
        });
      }

      if (!event.registration_open) {
        return res.status(400).json({ 
          success: false, 
          message: '活动报名已关闭' 
        });
      }

      if (event.max_participants && event.current_participants >= event.max_participants) {
        return res.status(400).json({ 
          success: false, 
          message: '活动报名已满' 
        });
      }

      // Create registration record
      const registration = await EventRegistration.createRegistration(eventId, req.body);
      
      // Increment participant count
      await Event.incrementParticipants(eventId);

      res.json({
        success: true,
        message: '报名成功！我们会通过邮件联系您',
        data: {
          eventId: event.id,
          eventTitle: event.title,
          registrationNumber: registration.registration_number
        }
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      res.status(500).json({
        success: false,
        message: '报名失败，请稍后重试'
      });
    }
  }
};

module.exports = eventController;
// This controller handles events, allowing users to view, create, and register for events.
// It includes methods for fetching all events, getting a single event by ID, creating new events