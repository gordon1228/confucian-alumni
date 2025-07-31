// src/components/Home/StatsSection.js
import React from 'react';
import { Users, Calendar, Award, TrendingUp } from 'lucide-react';

const StatsSection = ({ stats }) => {
  const statItems = [
    {
      icon: Users,
      label: '注册会员',
      value: stats?.totalMembers || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Calendar,
      label: '即将举行的活动',
      value: stats?.upcomingEvents || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Award,
      label: '奖学金申请',
      value: stats?.activeScholarships || 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: TrendingUp,
      label: '总活动数',
      value: stats?.totalEvents || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className={`${item.bgColor} p-3 rounded-full`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;