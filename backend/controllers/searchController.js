// backend/controllers/searchController.js - Updated for SQL Server
const { Event, News } = require('../models');

const searchController = {
  search: async (req, res) => {
    try {
      const { q, type } = req.query;
      
      if (!q) {
        return res.status(400).json({ 
          success: false, 
          message: '请提供搜索关键词' 
        });
      }

      const searchTerm = q.toLowerCase();
      let results = [];

      if (!type || type === 'events') {
        const events = await Event.findAll();
        const eventResults = events.filter(event =>
          event.title.toLowerCase().includes(searchTerm) ||
          (event.description && event.description.toLowerCase().includes(searchTerm))
        ).map(event => ({ ...event, type: 'event' }));
        results = results.concat(eventResults);
      }

      if (!type || type === 'news') {
        const news = await News.getPublished();
        const newsResults = news.filter(article =>
          article.title.toLowerCase().includes(searchTerm) ||
          (article.content && article.content.toLowerCase().includes(searchTerm))
        ).map(article => ({ ...article, type: 'news' }));
        results = results.concat(newsResults);
      }

      res.json({
        success: true,
        data: results.slice(0, 20), // Limit to 20 results
        total: results.length
      });
    } catch (error) {
      console.error('Error performing search:', error);
      res.status(500).json({
        success: false,
        message: '搜索失败'
      });
    }
  }
};

module.exports = searchController;
// This controller handles search functionality across events and news articles.  
// It allows users to search by keywords and returns results from both categories, with a limit on the number of results returned.