
import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, BookOpen } from 'lucide-react';
import { UI_TEXT, getLocalized } from '../constants';

const BookStore: React.FC = () => {
  const { books, language, addToCart } = useStore();
  const isRTL = language === 'fa';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-32 px-4 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className={`text-amber-500 tracking-[0.3em] text-sm uppercase font-bold ${language === 'fa' ? 'font-vazir tracking-widest' : ''}`}>
            {UI_TEXT.nav_books[language]}
          </span>
          <h1 className={`text-5xl md:text-7xl font-serif text-white mt-4 mb-6 ${language === 'fa' ? 'font-vazir' : ''}`}>
            {UI_TEXT.books_library[language]}
          </h1>
          <p className={`text-neutral-400 max-w-2xl mx-auto text-lg font-light ${language === 'fa' ? 'font-vazir' : ''}`}>
             {/* Using hero_desc as placeholder or similar concise text */}
             {UI_TEXT.hero_desc[language]}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {books.map((book) => {
            const title = getLocalized(book, 'title', language);
            const subtitle = getLocalized(book, 'subtitle', language);
            const desc = getLocalized(book, 'description', language);

            return (
              <div key={book.id} className="bg-neutral-900 border border-neutral-800 p-6 md:p-10 flex flex-col md:flex-row gap-8 hover:border-amber-500/30 transition-colors group">
                <div className="w-full md:w-1/3 flex-shrink-0 shadow-2xl shadow-black">
                  <img src={book.coverUrl} alt={title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className={`text-2xl md:text-3xl font-serif text-white mb-2 group-hover:text-amber-500 transition-colors ${language === 'fa' ? 'font-vazir' : ''}`}>
                      {title}
                    </h2>
                    <h3 className={`text-neutral-400 text-sm uppercase tracking-wide mb-4 ${language === 'fa' ? 'font-vazir' : ''}`}>
                      {subtitle}
                    </h3>
                    <p className={`text-neutral-500 leading-relaxed mb-6 ${language === 'fa' ? 'font-vazir' : ''}`}>
                      {desc}
                    </p>
                    
                    <div className={`flex gap-6 text-sm text-neutral-400 mb-8 border-t border-neutral-800 pt-4 ${language === 'fa' ? 'font-vazir' : ''}`}>
                      <span>{book.pages} {language === 'fa' ? 'صفحه' : 'Pages'}</span>
                      <span>•</span>
                      <span>{new Date(book.publishDate).getFullYear()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-3xl font-serif text-white ${language === 'fa' ? 'font-vazir' : ''}`}>${book.price}</span>
                    <div className="flex gap-3">
                      <button className="p-3 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-colors" aria-label="Read Preview">
                        <BookOpen size={20} />
                      </button>
                      <button 
                        onClick={() => addToCart(book)}
                        className={`flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-none font-bold uppercase tracking-wider hover:bg-amber-700 transition-colors active:scale-95 transform ${language === 'fa' ? 'font-vazir' : ''}`}
                      >
                        <ShoppingBag size={18} /> {UI_TEXT.add_to_cart[language]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookStore;
