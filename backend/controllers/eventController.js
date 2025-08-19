// backend/controllers/eventController.js - Fixed Date Handling for SQL Server
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
      
      // ✅ Fix date formatting for frontend
      const formattedEvents = events.map(event => ({
        ...event,
        // Ensure date is properly formatted
        date: event.eventDate || event.event_date, // Handle both camelCase and snake_case
        eventDate: event.eventDate || event.event_date,
        // Format time if exists
        time: event.eventTime || event.event_time,
        eventTime: event.eventTime || event.event_time,
        // Ensure date is in ISO format for frontend
        formattedDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : null
      }));
      
      res.json({
        success: true,
        data: formattedEvents
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

      // ✅ Fix date formatting for single event
      const formattedEvent = {
        ...event,
        date: event.eventDate || event.event_date,
        eventDate: event.eventDate || event.event_date,
        time: event.eventTime || event.event_time,
        eventTime: event.eventTime || event.event_time,
        formattedDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : null
      };
      
      res.json({ 
        success: true, 
        data: formattedEvent 
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
        current_participants: 0,
        // ✅ Ensure date fields are properly formatted
        event_date: req.body.date || req.body.eventDate || req.body.event_date,
        event_time: req.body.time || req.body.eventTime || req.body.event_time
      };

      // ✅ Validate date format
      if (eventData.event_date) {
        const date = new Date(eventData.event_date);
        if (isNaN(date.getTime())) {
          return res.status(400).json({
            success: false,
            message: '无效的日期格式'
          });
        }
        // Convert to SQL Server date format (YYYY-MM-DD)
        eventData.event_date = date.toISOString().split('T')[0];
      }

      const newEvent = await Event.create(eventData);
      
      // ✅ Format response with proper date fields
      const formattedEvent = {
        ...newEvent,
        date: newEvent.eventDate || newEvent.event_date,
        eventDate: newEvent.eventDate || newEvent.event_date,
        time: newEvent.eventTime || newEvent.event_time,
        eventTime: newEvent.eventTime || newEvent.event_time
      };
      
      res.status(201).json({ 
        success: true, 
        data: formattedEvent 
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

      if (!event.registrationOpen) {
        return res.status(400).json({ 
          success: false, 
          message: '活动报名已关闭' 
        });
      }

      if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
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
          registrationNumber: registration.registrationNumber || registration.registration_number
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