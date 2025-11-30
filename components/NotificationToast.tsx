
import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification, language } = useStore();
  const isRTL = language === 'fa' || language === 'ar';

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed bottom-4 z-[100] flex flex-col gap-2 pointer-events-none ${isRTL ? 'left-4 items-start' : 'right-4 items-end'}`}>
      {notifications.map((note) => (
        <div 
          key={note.id}
          className={`pointer-events-auto min-w-[300px] max-w-sm rounded-lg shadow-2xl p-4 flex items-start gap-3 transform transition-all duration-300 animate-fade-in-up border-l-4 ${
            note.type === 'success' ? 'bg-neutral-900 border-green-500 text-white' :
            note.type === 'error' ? 'bg-neutral-900 border-red-500 text-white' :
            'bg-neutral-900 border-blue-500 text-white'
          }`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="flex-shrink-0 mt-0.5">
            {note.type === 'success' && <CheckCircle size={18} className="text-green-500" />}
            {note.type === 'error' && <AlertTriangle size={18} className="text-red-500" />}
            {note.type === 'info' && <Info size={18} className="text-blue-500" />}
          </div>
          
          <div className="flex-1">
             <p className={`text-sm font-medium ${language === 'fa' ? 'font-vazir' : ''}`}>
               {note.message}
             </p>
          </div>

          <button 
            onClick={() => removeNotification(note.id)}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
