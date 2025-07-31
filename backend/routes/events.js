// routes/events.js
const express = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/eventController');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const eventValidation = [
  body('title').notEmpty().withMessage('活动标题不能为空'),
  body('date').isISO8601().withMessage('请提供有效的日期'),
  body('category').notEmpty().withMessage('请选择活动类别')
];

const registrationValidation = [
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('email').isEmail().withMessage('请提供有效的邮箱地址'),
  body('phone').notEmpty().withMessage('电话号码不能为空')
];

// Routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventValidation, validateRequest, eventController.createEvent);
router.post('/:id/register', registrationValidation, validateRequest, eventController.registerForEvent);

module.exports = router;