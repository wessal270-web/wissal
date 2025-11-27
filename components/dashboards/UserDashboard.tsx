
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { LogoutIcon, FavoritesIcon, HomeIcon } from '../icons';
import { useFavorites } from '../../hooks/useFavorites';
import { useAssociations } from '../../context/AssociationsContext';
import AssociationCard from '../AssociationCard';

const UserDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { associations } = useAssociations();
  
  const favoriteAssociations = associations.filter(assoc => favorites.includes(assoc.id));
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-blue-900 mb-1">{t('userDashboard')}</h1>
                <p className="text-gray-500">{t('welcome')}, <span className="text-emerald-600 font-bold">{user?.name}</span>!</p>
            </div>
         </div>
         <div className="flex gap-3">
             <Link to="/" className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
                <HomeIcon /> {t('home')}
             </Link>
             <button 
                onClick={logout}
                className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
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
            <h2 className="text-2xl font-bold text-gray-800">{t('favorites')}</h2>
        </div>

        {favoriteAssociations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteAssociations.map(assoc => (
                <AssociationCard key={assoc.id} association={assoc} />
            ))}
            </div>
        ) : (
            <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FavoritesIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">{t('noFavorites')}</h3>
                <Link to="/" className="text-blue-600 font-bold hover:underline">
                    قائمة الجمعيات
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
