// frontend/src/pages/News.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { Globe, Calendar, User, Eye, Filter, ArrowRight } from 'lucide-react';
import { NEWS_CATEGORIES } from '../constants';
import { formatDate, truncateText } from '../utils/formatters';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Pagination from '../components/UI/Pagination';

const News = () => {
  const { apiService } = useApi();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    featured: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiService.getNews(filters);
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [apiService, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', featured: '' });
    setCurrentPage(1);
  };

  if (loading) return <LoadingSpinner />;

  // Pagination logic
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(news.length / newsPerPage);

  // Featured news (first 3)
  const featuredNews = news.filter(article => article.featured).slice(0, 3);
  const hasActiveFilters = filters.category || filters.featured;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">校友动态</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          关注最新的校友会动态、活动报道和教育资讯
        </p>
      </div>

      {/* Featured News Section */}
      {featuredNews.length > 0 && !hasActiveFilters && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-red-600" />
            精选新闻
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredNews.map((article, index) => (
              <div key={article.id} className={`${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                <Link to={`/news/${article.id}`} className="block group">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full">
                    <div className="relative">
                      <div className="h-48 lg:h-64 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
                        <Globe className="w-16 h-16 text-white opacity-50" />
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className={`font-bold text-gray-800 group-hover:text-red-600 transition-colors mb-3 ${
                        index === 0 ? 'text-xl' : 'text-lg'
                      }`}>
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt || truncateText(article.content, 120)}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {article.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(article.date)}
                          </div>
                        </div>
                        {article.views && (
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {article.views}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <h3 className="font-medium text-gray-800">筛选新闻</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              清除筛选
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              新闻类别
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">全部类别</option>
              {NEWS_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              精选新闻
            </label>
            <select
              value={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">全部新闻</option>
              <option value="true">仅精选</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              共找到 {news.length} 条新闻
            </div>
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-6">
        {currentNews.length > 0 ? (
          currentNews.map(article => (
            <div key={article.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-48 md:h-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
                    <Globe className="w-12 h-12 text-white opacity-50" />
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                    {article.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                        精选
                      </span>
                    )}
                  </div>

                  <Link to={`/news/${article.id}`}>
                    <h3 className="text-xl font-semibold text-gray-800 hover:text-red-600 transition-colors mb-3">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt || truncateText(article.content, 200)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.date)}
                      </div>
                      {article.views && (
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {article.views} 次浏览
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/news/${article.id}`}
                      className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
                    >
                      阅读全文
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">暂无新闻信息</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default News;