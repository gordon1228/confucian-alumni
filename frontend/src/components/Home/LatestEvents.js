// src/components/Home/LatestEvents.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const LatestEvents = ({ events }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-red-600" />
          即将举行的活动
        </h2>
        <Link
          to="/events"
          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
        >
          查看全部
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {events && events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="border-l-4 border-red-200 pl-4 py-2 hover:border-red-400 transition-colors">
              <Link to={`/events/${event.id}`} className="block">
                <h3 className="font-medium text-gray-800 hover:text-red-600 mb-1">
                  {event.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(event.date)} {event.time}</span>
                </div>
                {event.location && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{event.location}</span>
                  </div>
                )}
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>暂无即将举行的活动</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestEvents;