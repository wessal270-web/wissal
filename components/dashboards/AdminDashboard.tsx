
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import ManageAssociations from './ManageAssociations';
import ManageNews from './ManageNews';
import ManageUsers from './ManageUsers';
import { LogoutIcon, UserIcon, YouthIcon, NewsIcon } from '../icons';
import { useAssociations } from '../../context/AssociationsContext';
import { useNews } from '../../context/NewsContext';
import { useUsers } from '../../context/UsersContext';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  
  // Use Context hooks to get real-time data from Firestore
  const { associations } = useAssociations();
  const { news } = useNews();
  const { users } = useUsers();

  const [view, setView] = useState('main'); // 'main', 'associations', 'news', 'users'

  // Real-time Statistics
  const totalAssociations = associations.length;
  const totalNews = news.length;
  const totalUsers = users.length;

  if (view === 'associations') {
    return <ManageAssociations onBack={() => setView('main')} />;
  }

  if (view === 'news') {
    return <ManageNews onBack={() => setView('main')} />;
  }

  if (view === 'users') {
    return <ManageUsers onBack={() => setView('main')} />;
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-900 to-blue-800 p-8 rounded-3xl shadow-lg text-white">
        <div>
            <h1 className="text-3xl font-black mb-2">{t('adminDashboard')}</h1>
            <p className="text-blue-200 text-lg opacity-90">{t('welcome')}, <span className="font-bold text-white">{user?.name}</span></p>
        </div>
        <button
            onClick={logout}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
        >
            <LogoutIcon />
            {t('logout')}
        </button>
      </div>
      
      {/* Smart Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title={t('totalAssociations')} value={totalAssociations} icon={<YouthIcon />} color="bg-emerald-500" />
        <StatCard title="مجموع الأخبار" value={totalNews} icon={<NewsIcon />} color="bg-indigo-500" />
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <span className="text-gray-500 font-medium text-sm">{t('systemHealth')}</span>
            <div className="flex items-center gap-2 mt-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-green-600 font-bold">{t('good')}</span>
            </div>
        </div>
      </div>

      {/* Control Center */}
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 px-2">لوحة التحكم المركزية</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Manage Associations */}
        <button 
            onClick={() => setView('associations')}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all text-start"
        >
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <YouthIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('manageAssociations')}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t('addEditDeleteAssociations')}</p>
        </button>

        {/* Manage News */}
        <button 
            onClick={() => setView('news')}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all text-start"
        >
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <NewsIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('manageNews')}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t('publishNews')}</p>
        </button>

         {/* Manage Users */}
         <button 
            onClick={() => setView('users')}
            className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all text-start"
        >
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserIcon />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('manageUsers')}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">إدارة المستخدمين ورؤساء الجمعيات والمدراء ({totalUsers} مستخدم).</p>
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
            <span className="text-gray-500 font-medium text-sm block mb-1">{title}</span>
            <span className="text-3xl font-black text-gray-800">{value}</span>
        </div>
        <div className={`w-12 h-12 ${color} text-white rounded-xl flex items-center justify-center shadow-lg relative z-10`}>
            {icon}
        </div>
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-10 rounded-full`}></div>
    </div>
);

export default AdminDashboard;
