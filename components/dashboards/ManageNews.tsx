
import React, { useState } from 'react';
import type { NewsItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useNews } from '../../context/NewsContext';
import { ArrowLeftIcon, PlusIcon, EditIcon, DeleteIcon } from '../icons';
import NewsFormModal from './NewsFormModal';

interface ManageNewsProps {
    onBack: () => void;
}

const ManageNews: React.FC<ManageNewsProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const { news, addNews, updateNews, deleteNews } = useNews();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

    const handleOpenAddModal = () => {
        setEditingNews(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (newsItem: NewsItem) => {
        setEditingNews(newsItem);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingNews(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('confirmDeleteNews'))) {
            deleteNews(id);
        }
    };

    const handleSave = (newsData: Omit<NewsItem, 'id'> & { id?: string }) => {
        if (editingNews) {
            updateNews({ ...editingNews, ...newsData });
        } else {
            const newNewsItem: NewsItem = {
                ...newsData,
                id: `news-${Date.now()}`,
            } as NewsItem;
            addNews(newNewsItem);
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
                    <h1 className="text-3xl font-bold text-cyan-800">{t('manageNews')}</h1>
                </div>
                <button onClick={handleOpenAddModal} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition-colors">
                    <PlusIcon />
                    {t('addNews')}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('title')}</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {news.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                    </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{item.date}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => handleOpenEditModal(item)} className="text-cyan-600 hover:text-cyan-900 flex items-center gap-1">
                                                <EditIcon /> {t('edit')}
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1">
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

            <NewsFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                initialData={editingNews}
            />
        </div>
    );
};

export default ManageNews;
