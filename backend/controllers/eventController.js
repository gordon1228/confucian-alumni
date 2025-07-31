// controllers/eventController.js
const { events, generateId } = require('../config/database');

const eventController = {
  // Get all events
  getAllEvents: (req, res) => {
    const { category, status, limit } = req.query;
    let filteredEvents = [...events];

    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }

    if (status) {
      filteredEvents = filteredEvents.filter(event => event.status === status);
    }

    if (limit) {
      filteredEvents = filteredEvents.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      data: filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  },

  // Get single event
  getEventById: (req, res) => {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) {
      return res.status(404).json({ success: false, message: '活动不存在' });
    }
    res.json({ success: true, data: event });
  },

  // Create new event
  createEvent: (req, res) => {
    const newEvent = {
      id: generateId(events),
      ...req.body,
      status: 'upcoming',
      currentParticipants: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    events.push(newEvent);
    res.status(201).json({ success: true, data: newEvent });
  },

  // Register for event
  registerForEvent: (req, res) => {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) {
      return res.status(404).json({ success: false, message: '活动不存在' });
    }

    if (!event.registrationOpen) {
      return res.status(400).json({ success: false, message: '活动报名已关闭' });
    }

    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: '活动报名已满' });
    }

    event.currentParticipants += 1;
    event.updatedAt = new Date();

    res.json({
      success: true,
      message: '报名成功！我们会通过邮件联系您',
      data: {
        eventId: event.id,
        eventTitle: event.title,
        registrationNumber: `REG${Date.now()}`
      }
    });
  }
};

module.exports = eventController;