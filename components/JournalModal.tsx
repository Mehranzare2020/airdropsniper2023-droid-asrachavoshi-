
import React from 'react';
import { X, Calendar, Tag, User } from 'lucide-react';
import { JournalPost } from '../types';
import { useStore } from '../context/StoreContext';
import { getLocalized } from '../constants';

interface JournalModalProps {
  post: JournalPost | null;
  onClose: () => void;
}

const JournalModal: React.FC<JournalModalProps> = ({ post, onClose }) => {
  const { language } = useStore();
  const isRTL = language === 'fa' || language === 'ar';

  if (!post) return null;

  const title = getLocalized(post, 'title', language);
  const content = getLocalized(post, 'content', language) || post.content; // Fallback

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div 
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-4xl bg-white h-[90vh] shadow-2xl animate-fade-in-up flex flex-col rounded-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-white z-10">
          <div className={`text-xs text-neutral-400 uppercase tracking-widest font-bold flex gap-4 ${language === 'fa' ? 'font-vazir' : ''}`}>
             <span>{language === 'fa' ? 'جستار فلسفی' : 'PHILOSOPHICAL ESSAY'}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-black"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-neutral-50 custom-scrollbar">
          <div className="max-w-2xl mx-auto">
             <div className="mb-8 flex flex-wrap gap-4 text-xs text-neutral-500">
               <span className="flex items-center gap-1"><Calendar size={14}/> {post.date}</span>
               <span className="flex items-center gap-1"><Tag size={14}/> {post.tags.join(', ')}</span>
               <span className="flex items-center gap-1"><User size={14}/> Dr. Archetype</span>
             </div>

             <h1 className={`text-3xl md:text-5xl font-serif text-neutral-900 mb-10 leading-tight ${language === 'fa' ? 'font-vazir' : ''}`}>
               {title}
             </h1>
             
             <div className={`prose prose-lg prose-neutral max-w-none text-neutral-700 leading-loose ${language === 'fa' ? 'font-vazir' : 'font-serif'}`}>
               {/* Simulating paragraph breaks if content is just a string */}
               {content.split('\n').map((paragraph: string, i: number) => (
                 paragraph.trim() && <p key={i} className="mb-6">{paragraph}</p>
               ))}
               
               {/* Mock filler content if short */}
               {!content.includes('\n') && (
                 <>
                   <p>{content}</p>
                   <p>{language === 'fa' 
                     ? 'هنر در عصر بازتولید مکانیکی، هاله مقدس خود را از دست داده است، اما در عصر دیجیتال، این هاله به شکلی پارادوکسیکال در قالب "اصالت کد" بازمی‌گردد. ما دیگر با فیزیکِ اثر روبرو نیستیم، بلکه با متافیزیکِ داده‌ها مواجهیم.' 
                     : 'Art in the age of mechanical reproduction lost its aura, but in the digital age, this aura returns paradoxically in the form of "code authenticity". We are no longer facing the physics of the work, but the metaphysics of data.'}</p>
                   <p>{language === 'fa'
                     ? 'زمانی که ما به یک پیکسل نگاه می‌کنیم، در واقع به اتم‌های یک جهان جدید خیره شده‌ایم. جهانی که در آن "بودن" با "دیده شدن" یکی نیست.'
                     : 'When we look at a pixel, we are staring at the atoms of a new universe. A universe where "being" is not synonymous with "being seen".'}</p>
                 </>
               )}
             </div>

             <div className="mt-16 pt-8 border-t border-neutral-200 flex justify-center">
                <span className="text-2xl text-neutral-300">✦ ✦ ✦</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
