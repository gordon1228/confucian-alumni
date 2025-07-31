// routes/news.js
const express = require('express');
const { body } = require('express-validator');
const newsController = require('../controllers/newsController');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const newsValidation = [
  body('title').notEmpty().withMessage('文章标题不能为空'),
  body('content').notEmpty().withMessage('文章内容不能为空'),
  body('category').notEmpty().withMessage('请选择文章类别')
];

// Routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', newsValidation, validateRequest, newsController.createNews);

module.exports = router;