
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { AssociationCategory } from '../types';
import AssociationCard from '../components/AssociationCard';
import { useLanguage } from '../context/LanguageContext';
import { useAssociations } from '../context/AssociationsContext';
import { saidaMunicipalities } from '../constants';

const AssociationsListPage = () => {
  const { category } = useParams<{ category: AssociationCategory }>();
  const { t } = useLanguage();
  const { associations } = useAssociations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [municipalityFilter, setMunicipalityFilter] = useState('all');

  const categoryAssociations = useMemo(() => 
    associations.filter(a => a.category === category), 
    [category, associations]
  );
  
  const filteredAssociations = useMemo(() => {
    return categoryAssociations.filter(assoc => {
      const nameMatch = assoc.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const municipalityMatch = municipalityFilter === 'all' || 
          assoc.municipality === municipalityFilter;
      
      return nameMatch && municipalityMatch;
    });
  }, [categoryAssociations, searchTerm, municipalityFilter]);

  const title = category === 'youth' ? t('youthAssociations') : t('sportsAssociations');
  const titleColor = category === 'youth' ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400';

  return (
    <div>
      <h1 className={`text-4xl font-black ${titleColor} mb-8`}>{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <input
          type="text"
          placeholder={t('searchByName')}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 transition-all outline-none"
          value={municipalityFilter}
          onChange={(e) => setMunicipalityFilter(e.target.value)}
        >
          <option value="all">{t('filterByMunicipality')} ({t('all')})</option>
          {saidaMunicipalities.map((mun, index) => (
            <option key={index} value={mun}>
              {mun}
            </option>
          ))}
        </select>
      </div>

      {filteredAssociations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAssociations.map(assoc => (
            <AssociationCard key={assoc.id} association={assoc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-400 dark:text-gray-500 text-xl font-medium">{t('noResults')}</p>
        </div>
      )}
    </div>
  );
};

export default AssociationsListPage;