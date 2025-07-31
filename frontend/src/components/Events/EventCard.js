// src/components/Events/EventCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';

const EventCard = ({ event }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return '即将开始';
      case 'ongoing': return '进行中';
      case 'completed': return '已结束';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status)}`}>
            {getStatusText(event.status)}
          </span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
            {event.category}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{event.date} {event.time}</span>
          </div>
          {event.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
          )}
          {event.maxParticipants && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{event.currentParticipants}/{event.maxParticipants} 人</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Link
            to={`/events/${event.id}`}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            查看详情
          </Link>
          {event.registrationOpen && event.status === 'upcoming' && (
            <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
              立即报名
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;