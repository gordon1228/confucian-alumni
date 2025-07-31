// src/pages/Scholarships.js
import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';
import { useNotification } from '../contexts/NotificationContext';
import { Award, Calendar, DollarSign, FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { SCHOOLS, GRADUATION_YEARS } from '../constants';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Scholarships = () => {
  const { apiService } = useApi();
  const { showSuccess, showError } = useNotification();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState({
    scholarshipId: '',
    applicantName: '',
    parentName: '',
    email: '',
    phone: '',
    school: '',
    grade: '',
    gpa: '',
    familyIncome: '',
    reason: '',
    transcript: null,
    recommendation: null,
    income_proof: null
  });

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await apiService.getScholarships();
        setScholarships(response.data);
      } catch (error) {
        console.error('Failed to fetch scholarships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, [apiService]);

  const handleApplicationChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setApplicationData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setApplicationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.keys(applicationData).forEach(key => {
        if (applicationData[key] !== null && applicationData[key] !== '') {
          formData.append(key, applicationData[key]);
        }
      });

      const response = await apiService.applyScholarship(formData);
      showSuccess(response.message);
      setShowApplicationForm(false);
      setSelectedScholarship(null);
      setApplicationData({
        scholarshipId: '',
        applicantName: '',
        parentName: '',
        email: '',
        phone: '',
        school: '',
        grade: '',
        gpa: '',
        familyIncome: '',
        reason: '',
        transcript: null,
        recommendation: null,
        income_proof: null
      });
    } catch (error) {
      showError(error.message || '申请提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const startApplication = (scholarship) => {
    setSelectedScholarship(scholarship);
    setApplicationData(prev => ({
      ...prev,
      scholarshipId: scholarship.id.toString()
    }));
    setShowApplicationForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return '开放申请';
      case 'upcoming': return '即将开放';
      case 'closed': return '申请已关闭';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return CheckCircle;
      case 'upcoming': return Calendar;
      case 'closed': return AlertCircle;
      default: return AlertCircle;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">奖学金申请</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          为支持优秀学子继续深造，本会设立多项奖学金，协助有需要的校友子女完成学业梦想。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {scholarships.map(scholarship => {
          const StatusIcon = getStatusIcon(scholarship.status);
          return (
            <div key={scholarship.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      <Award className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{scholarship.name}</h2>
                      <span className="text-sm text-gray-500">{scholarship.type === 'academic' ? '学业奖励' : '助学金'}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(scholarship.status)}`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {getStatusText(scholarship.status)}
                  </span>
                </div>

                <p className="text-gray-700 mb-6">{scholarship.description}</p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">奖励金额</p>
                      <p className="text-gray-600">{scholarship.amount}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">申请期限</p>
                      <p className="text-gray-600">{scholarship.deadline}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">申请条件</h3>
                  <ul className="space-y-2">
                    {scholarship.requirements.map((req, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    申请期间: {scholarship.applicationPeriod}
                  </div>
                  <button
                    onClick={() => startApplication(scholarship)}
                    disabled={scholarship.status !== 'open'}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      scholarship.status === 'open'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {scholarship.status === 'open' ? '立即申请' : '暂不开放'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedScholarship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  申请 {selectedScholarship.name}
                </h3>
                <button
                  onClick={() => {
                    setShowApplicationForm(false);
                    setSelectedScholarship(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApplication} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">申请人信息</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        申请人姓名 *
                      </label>
                      <input
                        type="text"
                        name="applicantName"
                        value={applicationData.applicantName}
                        onChange={handleApplicationChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        家长姓名 *
                      </label>
                      <input
                        type="text"
                        name="parentName"
                        value={applicationData.parentName}
                        onChange={handleApplicationChange}
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
                        value={applicationData.email}
                        onChange={handleApplicationChange}
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
                        value={applicationData.phone}
                        onChange={handleApplicationChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">学业信息</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        就读学校 *
                      </label>
                      <input
                        type="text"
                        name="school"
                        value={applicationData.school}
                        onChange={handleApplicationChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        年级 *
                      </label>
                      <input
                        type="text"
                        name="grade"
                        value={applicationData.grade}
                        onChange={handleApplicationChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GPA/成绩
                      </label>
                      <input
                        type="text"
                        name="gpa"
                        value={applicationData.gpa}
                        onChange={handleApplicationChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                {selectedScholarship.type === 'financial' && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 mb-4">家庭经济状况</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        家庭月收入 (RM)
                      </label>
                      <input
                        type="number"
                        name="familyIncome"
                        value={applicationData.familyIncome}
                        onChange={handleApplicationChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                )}

                {/* Application Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    申请理由 *
                  </label>
                  <textarea
                    name="reason"
                    value={applicationData.reason}
                    onChange={handleApplicationChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    placeholder="请说明申请此奖学金的理由..."
                  />
                </div>

                {/* File Uploads */}
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">上传文件</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        成绩单 *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                        <input
                          type="file"
                          name="transcript"
                          onChange={handleApplicationChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          支持 PDF, JPG, PNG 格式，最大 5MB
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        推荐信
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                        <input
                          type="file"
                          name="recommendation"
                          onChange={handleApplicationChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          支持 PDF, JPG, PNG 格式，最大 5MB
                        </p>
                      </div>
                    </div>
                    
                    {selectedScholarship.type === 'financial' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          收入证明
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                          <input
                            type="file"
                            name="income_proof"
                            onChange={handleApplicationChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            支持 PDF, JPG, PNG 格式，最大 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplicationForm(false);
                      setSelectedScholarship(null);
                    }}
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
                        <FileText className="w-4 h-4 mr-2" />
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

export default Scholarships;