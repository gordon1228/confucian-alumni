// server.js - Main Entry Point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const eventRoutes = require('./routes/events');
const newsRoutes = require('./routes/news');
const memberRoutes = require('./routes/members');
const scholarshipRoutes = require('./routes/scholarships');
const dashboardRoutes = require('./routes/dashboard');
const contactRoutes = require('./routes/contact');
const searchRoutes = require('./routes/search');
const statsRoutes = require('./routes/stats');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const uploadMiddleware = require('./middleware/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/stats', statsRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`开发环境: http://localhost:${PORT}`);
});

module.exports = app;