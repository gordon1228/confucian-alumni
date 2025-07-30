// server.js - Express Backend for Confucian Alumni Website
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许图片和文档文件'));
    }
  }
});

// In-memory data storage (in production, use a real database)
let events = [
  {
    id: 1,
    title: '尊孔独中 59週年會慶午宴',
    date: '2025-10-12',
    time: '12:00 PM',
    location: '吉隆坡希尔顿酒店',
    category: '母校活动',
    description: '庆祝尊孔独中59周年校庆午宴活动，邀请各届校友共襄盛举',
    status: 'upcoming',
    registrationOpen: true,
    maxParticipants: 500,
    currentParticipants: 234,
    createdAt: new Date('2025-07-13'),
    updatedAt: new Date('2025-07-13')
  },
  {
    id: 2,
    title: '2025年度会员子女学业优秀奖励金',
    date: '2025-07-03',
    time: '申请截止日期：2025-08-31',
    location: '线上申请',
    category: '本会活动',
    description: '开始申请年度会员子女学业优秀奖励金，鼓励学子继续努力',
    status: 'ongoing',
    registrationOpen: true,
    maxParticipants: null,
    currentParticipants: 45,
    createdAt: new Date('2025-07-03'),
    updatedAt: new Date('2025-07-03')
  },
  {
    id: 3,
    title: '第42届执委会职务正式敲定',
    date: '2025-05-15',
    time: '7:00 PM',
    location: '校友会会所',
    category: '本会活动',
    description: '新一届执委会职务分配完成，各职位负责人正式就职',
    status: 'completed',
    registrationOpen: false,
    maxParticipants: 100,
    currentParticipants: 100,
    createdAt: new Date('2025-05-15'),
    updatedAt: new Date('2025-05-15')
  }
];

let news = [
  {
    id: 1,
    title: '2025会员大会暨改选成功举行',
    date: '2025-04-30',
    author: '秘书处',
    category: '会议报告',
    content: '本会于2025年4月30日成功举行会员大会暨执委会改选。会议中讨论了推動性别伦理与心理支援机制等重要议题，并选出新一届执委会成员。',
    excerpt: '推動性别伦理与心理支援机制相关议题讨论',
    featured: true,
    published: true,
    views: 856,
    createdAt: new Date('2025-04-30'),
    updatedAt: new Date('2025-04-30')
  },
  {
    id: 2,
    title: '校友会新执委团队正式就职',
    date: '2025-04-27',
    author: '宣传组',
    category: '人事消息',
    content: '经过民主选举，新一届执委会团队正式就职。新团队将继续秉承服务校友、传承华教精神的宗旨，为校友提供更好的服务。',
    excerpt: '新一届执委会团队正式就职，为校友服务',
    featured: false,
    published: true,
    views: 423,
    createdAt: new Date('2025-04-27'),
    updatedAt: new Date('2025-04-27')
  }
];

let members = [
  {
    id: 1,
    name: '张三',
    email: 'zhang@example.com',
    phone: '+60123456789',
    graduationYear: '1995',
    school: '尊孔独中',
    membershipType: 'lifetime',
    status: 'active',
    joinDate: new Date('2020-01-15'),
    lastActivity: new Date('2025-07-20')
  }
];

let scholarshipApplications = [];

// Helper function to generate unique ID
const generateId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};

// Routes

// Home/Dashboard
app.get('/api/dashboard', (req, res) => {
  const upcomingEvents = events.filter(event => event.status === 'upcoming').slice(0, 3);
  const latestNews = news.filter(article => article.published).slice(0, 3);
  const stats = {
    totalMembers: members.length,
    upcomingEvents: events.filter(event => event.status === 'upcoming').length,
    activeScholarships: scholarshipApplications.filter(app => app.status === 'pending').length,
    totalEvents: events.length
  };

  res.json({
    success: true,
    data: {
      upcomingEvents,
      latestNews,
      stats
    }
  });
});

