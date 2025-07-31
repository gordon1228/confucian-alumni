// src/utils/validators.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/;
  return re.test(phone.replace(/\s|-/g, ''));
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return !value || value.toString().length <= maxLength;
};

export const validateFileSize = (file, maxSizeInMB) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const formValidator = {
  member: (data) => {
    const errors = {};
    
    if (!validateRequired(data.name)) {
      errors.name = '姓名不能为空';
    }
    
    if (!validateEmail(data.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    if (!validatePhone(data.phone)) {
      errors.phone = '请输入有效的电话号码';
    }
    
    if (!validateRequired(data.school)) {
      errors.school = '请选择母校';
    }
    
    if (!validateRequired(data.graduationYear)) {
      errors.graduationYear = '请输入毕业年份';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
  
  contact: (data) => {
    const errors = {};
    
    if (!validateRequired(data.name)) {
      errors.name = '姓名不能为空';
    }
    
    if (!validateEmail(data.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    if (!validateRequired(data.subject)) {
      errors.subject = '主题不能为空';
    }
    
    if (!validateRequired(data.message)) {
      errors.message = '消息内容不能为空';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};