// controllers/statsController.js
const { events, news, members, scholarshipApplications } = require('../config/database');

const statsController = {
  getStats: (req, res) => {
    const stats = {
      members: {
        total: members.length,
        active: members.filter(m => m.status === 'active').length,
        pending: members.filter(m => m.status === 'pending').length,
        bySchool: {
          '尊孔小学': members.filter(m => m.school === '尊孔小学').length,
          '尊孔国中': members.filter(m => m.school === '尊孔国中').length,
          '尊孔独中': members.filter(m => m.school === '尊孔独中').length
        }
      },
      events: {
        total: events.length,
        upcoming: events.filter(e => e.status === 'upcoming').length,
        ongoing: events.filter(e => e.status === 'ongoing').length,
        completed: events.filter(e => e.status === 'completed').length
      },
      scholarships: {
        totalApplications: scholarshipApplications.length,
        pending: scholarshipApplications.filter(s => s.status === 'pending').length,
        approved: scholarshipApplications.filter(s => s.status === 'approved').length,
        rejected: scholarshipApplications.filter(s => s.status === 'rejected').length
      },
      news: {
        total: news.length,
        published: news.filter(n => n.published).length,
        featured: news.filter(n => n.featured).length,
        totalViews: news.reduce((sum, article) => sum + (article.views || 0), 0)
      }
    };

    res.json({ success: true, data: stats });
  }
};

module.exports = statsController;