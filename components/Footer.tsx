
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">{t('footerText')}</p>
      </div>
    </footer>
  );
};

export default Footer;
