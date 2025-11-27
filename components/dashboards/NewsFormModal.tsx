
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-cyan-800">
                        {initialData ? t('editNews') : t('addNews')}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="md:col-span-2">
                             <InputGroup label={t('title')} name="title" value={formData.title} onChange={handleChange} required />
                        </div>
                        
                        <div className="md:col-span-2">
                           <TextAreaGroup label={t('summaryAr')} name="summary" value={formData.summary} onChange={handleChange} required />
                        </div>

                        <InputGroup label={t('date')} name="date" value={formData.date} onChange={handleChange} type="date" required />
                        <InputGroup label={t('imageUrl')} name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                    </div>
                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700">
                            {t('save')}
                        </button>
                    </div>
                </form>
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
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 input-field"
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
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            rows={rows}
            className="mt-1 input-field"
        />
    </div>
);

export default NewsFormModal;
