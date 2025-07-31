// controllers/dashboardController.js
const { events, news, members, scholarshipApplications } = require('../config/database');

const dashboardController = {
  getDashboard: (req, res) => {
    const upcomingEvents = events.filter(event => event.status === 'upcoming').slice(0, 3);
    const latestNews = news.filter(article => article.published).slice(0, 3);
    const stats = {
      totalMembers: members.length,
      upcomingEvents: events.filter(event => event.status === 'upcoming').length,
      activeScholarships: scholarshipApplications.filter(app => app.status === 'pending').length,
      totalEvents: events.length
    };

    res.json({
      success: true,
      data: {
        upcomingEvents,
        latestNews,
        stats
      }
    });
  }
};

module.exports = dashboardController;