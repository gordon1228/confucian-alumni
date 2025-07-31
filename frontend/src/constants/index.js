// src/constants/index.js
export const SCHOOLS = [
  { value: '尊孔小学', label: '尊孔小学' },
  { value: '尊孔国中', label: '尊孔国中' },
  { value: '尊孔独中', label: '尊孔独中' }
];

export const EVENT_CATEGORIES = [
  { value: '母校活动', label: '母校活动' },
  { value: '本会活动', label: '本会活动' },
  { value: '联谊活动', label: '联谊活动' },
  { value: '教育活动', label: '教育活动' }
];

export const EVENT_STATUS = [
  { value: 'upcoming', label: '即将开始' },
  { value: 'ongoing', label: '进行中' },
  { value: 'completed', label: '已结束' }
];

export const NEWS_CATEGORIES = [
  { value: '会议报告', label: '会议报告' },
  { value: '人事消息', label: '人事消息' },
  { value: '活动报道', label: '活动报道' },
  { value: '校友动态', label: '校友动态' }
];

export const MEMBERSHIP_TYPES = [
  { value: 'regular', label: '普通会员' },
  { value: 'lifetime', label: '终身会员' },
  { value: 'honorary', label: '荣誉会员' }
];

export const SCHOLARSHIP_TYPES = [
  { value: 'academic', label: '学业优秀奖励金' },
  { value: 'financial', label: '升学助学金' },
  { value: 'special', label: '特殊奖学金' }
];

export const GRADUATION_YEARS = (() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
})();

export const FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  all: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB