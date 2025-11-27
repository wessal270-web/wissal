
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../hooks/useFavorites';
import { useAssociations } from '../context/AssociationsContext';
import { 
    PhoneIcon, MailIcon, DownloadIcon, FacebookIcon, 
    InstagramIcon, TwitterIcon, MapPinIcon, HomeIcon,
    UserIcon, CalendarIcon, UserGroupIcon, GlobeIcon, ShareIcon 
} from '../components/icons';

const AssociationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { associations } = useAssociations();
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  
  const association = associations.find(a => a.id === id);

  if (!association) {
    return (
        <div className="flex flex-col items-center justify-center py-20 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">{t('noResults')}</h2>
            <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                {t('back')}
            </Link>
        </div>
    );
  }
  
  const favorite = isFavorite(association.id);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(association.id);
      setFeedbackMessage(t('removeFromFavorites'));
    } else {
      addFavorite(association.id);
      setFeedbackMessage(t('addToFavorites'));
    }

    setTimeout(() => {
      setFeedbackMessage('');
    }, 2000);
  };
  
  const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(association.name)}&background=f3f4f6&color=0891b2&size=256&font-size=0.4&bold=true`;
  const logoSrc = association.logoUrl && association.logoUrl.trim() !== '' ? association.logoUrl : placeholderUrl;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-900 via-blue-800 to-emerald-800 dark:from-gray-900 dark:via-blue-950 dark:to-emerald-950 rounded-b-[3rem] shadow-lg overflow-hidden">
         {/* Abstract patterns */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4"></div>
         
         {/* Breadcrumb */}
         <div className="absolute top-6 right-6 z-10 hidden md:flex items-center gap-2 text-white/80 text-sm font-medium">
            <Link to="/" className="hover:text-white transition-colors"><HomeIcon /></Link>
            <span>/</span>
            <Link to={association.category === 'youth' ? "/associations/youth" : "/associations/sports"} className="hover:text-white transition-colors">
                {association.category === 'youth' ? t('youthAssociations') : t('sportsAssociations')}
            </Link>
            <span>/</span>
            <span className="text-white truncate max-w-xs">{association.name}</span>
         </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 -mt-32 md:-mt-40 relative z-20">
        
        {/* Header Card (Logo & Title) */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-right">
            <div className="relative -mt-20 md:-mt-0 md:-mb-16 flex-shrink-0">
                 <img
                    src={logoSrc}
                    alt={association.name}
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-3xl border-4 border-white dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-700"
                    onError={(e) => { e.currentTarget.src = placeholderUrl; }}
                />
            </div>
            
            <div className="flex-1 pb-2 w-full">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                    <div>
                         <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm mb-3 ${association.category === 'sports' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                            {association.category === 'sports' ? t('sports') : t('youth')}
                        </span>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-2">
                            {association.name}
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center md:justify-start gap-1">
                             <MapPinIcon />
                             {association.municipality} - {association.activityType}
                        </p>
                    </div>

                    <div className="flex gap-3 mt-4 md:mt-0">
                         <button
                            onClick={handleFavoriteClick}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                                favorite
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                : 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white'
                            }`}
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${favorite ? 'text-yellow-500 fill-current' : ''}`} viewBox="0 0 20 20" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={favorite ? "0" : "2"}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{favorite ? t('removeFromFavorites') : t('addToFavorites')}</span>
                        </button>
                        
                        <button className="p-3 bg-gray-100 dark:bg-gray-700 text-blue-900 dark:text-blue-400 rounded-2xl hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors">
                            <ShareIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Column 1: General Overview & Address */}
            <div className="space-y-6 h-full">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                            <GlobeIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">نبذة عن الجمعية</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-loose flex-grow">
                        تنشط الجمعية في مجال <span className="font-bold text-blue-600 dark:text-blue-400">{association.activityType}</span>، 
                        وتسعى لتقديم برامج ونشاطات هادفة لشباب بلدية {association.municipality}.
                        تأسست سنة {association.foundedYear} وتعمل على تطوير المواهب.
                    </p>
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
                            <MapPinIcon />
                            <span className="font-bold text-sm">{t('address')}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl border border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium text-sm leading-relaxed">
                            {association.address}
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 2: Key Details (Grid inside Col) */}
            <div className="space-y-6 h-full">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                            <CalendarIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">معلومات أساسية</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <DetailRow label={t('president')} value={association.president} icon={<UserIcon />} />
                        <DetailRow label={t('foundedYear')} value={String(association.foundedYear)} icon={<CalendarIcon />} />
                        <DetailRow label={t('members')} value={String(association.members || 0)} icon={<UserGroupIcon />} />
                        {association.workingHours && (
                            <DetailRow label={t('workingHours')} value={association.workingHours} icon={<GlobeIcon />} />
                        )}
                    </div>
                </div>
            </div>

            {/* Column 3: Contact, Social, Docs */}
            <div className="space-y-6 md:col-span-2 xl:col-span-1">
                 
                 {/* Contact Card */}
                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-3xl shadow-sm border border-blue-100 dark:border-blue-900 p-6">
                     <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4">تواصل معنا</h3>
                     <div className="space-y-3">
                        <ContactItem href={`tel:${association.phone}`} icon={<PhoneIcon />} text={association.phone} bg="bg-white dark:bg-gray-800" />
                        {association.email && (
                            <ContactItem href={`mailto:${association.email}`} icon={<MailIcon />} text={association.email} bg="bg-white dark:bg-gray-800" />
                        )}
                     </div>
                 </div>

                 {/* Social Media */}
                 {(association.socialLinks.facebook || association.socialLinks.instagram || association.socialLinks.twitter) && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">صفحة الفيسبوك</h3>
                        <div className="flex gap-4">
                            {association.socialLinks.facebook && <SocialBtn href={association.socialLinks.facebook} icon={<FacebookIcon />} color="text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 hover:text-white" />}
                            {association.socialLinks.instagram && <SocialBtn href={association.socialLinks.instagram} icon={<InstagramIcon />} color="text-pink-600 bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-600 hover:text-white" />}
                            {association.socialLinks.twitter && <SocialBtn href={association.socialLinks.twitter} icon={<TwitterIcon />} color="text-sky-500 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-500 hover:text-white" />}
                        </div>
                    </div>
                 )}

                 {/* Documents */}
                 {association.documents && association.documents.length > 0 && (
                     <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('documents')}</h3>
                         <div className="space-y-2">
                            {association.documents.map((doc, idx) => (
                                <a key={idx} href={doc.url} download className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-100 dark:border-gray-600 transition text-gray-700 dark:text-gray-200 group">
                                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center ml-3 group-hover:scale-110 transition-transform">
                                        <DownloadIcon />
                                    </div>
                                    <span className="text-sm font-medium truncate">{doc.name}</span>
                                </a>
                            ))}
                         </div>
                     </div>
                 )}
            </div>

        </div>
      </div>
      
      {feedbackMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl z-50 animate-fade-in-up font-bold">
            {feedbackMessage}
        </div>
      )}

    </div>
  );
};

const DetailRow = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-100/50 dark:border-gray-600/50">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <span className="text-gray-400 dark:text-gray-500">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="font-bold text-gray-800 dark:text-white">{value}</span>
    </div>
);

const ContactItem = ({ href, icon, text, bg }: { href: string, icon: React.ReactNode, text: string, bg: string }) => (
    <a href={href} className={`flex items-center gap-3 p-3 rounded-xl shadow-sm hover:shadow-md transition-all ${bg}`}>
        <div className="text-gray-500 dark:text-gray-400">{icon}</div>
        <span className="font-bold text-gray-700 dark:text-gray-200 dir-ltr truncate text-sm">{text}</span>
    </a>
);

const SocialBtn = ({ href, icon, color }: { href: string, icon: React.ReactNode, color: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 transform hover:-translate-y-1 ${color}`}>
    {icon}
  </a>
);

export default AssociationDetailPage;