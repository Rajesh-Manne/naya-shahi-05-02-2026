import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppSupport: React.FC = () => {
  return (
    <div className="fixed bottom-24 right-6 z-[60] animate-in slide-in-from-bottom-4 duration-500">
      <a 
        href="https://wa.me/8217617245" 
        target="_blank" 
        rel="noreferrer"
        className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group relative"
        aria-label="Need help? Chat on WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
          Need help? Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};
