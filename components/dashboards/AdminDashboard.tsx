
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import ManageAssociations from './ManageAssociations';
import ManageNews from './ManageNews';
import ManageUsers from './ManageUsers';
import { LogoutIcon, UserIcon, YouthIcon, NewsIcon, EyeIcon, UserPlusIcon, PulseIcon } from '../icons';
import { useAssociations } from '../../context/AssociationsContext';
import { useNews } from '../../context/NewsContext';
import { useUsers } from '../../context/UsersContext';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebase';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  
  // Use Context hooks to get real-time data from Firestore
  const { associations } = useAssociations();
  const { news } = useNews();
  const { users } = useUsers();

  const [view, setView] = useState('main'); // 'main', 'associations', 'news', 'users'
  const [totalVisits, setTotalVisits] = useState(0); 
  const [realtimeUsers, setRealtimeUsers] = useState(0);

  // Real-time Statistics from Context
  const totalAssociations = associations.length;
  const totalNews = news.length;
  const totalUsers = users.length;

  // New News: items in the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newNewsCount = news.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  }).length;

  // Fetch Total Visitors from Firestore (Real Data)
  useEffect(() => {
     const unsub = onSnapshot(doc(db, "stats", "general"), (doc) => {
         if (doc.exists()) {
             setTotalVisits(doc.data().totalVisits || 0);
         }
     }, (error) => {
         if (error.code !== 'permission-denied') {
             console.error("Stats listener error:", error);
         }
     });
     return () => unsub();
  }, []);

  // Calculate Realtime Users from Presence Collection
  useEffect(() => {
     const q = collection(db, 'presence');
     const unsub = onSnapshot(q, (snapshot) => {
         const now = Date.now();
         const threshold = 2 * 60 * 1000; // Consider offline if no heartbeat for 2 minutes
         
         // Filter docs that have been updated recently
         const activeCount = snapshot.docs.filter(doc => {
             const data = doc.data();
             return data.timestamp && (now - data.timestamp < threshold);
         }).length;
         
         setRealtimeUsers(activeCount);
     }, (error) => {
         if (error.code !== 'permission-denied') {
             console.error("Presence listener error:", error);
         }
     });
     return () => unsub();
  }, []);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2">{t('adminDashboard')}</h1>
            <p className="text-blue-200 text-lg opacity-90">{t('welcome')}, <span className="font-bold text-white">{user?.name}</span></p>
        </div>
        <button
            onClick={logout}
            className="relative z-10 flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 shadow-sm"
        >
            <LogoutIcon />
            {t('logout')}
        </button>
      </div>
      
      {/* Smart Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        
        {/* Visitors (Real DB) */}
        <StatCard 
            title="الزوار" 
            value={totalVisits.toLocaleString()} 
            icon={<EyeIcon className="w-6 h-6" />} 
            color="bg-purple-500" 
            subtext="إجمالي الزيارات"
        />

        {/* Realtime Visitors (Real Heartbeat) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg relative z-10 group-hover:scale-110 transition-transform">
                    <PulseIcon />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg animate-pulse">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span> مباشر
                </span>
            </div>
            <div className="relative z-10">
                <span className="text-3xl font-black text-gray-800 dark:text-white block mb-1">{realtimeUsers}</span>
                <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">متواجدون الآن</span>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">تحديث حقيقي</p>
            </div>
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-500 opacity-5 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
        </div>

        {/* New Registrations */}
        <StatCard 
            title="تسجيلات جديدة" 
            value={`+${totalUsers}`} 
            icon={<UserPlusIcon className="w-6 h-6" />} 
            color="bg-blue-500" 
            subtext="مستخدم مسجل"
        />

        {/* New Associations */}
        <StatCard 
            title="جمعيات جديدة" 
            value={totalAssociations.toString()} 
            icon={<YouthIcon className="w-6 h-6" />} 
            color="bg-emerald-500" 
            subtext="جمعية معتمدة"
        />

        {/* New News */}
        <StatCard 
            title="أخبار جديدة" 
            value={newNewsCount > 0 ? `+${newNewsCount}` : totalNews.toString()} 
            icon={<NewsIcon />} 
            color="bg-orange-500" 
            subtext={newNewsCount > 0 ? "هذا الشهر" : "إجمالي الأخبار"}
        />

      </div>

      {/* Control Center */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4 px-2">لوحة التحكم المركزية</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Manage Associations */}
        <button 
            onClick={() => setView('associations')}
            className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-emerald-200 transition-all text-start relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-125 transition-transform"></div>
            <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <YouthIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('manageAssociations')}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t('addEditDeleteAssociations')}</p>
            </div>
        </button>

        {/* Manage News */}
        <button 
            onClick={() => setView('news')}
            className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-200 transition-all text-start relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-125 transition-transform"></div>
            <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <NewsIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('manageNews')}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t('publishNews')}</p>
            </div>
        </button>

         {/* Manage Users */}
         <button 
            onClick={() => setView('users')}
            className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-indigo-200 transition-all text-start relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-125 transition-transform"></div>
            <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <UserIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('manageUsers')}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">إدارة المستخدمين ورؤساء الجمعيات والمدراء ({totalUsers} مستخدم).</p>
            </div>
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, subtext }: { title: string, value: string, icon: React.ReactNode, color: string, subtext: string }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between overflow-hidden relative group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
             <div className={`w-12 h-12 ${color} text-white rounded-xl flex items-center justify-center shadow-lg relative z-10 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            {/* Optional trend indicator */}
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
                جديد
            </span>
        </div>
        
        <div className="relative z-10">
            <span className="text-3xl font-black text-gray-800 dark:text-white block mb-1">{value}</span>
            <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">{title}</span>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>
        </div>
        
        {/* Background Blob */}
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color} opacity-5 rounded-full group-hover:scale-125 transition-transform duration-500`}></div>
    </div>
);

export default AdminDashboard;
