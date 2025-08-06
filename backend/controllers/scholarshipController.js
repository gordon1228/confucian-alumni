// backend/controllers/scholarshipController.js - Updated for SQL Server
const { Scholarship, ScholarshipApplication } = require('../models');

const scholarshipController = {
  // Get all scholarships
  getAllScholarships: async (req, res) => {
    try {
      const { type, status } = req.query;
      const conditions = {};
      
      if (type) conditions.type = type;
      if (status) conditions.status = status;

      const scholarships = await Scholarship.findAll(conditions, 'created_at DESC');
      
      // Parse requirements from text to array
      const formattedScholarships = scholarships.map(scholarship => ({
        ...scholarship,
        requirements: scholarship.requirements ? scholarship.requirements.split(';') : []
      }));

      res.json({ 
        success: true, 
        data: formattedScholarships 
      });
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      res.status(500).json({
        success: false,
        message: '获取奖学金列表失败'
      });
    }
  },

  // Get single scholarship
  getScholarshipById: async (req, res) => {
    try {
      const scholarship = await Scholarship.findById(parseInt(req.params.id));
      
      if (!scholarship) {
        return res.status(404).json({ 
          success: false, 
          message: '奖学金不存在' 
        });
      }

      // Parse requirements from text to array
      const formattedScholarship = {
        ...scholarship,
        requirements: scholarship.requirements ? scholarship.requirements.split(';') : []
      };

      res.json({ 
        success: true, 
        data: formattedScholarship 
      });
    } catch (error) {
      console.error('Error fetching scholarship:', error);
      res.status(500).json({
        success: false,
        message: '获取奖学金详情失败'
      });
    }
  },

  // Apply for scholarship
  applyScholarship: async (req, res) => {
    try {
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

      const newApplication = await ScholarshipApplication.createWithFiles(req.body, req.files || {});

      res.status(201).json({
        success: true,
        message: '奖学金申请提交成功！我们会在2周内审核',
        data: {
          applicationId: newApplication.id,
          referenceNumber: `SCH${Date.now()}`
        }
      });
    } catch (error) {
      console.error('Error applying for scholarship:', error);
      res.status(500).json({
        success: false,
        message: '奖学金申请提交失败'
      });
    }
  },

  // Get application by ID
  getApplicationById: async (req, res) => {
    try {
      const application = await ScholarshipApplication.findById(parseInt(req.params.id));
      
      if (!application) {
        return res.status(404).json({ 
          success: false, 
          message: '申请不存在' 
        });
      }

      res.json({ 
        success: true, 
        data: application 
      });
    } catch (error) {
      console.error('Error fetching scholarship application:', error);
      res.status(500).json({
        success: false,
        message: '获取申请信息失败'
      });
    }
  }
};

module.exports = scholarshipController;
// This controller handles scholarship-related operations such as fetching scholarships, applying for scholarships, and retrieving application details.
// It includes methods for getting all scholarships, fetching a single scholarship by ID, and submitting applications with file uploads.
// It also supports filtering scholarships by type and status, and formats requirements from text to an array