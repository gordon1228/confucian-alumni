// backend/config/database.js - Fixed SQL Server Configuration
const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'confucian_alumni',
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT) || 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: process.env.NODE_ENV === 'production', // Use encryption in production
    trustServerCertificate: true, // For development only
    enableArithAbort: true,
    connectionTimeout: 60000,
    requestTimeout: 60000
  }
};

let poolPromise;

const initializeDatabase = async () => {
  try {
    console.log('🔌 Connecting to SQL Server...');
    console.log('Server:', config.server);
    console.log('Database:', config.database);
    console.log('User:', config.user);
    
    poolPromise = new sql.ConnectionPool(config).connect();
    const pool = await poolPromise;
    console.log('✅ Connected to SQL Server successfully');
    
    // Test the connection
    const testResult = await pool.request().query('SELECT 1 as test');
    console.log('✅ Database connection test successful:', testResult.recordset);
    
    // Initialize tables if they don't exist
    await createTables(pool);
    
    return pool;
  } catch (error) {
    console.error('❌ SQL Server connection failed:', error);
    console.error('Connection config:', {
      server: config.server,
      database: config.database,
      user: config.user,
      port: config.port
    });
    throw error;
  }
};

const getDB = async () => {
  try {
    if (!poolPromise) {
      console.log('⚠️  Database pool not initialized, initializing now...');
      await initializeDatabase();
    }
    
    const pool = await poolPromise;
    if (!pool || !pool.connected) {
      console.log('⚠️  Database pool not connected, reconnecting...');
      poolPromise = new sql.ConnectionPool(config).connect();
      const newPool = await poolPromise;
      return newPool;
    }
    
    return pool;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    // Try to reconnect
    try {
      console.log('🔄 Attempting to reconnect to database...');
      poolPromise = new sql.ConnectionPool(config).connect();
      const pool = await poolPromise;
      console.log('✅ Reconnected successfully');
      return pool;
    } catch (reconnectError) {
      console.error('❌ Reconnection failed:', reconnectError);
      throw reconnectError;
    }
  }
};

const closeDB = async () => {
  try {
    const pool = await getDB(); // ✅ Fixed: await the getDB function
    await pool.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

// ✅ Added: Create tables function that was referenced but missing
const createTables = async (pool) => {
  try {
    // Create Members table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='members' AND xtype='U')
      CREATE TABLE members (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) UNIQUE NOT NULL,
        phone NVARCHAR(20),
        graduation_year INT,
        school NVARCHAR(100),
        membership_type NVARCHAR(50) DEFAULT 'regular',
        status NVARCHAR(20) DEFAULT 'pending',
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Events table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='events' AND xtype='U')
      CREATE TABLE events (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(200) NOT NULL,
        description NTEXT,
        event_date DATE NOT NULL,
        event_time TIME,
        location NVARCHAR(200),
        category NVARCHAR(50),
        max_participants INT,
        current_participants INT DEFAULT 0,
        registration_open BIT DEFAULT 1,
        status NVARCHAR(20) DEFAULT 'upcoming',
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create News table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='news' AND xtype='U')
      CREATE TABLE news (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(200) NOT NULL,
        content NTEXT,
        author NVARCHAR(100) DEFAULT '管理员',
        category NVARCHAR(50),
        featured BIT DEFAULT 0,
        published BIT DEFAULT 0,
        views INT DEFAULT 0,
        publish_date DATE,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Scholarships table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='scholarships' AND xtype='U')
      CREATE TABLE scholarships (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(200) NOT NULL,
        description NTEXT,
        amount DECIMAL(10,2),
        type NVARCHAR(50),
        requirements NTEXT,
        deadline DATE,
        status NVARCHAR(20) DEFAULT 'open',
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Scholarship Applications table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='scholarship_applications' AND xtype='U')
      CREATE TABLE scholarship_applications (
        id INT IDENTITY(1,1) PRIMARY KEY,
        scholarship_id INT,
        applicant_name NVARCHAR(100) NOT NULL,
        applicant_email NVARCHAR(255) NOT NULL,
        applicant_phone NVARCHAR(20),
        school NVARCHAR(100),
        graduation_year INT,
        gpa DECIMAL(3,2),
        transcript_file NVARCHAR(255),
        recommendation_file NVARCHAR(255),
        income_proof_file NVARCHAR(255),
        essay NTEXT,
        status NVARCHAR(20) DEFAULT 'pending',
        submitted_at DATETIME DEFAULT GETDATE(),
        reviewed_at DATETIME,
        FOREIGN KEY (scholarship_id) REFERENCES scholarships(id)
      )
    `);

    // Create Event Registrations table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='event_registrations' AND xtype='U')
      CREATE TABLE event_registrations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        event_id INT,
        registration_number NVARCHAR(50) UNIQUE,
        participant_name NVARCHAR(100) NOT NULL,
        participant_email NVARCHAR(255) NOT NULL,
        participant_phone NVARCHAR(20),
        special_requirements NTEXT,
        registered_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (event_id) REFERENCES events(id)
      )
    `);

    // Create Contact Messages table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='contact_messages' AND xtype='U')
      CREATE TABLE contact_messages (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        phone NVARCHAR(20),
        subject NVARCHAR(200),
        message NTEXT NOT NULL,
        status NVARCHAR(20) DEFAULT 'new',
        created_at DATETIME DEFAULT GETDATE(),
        replied_at DATETIME
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

module.exports = {
  initializeDatabase: initializeDatabase(), // ✅ Export the promise, not just the function
  getDB,
  closeDB,
  sql
};