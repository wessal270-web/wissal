
import React, { useState, useEffect } from 'react';
import type { NewsItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface NewsFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newsData: Omit<NewsItem, 'id'> & { id?: string }) => void;
    initialData: NewsItem | null;
}

const defaultFormData: Omit<NewsItem, 'id'> = {
    title: '',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    summary: '',
    imageUrl: '',
};

const inputClasses = "block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500";

const NewsFormModal: React.FC<NewsFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(defaultFormData);
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        // Added pb-20 on mobile to lift the modal above the bottom navigation bar
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex justify-center items-end md:items-center pb-20 md:pb-0 px-0 md:px-4" role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 w-full md:rounded-2xl md:max-w-3xl h-[85vh] md:h-auto md:max-h-[90vh] flex flex-col rounded-t-3xl shadow-2xl animate-fade-in-up">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 rounded-t-3xl">
                    <h2 className="text-xl font-black text-cyan-800 dark:text-cyan-400">
                        {initialData ? t('editNews') : t('addNews')}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto custom-scrollbar bg-white dark:bg-gray-800">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="md:col-span-2">
                             <InputGroup label={t('title')} name="title" value={formData.title} onChange={handleChange} required />
                        </div>
                        
                        <div className="md:col-span-2">
                           <TextAreaGroup label={t('summaryAr')} name="summary" value={formData.summary} onChange={handleChange} required />
                        </div>

                        <InputGroup label={t('date')} name="date" value={formData.date} onChange={handleChange} type="date" required />
                        <InputGroup label={t('imageUrl')} name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                        
                        <div className="h-10 md:hidden"></div>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3 rounded-b-2xl sticky bottom-0 z-10 pb-6 md:pb-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <button type="button" onClick={onClose} className="px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        {t('cancel')}
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-200/50 transition-all transform hover:-translate-y-1">
                        {t('save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface InputGroupProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, value, onChange, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={inputClasses}
        />
    </div>
);

interface TextAreaGroupProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
    rows?: number;
}

const TextAreaGroup: React.FC<TextAreaGroupProps> = ({ label, name, value, onChange, required = false, rows = 3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            rows={rows}
            className={inputClasses}
        />
    </div>
);

export default NewsFormModal;
