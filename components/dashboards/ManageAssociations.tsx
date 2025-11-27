
import React, { useState } from 'react';
import type { Association } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useAssociations } from '../../context/AssociationsContext';
import { ArrowLeftIcon, PlusIcon, EditIcon, DeleteIcon } from '../icons';
import AssociationFormModal from './AssociationFormModal';

interface ManageAssociationsProps {
    onBack: () => void;
}

const ManageAssociations: React.FC<ManageAssociationsProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const { associations, addAssociation, updateAssociation, deleteAssociation } = useAssociations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAssociation, setEditingAssociation] = useState<Association | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

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

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteAssociation(deleteId);
            setDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setDeleteId(null);
    };

    const handleSave = (associationData: Omit<Association, 'id'> & { id?: string }) => {
        if (editingAssociation) {
            // Update
            updateAssociation({ ...editingAssociation, ...associationData });
        } else {
            // Add
            const newAssociation: Association = {
                ...associationData,
                id: `assoc-admin-${Date.now()}`,
                documents: [], // Default empty values for non-form fields
                socialLinks: {},
            } as Association;
            addAssociation(newAssociation);
        }
        handleCloseModal();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                     <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-cyan-700">
                        <ArrowLeftIcon />
                        {t('back')}
                    </button>
                    <h1 className="text-3xl font-bold text-cyan-800">{t('manageAssociations')}</h1>
                </div>
                <button onClick={handleOpenAddModal} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition-colors">
                    <PlusIcon />
                    {t('addAssociation')}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('appName')}</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('category')}</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {associations.map(assoc => (
                                <tr key={assoc.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{assoc.name}</div>
                                        <div className="text-sm text-gray-500">{assoc.municipality}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assoc.category === 'youth' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {assoc.category === 'youth' ? t('youth') : t('sports')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => handleOpenEditModal(assoc)} className="text-cyan-600 hover:text-cyan-900 flex items-center gap-1">
                                                <EditIcon /> {t('edit')}
                                            </button>
                                            <button onClick={() => handleDeleteClick(assoc.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1">
                                                <DeleteIcon /> {t('delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AssociationFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                initialData={editingAssociation}
            />

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <DeleteIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{t('deleteAssociation')}</h3>
                        <p className="text-gray-500 text-center mb-6">{t('confirmDelete')}</p>
                        <div className="flex justify-center gap-3">
                            <button 
                                onClick={cancelDelete} 
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
                            >
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAssociations;
