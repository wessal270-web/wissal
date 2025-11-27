
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
        <div className="flex flex-col items-center justify-center py-20">
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
    <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600"><HomeIcon /></Link>
            <span>/</span>
            <Link to="/news" className="hover:text-blue-600">{t('newsAndActivities')}</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-xs">{newsItem.title}</span>
        </div>

        <article className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Hero Image */}
            <div className="relative h-64 md:h-96 w-full">
                <img 
                    src={newsItem.imageUrl} 
                    alt={newsItem.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 md:p-10 pt-20">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-3">
                        {newsItem.date}
                    </span>
                    <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                        {newsItem.title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10">
                <div className="prose max-w-none">
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium mb-6 whitespace-pre-wrap">
                        {newsItem.summary}
                    </p>
                </div>

                {/* Share / Tags */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600">#الشباب</span>
                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600">#الرياضة</span>
                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600">#وصال</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 font-bold text-sm">مشاركة الخبر:</span>
                        <button 
                            onClick={handleFacebookShare} 
                            className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm transform hover:scale-110" 
                            title="مشاركة على فيسبوك"
                        >
                            <FacebookIcon />
                        </button>
                    </div>
                </div>
            </div>
        </article>

        <div className="mt-8 text-center">
            <Link to="/news" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all shadow-sm">
                <ArrowLeftIcon />
                العودة للأخبار
            </Link>
        </div>
    </div>
  );
};

export default NewsDetailPage;
