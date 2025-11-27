
import React from 'react';
import { Link } from 'react-router-dom';
import { associations } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { YouthIcon, SportsIcon } from '../components/icons';

const MapPage = () => {
    const { language, t } = useLanguage();

    // Find bounding box to center the map
    const latitudes = associations.map(a => a.location.lat);
    const longitudes = associations.map(a => a.location.lng);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    const getPosition = (lat: number, lng: number) => {
        const top = 100 - ((lat - minLat) / latRange) * 100;
        const left = ((lng - minLng) / lngRange) * 100;
        return { top: `${top}%`, left: `${left}%` };
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-cyan-800 mb-6">{t('associationsMap')}</h1>
            <div className="relative w-full h-[60vh] bg-cyan-50 border-2 border-cyan-200 rounded-lg shadow-inner overflow-hidden">
                {/* Placeholder map background */}
                <div className="absolute inset-0 bg-gray-200 opacity-50">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(200, 200, 200, 0.5)" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {associations.map(assoc => (
                    <div
                        key={assoc.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={getPosition(assoc.location.lat, assoc.location.lng)}
                    >
                        <Link to={`/association/${assoc.id}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transform group-hover:scale-125 transition-transform
                                ${assoc.category === 'sports' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                {assoc.category === 'sports' ? <SportsIcon /> : <YouthIcon />}
                            </div>
                        </Link>
                        <div className="absolute bottom-full mb-2 w-48 bg-white p-2 rounded-md shadow-lg text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none transform -translate-x-1/2 left-1/2">
                            <p className="font-bold text-sm text-gray-800">{assoc.name[language]}</p>
                            <p className="text-xs text-gray-500">{assoc.municipality[language]}</p>
                        </div>
                    </div>
                ))}
            </div>
             <div className="mt-4 flex justify-center items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-500"></span>
                    <span className="text-sm">{t('youthAssociations')}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                    <span className="text-sm">{t('sportsAssociations')}</span>
                </div>
            </div>
        </div>
    );
};

export default MapPage;
