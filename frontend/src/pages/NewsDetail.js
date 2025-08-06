// frontend/src/pages/NewsDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../contexts/ApiContext';
import { useNotification } from '../contexts/NotificationContext';
import { ArrowLeft, Calendar, User, Eye, Globe, Share2, BookmarkPlus } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const NewsDetail = () => {
  const { id } = useParams();
  const { apiService } = useApi();
  const { showSuccess, showError } = useNotification();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await apiService.getNewsArticle(id);
        setArticle(response.data);
        
        // Fetch related news from the same category
        if (response.data.category) {
          const relatedResponse = await apiService.getNews({ 
            category: response.data.category,
            limit: 3 
          });
          // Filter out current article
          const filtered = relatedResponse.data.filter(news => news.id !== parseInt(id));
          setRelatedNews(filtered.slice(0, 3));
        }
      } catch (error) {
        showError('文章加载失败');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, apiService, showError]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess('链接已复制到剪贴板');
      } catch (error) {
        showError('分享失败');
      }
    }
  };

  const handleBookmark = () => {
    // In a real app, this would save to user's bookmarks
    showSuccess('已添加到收藏夹');
  };

  if (loading) return <LoadingSpinner />;

  if (!article) {
    return (
      <div className="text-center py-12">
        <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500">文章不存在</p>
        <Link to="/news" className="text-red-600 hover:text-red-800 mt-4 inline-block">
          返回新闻列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center mb-6">
        <Link
          to="/news"
          className="flex items-center text-red-600 hover:text-red-800 mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回新闻列表
        </Link>
      </div>

      {/* Article Header */}
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="分享文章"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleBookmark}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="收藏文章"
              >
                <BookmarkPlus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>作者: {article.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>发布时间: {formatDate(article.date)}</span>
            </div>
            {article.views && (
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{article.views} 次浏览</span>
              </div>
            )}
            {article.featured && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                精选文章
              </span>
            )}
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {article.excerpt && (
              <div className="text-lg text-gray-700 font-medium mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-red-600">
                {article.excerpt}
              </div>
            )}
            
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          </div>

          {/* Article Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between">
              <div className="text-sm text-gray-500">
                最后更新: {formatDate(article.updatedAt || article.date)}
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <button
                  onClick={handleShare}
                  className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  分享文章
                </button>
                <button
                  onClick={handleBookmark}
                  className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  <BookmarkPlus className="w-4 h-4 mr-1" />
                  收藏
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">相关新闻</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map(news => (
              <Link
                key={news.id}
                to={`/news/${news.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                    {news.category}
                  </span>
                  <h3 className="font-semibold text-gray-800 mt-3 mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{news.author}</span>
                    <span>{formatDate(news.date)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to Top */}
      <div className="mt-12 text-center">
        <Link
          to="/news"
          className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回新闻列表
        </Link>
      </div>
    </div>
  );
};

export default NewsDetail;