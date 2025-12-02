
import React, { useState, useEffect } from 'react';
import type { Association } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { saidaMunicipalities } from '../../constants';
import { uploadImage } from '../../services/uploadService';
import { DownloadIcon } from '../icons';

interface AssociationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (associationData: Omit<Association, 'id'> & { id?: string }) => void;
    initialData: Association | null;
}

const defaultFormData: Omit<Association, 'id' | 'documents'> = {
    name: '',
    category: 'youth',
    president: '',
    phone: '',
    email: '',
    address: '',
    municipality: '',
    activityType: '',
    workingHours: '',
    foundedYear: new Date().getFullYear(),
    logoUrl: '',
    location: { lat: 0, lng: 0 },
    socialLinks: { facebook: '' },
};

const inputClasses = "block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500";

const AssociationFormModal: React.FC<AssociationFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState(defaultFormData);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                socialLinks: initialData.socialLinks || {}
            });
        } else {
            setFormData(defaultFormData);
        }
        setUploadError('');
        setIsUploading(false);
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const [field, subfield] = name.split('.');

        if (subfield) {
            setFormData(prev => ({
                ...prev,
                [field]: { ...(prev as any)[field], [subfield]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setUploadError('');
            
            const publicUrl = await uploadImage(file);
            
            setFormData(prev => ({ ...prev, logoUrl: publicUrl }));
        } catch (error: any) {
            console.error(error);
            setUploadError(error.message || 'فشل رفع الصورة.');
        } finally {
            setIsUploading(false);
        }
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
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">
                        {initialData ? t('editAssociation') : t('addAssociation')}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto custom-scrollbar bg-white dark:bg-gray-800">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* Name */}
                        <div className="md:col-span-2">
                             <InputGroup label={t('nameAr')} name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        
                        {/* Category & Municipality */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('category')}</label>
                               <div className="relative">
                                   <select 
                                       name="category" 
                                       value={formData.category} 
                                       onChange={handleChange} 
                                       className={`${inputClasses} appearance-none cursor-pointer`}
                                       required
                                    >
                                       <option value="youth" className="text-gray-900 dark:text-gray-900">🟢 {t('youth')}</option>
                                       <option value="sports" className="text-gray-900 dark:text-gray-900">🔵 {t('sports')}</option>
                                   </select>
                                   <div className="pointer-events-none absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center px-3 text-gray-500">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                   </div>
                               </div>
                               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">يرجى تحديد نوع الجمعية بدقة</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">البلدية</label>
                                <div className="relative">
                                    <select 
                                        name="municipality" 
                                        value={formData.municipality} 
                                        onChange={handleChange} 
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                        required
                                    >
                                        <option value="" className="text-gray-900">اختر البلدية</option>
                                        {saidaMunicipalities.map((mun, idx) => (
                                            <option key={idx} value={mun} className="text-gray-900">{mun}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center px-3 text-gray-500">
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                   </div>
                                </div>
                            </div>
                        </div>

                        {/* President */}
                        <div className="md:col-span-2">
                            <InputGroup label={`${t('president')}`} name="president" value={formData.president} onChange={handleChange} required />
                        </div>

                        {/* Contact Info */}
                        <InputGroup label={t('phone')} name="phone" value={formData.phone} onChange={handleChange} required />
                        <InputGroup label={t('email')} name="email" value={formData.email || ''} onChange={handleChange} type="email" />

                        {/* Address */}
                        <div className="md:col-span-2">
                            <InputGroup label={`${t('address')}`} name="address" value={formData.address} onChange={handleChange} />
                        </div>

                        {/* Activity Type */}
                        <div className="md:col-span-2">
                             <InputGroup label={`${t('activityType')}`} name="activityType" value={formData.activityType} onChange={handleChange} />
                        </div>

                         {/* Working Hours */}
                        <div className="md:col-span-2">
                             <InputGroup label={t('workingHours')} name="workingHours" value={formData.workingHours} onChange={handleChange} />
                        </div>
                        
                        {/* Stats */}
                        <div className="md:col-span-2">
                            <InputGroup label={t('foundedYear')} name="foundedYear" value={String(formData.foundedYear)} onChange={handleNumberChange} type="number" />
                        </div>

                        {/* Logo Upload Section */}
                        <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">شعار الجمعية</label>
                            
                            <div className="flex items-start gap-4">
                                {/* Preview */}
                                <div className="relative w-24 h-24 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-hidden flex-shrink-0 shadow-sm">
                                    {formData.logoUrl ? (
                                        <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Controls */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            className="hidden"
                                            accept="image/png, image/jpeg, image/webp"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                        />
                                        <label 
                                            htmlFor="logo-upload"
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors shadow-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <DownloadIcon /> 
                                            <span>{formData.logoUrl ? 'تغيير الصورة' : 'رفع صورة الشعار'}</span>
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        الصيغ المدعومة: PNG, JPG, WebP. الحد الأقصى: 2 ميجابايت.
                                    </p>
                                    {uploadError && (
                                        <p className="text-xs text-red-500 mt-1 font-bold">{uploadError}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Facebook Link */}
                        <div className="md:col-span-2">
                            <InputGroup label="رابط صفحة الفيسبوك" name="socialLinks.facebook" value={formData.socialLinks?.facebook || ''} onChange={handleChange} />
                        </div>
                        
                        {/* Spacing for mobile scroll */}
                        <div className="h-10 md:hidden"></div>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3 rounded-b-2xl md:rounded-b-2xl sticky bottom-0 z-10 pb-6 md:pb-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <button type="button" onClick={onClose} className="px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        {t('cancel')}
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isUploading}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-200/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                    >
                        {isUploading ? 'جاري الرفع...' : t('save')}
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
    step?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, value, onChange, type = 'text', required = false, step }) => (
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
            step={step}
            className={inputClasses}
        />
    </div>
);

export default AssociationFormModal;
