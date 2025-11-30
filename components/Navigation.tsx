
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Command, Globe, ShoppingBag, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UI_TEXT } from '../constants';
import { Language } from '../types';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, cart, toggleCart } = useStore();
  const isHome = location.pathname === '/';

  const isRTL = language === 'fa' || language === 'ar';
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: UI_TEXT.nav_works[language], path: '/portfolio' },
    { name: UI_TEXT.nav_books[language], path: '/books' },
    { name: UI_TEXT.nav_journal[language], path: '/journal' },
    { name: UI_TEXT.nav_bio[language], path: '/about' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fa', label: 'فارسی' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ru', label: 'Русский' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'ar', label: 'العربية' },
    { code: 'zh', label: '中文' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // If we are in the admin section, render nothing (Admin has its own sidebar)
  if (location.pathname.startsWith('/admin')) return null;

  // Font logic for specific languages
  const getFontClass = (code: Language) => {
    if (code === 'fa') return 'font-vazir';
    if (code === 'ar') return 'font-arabic';
    if (code === 'zh') return 'font-chinese';
    return '';
  };
  
  const currentFont = getFontClass(language);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isHome ? 'bg-transparent hover:bg-neutral-900/90' : 'bg-neutral-900 shadow-lg border-b border-neutral-800'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-serif text-white tracking-widest flex items-center gap-2">
              <span className="text-amber-500 text-3xl">✦</span>
              {language === 'fa' || language === 'ar' ? 
                <span className={language === 'ar' ? 'font-arabic font-bold' : 'font-vazir font-bold'}>
                  {language === 'ar' ? 'د. النموذج البدئي' : 'دکتر آرکتایپ'}
                </span> 
                : 'DR. ARCHETYPE'
              }
            </Link>
          </div>
          <div className="hidden md:block">
            <div className={`flex items-center space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-neutral-300 hover:text-amber-500 hover:scale-105 transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium tracking-wide uppercase ${currentFont} ${language === 'fa' || language === 'ar' ? 'text-base' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-6 w-px bg-neutral-700 mx-4"></div>

              {/* Cart Button */}
              <button 
                onClick={toggleCart}
                className="relative text-neutral-300 hover:text-white transition-colors p-2"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Language Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                  className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1 font-sans text-xs font-bold border border-neutral-700 rounded px-2 py-1 uppercase"
                >
                  <Globe size={14} />
                  {language}
                  <ChevronDown size={12} />
                </button>
                
                {isLangMenuOpen && (
                  <div className={`absolute top-full mt-2 w-32 bg-neutral-900 border border-neutral-800 shadow-xl rounded-md py-1 z-50 ${isRTL ? 'left-0' : 'right-0'}`}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors ${language === lang.code ? 'text-amber-500' : ''} ${getFontClass(lang.code)}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/admin"
                className="text-neutral-500 hover:text-white transition-colors"
                title={UI_TEXT.nav_admin[language]}
              >
                <Command size={18} />
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden items-center gap-4">
             <button 
                onClick={toggleCart}
                className="relative text-neutral-300 hover:text-white transition-colors p-2"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            <button
              onClick={toggleMenu}
              className="bg-neutral-800 inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-neutral-900 border-t border-neutral-800 shadow-2xl" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-neutral-300 hover:text-amber-500 block px-3 py-2 rounded-md text-base font-medium ${currentFont}`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-neutral-800 mt-4 pt-4 px-3">
              <div className="text-neutral-500 text-xs uppercase mb-2">Select Language</div>
              <div className="grid grid-cols-4 gap-2">
                {languages.map((lang) => (
                   <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`text-center py-2 rounded text-sm ${language === lang.code ? 'bg-neutral-800 text-amber-500' : 'text-neutral-400 hover:text-white'} ${getFontClass(lang.code)}`}
                   >
                     {lang.code.toUpperCase()}
                   </button>
                ))}
              </div>
            </div>

             <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`text-neutral-500 block px-3 py-2 rounded-md text-base font-medium mt-4 ${currentFont}`}
              >
                {UI_TEXT.nav_admin[language]}
              </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;