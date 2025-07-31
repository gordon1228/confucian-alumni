// utils/helpers.js
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN');
};

const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

const paginate = (array, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const paginatedItems = array.slice(offset, offset + limit);
  
  return {
    data: paginatedItems,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(array.length / limit),
      totalItems: array.length,
      hasNext: offset + limit < array.length,
      hasPrev: page > 1
    }
  };
};

module.exports = {
  formatDate,
  generateRandomString,
  validateEmail,
  sanitizeInput,
  paginate
};