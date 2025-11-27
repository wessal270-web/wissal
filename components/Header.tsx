
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { DashboardIcon, LogoutIcon, UserIcon, WessalLogo, ChevronDownIcon, MenuIcon, XIcon, YouthIcon, SportsIcon, SunIcon, MoonIcon } from './icons';

const Header = () => {
  const { t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAssocOpen, setIsMobileAssocOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
      isActive
        ? 'bg-white text-blue-700 shadow-md transform scale-105'
        : 'text-white hover:bg-white/20 hover:backdrop-blur-sm'
    }`;
  };
  
  const authLinkClass = `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 text-white hover:bg-white/20 hover:backdrop-blur-sm`;
  
  const dropdownButtonClass = `flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 text-white hover:bg-white/20 hover:backdrop-blur-sm cursor-pointer h-full`;

  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-600 to-emerald-500 shadow-lg sticky top-0 z-50 dark:from-gray-900 dark:via-blue-900 dark:to-emerald-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 py-3">
          
          {/* Logo & Brand Name & Hamburger */}
          <div className="flex items-center gap-4">
             {/* Mobile/PC Menu Button (Hamburger) - Moved to Right (Start in RTL) */}
             <button 
                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
             </button>

             <Link to="/" className="flex items-center gap-3 group">
                <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-all shadow-inner">
                    <WessalLogo className="w-10 h-10 md:w-12 md:h-12 drop-shadow-md" />
                </div>
                {/* Distinctive Wessal Logotype */}
                <div className="flex flex-col">
                    <span className="text-3xl md:text-4xl font-black font-Tajawal text-white tracking-wide leading-none drop-shadow-md">
                        وصال
                    </span>
                    <span className="text-[10px] md:text-xs text-blue-100 opacity-80 font-medium tracking-widest uppercase">
                        Wessal
                    </span>
                </div>
             </Link>

             {/* Desktop Navigation (Left of Logo for RTL) */}
             <nav className="hidden md:flex items-center space-x-2 rtl:space-x-reverse mr-8">
                <Link to="/" className={getNavLinkClass('/')}>{t('home')}</Link>
                
                {/* Associations Dropdown - State Controlled */}
                <div 
                    className="relative h-14 flex items-center"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                >
                    <div className={dropdownButtonClass}>
                      <span>{t('associationsMenu')}</span>
                      <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {/* Dropdown Menu */}
                    <div 
                        className={`absolute top-full right-0 w-56 pt-2 transition-all duration-300 ease-out transform z-50 ${
                            isDropdownOpen 
                                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                                : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}
                    >
                       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ring-1 ring-black ring-opacity-5 mt-1 border border-gray-100 dark:border-gray-700">
                        <div className="p-2 space-y-1">
                          <Link to="/associations/youth" className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-bold text-sm flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><YouthIcon /></div>
                             {t('youthAssociations')}
                          </Link>
                          <Link to="/associations/sports" className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold text-sm flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400"><SportsIcon /></div>
                             {t('sportsAssociations')}
                          </Link>
                        </div>
                      </div>
                    </div>
                </div>

                <Link to="/news" className={getNavLinkClass('/news')}>{t('newsAndActivities')}</Link>
                <Link to="/favorites" className={getNavLinkClass('/favorites')}>{t('favorites')}</Link>
             </nav>
          </div>

          <div className="flex items-center gap-2">
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-white hover:bg-white/20 transition-all flex items-center justify-center"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                  <>
                    <Link to="/dashboard" className={authLinkClass}>
                      <DashboardIcon /> {t('dashboard')}
                    </Link>
                    <button onClick={logout} className={authLinkClass}>
                      <LogoutIcon /> {t('logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={authLinkClass}>
                      <UserIcon /> {t('login')}
                    </Link>
                    <Link to="/register" className={`bg-emerald-400 hover:bg-emerald-300 text-blue-900 ${authLinkClass} shadow-md`}>
                      {t('register')}
                    </Link>
                  </>
                )}
              </div>
          </div>
        </div>
      </div>

      {/* Mobile/Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white dark:bg-gray-800 shadow-xl border-t border-gray-100 dark:border-gray-700 z-40 p-4 animate-fade-in-down">
            <div className="flex flex-col space-y-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-bold text-gray-700 dark:text-gray-200">
                    {t('home')}
                </Link>
                
                {/* Mobile Associations Expandable */}
                <div>
                    <button 
                        onClick={() => setIsMobileAssocOpen(!isMobileAssocOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-bold text-gray-700 dark:text-gray-200"
                    >
                        <span>{t('associationsMenu')}</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMobileAssocOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileAssocOpen && (
                        <div className="mr-4 pl-4 border-r-2 border-gray-100 dark:border-gray-700 space-y-1 mt-1">
                            <Link to="/associations/youth" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-sm font-semibold">
                                {t('youthAssociations')}
                            </Link>
                            <Link to="/associations/sports" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-sm font-semibold">
                                {t('sportsAssociations')}
                            </Link>
                        </div>
                    )}
                </div>

                <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-bold text-gray-700 dark:text-gray-200">
                    {t('newsAndActivities')}
                </Link>
                
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                
                {user ? (
                    <>
                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                             <DashboardIcon /> {t('dashboard')}
                        </Link>
                        <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-start px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                            <LogoutIcon /> {t('logout')}
                        </button>
                    </>
                ) : (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 font-bold text-gray-700 dark:text-gray-200">
                            {t('login')}
                        </Link>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 font-bold text-white">
                            {t('register')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;