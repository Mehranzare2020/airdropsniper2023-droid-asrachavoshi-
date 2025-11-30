
import React from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Instagram, Twitter, Linkedin, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UI_TEXT } from '../constants';

const Footer: React.FC = () => {
  const { language } = useStore();
  const isRTL = language === 'fa';

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-8 text-neutral-400" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
             <Link to="/" className="text-2xl font-serif text-white tracking-widest flex items-center gap-2 mb-6">
              <span className="text-amber-500 text-3xl">✦</span>
              {language === 'fa' ? <span className="font-vazir font-bold">دکتر آرکتایپ</span> : 'DR. ARCHETYPE'}
            </Link>
            <p className={`max-w-md leading-relaxed ${language === 'fa' ? 'font-vazir' : ''}`}>
              {UI_TEXT.hero_desc[language]}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className={`text-white font-bold uppercase tracking-widest text-sm ${language === 'fa' ? 'font-vazir' : ''}`}>
              {UI_TEXT.quick_links[language]}
            </h4>
            <ul className={`space-y-2 ${language === 'fa' ? 'font-vazir' : ''}`}>
              <li><Link to="/portfolio" className="hover:text-amber-500 transition-colors">{UI_TEXT.nav_works[language]}</Link></li>
              <li><Link to="/books" className="hover:text-amber-500 transition-colors">{UI_TEXT.nav_books[language]}</Link></li>
              <li><Link to="/journal" className="hover:text-amber-500 transition-colors">{UI_TEXT.nav_journal[language]}</Link></li>
              <li><Link to="/about" className="hover:text-amber-500 transition-colors">{UI_TEXT.nav_bio[language]}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className={`text-white font-bold uppercase tracking-widest text-sm ${language === 'fa' ? 'font-vazir' : ''}`}>
              {UI_TEXT.contact[language]}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail size={16} className="text-amber-600" />
                <span>studio@archetype.edu</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <MapPin size={16} className="text-amber-600" />
                <span>{language === 'fa' ? 'تهران، ایران' : 'Tehran, Iran'}</span>
              </li>
            </ul>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

        </div>

        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-600 uppercase tracking-wider">
          <p className={language === 'fa' ? 'font-vazir' : ''}>
            &copy; {new Date().getFullYear()} Dr. Archetype. {language === 'fa' ? 'تمامی حقوق محفوظ است.' : 'All Rights Reserved.'}
          </p>
          <p>{UI_TEXT.designed_with[language]}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
