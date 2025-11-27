
import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from './icons';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div 
        className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-[90] transition-all duration-300 ease-in-out" 
        style={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            pointerEvents: isVisible ? 'auto' : 'none' 
        }}
    >
       <button
        onClick={scrollToTop}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 focus:outline-none ring-4 ring-blue-100"
        aria-label="Back to top"
      >
        <ArrowUpIcon />
      </button>
    </div>
  );
};

export default BackToTopButton;