// Events API
app.get('/api/events', (req, res) => {
  const { category, status, limit } = req.query;
  let filteredEvents = [...events];

  if (category) {
    filteredEvents = filteredEvents.filter(event => event.category === category);
  }

  if (status) {
    filteredEvents = filteredEvents.filter(event => event.status === status);
  }

  if (limit) {
    filteredEvents = filteredEvents.slice(0, parseInt(limit));
  }

  res.json({
    success: true,
    data: filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date))
  });
});

app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) {
    return res.status(404).json({ success: false, message: '活动不存在' });
  }
  res.json({ success: true, data: event });
});

app.post('/api/events', [
  body('title').notEmpty().withMessage('活动标题不能为空'),
  body('date').isISO8601().withMessage('请提供有效的日期'),
  body('category').notEmpty().withMessage('请选择活动类别')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const newEvent = {
    id: generateId(events),
    ...req.body,
    status: 'upcoming',
    currentParticipants: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  events.push(newEvent);
  res.status(201).json({ success: true, data: newEvent });
});

// Event Registration
app.post('/api/events/:id/register', [
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('email').isEmail().withMessage('请提供有效的邮箱地址'),
  body('phone').notEmpty().withMessage('电话号码不能为空')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) {
    return res.status(404).json({ success: false, message: '活动不存在' });
  }

  if (!event.registrationOpen) {
    return res.status(400).json({ success: false, message: '活动报名已关闭' });
  }

  if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
    return res.status(400).json({ success: false, message: '活动报名已满' });
  }

  // In a real application, save registration to database
  event.currentParticipants += 1;
  event.updatedAt = new Date();

  res.json({
    success: true,
    message: '报名成功！我们会通过邮件联系您',
    data: {
      eventId: event.id,
      eventTitle: event.title,
      registrationNumber: `REG${Date.now()}`
    }
  });
});

// News API
app.get('/api/news', (req, res) => {
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
});

app.get('/api/news/:id', (req, res) => {
  const article = news.find(n => n.id === parseInt(req.params.id));
  if (!article || !article.published) {
    return res.status(404).json({ success: false, message: '文章不存在' });
  }

  // Increment view count
  article.views = (article.views || 0) + 1;

  res.json({ success: true, data: article });
});

app.post('/api/news', [
  body('title').notEmpty().withMessage('文章标题不能为空'),
  body('content').notEmpty().withMessage('文章内容不能为空'),
  body('category').notEmpty().withMessage('请选择文章类别')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

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
});

// Members API
app.get('/api/members', (req, res) => {
  const { school, graduationYear, status } = req.query;
  let filteredMembers = [...members];

  if (school) {
    filteredMembers = filteredMembers.filter(member => member.school === school);
  }

  if (graduationYear) {
    filteredMembers = filteredMembers.filter(member => member.graduationYear === graduationYear);
  }

  if (status) {
    filteredMembers = filteredMembers.filter(member => member.status === status);
  }

  // Remove sensitive information
  const publicMembers = filteredMembers.map(member => ({
    id: member.id,
    name: member.name,
    graduationYear: member.graduationYear,
    school: member.school,
    membershipType: member.membershipType,
    status: member.status
  }));

  res.json({ success: true, data: publicMembers });
});

app.post('/api/members/register', [
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('email').isEmail().withMessage('请提供有效的邮箱地址'),
  body('phone').notEmpty().withMessage('电话号码不能为空'),
  body('graduationYear').isNumeric().withMessage('请提供有效的毕业年份'),
  body('school').notEmpty().withMessage('请选择母校')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Check if email already exists
  const existingMember = members.find(member => member.email === req.body.email);
  if (existingMember) {
    return res.status(400).json({ success: false, message: '该邮箱已注册' });
  }

  const newMember = {
    id: generateId(members),
    ...req.body,
    membershipType: 'regular',
    status: 'pending',
    joinDate: new Date(),
    lastActivity: new Date()
  };

  members.push(newMember);
  res.status(201).json({
    success: true,
    message: '会员申请提交成功！我们会在3个工作日内审核',
    data: { memberId: newMember.id }
  });
});

