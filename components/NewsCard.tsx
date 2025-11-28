
import React from 'react';
import { Link } from 'react-router-dom';
import type { NewsItem } from '../types';
import { CalendarIcon, ArrowLeftIcon } from './icons';

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, featured = false }) => {

  if (featured) {
    return (
      <Link to={`/news/${news.id}`} className="block group relative overflow-hidden rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row h-auto md:h-[450px]">
        {/* Image Section - Left on desktop (RTL aware) */}
        <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden order-1 md:order-2">
             <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Gradient Overlay for Mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
            
             <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-sm px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 z-10 md:hidden">
                <CalendarIcon />
                <span dir="ltr">{news.date}</span>
            </div>
        </div>

        {/* Content Section - Right on desktop (RTL aware) */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center order-2 md:order-1 relative">
             <div className="hidden md:flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold mb-4 bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1 rounded-full">
                <CalendarIcon />
                <span dir="ltr">{news.date}</span>
            </div>

            <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                {news.title}
            </h3>
            
            <p className="text-gray-500 dark:text-gray-300 text-base md:text-lg line-clamp-3 md:line-clamp-4 mb-8 leading-relaxed">
                {news.summary}
            </p>
            
            <div className="mt-auto">
                 <span className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none">
                    اقرأ التفاصيل الكاملة <ArrowLeftIcon />
                </span>
            </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${news.id}`} className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
      {/* Image Container - Aspect Ratio Fixed */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        
        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur shadow-sm px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 z-10">
            <CalendarIcon />
            <span dir="ltr">{news.date}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col relative">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {news.title}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
            {news.summary}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                المزيد <ArrowLeftIcon />
            </span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
