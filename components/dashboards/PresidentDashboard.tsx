
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useAssociations } from '../../context/AssociationsContext';
import { LogoutIcon, EditIcon, PlusIcon, MapPinIcon } from '../icons';
import AssociationFormModal from './AssociationFormModal';
import type { Association } from '../../types';

const PresidentDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { associations, addAssociation, updateAssociation } = useAssociations();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState<Association | null>(null);
  
  // Filter associations: Show associations created by the current user
  // This uses the ownerId field we add when saving
  const myAssociations = associations.filter(a => a.ownerId === user?.id);

  // Check if the president already has an association
  const hasAssociation = myAssociations.length > 0;

  const handleOpenAddModal = () => {
    setEditingAssociation(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (association: Association) => {
    setEditingAssociation(association);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssociation(null);
  };

  const handleSave = (associationData: Omit<Association, 'id'> & { id?: string }) => {
     if (editingAssociation) {
         // Update existing via Context
         updateAssociation({ ...editingAssociation, ...associationData });
     } else {
         // Add new via Context
         const newAssoc: Association = { 
             ...associationData, 
             id: `temp-${Date.now()}`, // Temp ID, real ID set by Firestore
             documents: [],
             socialLinks: {},
         } as Association;
         
         addAssociation(newAssoc);
     }
     handleCloseModal();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
            <h1 className="text-3xl font-bold text-cyan-900 mb-2">{t('presidentDashboard')}</h1>
            <p className="text-lg text-gray-600">{t('welcome')}, <span className="font-bold text-cyan-600">{user?.name}</span>!</p>
        </div>
        <div className="flex gap-3">
            {!hasAssociation && (
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                >
                    <PlusIcon />
                    {t('addAssociation')}
                </button>
            )}
            <button
                onClick={logout}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
            >
                <LogoutIcon />
                {t('logout')}
            </button>
        </div>
      </div>

      {/* Associations List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render Managed Associations */}
        {myAssociations.map((assoc) => (
            <div key={assoc.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-emerald-500">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                     <img 
                        src={assoc.logoUrl || 'https://via.placeholder.com/150'} 
                        alt={assoc.name} 
                        className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-md"
                     />
                </div>
                <div className="pt-10 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{assoc.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 flex items-center">
                        <MapPinIcon />
                        <span className="mx-1">{assoc.municipality}</span>
                    </p>
                    
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{t('president')}:</span>
                            <span className="font-medium text-gray-800">{assoc.president}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleOpenEditModal(assoc)}
                        className="w-full py-2.5 bg-gray-50 text-cyan-700 font-bold rounded-xl hover:bg-cyan-50 hover:text-cyan-800 transition-colors flex items-center justify-center gap-2 border border-gray-200"
                    >
                        <EditIcon />
                        {t('editAssociation')}
                    </button>
                </div>
            </div>
        ))}

        {/* Add New Card (Empty State / Shortcut) - Only show if no association exists */}
        {!hasAssociation && (
            <button 
                onClick={handleOpenAddModal}
                className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 transition-all group h-full min-h-[300px]"
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <PlusIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-500 group-hover:text-emerald-600 transition-colors">{t('addAssociation')}</h3>
                <p className="text-sm text-gray-400 mt-2 text-center max-w-[200px]">Register a new association to manage its details and activities.</p>
            </button>
        )}
      </div>

      <AssociationFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={editingAssociation}
      />
    </div>
  );
};

export default PresidentDashboard;
