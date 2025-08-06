// backend/controllers/newsController.js - Updated for SQL Server
const { News } = require('../models');

const newsController = {
  // Get all news
  getAllNews: async (req, res) => {
    try {
      const { category, featured, limit } = req.query;
      const conditions = {};
      
      if (category) conditions.category = category;
      if (featured === 'true') conditions.featured = 1;
      
      const news = await News.getPublished(conditions, limit ? parseInt(limit) : null);
      
      res.json({
        success: true,
        data: news
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({
        success: false,
        message: '获取新闻列表失败'
      });
    }
  },

  // Get single news article
  getNewsById: async (req, res) => {
    try {
      const article = await News.findById(parseInt(req.params.id));
      
      if (!article || !article.published) {
        return res.status(404).json({ 
          success: false, 
          message: '文章不存在' 
        });
      }

      // Increment view count
      await News.incrementViews(article.id);
      article.views = (article.views || 0) + 1;

      res.json({ 
        success: true, 
        data: article 
      });
    } catch (error) {
      console.error('Error fetching news article:', error);
      res.status(500).json({
        success: false,
        message: '获取文章详情失败'
      });
    }
  },

  // Create new news article
  createNews: async (req, res) => {
    try {
      const articleData = {
        ...req.body,
        author: req.body.author || '管理员',
        published: req.body.published || false,
        featured: req.body.featured || false,
        views: 0,
        publish_date: new Date().toISOString().split('T')[0]
      };

      const newArticle = await News.create(articleData);
      
      res.status(201).json({ 
        success: true, 
        data: newArticle 
      });
    } catch (error) {
      console.error('Error creating news article:', error);
      res.status(500).json({
        success: false,
        message: '创建文章失败'
      });
    }
  },

  // Update news article
  updateNews: async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const updatedArticle = await News.update(articleId, req.body);
      
      if (!updatedArticle) {
        return res.status(404).json({ 
          success: false, 
          message: '文章不存在' 
        });
      }

      res.json({ 
        success: true, 
        data: updatedArticle 
      });
    } catch (error) {
      console.error('Error updating news article:', error);
      res.status(500).json({
        success: false,
        message: '更新文章失败'
      });
    }
  },

  // Delete news article
  deleteNews: async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const deleted = await News.delete(articleId);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: '文章不存在' 
        });
      }

      res.json({ 
        success: true, 
        message: '文章删除成功' 
      });
    } catch (error) {
      console.error('Error deleting news article:', error);
      res.status(500).json({
        success: false,
        message: '删除文章失败'
      });
    }
  }
};

module.exports = newsController;
// This controller handles news articles, allowing users to view, create, update, and delete news.
// It includes methods for fetching all news articles, getting a single article by ID, and managing news content.
// It also supports filtering by category and featured status, and includes view count tracking.
