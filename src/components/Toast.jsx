import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const Toast = ({ toast, onUndo, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-[#191F28] text-white px-5 py-3.5 rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
        >
          <CheckCircle2 size={16} className="text-[#0CC452] shrink-0" />
          <span className="text-[13px] font-semibold whitespace-nowrap">{toast.message}</span>
          <button
            onClick={onUndo}
            className="ml-2 text-[13px] font-bold text-[#3182F6] hover:text-[#5a9ef8] transition-colors whitespace-nowrap"
          >
            되돌리기
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
