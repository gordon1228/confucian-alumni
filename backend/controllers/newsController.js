// controllers/newsController.js
const { news, generateId } = require('../config/database');

const newsController = {
  // Get all news
  getAllNews: (req, res) => {
    const { category, featured, limit } = req.query;
    let filteredNews = news.filter(article => article.published);

    if (category) {
      filteredNews = filteredNews.filter(article => article.category === category);
    }

    if (featured === 'true') {
      filteredNews = filteredNews.filter(article => article.featured);
    }

    if (limit) {
      filteredNews = filteredNews.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      data: filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  },

  // Get single news article
  getNewsById: (req, res) => {
    const article = news.find(n => n.id === parseInt(req.params.id));
    if (!article || !article.published) {
      return res.status(404).json({ success: false, message: '文章不存在' });
    }

    // Increment view count
    article.views = (article.views || 0) + 1;

    res.json({ success: true, data: article });
  },

  // Create new news article
  createNews: (req, res) => {
    const newArticle = {
      id: generateId(news),
      ...req.body,
      author: req.body.author || '管理员',
      date: new Date().toISOString().split('T')[0],
      published: req.body.published || false,
      featured: req.body.featured || false,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    news.push(newArticle);
    res.status(201).json({ success: true, data: newArticle });
  }
};

module.exports = newsController;