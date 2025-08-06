// backend/models/index.js - Fixed Database Models for SQL Server
const { getDB, sql } = require('../config/database');

// Base Model Class
class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findAll(conditions = {}, orderBy = 'id DESC', limit = null) {
    try {
      const pool = await getDB();
      
      // Transform camelCase conditions to snake_case
      const transformedConditions = this.transformToSnakeCase(conditions);
      
      let query = `SELECT * FROM ${this.tableName}`;
      
      if (Object.keys(transformedConditions).length > 0) {
        const whereClause = Object.keys(transformedConditions)
          .map(key => `${key} = @${key}`)
          .join(' AND ');
        query += ` WHERE ${whereClause}`;
      }
      
      query += ` ORDER BY ${orderBy}`;
      
      if (limit) {
        query += ` OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY`;
      }

      const request = pool.request();

      Object.keys(transformedConditions).forEach(key => {
        request.input(key, transformedConditions[key]);
      });
      
      const result = await request.query(query);
      // Transform results back to camelCase
      return result.recordset.map(row => this.transformToCamelCase(row));
    } catch (error) {
      console.error(`Error in findAll for ${this.tableName}:`, error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const pool = await getDB();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM ${this.tableName} WHERE id = @id`);
      
      const record = result.recordset[0] || null;
      return record ? this.transformToCamelCase(record) : null;
    } catch (error) {
      console.error(`Error in findById for ${this.tableName}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      const pool = await getDB();
      
      // Transform camelCase to snake_case for database columns
      const transformedData = this.transformToSnakeCase(data);
      
      const keys = Object.keys(transformedData);
      const values = keys.map(key => `@${key}`).join(', ');
      const columns = keys.join(', ');
      
      const query = `
        INSERT INTO ${this.tableName} (${columns}) 
        OUTPUT INSERTED.* 
        VALUES (${values})
      `;
      
      const request = pool.request();

      keys.forEach(key => {
        request.input(key, transformedData[key]);
      });

      const result = await request.query(query);
      return this.transformToCamelCase(result.recordset[0]);
    } catch (error) {
      console.error(`Error in create for ${this.tableName}:`, error);
      throw error;
    }
  }

  // Helper method to convert camelCase to snake_case
  transformToSnakeCase(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const transformed = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      transformed[snakeKey] = value;
    }
    return transformed;
  }

  // Helper method to convert snake_case to camelCase
  transformToCamelCase(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const transformed = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      transformed[camelKey] = value;
    }
    return transformed;
  }

  async update(id, data) {
    try {
      const pool = await getDB();
      
      // Transform camelCase to snake_case for database columns
      const transformedData = this.transformToSnakeCase(data);
      
      const updates = Object.keys(transformedData)
        .map(key => `${key} = @${key}`)
        .join(', ');
      
      const query = `
        UPDATE ${this.tableName} 
        SET ${updates}, updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `;
      
      const request = pool.request();

      request.input('id', sql.Int, id);
      Object.keys(transformedData).forEach(key => {
        request.input(key, transformedData[key]);
      });
      
      const result = await request.query(query);
      return result.recordset[0] ? this.transformToCamelCase(result.recordset[0]) : null;
    } catch (error) {
      console.error(`Error in update for ${this.tableName}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const pool = await getDB();
      await pool.request()
        .input('id', sql.Int, id)
        .query(`DELETE FROM ${this.tableName} WHERE id = @id`);
      
      return true;
    } catch (error) {
      console.error(`Error in delete for ${this.tableName}:`, error);
      throw error;
    }
  }
}

// Member Model
class Member extends BaseModel {
  constructor() {
    super('members');
  }

  async findByEmail(email) {
    try {
      const pool = await getDB();
      const result = await pool
        .request()
        .input('email', sql.NVarChar(255), email)
        .query('SELECT * FROM members WHERE email = @email');
      
      const record = result.recordset[0];
      return record ? this.transformToCamelCase(record) : null;
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const pool = await getDB();
      const result = await pool.request().query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN school = '尊孔小学' THEN 1 ELSE 0 END) as primary_school,
          SUM(CASE WHEN school = '尊孔国中' THEN 1 ELSE 0 END) as secondary_school,
          SUM(CASE WHEN school = '尊孔独中' THEN 1 ELSE 0 END) as independent_school
        FROM members
      `);
      
      return this.transformToCamelCase(result.recordset[0]);
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  }
}

