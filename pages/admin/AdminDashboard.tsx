
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Book, 
  BrainCircuit, 
  Plus, 
  Trash2,
  Send,
  Loader2,
  LogOut,
  Lock,
  Key,
  ShieldAlert,
  Feather,
  Bot,
  Upload,
  XCircle
} from 'lucide-react';
import { askStrategicAdvisor, generateMultilingualData } from '../../services/geminiService';
import { Category, Artwork, Book as BookType, JournalPost } from '../../types';
import { Link } from 'react-router-dom';
import { ADMIN_SECRET_KEY } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { 
    artworks, books, journal, logs, 
    addArtwork, removeArtwork, 
    addBook, removeBook,
    addJournal, removeJournal,
    addLog,
    notify,
    chatHistory, addChatMessage
  } = useStore();
  
  // --- Security State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputKey === ADMIN_SECRET_KEY) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setAuthError(false);
      addLog('ورود مدیر به سیستم فرماندهی');
      notify('خوش آمدید دکتر. پنل فرماندهی آماده است.', 'success');
    } else {
      setAuthError(true);
      setInputKey('');
      addLog('تلاش ناموفق برای ورود');
      notify('کلید امنیتی نامعتبر است.', 'error');
      setTimeout(() => setAuthError(false), 500);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    addLog('خروج مدیر از سیستم');
  };

  // --- Dashboard State ---
  const [activeTab, setActiveTab] = useState<'overview' | 'art' | 'books' | 'journal' | 'ai'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  // AI Advisor
  const [strategyQuery, setStrategyQuery] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'ai') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeTab]);

  // Forms State
  const [artForm, setArtForm] = useState({ titleFa: '', descFa: '', cat: Category.PAINTING, year: new Date().getFullYear().toString(), imageUrl: '' });
  const [bookForm, setBookForm] = useState({ titleFa: '', descFa: '', price: '', pages: '', coverUrl: '' });
  const [journalForm, setJournalForm] = useState({ titleFa: '', contextFa: '', tags: '' });

  // --- Image Upload Logic ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'art' | 'book') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'art') {
          setArtForm(prev => ({ ...prev, imageUrl: reader.result as string }));
        } else {
          setBookForm(prev => ({ ...prev, coverUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (type: 'art' | 'book') => {
    if (type === 'art') {
      setArtForm(prev => ({ ...prev, imageUrl: '' }));
    } else {
      setBookForm(prev => ({ ...prev, coverUrl: '' }));
    }
  };

  // --- Handlers ---

  const handleSmartAddArt = async () => {
    if (!artForm.titleFa) return;
    setIsLoading(true);
    try {
      const data = await generateMultilingualData('artwork', artForm.titleFa, artForm.descFa, `Category: ${artForm.cat}, Year: ${artForm.year}`);
      
      const newArt: Artwork = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        year: parseInt(artForm.year) || new Date().getFullYear(),
        category: artForm.cat,
        // Use uploaded image OR fallback to random
        imageUrl: artForm.imageUrl || `https://picsum.photos/600/800?random=${Math.random()}`,
        featured: false,
        title: data.title || artForm.titleFa // Fallback
      };
      
      addArtwork(newArt);
      setArtForm({ titleFa: '', descFa: '', cat: Category.PAINTING, year: new Date().getFullYear().toString(), imageUrl: '' });
      notify('اثر با موفقیت ترجمه و ثبت شد.', 'success');
    } catch (e) {
      console.error(e);
      notify('خطا در ارتباط با هوش مصنوعی', 'error');
    }
    setIsLoading(false);
  };

  const handleSmartAddBook = async () => {
    if (!bookForm.titleFa) return;
    setIsLoading(true);
    try {
      const data = await generateMultilingualData('book', bookForm.titleFa, bookForm.descFa);
      
      const newBook: BookType = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        price: parseFloat(bookForm.price) || 0,
        pages: parseInt(bookForm.pages) || 0,
        // Use uploaded image OR fallback to random
        coverUrl: bookForm.coverUrl || `https://picsum.photos/400/600?random=${Math.random()}`,
        publishDate: new Date().toISOString(),
        title: data.title || bookForm.titleFa
      };
      
      addBook(newBook);
      setBookForm({ titleFa: '', descFa: '', price: '', pages: '', coverUrl: '' });
      notify('کتاب با موفقیت ترجمه و به کتابخانه افزوده شد.', 'success');
    } catch (e) {
      console.error(e);
      notify('خطا در عملیات', 'error');
    }
    setIsLoading(false);
  };

  const handleSmartAddJournal = async () => {
    if (!journalForm.titleFa) return;
    setIsLoading(true);
    try {
      const data = await generateMultilingualData('journal', journalForm.titleFa, journalForm.contextFa);
      
      const newPost: JournalPost = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        date: new Date().toLocaleDateString('en-CA'),
        tags: journalForm.tags.split(',').map(t => t.trim()).filter(t => t),
        title: data.title || journalForm.titleFa
      };
      
      addJournal(newPost);
      setJournalForm({ titleFa: '', contextFa: '', tags: '' });
      notify('مقاله با موفقیت تولید، ترجمه و منتشر شد.', 'success');
    } catch (e) {
      console.error(e);
      notify('خطا در عملیات', 'error');
    }
    setIsLoading(false);
  };

  const handleAskAdvisor = async () => {
    if (!strategyQuery.trim()) return;
    
    const userMsg = strategyQuery;
    setStrategyQuery('');
    addChatMessage('user', userMsg);
    setIsLoading(true);

    try {
      // Create context with recent history
      const historyContext = chatHistory.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n');
      const context = `سایت دارای ${artworks.length} اثر هنری، ${books.length} کتاب و ${journal.length} مقاله است. \nتاریخچه چت:\n${historyContext}`;
      
      const response = await askStrategicAdvisor(userMsg, context);
      addChatMessage('ai', response);
    } catch (error) {
       notify('خطا در دریافت پاسخ مشاور', 'error');
    }
    
    setIsLoading(false);
  };

  // --- Chart Data ---
  const chartData = [
    { name: 'آثار', count: artworks.length },
    { name: 'کتاب‌ها', count: books.length },
    { name: 'مقالات', count: journal.length },
    { name: 'فروش', count: 12 }, // Mock
  ];

  // Helper Component for Image Upload
  const ImageUploadBox = ({ image, onUpload, onClear, label }: { image: string, onUpload: (e: any) => void, onClear: () => void, label: string }) => (
    <div className="relative group w-full h-48 border-2 border-dashed border-neutral-700 hover:border-amber-500 rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer bg-neutral-950 overflow-hidden">
      {image ? (
        <>
          <img src={image} alt="Preview" className="w-full h-full object-cover opacity-80" />
          <button 
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-500 z-10"
            title="حذف تصویر"
          >
            <XCircle size={18} />
          </button>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
             <span className="text-white text-xs font-bold">تغییر تصویر</span>
          </div>
        </>
      ) : (
        <div className="text-center text-neutral-500 group-hover:text-amber-500">
          <Upload size={32} className="mx-auto mb-2" />
          <p className="text-sm font-bold">{label}</p>
          <p className="text-xs mt-1 text-neutral-600">JPG, PNG, WebP</p>
        </div>
      )}
      <input 
        type="file" 
        accept="image/*" 
        onChange={onUpload} 
        className="absolute inset-0 opacity-0 cursor-pointer" 
      />
    </div>
  );

  if (!isAuthenticated) {
     return (
      <div className="h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/17/Blue_matrix_code.gif')] bg-cover mix-blend-screen"></div>
        
        <div className="z-10 w-full max-w-lg space-y-8 text-right">
          <div className="text-center space-y-2">
            <ShieldAlert size={64} className="mx-auto text-red-600 animate-pulse" />
            <h1 className="text-3xl font-bold tracking-tighter text-red-600 font-vazir">دسترسی محدود</h1>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-vazir">مرکز فرماندهی دکتر آرکتایپ</p>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800 p-8 rounded shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest text-neutral-400 flex items-center gap-2 font-vazir">
                  <Key size={14} /> کلید پروتکل امنیتی
                </label>
                <div className={`relative transition-transform duration-100 ${authError ? 'translate-x-[10px] text-red-500' : ''}`}>
                  <input 
                    type="password" 
                    value={inputKey}
                    onChange={e => setInputKey(e.target.value)}
                    className="w-full bg-black border-b-2 border-green-500/50 focus:border-green-500 outline-none py-2 px-3 text-white font-mono placeholder-neutral-800 tracking-widest text-left"
                    placeholder="ENTER_KEY"
                    autoFocus
                  />
                  {authError && (
                    <span className="absolute left-0 top-2 text-xs text-red-500 font-bold font-vazir animate-pulse">
                      دسترسی غیرمجاز
                    </span>
                  )}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-green-900/20 text-green-500 border border-green-900 hover:bg-green-500 hover:text-black py-3 text-sm font-bold tracking-widest transition-all duration-300 font-vazir"
              >
                اجرای توالی ورود
              </button>
            </form>
          </div>
          
          <div className="text-center">
            <Link to="/" className="text-neutral-600 text-xs hover:text-white transition-colors tracking-widest font-vazir">
              بازگشت به سایت اصلی &gt;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-200 overflow-hidden font-vazir" dir="rtl">
      
      {/* Sidebar */}
      <aside className="w-64 border-l border-neutral-800 bg-black/50 backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-6 border-b border-neutral-800">
           <h1 className="font-bold text-amber-500 text-sm mb-1">مرکز فرماندهی</h1>
           <div className="text-xl font-bold">دکتر آرکتایپ</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}>
            <LayoutDashboard size={20} /> نمای کلی
          </button>
          <button onClick={() => setActiveTab('art')} className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'art' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}>
            <ImageIcon size={20} /> مدیریت آثار
          </button>
          <button onClick={() => setActiveTab('books')} className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'books' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}>
            <Book size={20} /> کتابخانه
          </button>
          <button onClick={() => setActiveTab('journal')} className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'journal' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}>
            <Feather size={20} /> نشریه
          </button>
          <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${activeTab === 'ai' ? 'bg-amber-900/20 text-amber-500' : 'text-neutral-500 hover:text-amber-500'}`}>
            <BrainCircuit size={20} /> مشاور هوشمند
          </button>
        </nav>

        <div className="p-4 border-t border-neutral-800">
           <button onClick={handleLogout} className="flex items-center gap-3 text-neutral-400 hover:text-red-500 transition-colors w-full text-right p-2 mb-2">
             <Lock size={18} /> قفل سیستم
           </button>
           <Link to="/" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors w-full text-right p-2">
             <LogOut size={18} /> خروج به سایت
           </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-grid-neutral-900/50 p-4 md:p-8 custom-scrollbar relative">
        
        {/* Mobile Nav Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="font-bold text-amber-500">مرکز فرماندهی</h1>
            <div className="flex gap-2">
                <button onClick={() => setActiveTab('overview')}><LayoutDashboard size={20}/></button>
                <button onClick={() => setActiveTab('art')}><ImageIcon size={20}/></button>
                <button onClick={() => setActiveTab('books')}><Book size={20}/></button>
                <button onClick={() => setActiveTab('ai')}><BrainCircuit size={20}/></button>
            </div>
        </div>
        
        {/* === OVERVIEW TAB === */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">داشبورد وضعیت</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                <h3 className="text-neutral-500 text-xs mb-2">کل آثار هنری</h3>
                <div className="text-3xl text-white font-bold">{artworks.length}</div>
              </div>
              <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                <h3 className="text-neutral-500 text-xs mb-2">کتاب‌های موجود</h3>
                <div className="text-3xl text-amber-500 font-bold">{books.length}</div>
              </div>
              <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                <h3 className="text-neutral-500 text-xs mb-2">مقالات منتشر شده</h3>
                <div className="text-3xl text-blue-500 font-bold">{journal.length}</div>
              </div>
              <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
                <h3 className="text-neutral-500 text-xs mb-2">بازدید امروز</h3>
                <div className="text-3xl text-emerald-500 font-bold">1,204</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 h-80">
                  <h3 className="mb-4 text-sm text-neutral-400">آمار محتوایی</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', textAlign: 'right' }} />
                      <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
               <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 h-80 overflow-y-auto custom-scrollbar">
                  <h3 className="mb-4 text-sm text-neutral-400">لاگ سیستم</h3>
                  <div className="space-y-3">
                    {logs.map(log => (
                      <div key={log.id} className="text-xs border-r-2 border-neutral-700 pr-3 py-1">
                         <span className="text-neutral-500 ml-2">{new Date(log.timestamp).toLocaleTimeString('fa-IR')}</span>
                         <span className="text-neutral-300">{log.action}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* === ARTWORKS TAB === */}
        {activeTab === 'art' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">لیست آثار هنری</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                   <thead>
                     <tr className="border-b border-neutral-800 text-neutral-500">
                       <th className="pb-3 pr-2">تصویر</th>
                       <th className="pb-3">عنوان</th>
                       <th className="pb-3">دسته‌بندی</th>
                       <th className="pb-3">سال</th>
                       <th className="pb-3">عملیات</th>
                     </tr>
                   </thead>
                   <tbody>
                     {artworks.map(art => (
                       <tr key={art.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                         <td className="py-2 pr-2">
                            <img src={art.imageUrl} className="w-10 h-10 object-cover rounded bg-neutral-800" alt="thumb"/>
                         </td>
                         <td className="py-4 font-medium">{art.title_fa || art.title}</td>
                         <td className="py-4 text-neutral-400">{art.category}</td>
                         <td className="py-4 text-neutral-400">{art.year}</td>
                         <td className="py-4">
                            <button onClick={() => removeArtwork(art.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={16}/></button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-fit sticky top-4">
               <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-500">
                 <Plus size={18}/> افزودن اثر جدید
               </h2>
               <div className="space-y-4">
                 <ImageUploadBox 
                    image={artForm.imageUrl} 
                    onUpload={(e) => handleImageUpload(e, 'art')} 
                    onClear={() => clearImage('art')}
                    label="بارگذاری تصویر اثر"
                 />
                 <input 
                   placeholder="عنوان اثر (فارسی)"
                   value={artForm.titleFa}
                   onChange={e => setArtForm({...artForm, titleFa: e.target.value})}
                   className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white focus:border-amber-500 outline-none placeholder-neutral-600"
                 />
                 <select 
                    value={artForm.cat}
                    onChange={e => setArtForm({...artForm, cat: e.target.value as Category})}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white outline-none"
                 >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 <input 
                   placeholder="سال خلق اثر"
                   type="number"
                   value={artForm.year}
                   onChange={e => setArtForm({...artForm, year: e.target.value})}
                   className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white outline-none placeholder-neutral-600"
                 />
                 <textarea 
                   placeholder="توضیحات کوتاه یا کانسپت اثر (فارسی)..."
                   value={artForm.descFa}
                   onChange={e => setArtForm({...artForm, descFa: e.target.value})}
                   className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white h-24 outline-none placeholder-neutral-600"
                 />
                 <button 
                   onClick={handleSmartAddArt}
                   disabled={isLoading || !artForm.titleFa}
                   className="w-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                 >
                   {isLoading ? <Loader2 className="animate-spin"/> : <BrainCircuit size={18}/>}
                   ثبت و ترجمه هوشمند (۸ زبان)
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* === BOOKS TAB === */}
        {activeTab === 'books' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
             <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">کتابخانه</h2>
              <div className="space-y-4">
                 {books.map(book => (
                   <div key={book.id} className="flex justify-between items-center bg-neutral-950 p-4 rounded border border-neutral-800">
                      <div className="flex gap-4">
                         <img src={book.coverUrl} className="w-12 h-16 object-cover bg-neutral-800" alt="cover"/>
                         <div>
                            <div className="font-bold">{book.title_fa || book.title}</div>
                            <div className="text-sm text-neutral-500">{book.subtitle_fa}</div>
                            <div className="text-xs text-amber-600 mt-1">${book.price} | {book.pages} صفحه</div>
                         </div>
                      </div>
                      <button onClick={() => removeBook(book.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={16}/></button>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-fit sticky top-4">
               <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-500">
                 <Plus size={18}/> افزودن کتاب جدید
               </h2>
               <div className="space-y-4">
                 <ImageUploadBox 
                    image={bookForm.coverUrl} 
                    onUpload={(e) => handleImageUpload(e, 'book')} 
                    onClear={() => clearImage('book')}
                    label="آپلود جلد کتاب"
                 />
                 <input 
                   placeholder="عنوان کتاب (فارسی)"
                   value={bookForm.titleFa}
                   onChange={e => setBookForm({...bookForm, titleFa: e.target.value})}
                   className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white outline-none"
                 />
                 <div className="flex gap-2">
                    <input 
                      placeholder="قیمت ($)"
                      type="number"
                      value={bookForm.price}
                      onChange={e => setBookForm({...bookForm, price: e.target.value})}
                      className="w-1/2 bg-neutral-950 border border-neutral-700 rounded p-3 text-white outline-none"
                    />
                    <input 
                      placeholder="تعداد صفحه"
                      type="number"
                      value={bookForm.pages}
                      onChange={e => setBookForm({...bookForm, pages: e.target.value})}
                      className="w-1/2 bg-neutral-950 border border-neutral-700 rounded p-3 text-white outline-none"
                    />
                 </div>
                 <textarea 
                   placeholder="توضیحات و معرفی کتاب (فارسی)..."
                   value={bookForm.descFa}
                   onChange={e => setBookForm({...bookForm, descFa: e.target.value})}
                   className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white h-24 outline-none"
                 />
                 <button 
                   onClick={handleSmartAddBook}
                   disabled={isLoading || !bookForm.titleFa}
                   className="w-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                 >
                   {isLoading ? <Loader2 className="animate-spin"/> : <BrainCircuit size={18}/>}
                   ترجمه و افزودن به کتابخانه
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* === JOURNAL TAB === */}
        {activeTab === 'journal' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
             <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">مقالات منتشر شده</h2>
              <div className="space-y-4">
                 {journal.map(post => (
                   <div key={post.id} className="bg-neutral-950 p-4 rounded border border-neutral-800">
                      <div className="flex justify-between items-start mb-2">
                         <div className="font-bold text-lg">{post.title_fa || post.title}</div>
                         <button onClick={() => removeJournal(post.id)} className="text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                      </div>
                      <p className="text-sm text-neutral-400 line-clamp-2">{post.excerpt_fa}</p>
                      <div className="flex gap-2 mt-3">
                        {post.tags.map(t => <span key={t} className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-500">{t}</span>)}
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 h-fit sticky top-4">
               <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-500">
                 <Plus size={18}/> انتشار مقاله جدید
               </h2>
               <div className="space-y-4">
                 <input 
                   placeholder="عنوان مقاله (فارسی)"
                   value={journalForm.titleFa}
                   onChange={e => setJournalForm({...journalForm, titleFa: e.target.value})}
                   className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white outline-none"
                 />
                 <input 
                   placeholder="تگ‌ها (با ویرگول جدا کنید)"
                   value={journalForm.tags}
                   onChange={e => setJournalForm({...journalForm, tags: e.target.value})}
                   className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white outline-none"
                 />
                 <textarea 
                   placeholder="متن کامل یا چکیده مقاله برای پردازش..."
                   value={journalForm.contextFa}
                   onChange={e => setJournalForm({...journalForm, contextFa: e.target.value})}
                   className="w-full bg-neutral-950 border border-neutral-700 rounded p-3 text-white h-40 outline-none"
                 />
                 <button 
                   onClick={handleSmartAddJournal}
                   disabled={isLoading || !journalForm.titleFa}
                   className="w-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                 >
                   {isLoading ? <Loader2 className="animate-spin"/> : <BrainCircuit size={18}/>}
                   تولید محتوا و ترجمه خودکار
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* === AI ADVISOR TAB === */}
        {activeTab === 'ai' && (
          <div className="max-w-3xl mx-auto h-[80vh] flex flex-col animate-fade-in relative">
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl flex-1 overflow-y-auto p-4 custom-scrollbar">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 mb-6 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-amber-900/30 text-amber-500' : 'bg-neutral-700 text-neutral-300'}`}>
                       {msg.role === 'ai' ? <BrainCircuit size={20}/> : <Bot size={20}/>}
                     </div>
                     <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === 'ai' 
                          ? 'bg-neutral-800 rounded-tr-xl' 
                          : 'bg-amber-900/20 border border-amber-900/30 text-white rounded-tl-xl'
                     }`}>
                        {msg.content}
                        <div className="text-[10px] text-neutral-500 mt-2 text-left opacity-50">
                          {new Date(msg.timestamp).toLocaleTimeString('fa-IR')}
                        </div>
                     </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 mb-6">
                     <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-500 flex-shrink-0 animate-pulse">
                       <BrainCircuit size={20}/>
                     </div>
                     <div className="bg-neutral-800 rounded-r-xl rounded-bl-xl p-4 flex items-center gap-2 text-sm">
                        <Loader2 size={16} className="animate-spin"/> در حال تحلیل استراتژیک...
                     </div>
                  </div>
                )}
                <div ref={chatEndRef} />
             </div>

             <div className="relative mt-4">
                <input 
                  value={strategyQuery}
                  onChange={e => setStrategyQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAskAdvisor()}
                  placeholder="سوال استراتژیک خود را از مشاور بپرسید..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-4 pr-4 pl-12 text-white outline-none focus:border-amber-500 shadow-lg"
                  autoFocus
                />
                <button 
                  onClick={handleAskAdvisor}
                  disabled={isLoading || !strategyQuery.trim()}
                  className="absolute left-2 top-2 p-2 bg-amber-600 rounded-lg text-white hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  <Send size={20}/>
                </button>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
