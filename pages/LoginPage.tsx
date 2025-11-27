
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      const errorCode = err.code;
      
      if (
        errorCode === 'auth/invalid-credential' || 
        errorCode === 'auth/user-not-found' || 
        errorCode === 'auth/wrong-password'
      ) {
         setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (errorCode === 'auth/invalid-email') {
         setError('البريد الإلكتروني غير صالح.');
      } else if (errorCode === 'auth/user-disabled') {
         setError('تم تعطيل هذا الحساب. يرجى الاتصال بالدعم.');
      } else if (errorCode === 'auth/too-many-requests') {
         setError('تم حظر الوصول مؤقتاً بسبب تكرار المحاولات الفاشلة. يرجى المحاولة لاحقاً.');
      } else {
         setError('حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من اتصالك بالانترنت أو المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-blue-900 dark:text-blue-400">{t('login')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">مرحباً بك في منصة وصال</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 p-3 rounded-lg border border-red-100 dark:border-red-900 text-center font-bold">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري التسجيل...' : t('login')}
              </button>
            </div>
          </form>
           <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('dontHaveAccount')}{' '}
            <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
