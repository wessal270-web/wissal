
import React, { useState, useEffect, useRef, useMemo } from 'react';
import NewsCard from '../components/NewsCard';
import { useLanguage } from '../context/LanguageContext';
import { useNews } from '../context/NewsContext';
import { NewsIcon } from '../components/icons';

const ITEMS_PER_PAGE = 9;

const NewsPage = () => {
  const { t } = useLanguage();
  const { news } = useNews();
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Filter news based on search
  const filteredNews = useMemo(() => {
    return news.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [news, searchTerm]);

  const hasSearch = searchTerm.length > 0;
  
  // If searching, show all matches. If not, show paginated.
  const displayedNews = hasSearch ? filteredNews : filteredNews.slice(0, displayCount);
  const hasMore = !hasSearch && displayCount < filteredNews.length;

  // First item for Hero section (only if not searching and on first page view)
  const heroNews = !hasSearch && filteredNews.length > 0 ? filteredNews[0] : null;
  const gridNews = !hasSearch && filteredNews.length > 0 ? displayedNews.slice(1) : displayedNews;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore) {
          setTimeout(() => {
            setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore]);

  return (
    <div className="pb-12 min-h-screen">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <NewsIcon />
              </div>
              <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wide text-sm uppercase">أحدث المستجدات</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            {t('newsAndActivities')}
           </h1>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input 
                type="text" 
                placeholder="ابحث عن خبر أو نشاط..." 
                className="w-full pl-4 pr-12 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {filteredNews.length > 0 ? (
        <>
          {/* Hero Section (Only when not searching) */}
          {heroNews && (
             <div className="mb-12 animate-fade-in-up">
                <NewsCard news={heroNews} featured={true} />
             </div>
          )}

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridNews.map((item, idx) => (
              <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                 <NewsCard news={item} />
              </div>
            ))}
          </div>

          {/* Loader for Infinite Scroll */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center items-center py-12">
               <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-100 dark:border-gray-700">
                 <div className="w-5 h-5 border-2 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                 <span className="text-sm text-gray-500 dark:text-gray-400 font-bold">جاري تحميل المزيد...</span>
               </div>
            </div>
          )}
          
          {/* End of List Message */}
          {!hasMore && gridNews.length > 0 && (
             <div className="text-center py-12">
                <span className="inline-block px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-full text-xs font-bold border border-gray-100 dark:border-gray-700">
                    وصلت لنهاية القائمة
                </span>
             </div>
          )}
        </>
      ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm text-center">
               <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لا توجد أخبار</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">لم يتم العثور على نتائج تطابق بحثك، حاول بكلمات مختلفة.</p>
              {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-6 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                      مسح البحث
                  </button>
              )}
          </div>
      )}
    </div>
  );
};

export default NewsPage;
