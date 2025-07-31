// controllers/scholarshipController.js
const { scholarshipApplications, generateId } = require('../config/database');

const scholarshipController = {
  // Get all scholarships
  getAllScholarships: (req, res) => {
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
  },

  // Apply for scholarship
  applyScholarship: (req, res) => {
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
  },

  // Get application by ID
  getApplicationById: (req, res) => {
    const application = scholarshipApplications.find(app => app.id === parseInt(req.params.id));
    if (!application) {
      return res.status(404).json({ success: false, message: '申请不存在' });
    }

    res.json({ success: true, data: application });
  }
};

module.exports = scholarshipController;