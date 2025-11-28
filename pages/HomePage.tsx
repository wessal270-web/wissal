
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAssociations } from '../context/AssociationsContext';
import { useNews } from '../context/NewsContext';
import { YouthIcon, SportsIcon, ArrowLeftIcon, CalendarIcon, HomeIcon } from '../components/icons';

// Custom Hook for counting animation
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (easeOutCubic) for smooth deceleration
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOutCubic * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure final value is exact
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return count;
};

const HomePage = () => {
  const { t } = useLanguage();
  const { associations } = useAssociations();
  const { news } = useNews();

  // Stats
  const totalAssociations = associations.length;
  const youthCount = associations.filter(a => a.category === 'youth').length;
  const sportsCount = associations.filter(a => a.category === 'sports').length;
  
  const latestNews = news.slice(0, 3);

  return (
    <div className="font-sans overflow-x-hidden">
      {/* 1. Hero Section - Reduced Padding */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-4 pb-24 lg:pt-10 lg:pb-32">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-24 w-96 h-96 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-48 left-20 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center py-1.5 px-4 rounded-full bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border border-blue-100 dark:border-gray-700 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase mb-4 shadow-sm">
              ✨ المنصة الرقمية الأولى للجمعيات في ولاية سعيدة
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">وصال</span>
              <span className="block text-2xl md:text-4xl lg:text-5xl mt-3 text-gray-700 dark:text-gray-300 font-extrabold">
                بوابتك نحو العمل الجمعوي
              </span>
            </h1>
            
            <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {t('homeSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Stats Section (Redesigned & Modern) */}
      <section className="relative -mt-16 z-20 mb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
             <StatCard 
               icon={<HomeIcon className="w-8 h-8" />} 
               count={totalAssociations} 
               label="إجمالي الجمعيات" 
               gradient="from-indigo-500 via-purple-500 to-purple-600"
               delay="0ms"
             />
             <StatCard 
               icon={<YouthIcon className="w-8 h-8" />} 
               count={youthCount} 
               label="جمعية شبانية" 
               gradient="from-emerald-400 via-teal-500 to-teal-600"
               delay="100ms"
             />
             <StatCard 
               icon={<SportsIcon className="w-8 h-8" />} 
               count={sportsCount} 
               label="نادي رياضي" 
               gradient="from-blue-500 via-cyan-500 to-cyan-600"
               delay="200ms"
             />
          </div>
        </div>
      </section>

      {/* 3. Categories Section - Reduced Padding */}
      <section className="py-4 container mx-auto px-4 mb-4">
         <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-1">استكشف المجالات</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              دليلك الشامل للنوادي والجمعيات، مصنفة لتسهيل الوصول إلى شغفك.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {/* Youth Card */}
            <Link to="/associations/youth" className="group relative h-64 rounded-[2rem] overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900 transition-transform duration-700 group-hover:scale-105"></div>
               
               {/* Decorative Circles */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

               <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg">
                     <div className="w-7 h-7"><YouthIcon className="w-7 h-7" /></div>
                  </div>
                  
                  <div>
                     <h3 className="text-2xl font-black text-white mb-1">قطاع الشباب</h3>
                     <p className="text-emerald-100 text-base font-medium mb-3 max-w-xs opacity-90">
                        ثقافة، علوم، كشافة، ونشاطات ترفيهية متنوعة.
                     </p>
                     <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl font-bold transition-all group-hover:bg-white group-hover:text-emerald-800 text-xs">
                        تصفح القائمة <ArrowLeftIcon />
                     </span>
                  </div>
               </div>
            </Link>

            {/* Sports Card */}
            <Link to="/associations/sports" className="group relative h-64 rounded-[2rem] overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 transition-transform duration-700 group-hover:scale-105"></div>
               
                {/* Decorative Circles */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

               <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg">
                     <div className="w-7 h-7"><SportsIcon className="w-7 h-7" /></div>
                  </div>
                  
                  <div>
                     <h3 className="text-2xl font-black text-white mb-1">قطاع الرياضة</h3>
                     <p className="text-blue-100 text-base font-medium mb-3 max-w-xs opacity-90">
                        كرة قدم، فنون قتالية، سباحة، ورياضات جماعية وفردية.
                     </p>
                     <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl font-bold transition-all group-hover:bg-white group-hover:text-blue-800 text-xs">
                        تصفح القائمة <ArrowLeftIcon />
                     </span>
                  </div>
               </div>
            </Link>
         </div>
      </section>

      {/* 4. Latest News - Modern Redesign */}
      {latestNews.length > 0 && (
        <section className="py-8 md:py-12 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-[2rem]">
           <div className="container mx-auto px-4">
              {/* Header */}
              <div className="flex items-end justify-between mb-8">
                 <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-2">جديد الساحة</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium">آخر المستجدات والنشاطات في الولاية</p>
                 </div>
                 <Link to="/news" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 text-sm font-bold shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-600 group">
                    كل الأخبار <span className="group-hover:-translate-x-1 transition-transform"><ArrowLeftIcon /></span>
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {latestNews.map((item, index) => (
                    <Link 
                        key={item.id} 
                        to={`/news/${item.id}`} 
                        className={`group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800
                        ${index === 0 ? 'md:col-span-2 md:flex-row' : 'shadow-sm hover:-translate-y-2'}`}
                    >
                       {/* Image */}
                       <div className={`relative overflow-hidden ${index === 0 ? 'w-full md:w-1/2 h-64 md:h-auto' : 'h-48 w-full'}`}>
                          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 relative z-10" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 md:opacity-40 transition-opacity z-10"></div>
                          
                          {/* Date Badge */}
                          <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-gray-900 dark:text-white shadow-sm flex items-center gap-1 z-20">
                             <CalendarIcon /> {item.date}
                          </div>
                       </div>

                       {/* Content */}
                       <div className={`p-6 flex flex-col ${index === 0 ? 'w-full md:w-1/2 justify-center bg-white dark:bg-gray-800' : 'flex-1'}`}>
                          <h3 className={`font-black text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight ${index === 0 ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
                             {item.title}
                          </h3>
                          <p className={`text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 ${index === 0 ? 'md:text-base' : ''}`}>
                             {item.summary}
                          </p>
                          
                          <div className="mt-auto flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold group-hover:gap-3 transition-all">
                             <span>اقرأ المزيد</span>
                             <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ArrowLeftIcon />
                             </div>
                          </div>
                       </div>
                    </Link>
                 ))}
              </div>
              
              <div className="mt-6 text-center md:hidden">
                  <Link to="/news" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-white font-bold border border-gray-200 dark:border-gray-600 shadow-sm">
                    عرض كل الأخبار <ArrowLeftIcon />
                 </Link>
              </div>
           </div>
        </section>
      )}
    </div>
  );
};

const StatCard = ({ icon, count, label, gradient, delay }: { icon: React.ReactNode, count: number, label: string, gradient: string, delay: string }) => {
  const animatedCount = useCountUp(count);

  return (
    <div 
      className="relative group bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden"
      style={{ animationDelay: delay }}
    >
      {/* Decorative Gradient Blob */}
      <div className={`absolute -top-12 -left-12 w-40 h-40 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700`}></div>
      <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${gradient} opacity-5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700`}></div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col space-y-2">
            <span className="text-gray-500 dark:text-gray-400 font-bold text-sm md:text-base">{label}</span>
            <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
               {animatedCount}
            </span>
        </div>
        
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg shadow-gray-200/50 dark:shadow-none transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
            {icon}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
