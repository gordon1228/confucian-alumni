// backend/controllers/dashboardController.js - Updated for SQL Server
const { Event, News, Member, ScholarshipApplication } = require('../models');

const dashboardController = {
  getDashboard: async (req, res) => {
    try {
      const [upcomingEvents, latestNews, memberStats, pendingApplications] = await Promise.all([
        Event.getUpcoming(3),
        News.getFeatured(3),
        Member.getStats(),
        ScholarshipApplication.getByStatus('pending')
      ]);

      const stats = {
        totalMembers: memberStats.total || 0,
        upcomingEvents: upcomingEvents.length || 0,
        activeScholarships: pendingApplications.length || 0,
        totalEvents: await Event.findAll().then(events => events.length)
      };

      res.json({
        success: true,
        data: {
          upcomingEvents,
          latestNews,
          stats
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({
        success: false,
        message: '获取仪表板数据失败'
      });
    }
  }
};

module.exports = dashboardController;
// This controller provides an overview of the dashboard, including upcoming events, latest news, and member statistics.
// It aggregates data from multiple models to present a comprehensive view for the admin dashboard.