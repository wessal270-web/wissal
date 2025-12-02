
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { LogoutIcon, FavoritesIcon, HomeIcon, KeyIcon } from '../icons';
import { useFavorites } from '../../hooks/useFavorites';
import { useAssociations } from '../../context/AssociationsContext';
import AssociationCard from '../AssociationCard';
import ChangePasswordModal from '../ChangePasswordModal';

const UserDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { associations } = useAssociations();
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const favoriteAssociations = associations.filter(assoc => favorites.includes(assoc.id));
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-blue-900 dark:text-blue-400 mb-1">{t('userDashboard')}</h1>
                <p className="text-gray-500 dark:text-gray-400">{t('welcome')}, <span className="text-emerald-600 dark:text-emerald-400 font-bold">{user?.name}</span>!</p>
            </div>
         </div>
         <div className="flex flex-wrap gap-3 justify-center">
             <Link to="/" className="px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                <HomeIcon /> {t('home')}
             </Link>
             <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-5 py-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 font-bold rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors flex items-center gap-2"
            >
                <KeyIcon />
                {t('changePassword')}
            </button>
             <button 
                onClick={logout}
                className="px-5 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
            >
                <LogoutIcon />
                {t('logout')}
            </button>
         </div>
      </div>

      {/* Favorites Section Embedded */}
      <div>
        <div className="flex items-center gap-3 mb-6">
            <FavoritesIcon />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('favorites')}</h2>
        </div>

        {favoriteAssociations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteAssociations.map(assoc => (
                <AssociationCard key={assoc.id} association={assoc} />
            ))}
            </div>
        ) : (
            <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FavoritesIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-2">{t('noFavorites')}</h3>
                <Link to="/" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    قائمة الجمعيات
                </Link>
            </div>
        )}
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default UserDashboard;