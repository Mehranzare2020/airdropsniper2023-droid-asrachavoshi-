
import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UI_TEXT } from '../constants';

const Home: React.FC = () => {
  const { language } = useStore();
  const isRTL = language === 'fa';
  
  // Dynamic font styles based on language for headlines
  const headlineFont = language === 'fa' ? 'font-vazir font-black' : 'font-serif';
  const subheadFont = language === 'fa' ? 'font-vazir' : 'font-serif';

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-700 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center h-screen px-4 text-center">
        <h2 className={`text-amber-500 font-bold tracking-[0.3em] text-sm md:text-base mb-6 animate-fade-in-up ${language === 'fa' ? 'font-vazir tracking-widest' : ''}`}>
          {UI_TEXT.hero_subtitle[language]}
        </h2>
        
        <h1 className={`text-5xl md:text-8xl lg:text-9xl leading-tight mb-8 ${headlineFont}`}>
          {UI_TEXT.hero_title_prefix[language]} <br />
          <span className="italic text-neutral-400">{UI_TEXT.hero_title_highlight[language]}</span>
        </h1>

        <p className={`max-w-2xl text-neutral-400 text-lg md:text-xl font-light leading-relaxed mb-12 ${language === 'fa' ? 'font-vazir' : ''}`}>
          {UI_TEXT.hero_desc[language]}
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <Link 
            to="/portfolio"
            className={`group relative px-8 py-4 bg-white text-neutral-900 font-bold uppercase tracking-wider overflow-hidden ${language === 'fa' ? 'font-vazir' : ''}`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {UI_TEXT.btn_view_works[language]} 
              {isRTL ? <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>}
            </span>
            <div className={`absolute top-0 left-0 w-full h-full bg-amber-500 transform transition-transform duration-300 ease-in-out ${isRTL ? 'translate-x-full group-hover:translate-x-0' : '-translate-x-full group-hover:translate-x-0'}`}></div>
          </Link>
          
          <Link 
            to="/books"
            className={`px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors ${language === 'fa' ? 'font-vazir' : ''}`}
          >
            {UI_TEXT.btn_published_books[language]}
          </Link>
        </div>
      </div>
      
      {/* Philosophy Quote Section */}
      <div className="bg-neutral-900 py-24 px-6 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto text-center">
            <blockquote className={`text-3xl md:text-4xl italic text-neutral-300 leading-normal ${subheadFont} ${language === 'fa' ? 'not-italic leading-relaxed' : ''}`}>
              "{UI_TEXT.quote[language]}"
            </blockquote>
            <p className={`mt-6 text-amber-500 tracking-widest ${language === 'fa' ? 'font-vazir' : ''}`}>
              — {UI_TEXT.thesis_ref[language]}
            </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
