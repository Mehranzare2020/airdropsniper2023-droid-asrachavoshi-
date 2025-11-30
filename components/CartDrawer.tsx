
import React, { useState } from 'react';
import { X, Trash2, CreditCard, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UI_TEXT, getLocalized } from '../constants';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, clearCart, cartTotal, language, notify } = useStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const isRTL = language === 'fa';

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate API call
    setTimeout(() => {
      setIsCheckingOut(false);
      clearCart();
      toggleCart();
      const successMsg = language === 'fa' 
        ? 'سفارش شما با موفقیت ثبت شد. از خرید شما سپاسگزاریم.' 
        : 'Order placed successfully! Thank you for your purchase.';
      notify(successMsg, 'success');
    }, 2500);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      ></div>

      {/* Drawer */}
      <div className={`relative w-full max-w-md bg-neutral-900 h-full shadow-2xl flex flex-col transform transition-transform duration-300 ${isRTL ? 'border-r' : 'border-l'} border-neutral-800`}>
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className={`text-xl font-serif text-white ${language === 'fa' ? 'font-vazir' : ''}`}>
            {UI_TEXT.cart_title[language]}
          </h2>
          <button onClick={toggleCart} className="text-neutral-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
              <span className={`text-lg ${language === 'fa' ? 'font-vazir' : ''}`}>
                {UI_TEXT.cart_empty[language]}
              </span>
              <button 
                onClick={toggleCart}
                className={`text-amber-500 hover:text-amber-400 text-sm uppercase tracking-widest ${language === 'fa' ? 'font-vazir' : ''}`}
              >
                 {language === 'fa' ? 'بازگشت به فروشگاه' : 'Return to Store'}
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const title = getLocalized(item, 'title', language);
              return (
                <div key={item.id} className="flex gap-4 bg-neutral-800/50 p-3 rounded-lg border border-neutral-800">
                  <img src={item.coverUrl} alt={title} className="w-16 h-24 object-cover rounded shadow" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className={`font-serif text-white text-sm ${language === 'fa' ? 'font-vazir' : ''}`}>
                        {title}
                      </h3>
                      <p className={`text-xs text-neutral-400 mt-1 ${language === 'fa' ? 'font-vazir' : ''}`}>
                        ${item.price} x {item.quantity}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="self-end text-neutral-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-neutral-950 border-t border-neutral-800">
            <div className="flex justify-between items-center mb-6 text-white text-lg font-serif">
              <span className={language === 'fa' ? 'font-vazir' : ''}>{language === 'fa' ? 'مجموع:' : 'Total:'}</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`w-full bg-amber-600 text-white py-4 font-bold uppercase tracking-wider hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${language === 'fa' ? 'font-vazir' : ''}`}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {language === 'fa' ? 'در حال پردازش...' : 'Processing...'}
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  {UI_TEXT.checkout[language]}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
