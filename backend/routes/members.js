// routes/members.js
const express = require('express');
const { body } = require('express-validator');
const memberController = require('../controllers/memberController');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const memberValidation = [
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('email').isEmail().withMessage('请提供有效的邮箱地址'),
  body('phone').notEmpty().withMessage('电话号码不能为空'),
  body('graduationYear').isNumeric().withMessage('请提供有效的毕业年份'),
  body('school').notEmpty().withMessage('请选择母校')
];

// Routes
router.get('/', memberController.getAllMembers);
router.post('/register', memberValidation, validateRequest, memberController.registerMember);

module.exports = router;