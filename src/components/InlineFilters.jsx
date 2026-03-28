import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsUpDown, RotateCcw } from 'lucide-react';
import DropdownMenu from './DropdownMenu';

const InlineFilters = ({ data, chipFilters, setChipFilters }) => {
  const TODAY        = '2026-03-28';
  const YESTERDAY    = '2026-03-27';
  const THREE_DAYS   = '2026-03-25'; // 3일 전(포함) ~ 오늘

  const [orderDateOpen, setOrderDateOpen] = useState(false);
  const [customDateInput, setCustomDateInput] = useState('');
  const orderDateRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (orderDateRef.current && !orderDateRef.current.contains(e.target)) setOrderDateOpen(false);
    };
    if (orderDateOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [orderDateOpen]);

  const counts = useMemo(() => {
    const unassigned      = data.filter(d => d.items.some(i => i.technician === '미배정')).length;
    const todayOrder      = data.filter(d => d.orderDate === TODAY).length;
    const yesterdayOrder  = data.filter(d => d.orderDate === YESTERDAY).length;
    const threeDaysOrder  = data.filter(d => d.orderDate >= THREE_DAYS).length;
    const todayDL         = data.filter(d => d.deadline === TODAY).length;
    const tomorrowDL      = data.filter(d => d.deadline === '2026-03-29').length;
    const weekDL          = data.filter(d => d.deadline >= '2026-03-28' && d.deadline <= '2026-04-03').length;
    const clinicCounts    = {};
    const typeCounts      = {};
    data.forEach(d => {
      clinicCounts[d.clinic] = (clinicCounts[d.clinic] || 0) + 1;
      d.items.forEach(i => { typeCounts[i.type] = (typeCounts[i.type] || 0) + 1; });
    });
    return { unassigned, todayOrder, yesterdayOrder, threeDaysOrder, todayDL, tomorrowDL, weekDL, clinicCounts, typeCounts };
  }, [data]);

  const clinics         = useMemo(() => [...new Set(data.map(d => d.clinic))].sort(), [data]);
  const prostheticsTypes = useMemo(() => {
    const s = new Set();
    data.forEach(d => d.items.forEach(i => s.add(i.type)));
    return [...s].sort();
  }, [data]);

  /* ---- 접수일 필터 label ---- */
  const orderDateLabel = () => {
    const v = chipFilters.orderDate;
    if (!v) return '요청된 의뢰서';
    if (v === 'today')     return "'오늘' 요청된 의뢰서";
    if (v === 'yesterday') return "'어제' 요청된 의뢰서";
    if (v === '3days')     return "'3일 전' 요청된 의뢰서";
    if (v === 'custom')    return '날짜 지정';
    // 실제 날짜 문자열
    const [, m, d] = v.split('-');
    return `'${parseInt(m)}월 ${parseInt(d)}일' 요청된 의뢰서`;
  };

  const orderDateOptions = [
    { id: 'today',     label: '오늘',    count: counts.todayOrder },
    { id: 'yesterday', label: '어제',    count: counts.yesterdayOrder },
    { id: '3days',     label: '3일 전',  count: counts.threeDaysOrder },
    { id: 'custom',    label: '날짜 지정' },
  ];

  const deadlineOptions = [
    { id: 'today',    label: '오늘',   count: counts.todayDL },
    { id: 'tomorrow', label: '내일',   count: counts.tomorrowDL },
    { id: 'week',     label: '이번주', count: counts.weekDL },
  ];

  const clinicOptions = [
    { id: '__all__', label: '전체 치과' },
    ...clinics.map(c => ({ id: c, label: c, count: counts.clinicCounts[c] || 0 })),
  ];

  const prostheticsOptions = [
    { id: '__all__', label: '전체 종류' },
    ...prostheticsTypes.map(t => ({ id: t, label: t, count: counts.typeCounts[t] || 0 })),
  ];

  const hasActive = chipFilters.orderDate || chipFilters.unassigned || chipFilters.deadline || chipFilters.clinic || chipFilters.prostheticsType;

  const chipBase = (active) =>
    `flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-[8px] transition-all cursor-pointer select-none ${
      active
        ? 'bg-[#EBF3FF] text-[#3182F6] hover:bg-[#dbeafe]'
        : 'bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]'
    }`;

  const isOrderDateActive = !!chipFilters.orderDate;

  return (
    <div className="flex items-center gap-2 flex-wrap">

      {/* ① 접수일 – 요청된 의뢰서 */}
      <div className="relative" ref={orderDateRef}>
        <button
          onClick={() => setOrderDateOpen(o => !o)}
          className={chipBase(isOrderDateActive)}
        >
          <span>{orderDateLabel()}</span>
          <ChevronsUpDown
            size={13}
            className={isOrderDateActive ? 'text-[#3182F6]' : 'text-[#8B95A1]'}
            strokeWidth={2.5}
          />
        </button>

        <AnimatePresence>
          {orderDateOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-1 min-w-[168px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-1.5 z-[100]"
              onClick={e => e.stopPropagation()}
            >
              {orderDateOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (opt.id === 'custom') {
                      setChipFilters(prev => ({ ...prev, orderDate: 'custom' }));
                      // 드롭다운 유지 → 날짜 입력 노출
                    } else {
                      setChipFilters(prev => ({ ...prev, orderDate: prev.orderDate === opt.id ? null : opt.id }));
                      setOrderDateOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-[13px] font-semibold transition-colors hover:bg-[#F2F4F6] ${
                    chipFilters.orderDate === opt.id ? 'text-[#3182F6]' : 'text-[#4E5968]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.count != null && (
                    <span className={`text-[11px] font-bold ${chipFilters.orderDate === opt.id ? 'text-[#3182F6]' : 'text-[#B0B8C1]'}`}>
                      {opt.count}
                    </span>
                  )}
                </button>
              ))}

              {/* 날짜 지정 선택 시 date input 노출 */}
              {chipFilters.orderDate === 'custom' && (
                <div className="px-3 pt-1 pb-2.5 border-t border-[#F2F4F6] mt-1">
                  <input
                    type="date"
                    value={customDateInput}
                    onChange={e => {
                      const val = e.target.value;
                      setCustomDateInput(val);
                      setChipFilters(prev => ({ ...prev, orderDate: val || 'custom' }));
                      if (val) setOrderDateOpen(false);
                    }}
                    className="w-full text-[12px] px-2.5 py-1.5 rounded-[8px] border border-[#E5E8EB] focus:outline-none focus:ring-2 focus:ring-[#3182F6]/20 text-[#4E5968]"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ② 미배정 */}
      <button
        onClick={() => setChipFilters(prev => ({ ...prev, unassigned: !prev.unassigned }))}
        className={chipBase(chipFilters.unassigned)}
      >
        미배정
        <span className={`text-[11px] font-bold leading-none ${chipFilters.unassigned ? 'text-[#3182F6]' : 'text-[#B0B8C1]'}`}>
          {counts.unassigned}
        </span>
      </button>

      {/* ③ 마감일 */}
      <DropdownMenu
        label={chipFilters.deadline ? (deadlineOptions.find(d => d.id === chipFilters.deadline)?.label ?? '마감일') : '마감일'}
        options={deadlineOptions}
        selected={chipFilters.deadline}
        onSelect={(id) => setChipFilters(prev => ({ ...prev, deadline: prev.deadline === id ? null : id }))}
        minWidth="min-w-[120px]"
        align="left"
      />

      {/* ④ 치과 */}
      <DropdownMenu
        label={chipFilters.clinic || '치과'}
        options={clinicOptions}
        selected={chipFilters.clinic}
        onSelect={(id) => setChipFilters(prev => ({ ...prev, clinic: id === '__all__' ? null : id }))}
        minWidth="min-w-[160px]"
        align="left"
      />

      {/* ⑤ 보철 종류 */}
      <DropdownMenu
        label={chipFilters.prostheticsType || '보철 종류'}
        options={prostheticsOptions}
        selected={chipFilters.prostheticsType}
        onSelect={(id) => setChipFilters(prev => ({ ...prev, prostheticsType: id === '__all__' ? null : id }))}
        minWidth="min-w-[140px]"
        align="left"
      />

      {/* 전체 해제 */}
      {hasActive && (
        <button
          onClick={() => {
            setChipFilters({ orderDate: null, unassigned: false, deadline: null, clinic: null, prostheticsType: null });
            setCustomDateInput('');
          }}
          className="flex items-center gap-1 text-[12px] font-semibold text-[#8B95A1] hover:text-[#F04452] transition-colors px-2"
        >
          <RotateCcw size={11} /> 전체 해제
        </button>
      )}
    </div>
  );
};

export default InlineFilters;
