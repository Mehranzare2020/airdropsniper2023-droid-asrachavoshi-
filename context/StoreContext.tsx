
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Artwork, Book, AdminLog, CartItem, JournalPost, Language, Notification, ChatMessage, Theme } from '../types';
import { MOCK_ARTWORKS, MOCK_BOOKS, MOCK_JOURNAL, THEMES } from '../constants';
import { api } from '../services/api';

interface StoreContextType {
  artworks: Artwork[];
  books: Book[];
  journal: JournalPost[];
  logs: AdminLog[];
  language: Language;
  theme: Theme;
  cart: CartItem[];
  isCartOpen: boolean;
  notifications: Notification[];
  chatHistory: ChatMessage[];
  
  // Actions
  addArtwork: (art: Artwork) => void;
  removeArtwork: (id: string) => void;
  addBook: (book: Book) => void;
  removeBook: (id: string) => void;
  addJournal: (post: JournalPost) => void;
  removeJournal: (id: string) => void;
  
  addLog: (action: string) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  addToCart: (book: Book) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  cartTotal: number;
  
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  
  addChatMessage: (role: 'user' | 'ai', content: string) => void;
  clearChat: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with Mock data first, then overwrite with DB data
  const [artworks, setArtworks] = useState<Artwork[]>(MOCK_ARTWORKS);
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [journal, setJournal] = useState<JournalPost[]>(MOCK_JOURNAL);
  
  const [logs, setLogs] = useState<AdminLog[]>([
    { id: '1', action: 'System Initialized', timestamp: new Date().toISOString() }
  ]);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('noir');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'ai',
      content: 'سلام دکتر. من مشاور استراتژیک هوشمند شما هستم. می‌توانم با تحلیل داده‌های سایت، وضعیت بازار هنر و مباحث فلسفی، به شما در تدوین استراتژی‌های جدید کمک کنم. چه دستوری دارید؟',
      timestamp: new Date().toISOString()
    }
  ]);

  // --- Fetch Data from Backend ---
  useEffect(() => {
    const initData = async () => {
      const data = await api.syncData();
      if (data) {
        setArtworks(data.artworks);
        setBooks(data.books);
        setJournal(data.journal);
        console.log('Database Connected: Data synced successfully.');
      } else {
        console.log('Database Offline: Using Mock Data.');
      }
    };
    initData();
  }, []);

  // --- Theme Logic ---
  useEffect(() => {
    const root = document.documentElement;
    const selectedTheme = THEMES[theme];
    
    // Apply CSS Variables
    Object.entries(selectedTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
  }, [theme]);

  // --- Notification Logic ---
  const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- Artwork Logic ---
  const addArtwork = (art: Artwork) => {
    // 1. Optimistic UI update
    setArtworks([art, ...artworks]);
    // 2. API Call
    api.createArtwork(art).catch(err => {
      console.error(err);
      notify('Failed to save artwork to database', 'error');
    });
    addLog(`Added new artwork: ${art.title}`);
  };

  const removeArtwork = (id: string) => {
    const art = artworks.find(a => a.id === id);
    setArtworks(artworks.filter(a => a.id !== id));
    if (art) {
      api.deleteArtwork(id).catch(err => console.error(err));
      addLog(`Removed artwork: ${art.title}`);
    }
  };

  // --- Book Logic ---
  const addBook = (book: Book) => {
    setBooks([book, ...books]);
    api.createBook(book).catch(err => {
       console.error(err);
       notify('Failed to save book to database', 'error');
    });
    addLog(`Added new book: ${book.title}`);
  }

  const removeBook = (id: string) => {
    const item = books.find(b => b.id === id);
    setBooks(books.filter(b => b.id !== id));
    if (item) {
      api.deleteBook(id).catch(err => console.error(err));
      addLog(`Removed book: ${item.title}`);
    }
  }

  // --- Journal Logic ---
  const addJournal = (post: JournalPost) => {
    setJournal([post, ...journal]);
    api.createJournal(post).catch(err => {
       console.error(err);
       notify('Failed to save journal to database', 'error');
    });
    addLog(`Published journal post: ${post.title}`);
  }

  const removeJournal = (id: string) => {
    const item = journal.find(j => j.id === id);
    setJournal(journal.filter(j => j.id !== id));
    if (item) {
      api.deleteJournal(id).catch(err => console.error(err));
      addLog(`Removed journal post: ${item.title}`);
    }
  }

  // --- System Logic ---
  const addLog = (action: string) => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  const addToCart = (book: Book) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        notify(`${book.title} quantity updated`, 'success');
        return prev.map(item => item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      notify(`${book.title} added to cart`, 'success');
      return [...prev, { ...book, quantity: 1 }];
    });
    setIsCartOpen(true);
    addLog(`Added to cart: ${book.title}`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // --- Chat Logic ---
  const addChatMessage = (role: 'user' | 'ai', content: string) => {
    setChatHistory(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      role,
      content,
      timestamp: new Date().toISOString()
    }]);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <StoreContext.Provider value={{ 
      artworks, books, journal, logs, language, theme, cart, isCartOpen, notifications, chatHistory,
      setLanguage, setTheme,
      addArtwork, removeArtwork, 
      addBook, removeBook,
      addJournal, removeJournal,
      addLog,
      addToCart, removeFromCart, clearCart, toggleCart, cartTotal,
      notify, removeNotification,
      addChatMessage, clearChat
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
