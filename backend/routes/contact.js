// routes/contact.js
const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const contactValidation = [
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('email').isEmail().withMessage('请提供有效的邮箱地址'),
  body('subject').notEmpty().withMessage('主题不能为空'),
  body('message').notEmpty().withMessage('消息内容不能为空')
];

// Routes
router.post('/', contactValidation, validateRequest, contactController.sendContact);

module.exports = router;