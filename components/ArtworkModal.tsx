
import React from 'react';
import { X } from 'lucide-react';
import { Artwork } from '../types';
import { useStore } from '../context/StoreContext';
import { getLocalized } from '../constants';

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose }) => {
  const { language } = useStore();
  const isRTL = language === 'fa';

  if (!artwork) return null;

  const title = getLocalized(artwork, 'title', language);
  const desc = getLocalized(artwork, 'description', language);
  const technique = getLocalized(artwork, 'technique', language);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div 
        className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-6xl bg-white max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-black hover:text-white rounded-full transition-colors text-black md:text-white mix-blend-difference"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/3 bg-neutral-100 flex items-center justify-center p-4 md:p-12 overflow-hidden">
          <img 
            src={artwork.imageUrl} 
            alt={title} 
            className="max-w-full max-h-[80vh] shadow-2xl object-contain"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/3 p-8 md:p-12 bg-white text-neutral-900 flex flex-col justify-center overflow-y-auto">
          <span className={`text-amber-600 text-xs font-bold uppercase tracking-widest mb-4 block ${language === 'fa' ? 'font-vazir' : ''}`}>
             {artwork.category} • {artwork.year}
          </span>
          
          <h2 className={`text-3xl md:text-4xl font-serif mb-6 leading-tight ${language === 'fa' ? 'font-vazir' : ''}`}>
            {title}
          </h2>

          <div className={`space-y-6 text-neutral-600 leading-relaxed ${language === 'fa' ? 'font-vazir' : ''}`}>
            <p>{desc}</p>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-100 space-y-3">
             <div className="flex justify-between text-sm">
                <span className={`text-neutral-400 uppercase tracking-wider ${language === 'fa' ? 'font-vazir' : ''}`}>{language === 'fa' ? 'تکنیک' : 'Technique'}</span>
                <span className={`font-medium ${language === 'fa' ? 'font-vazir' : ''}`}>{technique || 'Mixed Media'}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className={`text-neutral-400 uppercase tracking-wider ${language === 'fa' ? 'font-vazir' : ''}`}>{language === 'fa' ? 'ابعاد' : 'Dimensions'}</span>
                <span className="font-medium">{artwork.dimensions || 'Variable'}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkModal;
