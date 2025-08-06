// backend/controllers/statsController.js - Updated for SQL Server
const { Event, News, Member, ScholarshipApplication } = require('../models');

const statsController = {
  getStats: async (req, res) => {
    try {
      const [
        memberStats,
        allEvents,
        allNews,
        scholarshipApps
      ] = await Promise.all([
        Member.getStats(),
        Event.findAll(),
        News.findAll(),
        ScholarshipApplication.findAll()
      ]);

      const stats = {
        members: {
          total: memberStats.total || 0,
          active: memberStats.active || 0,
          pending: memberStats.pending || 0,
          bySchool: {
            '尊孔小学': memberStats.primary_school || 0,
            '尊孔国中': memberStats.secondary_school || 0,
            '尊孔独中': memberStats.independent_school || 0
          }
        },
        events: {
          total: allEvents.length,
          upcoming: allEvents.filter(e => e.status === 'upcoming').length,
          ongoing: allEvents.filter(e => e.status === 'ongoing').length,
          completed: allEvents.filter(e => e.status === 'completed').length
        },
        scholarships: {
          totalApplications: scholarshipApps.length,
          pending: scholarshipApps.filter(s => s.status === 'pending').length,
          approved: scholarshipApps.filter(s => s.status === 'approved').length,
          rejected: scholarshipApps.filter(s => s.status === 'rejected').length
        },
        news: {
          total: allNews.length,
          published: allNews.filter(n => n.published).length,
          featured: allNews.filter(n => n.featured).length,
          totalViews: allNews.reduce((sum, article) => sum + (article.views || 0), 0)
        }
      };

      res.json({ 
        success: true, 
        data: stats 
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        message: '获取统计数据失败'
      });
    }
  }
};

module.exports =  statsController ;
// This controller provides an overview of the system's statistics, including member counts, event statuses, scholarship applications, and news articles.
// It aggregates data from multiple models to present a comprehensive view of the platform's activity and status.
// It includes methods for fetching total members, events, news articles, and scholarship applications, along with their respective statuses and counts.
// The stats are structured to provide insights into the platform's engagement and operational metrics.