// backend/controllers/contactController.js - Updated for SQL Server
const { ContactMessage } = require('../models');

const contactController = {
  sendContact: async (req, res) => {
    try {
      const contactMessage = await ContactMessage.create(req.body);

      res.json({
        success: true,
        message: '消息发送成功！我们会尽快回复您',
        data: { messageId: contactMessage.id }
      });
    } catch (error) {
      console.error('Error sending contact message:', error);
      res.status(500).json({
        success: false,
        message: '消息发送失败，请稍后重试'
      });
    }
  },

  // Get all contact messages (admin only)
  getAllMessages: async (req, res) => {
    try {
      const { status, limit } = req.query;
      const conditions = {};
      
      if (status) conditions.status = status;
      
      const messages = await ContactMessage.findAll(conditions, 'created_at DESC', limit ? parseInt(limit) : null);
      
      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      res.status(500).json({
        success: false,
        message: '获取消息列表失败'
      });
    }
  }
};

module.exports = contactController;
// backend/controllers/contactController.js - Updated for SQL Server
// This controller handles contact messages, allowing users to send messages and admins to retrieve them.