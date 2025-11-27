
import React from 'react';
import { Link } from 'react-router-dom';
import type { Association } from '../types';
import { MapPinIcon } from './icons';

interface AssociationCardProps {
  association: Association;
}

const AssociationCard: React.FC<AssociationCardProps> = ({ association }) => {
  // Generate a dynamic placeholder using the association name if logo is missing
  const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(association.name)}&background=f3f4f6&color=0891b2&size=150&font-size=0.4&bold=true`;
  
  const logoSrc = association.logoUrl && association.logoUrl.trim() !== '' 
    ? association.logoUrl 
    : placeholderUrl;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
      <Link to={`/association/${association.id}`} className="block h-full">
        <div className="flex items-start p-5 h-full">
          <div className="relative">
            <img
              src={logoSrc}
              alt={`Logo of ${association.name}`}
              className="w-24 h-24 object-cover rounded-2xl me-5 border-2 border-gray-100 dark:border-gray-700 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors bg-gray-50 dark:bg-gray-700"
              onError={(e) => {
                // Fallback if the provided URL is broken
                e.currentTarget.src = placeholderUrl;
              }}
            />
             <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 ${association.category === 'sports' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-400 truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                {association.name}
            </h3>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1 inline-block bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                {association.activityType}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-center">
              <span className="text-gray-400 dark:text-gray-500"><MapPinIcon /></span>
              <span className="truncate">{association.municipality}</span>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AssociationCard;