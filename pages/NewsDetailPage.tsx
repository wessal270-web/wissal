
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useNews } from '../context/NewsContext';
import { ArrowLeftIcon, HomeIcon, FacebookIcon } from '../components/icons';

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { getNewsById } = useNews();
  
  const newsItem = id ? getNewsById(id) : undefined;

  if (!newsItem) {
    return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">{t('noResults')}</h2>
            <Link to="/news" className="text-blue-600 hover:underline font-bold">
                {t('back')}
            </Link>
        </div>
    );
  }

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  return (
    <div className="max-w-4xl mx-auto pb-8 px-4 md:px-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
            <Link to="/" className="hover:text-blue-600"><HomeIcon /></Link>
            <span>/</span>
            <Link to="/news" className="hover:text-blue-600">{t('newsAndActivities')}</Link>
            <span>/</span>
            <span className="text-gray-800 dark:text-gray-200 font-medium truncate max-w-[150px] md:max-w-xs">{newsItem.title}</span>
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Header Section with Title & Date */}
            <div className="p-6 md:p-10 pb-0">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
                        {newsItem.date}
                    </span>
                 </div>
                 <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-6">
                    {newsItem.title}
                </h1>
            </div>

            {/* Hero Image */}
            <div className="relative h-48 md:h-[350px] w-full mx-auto md:w-[calc(100%-5rem)] md:rounded-2xl overflow-hidden shadow-sm">
                <img 
                    src={newsItem.imageUrl} 
                    alt={newsItem.title} 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-5 md:p-10">
                <div className="prose max-w-none">
                    <p className="text-base md:text-xl text-gray-700 dark:text-gray-300 leading-loose font-medium mb-6 whitespace-pre-line break-words text-justify">
                        {newsItem.summary}
                    </p>
                </div>

                {/* Share / Tags */}
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2 flex-wrap justify-center">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">#الشباب</span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">#الرياضة</span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">#وصال</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">مشاركة الخبر:</span>
                        <button 
                            onClick={handleFacebookShare} 
                            className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm transform hover:scale-110" 
                            title="مشاركة على فيسبوك"
                        >
                            <FacebookIcon />
                        </button>
                    </div>
                </div>
            </div>
        </article>

        <div className="mt-8 text-center pb-8">
            <Link to="/news" className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm">
                <ArrowLeftIcon />
                العودة للأخبار
            </Link>
        </div>
    </div>
  );
};

export default NewsDetailPage;
