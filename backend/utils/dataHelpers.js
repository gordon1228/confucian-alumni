// backend/utils/dateHelpers.js - Comprehensive Date Handling Utilities

/**
 * Format date for different display purposes
 */
const formatDate = (dateValue, format = 'iso') => {
  if (!dateValue) return null;
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date value:', dateValue);
      return null;
    }
    
    switch (format) {
      case 'iso':
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      case 'chinese':
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
      case 'chinese-full':
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        });
      
      case 'short':
        return date.toLocaleDateString('zh-CN');
      
      case 'display':
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      
      default:
        return date.toISOString().split('T')[0];
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return null;
  }
};

/**
 * Format time for display
 */
const formatTime = (timeValue) => {
  if (!timeValue) return null;
  
  try {
    // Handle different time formats
    if (typeof timeValue === 'string') {
      // If it's already a time string like "14:30:00"
      if (timeValue.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
        return timeValue.substring(0, 5); // Return HH:MM
      }
      
      // If it's a full datetime string
      const date = new Date(timeValue);
      if (!isNaN(date.getTime())) {
        return date.toTimeString().substring(0, 5); // Return HH:MM
      }
    }
    
    return timeValue;
  } catch (error) {
    console.error('Error formatting time:', error);
    return null;
  }
};

/**
 * Calculate days until event
 */
const getDaysUntilEvent = (eventDate) => {
  if (!eventDate) return null;
  
  try {
    const event = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    
    const diffTime = event - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating days until event:', error);
    return null;
  }
};

/**
 * Get event status based on date
 */
const getEventStatus = (eventDate, currentStatus = 'upcoming') => {
  if (!eventDate) return currentStatus;
  
  try {
    const event = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    
    if (event < today) {
      return 'completed';
    } else if (event.getTime() === today.getTime()) {
      return 'ongoing';
    } else {
      return 'upcoming';
    }
  } catch (error) {
    console.error('Error determining event status:', error);
    return currentStatus;
  }
};

/**
 * Comprehensive date formatter for events
 */
const formatEventDates = (event) => {
  if (!event) return event;
  
  const eventDate = event.eventDate || event.event_date || event.date;
  const eventTime = event.eventTime || event.event_time || event.time;
  
  return {
    ...event,
    // Original fields
    eventDate: eventDate,
    eventTime: eventTime,
    date: eventDate,
    time: eventTime,
    
    // Formatted fields
    isoDate: formatDate(eventDate, 'iso'),
    displayDate: formatDate(eventDate, 'chinese-full'),
    shortDate: formatDate(eventDate, 'short'),
    chineseDate: formatDate(eventDate, 'chinese'),
    formattedTime: formatTime(eventTime),
    
    // Calculated fields
    daysUntilEvent: getDaysUntilEvent(eventDate),
    calculatedStatus: getEventStatus(eventDate, event.status),
    
    // Utility fields
    isUpcoming: getEventStatus(eventDate) === 'upcoming',
    isToday: getDaysUntilEvent(eventDate) === 0,
    isPast: getDaysUntilEvent(eventDate) < 0
  };
};

/**
 * Format news dates
 */
const formatNewsDates = (article) => {
  if (!article) return article;
  
  const publishDate = article.publishDate || article.publish_date;
  const createdAt = article.createdAt || article.created_at;
  
  return {
    ...article,
    publishDate: publishDate,
    createdAt: createdAt,
    formattedPublishDate: formatDate(publishDate, 'chinese'),
    shortPublishDate: formatDate(publishDate, 'short'),
    isoPublishDate: formatDate(publishDate, 'iso')
  };
};

/**
 * Validate date input
 */
const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Convert date to SQL Server format
 */
const toSqlServerDate = (dateValue) => {
  if (!dateValue) return null;
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return null;
    
    // Return in YYYY-MM-DD format for SQL Server
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error converting to SQL Server date:', error);
    return null;
  }
};

module.exports = {
  formatDate,
  formatTime,
  getDaysUntilEvent,
  getEventStatus,
  formatEventDates,
  formatNewsDates,
  isValidDate,
  toSqlServerDate
};