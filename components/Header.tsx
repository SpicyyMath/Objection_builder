import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { useTranslations } from '../hooks/useTranslations';

const Header: React.FC = () => {
  const { language, setLanguage } = useContext(LanguageContext)!;
  const t = useTranslations();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <header className="relative py-6 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white tracking-tight">
          {language === 'en' ? (
            <>
              Objection <span className="text-primary-600 dark:text-primary-400">Builder</span>
            </>
          ) : (
            <>
              异<span className="text-primary-600 dark:text-primary-400">议</span>
            </>
          )}
        </h1>
      </div>
      <div className="absolute top-1/2 right-4 sm:right-6 -translate-y-1/2">
          <button
            onClick={toggleLanguage}
            className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={t.toggleLanguage}
          >
            {language === 'en' ? '中文' : 'EN'}
          </button>
      </div>
    </header>
  );
};

export default Header;