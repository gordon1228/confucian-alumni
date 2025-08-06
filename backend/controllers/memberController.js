// backend/controllers/memberController.js - Fixed for SQL Server with Data Transformation
const { Member } = require('../models');

const memberController = {
  // Get all members
  getAllMembers: async (req, res) => {
    try {
      const { school, graduationYear, status } = req.query;
      const conditions = {};
      
      if (school) conditions.school = school;
      if (graduationYear) conditions.graduationYear = graduationYear;
      if (status) conditions.status = status;

      const members = await Member.findAll(conditions, 'created_at DESC');
      
      // Remove sensitive information
      const publicMembers = members.map(member => ({
        id: member.id,
        name: member.name,
        graduationYear: member.graduationYear,
        school: member.school,
        membershipType: member.membershipType,
        status: member.status
      }));

      res.json({ 
        success: true, 
        data: publicMembers 
      });
    } catch (error) {
      console.error('Error fetching members:', error);
      res.status(500).json({
        success: false,
        message: '获取会员列表失败'
      });
    }
  },

  // Register new member
  registerMember: async (req, res) => {
    try {
      console.log('Received member registration data:', req.body);
      
      // Check if email already exists
      const existingMember = await Member.findByEmail(req.body.email);
      if (existingMember) {
        return res.status(400).json({ 
          success: false, 
          message: '该邮箱已注册' 
        });
      }

      // Prepare member data with proper defaults
      const memberData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || null,
        graduationYear: req.body.graduationYear || null,
        school: req.body.school || null,
        membershipType: req.body.membershipType || 'regular',
        status: 'pending'
      };

      console.log('Processed member data:', memberData);

      const newMember = await Member.create(memberData);
      
      res.status(201).json({
        success: true,
        message: '会员申请提交成功！我们会在3个工作日内审核',
        data: { memberId: newMember.id }
      });
    } catch (error) {
      console.error('Error registering member:', error);
      console.error('Error details:', error.message);
      res.status(500).json({
        success: false,
        message: '会员申请提交失败: ' + error.message
      });
    }
  }
};

module.exports = memberController;