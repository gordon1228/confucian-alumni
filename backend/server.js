// backend/server.js - Fixed Database Connection
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import database configuration
const { initializeDatabase, getDB } = require('./config/database');

// Import routes
const eventRoutes = require('./routes/events');
const newsRoutes = require('./routes/news');
const memberRoutes = require('./routes/members');
const scholarshipRoutes = require('./routes/scholarships');
const dashboardRoutes = require('./routes/dashboard');
const contactRoutes = require('./routes/contact');
const searchRoutes = require('./routes/search');
const statsRoutes = require('./routes/stats');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Start Server Function
const startServer = async () => {
  try {
    // ✅ Fixed: Properly initialize database connection first
    console.log('🔌 Initializing database connection...');
    await initializeDatabase;
    
    // Test the connection
    const pool = await getDB();
    console.log('✅ Database connection verified');
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('📁 Created uploads directory');
    }

    // Security middleware
    app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || (process.env.NODE_ENV === 'production' ? 100 : 1000),
      message: {
        success: false,
        message: '请求过于频繁，请稍后再试'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use(limiter);

    // CORS configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://127.0.0.1:3000'];

    const corsOptions = {
      origin: process.env.NODE_ENV === 'production' 
        ? allowedOrigins
        : true,
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };
    app.use(cors(corsOptions));

    // Basic middleware
    app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf) => {
        req.rawBody = buf;
      }
    }));
    app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb' 
    }));

    // Static file serving
    app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
      maxAge: '1d',
      etag: false
    }));

    // Request logging middleware (for development)
    if (process.env.NODE_ENV === 'development') {
      app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }

    // Health check endpoint
    app.get('/health', async (req, res) => {
      try {
        // Test database connection
        const pool = await getDB();
        const result = await pool.request().query('SELECT 1 as health_check');
        
        res.json({ 
          success: true, 
          message: '服务器运行正常',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          version: '1.0.0',
          database: 'connected'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: '数据库连接异常',
          error: error.message
        });
      }
    });

    // API Routes
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/events', eventRoutes);
    app.use('/api/news', newsRoutes);
    app.use('/api/members', memberRoutes);
    app.use('/api/scholarships', scholarshipRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/search', searchRoutes);
    app.use('/api/stats', statsRoutes);

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({
        success: true,
        message: '欢迎访问雪隆尊孔学校校友会API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          api: '/api/*'
        }
      });
    });

    // Error handling middleware
    app.use(notFoundHandler);
    app.use(errorHandler);

    // Graceful shutdown handlers
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received, shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed');
        const { closeDB } = require('./config/database');
        closeDB().then(() => {
          console.log('Database connections closed');
          process.exit(0);
        }).catch((error) => {
          console.error('Error closing database connections:', error);
          process.exit(1);
        });
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    // Start server
    const server = app.listen(PORT, () => {
      console.log('🚀 =================================');
      console.log(`🚀 雪隆尊孔学校校友会 API 服务器启动成功`);
      console.log(`🚀 =================================`);
      console.log(`📱 本地访问: http://localhost:${PORT}`);
      console.log(`🏥 健康检查: http://localhost:${PORT}/health`);
      console.log(`📁 文件上传目录: ${path.join(__dirname, 'uploads')}`);
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 数据库: SQL Server - Connected`);
      console.log('🚀 =================================');
    });

    // Set server timeout
    server.timeout = 30000; // 30 seconds
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    // If it's a database connection error, provide helpful tips
    if (error.message.includes('Failed to connect') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Database Connection Tips:');
      console.log('1. Make sure SQL Server is running');
      console.log('2. Check your .env file for correct database credentials');
      console.log('3. Verify the server name and port number');
      console.log('4. Ensure the database exists');
      console.log('5. Check firewall settings');
    }
    
    process.exit(1);
  }
};

app.get('/api/debug/events', async (req, res) => {
  try {
    const { getDB } = require('./config/database');
    const pool = await getDB();
    
    // Raw SQL query to see what's actually in the database
    const result = await pool.request().query(`
      SELECT TOP 5 
        id,
        title,
        event_date,
        event_time,
        CONVERT(varchar, event_date, 23) as formatted_date,
        CONVERT(varchar, event_time, 108) as formatted_time
      FROM events 
      ORDER BY id DESC
    `);
    
    console.log('Raw database result:', result.recordset);
    
    // Also test the model transformation
    const { Event } = require('./models');
    const modelResult = await Event.findAll({}, 'id DESC', 5);
    
    console.log('Model transformed result:', modelResult);
    
    res.json({
      success: true,
      data: {
        raw: result.recordset,
        transformed: modelResult,
        debug: {
          message: 'Check server console for detailed logs'
        }
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Also add this helper function to format dates consistently
const formatEventDate = (dateValue) => {
  if (!dateValue) return null;
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', dateValue);
      return null;
    }
    
    // Return in YYYY-MM-DD format
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

module.exports = { formatEventDate };

// Start the server
startServer();

module.exports = app;