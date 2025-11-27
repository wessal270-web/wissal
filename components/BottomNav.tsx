
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { HomeIcon, NewsIcon, FavoritesIcon, DashboardIcon, UserIcon } from './icons';
import { useAuth } from '../hooks/useAuth';

const BottomNav = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center justify-center flex-1 text-xs transition-all duration-300 ${
      isActive ? 'text-blue-600 font-bold scale-110' : 'text-gray-400 hover:text-blue-500'
    }`;
  };

  const baseItems = [
    { to: '/', label: t('home'), icon: <HomeIcon /> },
    { to: '/news', label: t('newsAndActivities'), icon: <NewsIcon /> },
    { to: '/favorites', label: t('favorites'), icon: <FavoritesIcon /> },
  ];

  const authItem = user
    ? { to: '/dashboard', label: t('dashboard'), icon: <DashboardIcon /> }
    : { to: '/login', label: t('login'), icon: <UserIcon /> };

  const items = [...baseItems, authItem];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
        <div className="bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-around h-20 items-center pb-2 px-2">
          {items.map(item => (
            <Link key={item.to} to={item.to} className={getNavLinkClass(item.to)}>
              {item.icon}
              <span className="mt-1 scale-90">{item.label}</span>
            </Link>
          ))}
        </div>
    </nav>
  );
};

export default BottomNav;
