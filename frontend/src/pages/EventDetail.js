// src/pages/EventDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserPlus } from 'lucide-react';
import { useApi } from '../contexts/ApiContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatDate } from '../utils/formatters';

const EventDetail = () => {
  const { id } = useParams();
  const { apiService } = useApi();
  const { showSuccess, showError } = useNotification();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiService.getEvent(id);
        setEvent(response.data);
      } catch (error) {
        showError('活动信息加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, apiService, showError]);

  const handleRegistrationChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setRegistering(true);

    try {
      const response = await apiService.registerForEvent(id, registrationData);
      showSuccess(response.message);
      setShowRegistrationForm(false);
      setRegistrationData({ name: '', email: '', phone: '', notes: '' });
      
      // Update event participant count
      setEvent(prev => ({
        ...prev,
        currentParticipants: prev.currentParticipants + 1
      }));
    } catch (error) {
      showError(error.message || '报名失败，请稍后重试');
    } finally {
      setRegistering(false);
    }
  };

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

  const canRegister = event?.registrationOpen && event?.status === 'upcoming' && 
    (!event?.maxParticipants || event?.currentParticipants < event?.maxParticipants);

  if (loading) return <LoadingSpinner />;

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">活动不存在</p>
        <Link to="/events" className="text-red-600 hover:text-red-800 mt-4 inline-block">
          返回活动列表
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          to="/events"
          className="flex items-center text-red-600 hover:text-red-800 mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回活动列表
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
              {getStatusText(event.status)}
            </span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">{event.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-red-600" />
                <div>
                  <p className="font-medium">活动日期</p>
                  <p>{formatDate(event.date)} {event.time}</p>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-red-600" />
                  <div>
                    <p className="font-medium">活动地点</p>
                    <p>{event.location}</p>
                  </div>
                </div>
              )}

              {event.maxParticipants && (
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3 text-red-600" />
                  <div>
                    <p className="font-medium">参与人数</p>
                    <p>{event.currentParticipants} / {event.maxParticipants} 人</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-4">活动报名</h3>
              {canRegister ? (
                <button
                  onClick={() => setShowRegistrationForm(true)}
                  className="w-full bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  立即报名
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 mb-2">
                    {event.status === 'completed' ? '活动已结束' :
                     !event.registrationOpen ? '报名已关闭' :
                     '报名已满'}
                  </p>
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-md cursor-not-allowed"
                  >
                    无法报名
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">活动详情</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {event.description}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">活动报名</h3>
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={registrationData.name}
                  onChange={handleRegistrationChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱 *
                </label>
                <input
                  type="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleRegistrationChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  电话 *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleRegistrationChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  name="notes"
                  value={registrationData.notes}
                  onChange={handleRegistrationChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegistrationForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {registering ? '提交中...' : '确认报名'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;