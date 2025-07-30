import React, { useState, useEffect } from 'react';
import { Calendar, Users, BookOpen, Award, Menu, X, ChevronRight, Globe } from 'lucide-react';

const ConfucianAlumniWebsite = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);

  // Simulated data - in real app, this would come from Express API
  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: '尊孔独中 59週年會慶午宴',
        date: '2025-10-12',
        category: '母校活动',
        description: '庆祝尊孔独中59周年校庆午宴活动'
      },
      {
        id: 2,
        title: '2025年度会员子女学业优秀奖励金',
        date: '2025-07-03',
        category: '本会活动',
        description: '开始申请年度会员子女学业优秀奖励金'
      },
      {
        id: 3,
        title: '第42届执委会职务正式敲定',
        date: '2025-05-15',
        category: '本会活动',
        description: '新一届执委会职务分配完成'
      }
    ]);

    setNews([
      {
        id: 1,
        title: '2025会员大会暨改选成功举行',
        date: '2025-04-30',
        content: '推動性别伦理与心理支援机制相关议题讨论',
        image: '/api/placeholder/300/200'
      },
      {
        id: 2,
        title: '校友会新执委团队就职',
        date: '2025-04-27',
        content: '新一届执委会团队正式就职，为校友服务',
        image: '/api/placeholder/300/200'
      }
    ]);
  }, []);

  const schools = [
    { name: '尊孔小学', type: '华小', established: '1906' },
    { name: '尊孔国中', type: '国中', established: '1962' },
    { name: '尊孔独中', type: '独中', established: '1966' }
  ];

  const navigation = [
    { id: 'home', label: '首页', icon: Globe },
    { id: 'about', label: '本会简介', icon: Users },
    { id: 'schools', label: '母校', icon: BookOpen },
    { id: 'events', label: '活动预告', icon: Calendar },
    { id: 'awards', label: '奖学金', icon: Award }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-800 to-red-600 text-white rounded-lg p-8 text-center">
              <h1 className="text-4xl font-bold mb-4">雪隆尊孔学校校友会</h1>
              <p className="text-xl mb-6">弘扬孔子精神，传承华教文化</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {schools.map((school, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-semibold text-lg">{school.name}</h3>
                    <p className="text-red-100">成立于 {school.established}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="mr-2 text-red-600" />
                  最新活动
                </h2>
                <div className="space-y-4">
                  {events.slice(0, 3).map(event => (
                    <div key={event.id} className="border-l-4 border-red-600 pl-4 py-2">
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.date}</p>
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-1">
                        {event.category}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-red-600 hover:text-red-800 flex items-center">
                  查看更多 <ChevronRight className="ml-1 w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="mr-2 text-red-600" />
                  校友动态
                </h2>
                <div className="space-y-4">
                  {news.map(item => (
                    <div key={item.id} className="flex space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{item.content}</p>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">本会简介</h1>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-4">
                雪隆尊孔学校校友会成立于1970年代，是连接尊孔小学、尊孔国中和尊孔独中校友的重要桥梁。
                本会致力于弘扬孔子教育精神，传承华教文化传统，促进校友间的联系与合作。
              </p>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">宗旨与使命</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• 联系各届校友，增进友谊与合作</li>
                <li>• 支持母校发展，传承华教精神</li>
                <li>• 推动教育事业，培养优秀人才</li>
                <li>• 服务社会，回馈社区</li>
              </ul>
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">组织架构</h2>
              <p className="text-gray-700">
                校友会设有会长、副会长、秘书、财政等职位，每届任期两年。
                第42届执委会已于2025年正式就职，继续为校友服务。
              </p>
            </div>
          </div>
        );

      case 'schools':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">母校介绍</h1>
            {schools.map((school, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-red-600">{school.name}</h2>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    {school.type}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">成立于 {school.established} 年</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">学校特色</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 传承孔子教育思想</li>
                      <li>• 重视品德教育</li>
                      <li>• 培养双语人才</li>
                      <li>• 注重全面发展</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">联系方式</h3>
                    <p className="text-sm text-gray-600">
                      地址：吉隆坡苏丹街<br/>
                      电话：+603-xxxx-xxxx<br/>
                      网站：www.confucian.edu.my
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'events':
        return (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">活动预告</h1>
            <div className="space-y-6">
              {events.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {event.date}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                      了解详情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'awards':
        return (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">奖学金计划</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Award className="w-8 h-8 text-red-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">学业优秀奖励金</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  每年颁发给会员子女中学业表现优秀的学生，鼓励继续努力学习。
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• 申请时间：每年7月-8月</li>
                  <li>• 对象：本会会员子女</li>
                  <li>• 条件：学业成绩优异</li>
                  <li>• 金额：RM500-RM2000</li>
                </ul>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  立即申请
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-8 h-8 text-red-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">升学助学金</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  协助经济有困难的会员子女继续升学，减轻家庭负担。
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• 申请时间：每年1月-2月</li>
                  <li>• 对象：升读大专院校学生</li>
                  <li>• 条件：家庭经济需要</li>
                  <li>• 金额：RM1000-RM5000</li>
                </ul>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                  了解详情
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>页面不存在</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                尊
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">雪隆尊孔学校校友会</h1>
                <p className="text-sm text-gray-600">Confucian Alumni Association</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
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
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                    activeTab === item.id
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-700 hover:text-red-600'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
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
                <li><a href="#" className="hover:text-white">会员申请</a></li>
                <li><a href="#" className="hover:text-white">活动报名</a></li>
                <li><a href="#" className="hover:text-white">奖学金申请</a></li>
                <li><a href="#" className="hover:text-white">母校网站</a></li>
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
    </div>
  );
};

export default ConfucianAlumniWebsite;