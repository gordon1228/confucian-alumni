// controllers/memberController.js
const { members, generateId } = require('../config/database');

const memberController = {
  // Get all members
  getAllMembers: (req, res) => {
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
  },

  // Register new member
  registerMember: (req, res) => {
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
  }
};

module.exports = memberController;