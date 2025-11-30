
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Calendar, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import { UI_TEXT, getLocalized } from '../constants';
import JournalModal from '../components/JournalModal';
import { JournalPost } from '../types';

const Journal: React.FC = () => {
  const { journal, language } = useStore();
  const [selectedPost, setSelectedPost] = useState<JournalPost | null>(null);
  const isRTL = language === 'fa';

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 px-4 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className={`text-5xl md:text-7xl font-serif text-neutral-900 mb-6 ${language === 'fa' ? 'font-vazir' : ''}`}>
            {UI_TEXT.journal_title[language]}
          </h1>
          <p className={`text-neutral-500 text-lg max-w-2xl mx-auto ${language === 'fa' ? 'font-vazir' : ''}`}>
             {UI_TEXT.hero_desc[language]}
          </p>
        </div>

        <div className="space-y-12">
          {journal.map((post) => {
            const title = getLocalized(post, 'title', language);
            const excerpt = getLocalized(post, 'excerpt', language);

            return (
              <article key={post.id} className="bg-white border border-neutral-200 p-8 md:p-12 hover:shadow-xl transition-shadow duration-300 group">
                <div className="flex items-center gap-4 text-xs text-neutral-400 mb-6 uppercase tracking-widest font-bold">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {post.date}
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Tag size={12} /> {post.tags.join(', ')}
                  </span>
                </div>
                
                <h2 
                  onClick={() => setSelectedPost(post)}
                  className={`text-3xl md:text-4xl font-serif text-neutral-900 mb-6 group-hover:text-amber-700 transition-colors cursor-pointer ${language === 'fa' ? 'font-vazir' : ''}`}
                >
                  {title}
                </h2>

                <p className={`text-neutral-600 text-lg leading-relaxed mb-8 ${language === 'fa' ? 'font-vazir' : ''}`}>
                  {excerpt}
                </p>

                <button 
                  onClick={() => setSelectedPost(post)}
                  className={`group flex items-center gap-2 text-amber-700 font-bold uppercase tracking-widest text-sm hover:gap-4 transition-all ${language === 'fa' ? 'font-vazir' : ''}`}
                >
                  {UI_TEXT.read_essay[language]} 
                  {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </button>
              </article>
            );
          })}
        </div>
      </div>
      
      <JournalModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
};

export default Journal;
