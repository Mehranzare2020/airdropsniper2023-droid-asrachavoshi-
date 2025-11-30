
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Category, Artwork } from '../types';
import { ExternalLink, ZoomIn } from 'lucide-react';
import ArtworkModal from '../components/ArtworkModal';
import { UI_TEXT, getLocalized } from '../constants';

const Portfolio: React.FC = () => {
  const { artworks, language } = useStore();
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  
  const isRTL = language === 'fa';
  const categories = ['All', ...Object.values(Category)];

  // Helper to translate categories roughly (mostly for Persian, can expand later)
  const getCategoryLabel = (cat: string) => {
    if (language !== 'fa') return cat;
    const map: Record<string, string> = {
      'All': 'همه',
      'Painting': 'نقاشی',
      'Sculpture': 'مجسمه‌سازی',
      'Digital Art': 'هنر دیجیتال',
      'Photography': 'عکاسی',
      'Philosophy': 'فلسفه',
      'Graphic Design': 'طراحی گرافیک'
    };
    return map[cat] || cat;
  };

  const filteredWorks = filter === 'All' 
    ? artworks 
    : artworks.filter(art => art.category === filter);

  return (
    <>
      <div className="min-h-screen bg-neutral-50 pt-32 px-4 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-neutral-200 pb-8">
            <div>
              <h1 className={`text-4xl md:text-6xl font-serif text-neutral-900 mb-4 ${language === 'fa' ? 'font-vazir' : ''}`}>
                {UI_TEXT.portfolio_title[language]}
              </h1>
              <p className={`text-neutral-500 max-w-xl ${language === 'fa' ? 'font-vazir' : ''}`}>
                {UI_TEXT.portfolio_subtitle[language]}
              </p>
            </div>
            
            <div className="mt-8 md:mt-0 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as Category | 'All')}
                  className={`px-4 py-2 text-sm uppercase tracking-wider transition-all duration-300 ${language === 'fa' ? 'font-vazir' : ''} ${
                    filter === cat 
                      ? 'bg-neutral-900 text-white' 
                      : 'bg-transparent text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {getCategoryLabel(cat as string)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorks.map((art) => {
              const title = getLocalized(art, 'title', language);
              const desc = getLocalized(art, 'description', language);
              
              return (
                <div 
                  key={art.id} 
                  className="group relative overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 cursor-pointer"
                  onClick={() => setSelectedArtwork(art)}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-neutral-200 relative">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ZoomIn className="text-white drop-shadow-lg" size={48} />
                    </div>
                    <img 
                      src={art.imageUrl} 
                      alt={title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out border-t border-neutral-100 z-20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-serif text-xl text-neutral-900 ${language === 'fa' ? 'font-vazir' : ''}`}>
                          {title}
                        </h3>
                        <p className={`text-amber-600 text-xs font-bold tracking-widest mt-1 mb-2 ${language === 'fa' ? 'font-vazir' : ''}`}>
                          {getCategoryLabel(art.category)} • {art.year}
                        </p>
                        <p className={`text-neutral-600 text-sm line-clamp-2 ${language === 'fa' ? 'font-vazir' : ''}`}>
                          {desc}
                        </p>
                      </div>
                    </div>
                    <button className={`mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider border-b border-neutral-900 pb-1 hover:text-amber-600 hover:border-amber-600 transition-colors ${language === 'fa' ? 'font-vazir' : ''}`}>
                      {UI_TEXT.full_details[language]} <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Artwork Modal */}
      <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </>
  );
};

export default Portfolio;
