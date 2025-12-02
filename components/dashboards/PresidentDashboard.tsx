
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useAssociations } from '../../context/AssociationsContext';
import { LogoutIcon, EditIcon, PlusIcon, MapPinIcon, KeyIcon } from '../icons';
import AssociationFormModal from './AssociationFormModal';
import ChangePasswordModal from '../ChangePasswordModal';
import type { Association } from '../../types';

const PresidentDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { associations, addAssociation, updateAssociation } = useAssociations();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState<Association | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const myAssociations = associations.filter(a => a.ownerId === user?.id);
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

  const handleSave = async (associationData: any) => {
     setIsSaving(true);
     try {
       if (editingAssociation) {
           await updateAssociation({ ...editingAssociation, ...associationData });
       } else {
           // Using Context addAssociation (restored logic)
           await addAssociation(associationData as Association);
       }
       handleCloseModal();
     } catch (error: any) {
       console.error("Failed to save:", error);
       alert("حدث خطأ أثناء الحفظ: " + error.message);
     } finally {
       setIsSaving(false);
     }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
            <h1 className="text-3xl font-bold text-cyan-900 dark:text-cyan-400 mb-2">{t('presidentDashboard')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{t('welcome')}, <span className="font-bold text-cyan-600 dark:text-cyan-400">{user?.name}</span>!</p>
        </div>
        <div className="flex flex-wrap gap-3">
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
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 font-bold rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
            >
                <KeyIcon />
                {t('changePassword')}
            </button>
            <button
                onClick={logout}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
                <LogoutIcon />
                {t('logout')}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myAssociations.map((assoc) => (
            <div key={assoc.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group">
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-emerald-500">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                     <img 
                        src={assoc.logoUrl || 'https://via.placeholder.com/150'} 
                        alt={assoc.name} 
                        className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-700 object-cover shadow-md bg-white"
                     />
                </div>
                <div className="pt-10 p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{assoc.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                        <MapPinIcon />
                        <span className="mx-1">{assoc.municipality}</span>
                    </p>
                    
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">{t('president')}:</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{assoc.president}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleOpenEditModal(assoc)}
                            className="w-full py-2.5 bg-gray-50 dark:bg-gray-700 text-cyan-700 dark:text-cyan-400 font-bold rounded-xl hover:bg-cyan-50 dark:hover:bg-gray-600 hover:text-cyan-800 transition-colors flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600"
                        >
                            <EditIcon />
                            {t('edit')}
                        </button>
                    </div>
                </div>
            </div>
        ))}

        {!hasAssociation && (
            <button 
                onClick={handleOpenAddModal}
                className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group h-full min-h-[300px]"
            >
                <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <PlusIcon />
                </div>
                <h3 className="text-xl font-bold text-gray-50 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{t('addAssociation')}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 text-center max-w-[200px]">قم بتسجيل جمعية جديدة لإدارة تفاصيلها ونشاطاتها.</p>
            </button>
        )}
      </div>

      <AssociationFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={editingAssociation}
      />
      
      <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
      />
      
      {isSaving && (
        <div className="fixed inset-0 bg-black/20 z-[250] flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-bold text-gray-700 dark:text-gray-200">جاري الحفظ...</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default PresidentDashboard;
