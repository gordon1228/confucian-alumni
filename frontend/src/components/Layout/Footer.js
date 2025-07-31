// src/components/Layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <p className="text-gray-300 text-sm">
              地址：吉隆坡苏丹街<br/>
              电话：+603-xxxx-xxxx<br/>
              邮箱：info@confucianalumni.org
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/members" className="hover:text-white">会员申请</Link></li>
              <li><Link to="/events" className="hover:text-white">活动报名</Link></li>
              <li><Link to="/scholarships" className="hover:text-white">奖学金申请</Link></li>
              <li><Link to="/schools" className="hover:text-white">母校网站</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">关注我们</h3>
            <p className="text-gray-300 text-sm">
              获取最新活动资讯和校友动态
            </p>
            <div className="mt-4 flex space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <div className="w-8 h-8 bg-green-600 rounded-full"></div>
              <div className="w-8 h-8 bg-red-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>&copy; 2025 雪隆尊孔学校校友会. 版权所有.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;