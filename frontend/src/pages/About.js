// src/pages/About.js
import React from 'react';
import { Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
  const missions = [
    {
      icon: Users,
      title: '联系校友',
      description: '联系各届校友，增进友谊与合作'
    },
    {
      icon: Target,
      title: '支持母校',
      description: '支持母校发展，传承华教精神'
    },
    {
      icon: Award,
      title: '推动教育',
      description: '推动教育事业，培养优秀人才'
    },
    {
      icon: Heart,
      title: '服务社会',
      description: '服务社会，回馈社区'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">本会简介</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            雪隆尊孔学校校友会成立于1970年代，是连接尊孔小学、尊孔国中和尊孔独中校友的重要桥梁。
            本会致力于弘扬孔子教育精神，传承华教文化传统，促进校友间的联系与合作。
          </p>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">我们的愿景</h3>
            <p className="text-red-700">
              成为马来西亚华教事业的重要支柱，培养德才兼备的华教人才，传承中华文化精髓。
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">宗旨与使命</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {missions.map((mission, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-red-100 p-3 rounded-full">
                  <mission.icon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{mission.title}</h3>
                  <p className="text-gray-600 text-sm">{mission.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">组织架构</h2>
          <p className="text-gray-700 mb-4">
            校友会设有会长、副会长、秘书、财政等职位，每届任期两年。
            第42届执委会已于2025年正式就职，继续为校友服务。
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">执委会架构</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-800">领导层</h4>
                <ul className="text-gray-600 mt-2 space-y-1">
                  <li>• 会长</li>
                  <li>• 副会长</li>
                  <li>• 署理会长</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">行政组</h4>
                <ul className="text-gray-600 mt-2 space-y-1">
                  <li>• 秘书</li>
                  <li>• 副秘书</li>
                  <li>• 财政</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">工作组</h4>
                <ul className="text-gray-600 mt-2 space-y-1">
                  <li>• 活动组</li>
                  <li>• 宣传组</li>
                  <li>• 联络组</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;