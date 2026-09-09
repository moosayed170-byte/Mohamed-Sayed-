import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  type?: 'success' | 'warning' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5 shadow-2xl shadow-emerald-500/10">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
};
