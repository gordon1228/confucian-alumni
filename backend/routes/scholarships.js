// routes/scholarships.js
const express = require('express');
const { body } = require('express-validator');
const scholarshipController = require('../controllers/scholarshipController');
const { validateRequest } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation rules
const scholarshipValidation = [
  body('scholarshipId').isNumeric().withMessage('请选择奖学金类型'),
  body('applicantName').notEmpty().withMessage('申请人姓名不能为空'),
  body('parentName').notEmpty().withMessage('家长姓名不能为空'),
  body('email').isEmail().withMessage('请提供有效的邮箱地址'),
  body('phone').notEmpty().withMessage('电话号码不能为空'),
  body('school').notEmpty().withMessage('就读学校不能为空'),
  body('grade').notEmpty().withMessage('年级不能为空')
];

// Routes
router.get('/', scholarshipController.getAllScholarships);
router.post('/apply', 
  upload.fields([
    { name: 'transcript', maxCount: 1 },
    { name: 'recommendation', maxCount: 2 },
    { name: 'income_proof', maxCount: 1 }
  ]),
  scholarshipValidation,
  validateRequest,
  scholarshipController.applyScholarship
);
router.get('/applications/:id', scholarshipController.getApplicationById);

module.exports = router;