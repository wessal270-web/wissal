
import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useUsers } from '../../context/UsersContext';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeftIcon, DeleteIcon, UserIcon, EditIcon } from '../icons';
import type { User, Role } from '../../types';

interface ManageUsersProps {
    onBack: () => void;
}

const ManageUsers: React.FC<ManageUsersProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const { users, deleteUser, updateUserRole } = useUsers();
    const { user: currentUser } = useAuth();
    
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role>('user');

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteUser(deleteId);
            setDeleteId(null);
        }
    };

    const cancelDelete = () => {
        setDeleteId(null);
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setSelectedRole(user.role);
    };

    const handleSaveRole = async () => {
        if (editingUser) {
            await updateUserRole(editingUser.id, selectedRole);
            setEditingUser(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                     <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-cyan-700">
                        <ArrowLeftIcon />
                        {t('back')}
                    </button>
                    <h1 className="text-3xl font-bold text-cyan-800">{t('manageUsers')}</h1>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('fullName')}</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('email')}</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">الدور</th>
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => {
                                const isCurrentUser = currentUser?.id === user.id;
                                return (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 me-3">
                                                <UserIcon />
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            {isCurrentUser && <span className="mr-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">(أنت)</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                              user.role === 'president' ? 'bg-emerald-100 text-emerald-800' : 
                                              'bg-gray-100 text-gray-800'}`}>
                                            {user.role === 'admin' ? 'مدير' : user.role === 'president' ? 'رئيس جمعية' : 'مستخدم'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {!isCurrentUser && (
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                                                    <EditIcon /> {t('edit')}
                                                </button>
                                                {user.role !== 'admin' && (
                                                    <button onClick={() => handleDeleteClick(user.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1">
                                                        <DeleteIcon /> {t('delete')}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Role Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                            <EditIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-4">تعديل دور المستخدم</h3>
                        <p className="text-center text-gray-600 mb-4 font-medium">{editingUser.name}</p>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">الدور الجديد</label>
                            <div className="relative">
                                <select 
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                >
                                    <option value="user">مستخدم عادي</option>
                                    <option value="president">رئيس جمعية</option>
                                    <option value="admin">مدير (Admin)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 left-0 rtl:right-0 rtl:left-auto flex items-center px-3 text-gray-500">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-3">
                            <button 
                                onClick={() => setEditingUser(null)} 
                                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button 
                                onClick={handleSaveRole} 
                                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg transition-colors"
                            >
                                {t('save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in-up">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <DeleteIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">حذف المستخدم</h3>
                        <p className="text-gray-500 text-center mb-6">هل أنت متأكد من أنك تريد حذف هذا المستخدم؟</p>
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

export default ManageUsers;
