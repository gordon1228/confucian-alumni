// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ChevronRight, TrendingUp } from 'lucide-react';
import { useApi } from '../contexts/ApiContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import HeroSection from '../components/Home/HeroSection';
import StatsSection from '../components/Home/StatsSection';
import LatestEvents from '../components/Home/LatestEvents';
import LatestNews from '../components/Home/LatestNews';

const Home = () => {
  const { apiService } = useApi();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiService.getDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [apiService]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <HeroSection />
      {dashboard && (
        <>
          <StatsSection stats={dashboard.stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LatestEvents events={dashboard.upcomingEvents} />
            <LatestNews news={dashboard.latestNews} />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;