import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useAssociations } from '../context/AssociationsContext';
import AssociationCard from '../components/AssociationCard';
import { useLanguage } from '../context/LanguageContext';

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const { associations } = useAssociations();
  const { t } = useLanguage();

  const favoriteAssociations = associations.filter(assoc => favorites.includes(assoc.id));

  return (
    <div>
      <h1 className="text-4xl font-black text-blue-900 mb-8">{t('favorites')}</h1>
      {favoriteAssociations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteAssociations.map(assoc => (
            <AssociationCard key={assoc.id} association={assoc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
             </svg>
          </div>
          <p className="text-gray-500 text-xl font-medium">{t('noFavorites')}</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
