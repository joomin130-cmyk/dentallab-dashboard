import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsUpDown } from 'lucide-react';

const STATUSES = ['요청됨', '작업중', '발송됨', '수거완료'];

const STATUS_COLORS = {
  '요청됨':  { text: 'text-amber-600',   dot: 'bg-amber-400'   },
  '작업중':  { text: 'text-[#3182F6]',   dot: 'bg-[#3182F6]'   },
  '발송됨':  { text: 'text-purple-600',  dot: 'bg-purple-400'  },
  '수거완료': { text: 'text-emerald-600', dot: 'bg-emerald-400' },
};

const StatusSelect = ({ status, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const color = STATUS_COLORS[status] || { text: 'text-slate-500', dot: 'bg-slate-400' };

  return (
    <div className="relative" ref={ref}>
      {/* 트리거 */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(o => !o); }}
        className="flex items-center gap-1.5 bg-[#F2F4F6] hover:bg-[#E5E8EB] px-2.5 py-[5px] rounded-[8px] transition-colors"
      >
        <span className={`text-[12px] font-semibold ${color.text}`}>{status}</span>
        <ChevronsUpDown size={12} className="text-[#B0B8C1]" strokeWidth={2.5} />
      </button>

      {/* 드롭다운 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.13 }}
            className="absolute top-full left-0 mt-1 min-w-[112px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-1.5 z-[200]"
            onClick={(e) => e.stopPropagation()}
          >
            {STATUSES.map((s) => {
              const c = STATUS_COLORS[s];
              const isSelected = s === status;
              return (
                <button
                  key={s}
                  onClick={() => { onStatusChange(s); setIsOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-semibold transition-colors hover:bg-[#F2F4F6]
                    ${isSelected ? c.text : 'text-[#4E5968]'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                  {s}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusSelect;
