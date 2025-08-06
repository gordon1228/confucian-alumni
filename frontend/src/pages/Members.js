// frontend/src/pages/Members.js
import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useNotification } from '../contexts/NotificationContext';
import { Users, UserPlus, School, Calendar, Phone, Mail } from 'lucide-react';
import { SCHOOLS, GRADUATION_YEARS, MEMBERSHIP_TYPES } from '../constants';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Members = () => {
  const { apiService } = useApi();
  const { showSuccess, showError } = useNotification();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    school: '',
    graduationYear: ''
  });
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    graduationYear: '',
    membershipType: 'regular',
    address: '',
    occupation: '',
    notes: ''
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await apiService.getMembers(filters);
        setMembers(response.data);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [apiService, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRegistrationChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await apiService.registerMember(registrationData);
      showSuccess(response.message);
      setShowRegistrationForm(false);
      setRegistrationData({
        name: '',
        email: '',
        phone: '',
        school: '',
        graduationYear: '',
        membershipType: 'regular',
        address: '',
        occupation: '',
        notes: ''
      });
    } catch (error) {
      showError(error.message || '会员申请失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">会员中心</h1>
          <p className="text-gray-600">加入我们的大家庭，与校友保持联系</p>
        </div>
        <button
          onClick={() => setShowRegistrationForm(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors flex items-center mt-4 md:mt-0"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          申请加入
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">{members.length}</p>
              <p className="text-sm text-gray-600">注册会员</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <School className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">3</p>
              <p className="text-sm text-gray-600">母校</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">50+</p>
              <p className="text-sm text-gray-600">届别</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-800">95%</p>
              <p className="text-sm text-gray-600">活跃度</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-medium text-gray-800 mb-4">筛选会员</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              母校
            </label>
            <select
              value={filters.school}
              onChange={(e) => handleFilterChange('school', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">全部学校</option>
              {SCHOOLS.map(school => (
                <option key={school.value} value={school.value}>
                  {school.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              毕业年份
            </label>
            <select
              value={filters.graduationYear}
              onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">全部年份</option>
              {GRADUATION_YEARS.slice(0, 20).map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ school: '', graduationYear: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              清除筛选
            </button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">会员名录</h3>
        </div>
        <div className="p-6">
          {members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map(member => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-800">{member.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status === 'active' ? '活跃' : '待审核'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <School className="w-4 h-4 mr-2" />
                      {member.school}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {member.graduationYear} 届
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {member.membershipType === 'lifetime' ? '终身会员' : '普通会员'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">暂无会员信息</p>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">申请加入校友会</h3>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRegistration} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      母校 *
                    </label>
                    <select
                      name="school"
                      value={registrationData.school}
                      onChange={handleRegistrationChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">请选择母校</option>
                      {SCHOOLS.map(school => (
                        <option key={school.value} value={school.value}>
                          {school.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      毕业年份 *
                    </label>
                    <select
                      name="graduationYear"
                      value={registrationData.graduationYear}
                      onChange={handleRegistrationChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">请选择毕业年份</option>
                      {GRADUATION_YEARS.map(year => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      职业
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={registrationData.occupation}
                      onChange={handleRegistrationChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    地址
                  </label>
                  <textarea
                    name="address"
                    value={registrationData.address}
                    onChange={handleRegistrationChange}
                    rows={3}
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
                    placeholder="其他需要说明的信息..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        提交中...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        提交申请
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;