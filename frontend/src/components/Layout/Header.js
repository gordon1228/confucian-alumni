// src/components/Layout/Header.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, BookOpen, Award, Menu, X, Globe, Home } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { path: '/', label: '首页', icon: Home },
    { path: '/about', label: '本会简介', icon: Users },
    { path: '/schools', label: '母校', icon: BookOpen },
    { path: '/events', label: '活动预告', icon: Calendar },
    { path: '/news', label: '校友动态', icon: Globe },
    { path: '/scholarships', label: '奖学金', icon: Award }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
              尊
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">雪隆尊孔学校校友会</h1>
              <p className="text-sm text-gray-600">Confucian Alumni Association</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;