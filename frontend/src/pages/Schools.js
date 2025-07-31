// src/pages/Schools.js
import React from 'react';
import { ExternalLink, MapPin, Phone, Globe } from 'lucide-react';

const Schools = () => {
  const schools = [
    {
      name: '尊孔小学',
      type: '华小',
      established: '1906',
      description: '马来西亚历史最悠久的华文小学之一，秉承孔子教育思想，注重品德教育。',
      features: [
        '传承孔子教育思想',
        '重视品德教育',
        '培养双语人才',
        '注重全面发展'
      ],
      contact: {
        address: '吉隆坡苏丹街',
        phone: '+603-2072-4348',
        website: 'www.confucian-primary.edu.my'
      },
      image: '/api/placeholder/400/250'
    },
    {
      name: '尊孔国中',
      type: '国中',
      established: '1962',
      description: '延续华教传统的国民型中学，为学生提供优质的中等教育。',
      features: [
        '国中课程体系',
        '华文教育传承',
        '多元文化环境',
        '升学率优异'
      ],
      contact: {
        address: '吉隆坡苏丹街',
        phone: '+603-2072-5678',
        website: 'www.confucian-secondary.edu.my'
      },
      image: '/api/placeholder/400/250'
    },
    {
      name: '尊孔独中',
      type: '独中',
      established: '1966',
      description: '马来西亚著名的华文独立中学，坚持华教理念，培养优秀华裔子弟。',
      features: [
        '独中统考课程',
        '华文为教学媒介语',
        '传统文化教育',
        '国际视野培养'
      ],
      contact: {
        address: '吉隆坡苏丹街',
        phone: '+603-2072-9999',
        website: 'www.confucian.edu.my'
      },
      image: '/api/placeholder/400/250'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">母校介绍</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          尊孔学校体系包含小学、国中和独中，是马来西亚华教事业的重要组成部分，
          秉承孔子"有教无类"的教育理念，培养了无数优秀人才。
        </p>
      </div>

      <div className="space-y-8">
        {schools.map((school, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src={school.image} 
                  alt={school.name}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-red-600">{school.name}</h2>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    {school.type}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">成立于 {school.established} 年</p>
                
                <p className="text-gray-700 mb-6">{school.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">学校特色</h3>
                    <ul className="space-y-2">
                      {school.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">联系方式</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {school.contact.address}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {school.contact.phone}
                      </div>
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-gray-400" />
                        <a 
                          href={`https://${school.contact.website}`}
                          className="text-red-600 hover:text-red-800 flex items-center"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {school.contact.website}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schools;