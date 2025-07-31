// controllers/searchController.js
const { events, news } = require('../config/database');

const searchController = {
  search: (req, res) => {
    const { q, type } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, message: '请提供搜索关键词' });
    }

    const searchTerm = q.toLowerCase();
    let results = [];

    if (!type || type === 'events') {
      const eventResults = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm)
      ).map(event => ({ ...event, type: 'event' }));
      results = results.concat(eventResults);
    }

    if (!type || type === 'news') {
      const newsResults = news.filter(article =>
        article.published &&
        (article.title.toLowerCase().includes(searchTerm) ||
         article.content.toLowerCase().includes(searchTerm))
      ).map(article => ({ ...article, type: 'news' }));
      results = results.concat(newsResults);
    }

    res.json({
      success: true,
      data: results.slice(0, 20), // Limit to 20 results
      total: results.length
    });
  }
};

module.exports = searchController;