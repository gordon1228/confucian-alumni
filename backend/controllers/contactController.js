// controllers/contactController.js
const contactController = {
  sendContact: (req, res) => {
    // In a real application, save to database and send email notification
    const contactMessage = {
      id: Date.now(),
      ...req.body,
      status: 'new',
      createdAt: new Date()
    };

    res.json({
      success: true,
      message: '消息发送成功！我们会尽快回复您',
      data: { messageId: contactMessage.id }
    });
  }
};

module.exports = contactController;