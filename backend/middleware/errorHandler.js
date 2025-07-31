// middleware/errorHandler.js
const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  
  // Multer error handling
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超出限制'
      });
    }
  }

  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
};

module.exports = { errorHandler, notFoundHandler };