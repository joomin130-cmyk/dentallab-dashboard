import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsUpDown } from 'lucide-react';

// label: 트리거 버튼에 표시할 텍스트
// options: [{ id, label, count?, dimmed? }]
// selected: 현재 선택된 id
// onSelect: (id) => void
// minWidth: 드롭다운 최소 너비 (tailwind class)
// align: 'left' | 'center' — 드롭다운 정렬 방향
const DropdownMenu = ({ label, options, selected, onSelect, minWidth = 'w-24', align = 'center' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const positionClass = align === 'center'
    ? 'left-1/2 -translate-x-1/2'
    : 'left-0';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(o => !o); }}
        className="flex items-center justify-between gap-1.5 px-3 py-1.5 bg-[#F2F4F6] hover:bg-[#E5E8EB] transition-colors rounded-[8px]"
      >
        <span className={`text-[13px] font-semibold tracking-tight ${selected ? 'text-[#3182F6]' : 'text-[#4E5968]'}`}>
          {label}
        </span>
        <ChevronsUpDown size={13} className="text-[#8B95A1]" strokeWidth={2.5} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full ${positionClass} mt-1 ${minWidth} bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-1.5 z-[100]`}
            onClick={(e) => e.stopPropagation()}
          >
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => { onSelect(opt.id); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2 text-[14px] font-semibold transition-colors hover:bg-[#F2F4F6] ${opt.dimmed
                  ? 'text-[#8B95A1]'
                  : selected === opt.id
                    ? 'text-[#3182F6]'
                    : 'text-[#4E5968]'
                  }`}
              >
                <span>{opt.label}</span>
                {opt.count != null && (
                  <span className={`text-[11px] font-bold leading-none ${selected === opt.id ? 'text-[#3182F6]' : 'text-[#B0B8C1]'}`}>
                    {opt.count}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
