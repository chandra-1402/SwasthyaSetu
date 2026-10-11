import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          let bg = 'bg-slate-900 text-white border-slate-700';
          let icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;

          if (toast.type === 'success') {
            bg = 'bg-emerald-950/95 text-emerald-50 border-emerald-700/80 shadow-emerald-950/50';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          } else if (toast.type === 'warning') {
            bg = 'bg-amber-950/95 text-amber-50 border-amber-600/80 shadow-amber-950/50';
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          } else if (toast.type === 'danger') {
            bg = 'bg-rose-950/95 text-rose-50 border-rose-600/80 shadow-rose-950/50';
            icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md ${bg}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 text-sm">
                <div className="font-semibold text-white tracking-wide">{toast.title}</div>
                <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors -mr-1 -mt-1"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