// Scholarship Applications API
app.get('/api/scholarships', (req, res) => {
  const { type, status } = req.query;
  let scholarships = [
    {
      id: 1,
      name: '学业优秀奖励金',
      type: 'academic',
      description: '颁发给学业表现优秀的会员子女',
      amount: 'RM500-RM2000',
      deadline: '2025-08-31',
      requirements: [
        '申请人必须是本会会员子女',
        '学业成绩优异（GPA 3.5以上）',
        '提交成绩单和推荐信'
      ],
      applicationPeriod: '每年7月-8月',
      status: 'open'
    },
    {
      id: 2,
      name: '升学助学金',
      type: 'financial',
      description: '协助经济有困难的会员子女继续升学',
      amount: 'RM1000-RM5000',
      deadline: '2026-02-28',
      requirements: [
        '申请人必须是本会会员子女',
        '家庭月收入低于RM3000',
        '提交家庭收入证明和大学录取通知书'
      ],
      applicationPeriod: '每年1月-2月',
      status: 'upcoming'
    }
  ];

  if (type) {
    scholarships = scholarships.filter(scholarship => scholarship.type === type);
  }

  if (status) {
    scholarships = scholarships.filter(scholarship => scholarship.status === status);
  }

  res.json({ success: true, data: scholarships });
});

app.post('/api/scholarships/apply', upload.fields([
  { name: 'transcript', maxCount: 1 },
  { name: 'recommendation', maxCount: 2 },
  { name: 'income_proof', maxCount: 1 }
]), [
  body('scholarshipId').isNumeric().withMessage('请选择奖学金类型'),
  body('applicantName').notEmpty().withMessage('申请人姓名不能为空'),
  body('parentName').notEmpty().withMessage('家长姓名不能为空'),
  body('email').isEmail().withMessage('请提供有效的邮箱地址'),
  body('phone').notEmpty().withMessage('电话号码不能为空'),
  body('school').notEmpty().withMessage('就读学校不能为空'),
  body('grade').notEmpty().withMessage('年级不能为空')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const files = {};
  if (req.files) {
    Object.keys(req.files).forEach(key => {
      files[key] = req.files[key].map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size
      }));
    });
  }

  const newApplication = {
    id: generateId(scholarshipApplications),
    ...req.body,
    files,
    status: 'pending',
    submittedAt: new Date(),
    updatedAt: new Date()
  };

  scholarshipApplications.push(newApplication);

  res.status(201).json({
    success: true,
    message: '奖学金申请提交成功！我们会在2周内审核',
    data: {
      applicationId: newApplication.id,
      referenceNumber: `SCH${Date.now()}`
    }
  });
});

app.get('/api/scholarships/applications/:id', (req, res) => {
  const application = scholarshipApplications.find(app => app.id === parseInt(req.params.id));
  if (!application) {
    return res.status(404).json({ success: false, message: '申请不存在' });
  }

  res.json({ success: true, data: application });
});

// Contact/Feedback API
app.post('/api/contact', [
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('email').isEmail().withMessage('请提供有效的邮箱地址'),
  body('subject').notEmpty().withMessage('主题不能为空'),
  body('message').notEmpty().withMessage('消息内容不能为空')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // In a real application, save to database and send email notification
  const contactMessage = {
    id: Date.now(),
    ...req.body,
    status: 'new',
    createdAt: new Date()
  };

  res.json({
    success: true,
    message: '消息发送成功！我们会尽快回复您',
    data: { messageId: contactMessage.id }
  });
});

// Search API
app.get('/api/search', (req, res) => {
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
});

// Statistics API (for admin dashboard)
app.get('/api/stats', (req, res) => {
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
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`开发环境: http://localhost:${PORT}`);
  console.log('\n可用的API端点：');
  console.log('GET  /api/dashboard - 获取首页数据');
  console.log('GET  /api/events - 获取活动列表');
  console.log('POST /api/events/:id/register - 活动报名');
  console.log('GET  /api/news - 获取新闻列表');
  console.log('POST /api/members/register - 会员注册');
  console.log('GET  /api/scholarships - 获取奖学金信息');
  console.log('POST /api/scholarships/apply - 申请奖学金');
  console.log('POST /api/contact - 联系我们');
  console.log('GET  /api/search - 搜索');
  console.log('GET  /api/stats - 获取统计数据');
});

module.exports = app;