// Event Model
class Event extends BaseModel {
  constructor() {
    super('events');
  }

  async getUpcoming(limit = 10) {
    try {
      const pool = await getDB();
      const result = await pool.request()
        .input('limit', sql.Int, limit)
        .query(`
          SELECT TOP (@limit) * FROM events 
          WHERE status = 'upcoming' AND event_date >= CAST(GETDATE() AS DATE)
          ORDER BY event_date ASC
        `);
      
      return result.recordset.map(row => this.transformToCamelCase(row));
    } catch (error) {
      console.error('Error in getUpcoming:', error);
      throw error;
    }
  }

  async incrementParticipants(id) {
    try {
      const pool = await getDB();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          UPDATE events 
          SET current_participants = current_participants + 1, updated_at = GETDATE()
          OUTPUT INSERTED.*
          WHERE id = @id
        `);
      
      return result.recordset[0] ? this.transformToCamelCase(result.recordset[0]) : null;
    } catch (error) {
      console.error('Error in incrementParticipants:', error);
      throw error;
    }
  }
}

// News Model
class News extends BaseModel {
  constructor() {
    super('news');
  }

  async getFeatured(limit = 3) {
    try {
      const pool = await getDB();
      const result = await pool.request()
        .input('limit', sql.Int, limit)
        .query(`
          SELECT TOP (@limit) * FROM news 
          WHERE featured = 1 AND published = 1
          ORDER BY publish_date DESC
        `);
      
      return result.recordset.map(row => this.transformToCamelCase(row));
    } catch (error) {
      console.error('Error in getFeatured:', error);
      throw error;
    }
  }

  async getPublished(conditions = {}, limit = null) {
    const publishedConditions = { ...conditions, published: 1 };
    return this.findAll(publishedConditions, 'publish_date DESC', limit);
  }

  async incrementViews(id) {
    try {
      const pool = await getDB();
      await pool.request()
        .input('id', sql.Int, id)
        .query('UPDATE news SET views = views + 1 WHERE id = @id');
      
      return true;
    } catch (error) {
      console.error('Error in incrementViews:', error);
      throw error;
    }
  }
}

// Scholarship Model
class Scholarship extends BaseModel {
  constructor() {
    super('scholarships');
  }

  async getActive() {
    return this.findAll({ status: 'open' }, 'created_at DESC');
  }
}

// Scholarship Application Model
class ScholarshipApplication extends BaseModel {
  constructor() {
    super('scholarship_applications');
  }

  async createWithFiles(data, files) {
    const applicationData = { ...data };
    
    // Handle file paths
    if (files.transcript) applicationData.transcript_file = files.transcript[0].filename;
    if (files.recommendation) applicationData.recommendation_file = files.recommendation[0].filename;
    if (files.income_proof) applicationData.income_proof_file = files.income_proof[0].filename;
    
    return this.create(applicationData);
  }

  async getByStatus(status) {
    return this.findAll({ status }, 'submitted_at DESC');
  }
}

// Event Registration Model
class EventRegistration extends BaseModel {
  constructor() {
    super('event_registrations');
  }

  async createRegistration(eventId, data) {
    const registrationNumber = `REG${Date.now()}`;
    const registrationData = {
      event_id: eventId,
      registration_number: registrationNumber,
      ...data
    };
    
    return this.create(registrationData);
  }

  async getByEvent(eventId) {
    return this.findAll({ event_id: eventId }, 'registered_at DESC');
  }
}

// Contact Message Model
class ContactMessage extends BaseModel {
  constructor() {
    super('contact_messages');
  }

  async getUnread() {
    return this.findAll({ status: 'new' }, 'created_at DESC');
  }

  async markAsRead(id) {
    return this.update(id, { status: 'read' });
  }
}

// Export all models
module.exports = {
  Member: new Member(),
  Event: new Event(),
  News: new News(),
  Scholarship: new Scholarship(),
  ScholarshipApplication: new ScholarshipApplication(),
  EventRegistration: new EventRegistration(),
  ContactMessage: new ContactMessage()
};