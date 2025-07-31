// config/database.js - In-memory data storage (replace with real database)
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
  // ... other events
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
  // ... other news
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

// Helper function
const generateId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};

module.exports = {
  events,
  news,
  members,
  scholarshipApplications,
  generateId
};