// src/components/Home/HeroSection.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Award } from 'lucide-react';

const HeroSection = () => {
  const quickActions = [
    {
      icon: Users,
      title: '成为会员',
      description: '加入我们的大家庭',
      link: '/members',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: Calendar,
      title: '活动报名',
      description: '参与精彩活动',
      link: '/events',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      icon: Award,
      title: '奖学金申请',
      description: '助力教育梦想',
      link: '/scholarships',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <div className="relative bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative px-8 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            雪隆尊孔学校校友会
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-red-100">
            传承孔子教育精神 · 联系校友情谊 · 推动华教发展
          </p>
          <p className="text-lg mb-12 text-red-200 max-w-2xl mx-auto">
            自1970年代成立以来，我们致力于连接各届校友，支持母校发展，传承华教文化传统，
            成为马来西亚华教事业的重要支柱。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`${action.color} p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
              >
                <action.icon className="w-8 h-8 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                <p className="text-sm opacity-90 mb-4">{action.description}</p>
                <div className="flex items-center justify-center text-sm font-medium">
                  立即行动
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;