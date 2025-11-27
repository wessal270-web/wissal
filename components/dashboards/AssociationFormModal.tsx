
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
    members: 0,
    logoUrl: '',
    location: { lat: 0, lng: 0 },
    socialLinks: { facebook: '' },
};

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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-cyan-800">
                        {initialData ? t('editAssociation') : t('addAssociation')}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Name */}
                        <div className="md:col-span-2">
                             <InputGroup label={t('nameAr')} name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        
                        {/* Category & Municipality */}
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
                           <select name="category" value={formData.category} onChange={handleChange} className="input-field" required>
                               <option value="youth">{t('youth')}</option>
                               <option value="sports">{t('sports')}</option>
                           </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">البلدية</label>
                            <select 
                                name="municipality" 
                                value={formData.municipality} 
                                onChange={handleChange} 
                                className="input-field"
                                required
                            >
                                <option value="">اختر البلدية</option>
                                {saidaMunicipalities.map((mun, idx) => (
                                    <option key={idx} value={mun}>{mun}</option>
                                ))}
                            </select>
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
                        
                        {/* Stats */}
                        <InputGroup label={t('foundedYear')} name="foundedYear" value={String(formData.foundedYear)} onChange={handleNumberChange} type="number" />
                        <InputGroup label={t('members')} name="members" value={String(formData.members || 0)} onChange={handleNumberChange} type="number" />

                        {/* Logo Upload Section */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">شعار الجمعية</label>
                            
                            <div className="flex items-start gap-4">
                                {/* Preview */}
                                <div className="relative w-24 h-24 rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden flex-shrink-0">
                                    {formData.logoUrl ? (
                                        <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
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
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 cursor-pointer transition-colors shadow-sm ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <DownloadIcon /> 
                                            <span>{formData.logoUrl ? 'تغيير الصورة' : 'رفع صورة الشعار'}</span>
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        الصيغ المدعومة: PNG, JPG, WebP. الحد الأقصى: 2 ميجابايت.
                                    </p>
                                    {uploadError && (
                                        <p className="text-xs text-red-500 mt-1 font-bold">{uploadError}</p>
                                    )}
                                    
                                    {/* URL Fallback */}
                                    <div className="mt-2">
                                         <details className="text-xs text-gray-400 cursor-pointer">
                                            <summary>أو أدخل الرابط يدوياً</summary>
                                            <input 
                                                type="text" 
                                                name="logoUrl"
                                                value={formData.logoUrl}
                                                onChange={handleChange}
                                                placeholder="https://..."
                                                className="mt-1 w-full p-2 border border-gray-200 rounded text-gray-700"
                                            />
                                         </details>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Facebook Link */}
                        <div className="md:col-span-2">
                            <InputGroup label="رابط صفحة الفيسبوك" name="socialLinks.facebook" value={formData.socialLinks?.facebook || ''} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            {t('cancel')}
                        </button>
                        <button 
                            type="submit" 
                            disabled={isUploading}
                            className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? 'جاري الرفع...' : t('save')}
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
    step?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, name, value, onChange, type = 'text', required = false, step }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
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
            className="input-field"
        />
    </div>
);

// Add a simple style for the input fields in index.html for consistency
const style = document.createElement('style');
style.textContent = `
    .input-field {
        display: block;
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid #D1D5DB;
        border-radius: 0.375rem;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        background-color: #F9FAFB;
    }
    .input-field:focus {
        outline: none;
        --tw-ring-color: #0891B2;
        border-color: #0891B2;
        box-shadow: 0 0 0 1px #0891B2;
        background-color: white;
    }
`;
document.head.append(style);

export default AssociationFormModal;
