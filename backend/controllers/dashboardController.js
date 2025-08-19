// backend/controllers/dashboardController.js - Fixed Date Handling for Dashboard
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

      // ✅ Fix: Format upcoming events with proper date handling
      const formattedUpcomingEvents = upcomingEvents.map(event => ({
        ...event,
        // Ensure date fields are properly formatted
        date: event.eventDate || event.event_date,
        eventDate: event.eventDate || event.event_date,
        time: event.eventTime || event.event_time,
        eventTime: event.eventTime || event.event_time,
        // Add formatted date for easy display
        formattedDate: event.eventDate ? 
          new Date(event.eventDate).toISOString().split('T')[0] : 
          (event.event_date ? new Date(event.event_date).toISOString().split('T')[0] : null),
        // Add display date for Chinese format
        displayDate: event.eventDate ? 
          new Date(event.eventDate).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 
          (event.event_date ? new Date(event.event_date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : '日期待定')
      }));

      // ✅ Fix: Format latest news with proper date handling
      const formattedLatestNews = latestNews.map(article => ({
        ...article,
        // Format publish date
        publishDate: article.publishDate || article.publish_date,
        formattedPublishDate: article.publishDate ? 
          new Date(article.publishDate).toISOString().split('T')[0] : 
          (article.publish_date ? new Date(article.publish_date).toISOString().split('T')[0] : null),
        displayPublishDate: article.publishDate ? 
          new Date(article.publishDate).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 
          (article.publish_date ? new Date(article.publish_date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : '发布日期待定')
      }));

      const stats = {
        totalMembers: memberStats.total || 0,
        upcomingEvents: formattedUpcomingEvents.length || 0,
        activeScholarships: pendingApplications.length || 0,
        totalEvents: await Event.findAll().then(events => events.length)
      };

      // ✅ Debug: Log the formatted data to console
      console.log('Dashboard - Formatted upcoming events:', formattedUpcomingEvents.map(e => ({
        id: e.id,
        title: e.title,
        eventDate: e.eventDate,
        formattedDate: e.formattedDate,
        displayDate: e.displayDate
      })));

      res.json({
        success: true,
        data: {
          upcomingEvents: formattedUpcomingEvents,
          latestNews: formattedLatestNews,
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