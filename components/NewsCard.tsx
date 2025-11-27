
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
      <Link to={`/news/${news.id}`} className="block group relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Background Image with Zoom Effect */}
        <div className="absolute inset-0 overflow-hidden">
             <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col justify-end h-full">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold rounded-lg mb-4 shadow-lg border border-white/10">
                    <CalendarIcon /> {news.date}
                </span>
                
                <h3 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight drop-shadow-lg">
                    {news.title}
                </h3>
                
                <p className="text-gray-200 text-sm md:text-lg line-clamp-2 md:line-clamp-3 mb-6 max-w-3xl opacity-90 group-hover:opacity-100 transition-opacity">
                    {news.summary}
                </p>
                
                <span className="inline-flex items-center gap-2 text-white font-bold border-b-2 border-blue-500 pb-1 hover:text-blue-400 transition-colors">
                    اقرأ التفاصيل الكاملة <ArrowLeftIcon />
                </span>
            </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${news.id}`} className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
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