// src/components/Home/LatestNews.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, Eye } from 'lucide-react';
import { formatDate, truncateText } from '../../utils/formatters';

const LatestNews = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-red-600" />
          最新消息
        </h2>
        <Link
          to="/news"
          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
        >
          查看全部
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {news && news.length > 0 ? (
          news.map(article => (
            <div key={article.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <Link to={`/news/${article.id}`} className="block hover:bg-gray-50 p-2 -m-2 rounded">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(article.date)}
                  </span>
                </div>
                <h3 className="font-medium text-gray-800 hover:text-red-600 mb-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-gray-600 mb-2">
                    {truncateText(article.excerpt, 80)}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>作者: {article.author}</span>
                  {article.views && (
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{article.views} 次浏览</span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>暂无最新消息</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestNews;