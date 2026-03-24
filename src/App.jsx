import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  User,
  MoreVertical,
  Printer,
  Bell,
  List,
  LayoutGrid,
  Check,
  ChevronsUpDown,
  ArrowDown,
  ArrowUp,
  Edit2
} from 'lucide-react';

const INITIAL_DATA = [
  { id: '1', patient: '김철수', clinic: '서울바른치과', deadline: '2024-10-27', priority: 'high', items: [{ type: '크라운', material: 'Zirconia / SCRP / Non-Vital', teeth: ['11', '12'], status: '제작중', technician: '이기공' }, { type: '어버트먼트', material: 'Custom Abutment / Ti', teeth: ['11'], status: '접수', technician: '미배정' }] },
  { id: '2', patient: '이영희', clinic: '연세미소치과', deadline: '2024-10-27', priority: 'medium', items: [{ type: '크라운', material: 'PFM / Base Metal', teeth: ['36', '37'], status: '제작중', technician: '김기공' }] },
  { id: '3', patient: '박지민', clinic: '미래플란트치과', deadline: '2024-10-26', priority: 'urgent', items: [{ type: '인레이', material: 'E-max / Ceramic', teeth: ['44', '45'], status: '배송준비', technician: '최기공' }] },
  { id: '4', patient: '정민수', clinic: '하늘치과', deadline: '2024-10-28', priority: 'low', items: [{ type: '서지컬 가이드', material: 'Surgical Resin', teeth: ['21', '22', '23'], status: '제작중', technician: '미배정' }] },
  { id: '5', patient: '최윤서', clinic: '튼튼치과', deadline: '2024-10-27', priority: 'medium', items: [{ type: '덴처', material: 'Full Denture / Acrylic', teeth: ['Upper'], status: '검수완료', technician: '김기공' }, { type: '개인 트레이', material: 'Custom Tray Resin', teeth: ['Lower'], status: '제작중', technician: '미배정' }] },
  { id: '6', patient: '강하늘', clinic: '미소지음치과', deadline: '2024-10-27', priority: 'high', items: [{ type: '브릿지', material: 'Zirconia / Monolithic', teeth: ['14', '15', '16'], status: '제작중', technician: '이기공' }] },
];

const TECHNICIANS = ['김기공', '이기공', '최기공', '박기공', '미배정'];

const StatusBadge = ({ status }) => {
  const styles = {
    '접수': 'text-amber-600 bg-amber-50',
    '제작중': 'text-blue-600 bg-blue-50',
    '검수완료': 'text-purple-600 bg-purple-50',
    '배송준비': 'text-emerald-600 bg-emerald-50'
  };
  return (
    <span className={`px-2 py-1 rounded-[8px] text-[11px] font-semibold whitespace-nowrap ${styles[status] || 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  );
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}.${d.getDate()}`;
};

const getAggregatedStatus = (items) => {
  const statusPriority = { '접수': 0, '제작중': 1, '검수완료': 2, '배송준비': 3 };
  let minPriority = 4;
  let status = items[0].status;
  items.forEach(item => {
    if (statusPriority[item.status] < minPriority) {
      minPriority = statusPriority[item.status];
      status = item.status;
    }
  });
  return status;
};

const Checkbox = ({ checked, onChange }) => (
  <motion.div
    whileTap={{ scale: 0.85 }}
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${checked ? 'bg-[#3182F6]' : 'bg-[#E5E8EB] hover:bg-[#D1D6DB]'}`}
  >
    {checked && <Check size={14} className="text-white" strokeWidth={3} />}
  </motion.div>
);

const ManagementSummary = ({ data }) => {
  const today = '2024-10-27';
  const tomorrow = '2024-10-28';

  const stats = useMemo(() => ({
    todayDeadline: data.filter(d => d.deadline === today).length,
    tomorrowDeadline: data.filter(d => d.deadline === tomorrow).length,
    inProgress: data.filter(d => getAggregatedStatus(d.items) === '제작중').length,
    total: data.length
  }), [data]);

  const cards = [
    { label: '오늘 마감', value: stats.todayDeadline, color: 'text-[#F04452]', sub: '긴급 처리 필요' },
    { label: '내일 마감', value: stats.tomorrowDeadline, color: 'text-[#333D4B]', sub: '공정 준비 중' },
    { label: '현재 제작 중', value: stats.inProgress, color: 'text-[#3182F6]', sub: '기공사 가동 중' },
    { label: '전체 의뢰', value: stats.total, color: 'text-[#333D4B]', sub: '이번 주 누적' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="bg-white p-[18px] rounded-[16px] flex flex-col gap-1.5"
        >
          <p className="text-[12px] font-semibold leading-none text-[#8B95A1]">{card.label}</p>
          <div className="flex items-end gap-0.5">
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.05 + 0.1 }}
              className={`text-[24px] font-semibold leading-none tracking-tight ${card.color}`}
            >
              {card.value}
            </motion.span>
            <span className="text-[18px] font-bold leading-none text-[#333D4B] pb-[1px]">건</span>
          </div>
          <p className="text-[11px] font-semibold leading-none text-[#B0B8C1]">{card.sub}</p>
        </motion.div>
      ))}
    </div>
  );
};

// ==== Technician Select Button ====
const TechnicianSelect = ({ name, type = 'single', onAssign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (type === 'multi-assigned') {
    return <div className="h-[28px] flex items-center text-[11px] font-medium text-[#8B95A1] px-1">복수 작업자</div>;
  }

  const isUnassigned = name === '미배정' || type === 'multi-unassigned';

  const handleSelect = (tech, e) => {
    e.stopPropagation();
    onAssign(tech);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="flex items-center justify-between gap-1.5 px-2.5 py-1 bg-[#F2F4F6] hover:bg-[#E5E8EB] transition-colors rounded-[8px]"
      >
        <span className={`text-[11px] font-semibold tracking-tight ${isUnassigned ? 'text-[#8B95A1]' : 'text-[#3182F6]'}`}>
          {name}
        </span>
        <ChevronsUpDown size={12} className="text-[#8B95A1]" strokeWidth={2.5} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-24 bg-white border border-[#F2F4F6] rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-1.5 z-[100] cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {TECHNICIANS.map(tech => (
              <button
                key={tech}
                onClick={(e) => handleSelect(tech, e)}
                className={`w-full text-center px-2 py-1.5 text-[12px] font-semibold transition-colors hover:bg-[#F2F4F6] ${tech === '미배정' ? 'text-[#8B95A1]' : 'text-[#4E5968]'}`}
              >
                {tech}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 리스트 뷰
const OrderRow = ({ order, isSelected, onSelect, onAssign }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMultiItem = order.items.length > 1;
  const mainStatus = getAggregatedStatus(order.items);
  const unassignedCount = order.items.filter(i => i.technician === '미배정').length;

  return (
    <>
      <motion.tr
        layout
        className={`group transition-colors border-b border-[#F2F4F6] last:border-0 relative z-10 ${isSelected ? 'bg-blue-50/40' : 'hover:bg-[#F9FAFB]'} ${isExpanded ? 'bg-[#F9FAFB]' : ''}`}
        onClick={() => { if (isMultiItem) setIsExpanded(!isExpanded); }}
        style={{ cursor: isMultiItem ? 'pointer' : 'default' }}
      >
        <td className="py-4 pl-6 pr-3 w-14 align-center" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          <div className="mt-1 w-fit cursor-pointer">
            <Checkbox checked={isSelected} onChange={onSelect} />
          </div>
        </td>

        {/* === 좌측 그룹: 환자, 보철, 치식 === */}
        {/* 환자 및 치과 (2줄) */}
        <td className="py-4 align-top">
          <div className="flex flex-col gap-0.5 mt-0.5">
            <div className="flex items-center gap-1.5">
              <span className={`text-[13px] font-semibold tracking-tight transition-colors ${isSelected ? 'text-[#3182F6]' : 'text-[#333D4B]'}`}>{order.patient}</span>
              {isMultiItem && <span className="text-[10px] font-semibold bg-blue-50 text-[#3182F6] px-1.5 py-0.5 rounded-[6px]">복합</span>}
            </div>
            <span className="text-[12px] text-[#8B95A1] font-medium">{order.clinic}</span>
          </div>
        </td>

        {/* 보철 정보 (Material, 2줄) */}
        <td className="py-4 align-top">
          <div className="flex flex-col gap-0.5 mt-0.5">
            {isMultiItem ? (
              <>
                <span className="text-[13px] font-semibold text-[#333D4B]">{order.items[0].type} 외 {order.items.length - 1}건</span>
                <span className="text-[12px] font-medium text-[#8B95A1]">복합 의뢰</span>
              </>
            ) : (
              <>
                <span className="text-[13px] font-semibold text-[#333D4B]">{order.items[0].material}</span>
                <span className="text-[12px] font-medium text-[#8B95A1]">{order.items[0].type}</span>
              </>
            )}
          </div>
        </td>

        {/* 치식 (Teeth) */}
        <td className="py-4 align-top">
          <div className="mt-1 min-h-[24px] flex items-center">
            {isMultiItem ? (
              <span className="text-[12px] font-medium text-[#B0B8C1]">하단 상세 참조</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {order.items[0].teeth.map(t => (
                  <span key={t} className="text-[10px] font-semibold text-[#3182F6] bg-blue-50 px-1.5 py-0.5 rounded-[4px]">{t}</span>
                ))}
              </div>
            )}
          </div>
        </td>

        {/* === 우측 그룹: 상태, 작업자, 마감일, 관리 === */}
        {/* 진행 상태 (Status) */}
        <td className="py-4 align-top">
          <div className="mt-1 flex justify-center">
            <StatusBadge status={mainStatus} />
          </div>
        </td>

        {/* 작업자 (Technician) */}
        <td className="py-4 align-top">
          <div className="mt-1 flex justify-center">
            {isMultiItem ? (
              unassignedCount > 0 ? (
                <TechnicianSelect name={`${unassignedCount}건 미배정`} type="multi-unassigned" onAssign={(tch) => onAssign(order.id, 'all', tch)} />
              ) : (
                <TechnicianSelect name="" type="multi-assigned" />
              )
            ) : (
              <TechnicianSelect name={order.items[0].technician} onAssign={(tch) => onAssign(order.id, 0, tch)} />
            )}
          </div>
        </td>

        {/* 마감일 (Deadline) */}
        <td className="py-4 align-top">
          <div className={`mt-1 flex justify-center items-center gap-1.5 text-[13px] font-semibold ${order.priority === 'urgent' || order.priority === 'high' ? 'text-[#F04452]' : 'text-[#8B95A1]'}`}>
            <span>{formatDate(order.deadline)}</span>
          </div>
        </td>

        {/* 관리 (Quick Actions) */}
        <td className="py-4 align-top">
          <div className="mt-0.5 flex items-center justify-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 text-[#8B95A1] hover:text-[#3182F6] hover:bg-blue-50 rounded-[10px] transition-all">
              <Printer size={14} />
            </button>
            {isMultiItem ? (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-1.5 text-[#D1D6DB] hover:text-[#4E5968] bg-transparent rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#E5E8EB]"
              >
                <ChevronDown size={14} />
              </motion.div>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 text-[#D1D6DB] hover:text-[#4E5968] rounded-[10px] transition-all hover:bg-[#E5E8EB]">
                <MoreVertical size={14} />
              </button>
            )}
          </div>
        </td>
      </motion.tr>

      {/* Accordion Content for Multi-item */}
      <AnimatePresence initial={false}>
        {isExpanded && isMultiItem && (
          <tr className="bg-[#F9FAFB] border-b border-[#F2F4F6] relative z-0">
            <td colSpan="8" className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: 'visible' } }}
                exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="pl-14 py-4 pr-0 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center py-2.5">

                      {/* 환자명 빈 공간 (부모 컬럼폭 180px와 일치하게 스킵) */}
                      <div className="w-[180px]"></div>

                      {/* 보철 정보 (헤더 w-240px와 정확히 일치) */}
                      <div className="w-[240px]">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] font-medium text-[#333D4B]">{item.material}</span>
                          <span className="text-[11px] font-medium text-[#8B95A1]">{item.type}</span>
                        </div>
                      </div>

                      {/* 치식 (나머지 영역 모두 차지) */}
                      <div className="flex-1 flex items-center pr-4">
                        <div className="flex flex-wrap gap-1">
                          {item.teeth.map(t => <span key={t} className="text-[10px] font-semibold text-[#3182F6] bg-blue-50/70 px-1.5 py-0.5 rounded-[8px]">{t}</span>)}
                        </div>
                      </div>

                      {/* 우측 진행 관리 영역 (상위 헤더 130px * 4 정확히 일치) */}
                      <div className="flex items-center">
                        {/* 진행 상태 */}
                        <div className="w-[130px] flex justify-center">
                          <StatusBadge status={item.status} />
                        </div>

                        {/* 작업자 */}
                        <div className="w-[130px] flex justify-center relative z-20">
                          <TechnicianSelect name={item.technician} onAssign={(tch) => onAssign(order.id, idx, tch)} />
                        </div>

                        {/* 마감일 공백 */}
                        <div className="w-[130px]"></div>

                        {/* 관리 */}
                        <div className="w-[130px] flex justify-center gap-1">
                          <button className="p-1.5 text-[#D1D6DB] hover:text-[#4E5968] rounded-[8px] transition-all hover:bg-[#F2F4F6]">
                            <Edit2 size={13} />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

// 카드 뷰
const OrderCard = ({ order, isSelected, onSelect, onAssign }) => {
  const mainStatus = getAggregatedStatus(order.items);
  const isMultiItem = order.items.length > 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`p-5 rounded-[16px] flex flex-col justify-between transition-colors group relative border border-transparent ${isSelected ? 'bg-blue-50/60 border-blue-200' : 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]'}`}
    >
      <div className="absolute top-5 left-5">
        <Checkbox checked={isSelected} onChange={onSelect} />
      </div>
      <div className="pl-8">
        <div className="flex justify-between items-start mb-3">
          <StatusBadge status={mainStatus} />
          <div className="flex gap-1">
            <button onClick={(e) => e.stopPropagation()} className="p-1 text-[#B0B8C1] hover:text-[#3182F6] transition-colors"><Printer size={14} /></button>
            <button onClick={(e) => e.stopPropagation()} className="p-1 text-[#D1D6DB] hover:text-[#4E5968] transition-colors"><MoreVertical size={14} /></button>
          </div>
        </div>

        <div className="flex flex-col gap-0.5 mb-4">
          <div className="flex items-center gap-2">
            <h4 className={`text-[15px] font-bold tracking-tight transition-colors ${isSelected ? 'text-[#3182F6]' : 'text-[#333D4B]'}`}>{order.patient}</h4>
            {isMultiItem && <span className="text-[10px] bg-blue-50 text-[#3182F6] px-1.5 py-0.5 rounded-[6px] font-semibold">복합</span>}
          </div>
          <p className="text-[12px] text-[#8B95A1] font-medium">{order.clinic}</p>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex flex-col bg-[#F9FAFB] p-3 rounded-[10px] gap-2.5">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-medium text-[#333D4B]">{item.material}</span>
                  <span className="text-[11px] font-medium text-[#8B95A1]">{item.type}</span>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="flex justify-between items-center bg-white p-2 rounded-[12px] border border-[#F2F4F6]">
                <div className="flex flex-wrap gap-1">
                  {item.teeth.map(t => <span key={t} className="text-[10px] font-semibold text-[#3182F6] bg-blue-50 px-1.5 py-0.5 rounded-[6px]">{t}</span>)}
                </div>
                <div className="relative z-10">
                  <TechnicianSelect name={item.technician} onAssign={(tch) => onAssign(order.id, idx, tch)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#F2F4F6] flex justify-between items-center pl-8">
        <span className="text-[12px] font-medium text-[#8B95A1]">마감일</span>
        <div className={`text-[12px] font-bold tracking-tight ${order.priority === 'urgent' || order.priority === 'high' ? 'text-[#F04452]' : 'text-[#4E5968]'}`}>
          <span>{formatDate(order.deadline)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [viewMode, setViewMode] = useState('list');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('전체');
  const [sortConfig, setSortConfig] = useState(null);

  const filteredData = useMemo(() => {
    let result = [...data].filter(order => {
      if (activeTab === '전체') return true;
      const mainStatus = getAggregatedStatus(order.items);
      if (activeTab === '요청됨') return mainStatus === '접수';
      if (activeTab === '제작중') return mainStatus === '제작중';
      if (activeTab === '배송준비') return mainStatus === '배송준비';
      return true;
    });

    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (sortConfig.key === 'deadline') {
          const dateA = new Date(a.deadline);
          const dateB = new Date(b.deadline);
          if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }
        return 0;
      });
    }

    return result;
  }, [data, activeTab, sortConfig]);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(item => item.id)));
    }
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      setSortConfig(null);
      return;
    }
    setSortConfig({ key, direction });
  };

  const handleAssign = (orderId, itemIdx, technicianName) => {
    setData(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      if (itemIdx === 'all') {
        return {
          ...order,
          items: order.items.map(i => ({ ...i, technician: technicianName }))
        };
      } else {
        return {
          ...order,
          items: order.items.map((i, idx) => idx === itemIdx ? { ...i, technician: technicianName } : i)
        };
      }
    }));
  };

  const isAllSelected = selectedIds.size === filteredData.length && filteredData.length > 0;

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#333D4B] antialiased flex flex-col pt-0 pb-12">
      <header className="h-16 bg-white flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#3182F6] rounded-[10px] flex items-center justify-center text-white font-bold text-[12px]">D</div>
            <h1 className="text-[15px] font-semibold tracking-tight text-[#191F28]">Dental Lab</h1>
          </div>
          <nav className="flex gap-7">
            {['관제 보드', '의뢰 목록', '정산 관리', '알림'].map((label, i) => (
              <button key={i} className={`text-[13px] font-medium transition-colors relative ${i === 0 ? 'text-[#3182F6]' : 'text-[#8B95A1] hover:text-[#4E5968]'}`}>
                {label}
                {i === 0 && <motion.div layoutId="nav-indicator" className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#3182F6] rounded-full" />}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <button className="p-2 text-[#8B95A1] hover:text-[#4E5968] bg-transparent rounded-full transition-colors hover:bg-[#F2F4F6]"><Bell size={18} /></button>
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-8 h-8 bg-[#F2F4F6] rounded-full flex items-center justify-center text-[#B0B8C1] group-hover:bg-[#E5E8EB] transition-colors"><User size={15} /></div>
            <span className="text-[13px] font-medium text-[#4E5968]">최고 관리자</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1300px] w-full mx-auto p-8 flex-1">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-[#191F28] mb-1 tracking-tight">작업 현황 및 스케줄</h2>
            <p className="text-[#8B95A1] text-[12px] font-medium">관리자의 빠른 판단과 실행을 돕는 통합 워크스페이스입니다.</p>
          </div>
          <div className="flex gap-2.5">
            <div className="flex bg-white p-1 rounded-[14px] items-center relative">
              <motion.div
                layout
                className="absolute bg-[#F2F4F6] rounded-xl z-0"
                style={{
                  width: 'calc(50% - 4px)',
                  height: 'calc(100% - 8px)',
                  left: viewMode === 'list' ? 4 : 'calc(50%)',
                  top: 4
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-colors relative z-10 ${viewMode === 'list' ? 'text-[#3182F6]' : 'text-[#B0B8C1] hover:text-[#8B95A1]'}`}>
                <List size={16} />
              </button>
              <button onClick={() => setViewMode('card')} className={`p-2 rounded-xl transition-colors relative z-10 ${viewMode === 'card' ? 'text-[#3182F6]' : 'text-[#B0B8C1] hover:text-[#8B95A1]'}`}>
                <LayoutGrid size={16} />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D1D6DB]" size={13} />
              <input
                type="text"
                placeholder="환자 또는 치과 검색"
                className="pl-9 pr-4 py-3 bg-white rounded-[12px] text-[12px] w-48 focus:outline-none transition-all placeholder:text-[#D1D6DB] focus:ring-2 focus:ring-[#3182F6]/20"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#3281FA] text-white px-4 py-2 rounded-[12px] text-[13px] font-semibold"
            >
              새 의뢰 등록
            </motion.button>
          </div>
        </div>

        <ManagementSummary data={data} />

        <motion.section
          layout
          className={`rounded-[16px] transition-colors ${viewMode === 'list' ? 'bg-white overflow-hidden/removed' : 'bg-transparent'}`}
        >
          <div className={`px-6 py-4 flex flex-col gap-3 ${viewMode === 'list' ? 'bg-white rounded-t-[16px]' : 'mb-4 px-0'}`}>
            <div className="flex justify-between items-center w-full">
              <div className="flex bg-[#F2F4F6] p-1 rounded-[12px] relative">
                {['전체', '요청됨', '제작중', '배송준비'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`relative px-5 py-1.5 text-[13px] font-semibold rounded-[8px] transition-colors z-10 ${activeTab === t ? 'text-[#3182F6]' : 'text-[#8B95A1] hover:text-[#4E5968]'}`}
                  >
                    {activeTab === t && (
                      <motion.div
                        layoutId="activeTabBadge"
                        className="absolute inset-0 bg-white rounded-[8px]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button className={`flex items-center gap-1.5 text-[12px] font-semibold text-[#8B95A1] hover:text-[#4E5968] px-3 py-1.5 rounded-xl transition-all ${viewMode === 'card' ? 'bg-white' : 'hover:bg-[#F2F4F6]'}`}>
                  <Filter size={13} /> 필터
                </button>
              </div>
            </div>

            <AnimatePresence>
              {selectedIds.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 bg-[#3182F6] text-white px-3 py-2 rounded-[10px] text-[13px] font-semibold transition-all"
                    >
                      <User size={14} />
                      <span>전체 {selectedIds.size}건 배정하기</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 bg-[#F2F4F6] text-[#4E5968] px-3 py-2 rounded-[10px] text-[13px] font-semibold hover:bg-[#E5E8EB] transition-colors"
                    >
                      <Printer size={14} />
                      <span>전체 {selectedIds.size}건 출력</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-b-[16px] pb-4"
              >
                <table className="w-full text-left table-fixed">
                  <thead>
                    <tr className="text-[12px] font-medium text-[#8B95A1] bg-[#F9FAFB]">
                      <th className="py-3 pl-6 pr-3 w-14 border-b border-[#F2F4F6]">
                        <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
                      </th>
                      <th className="py-3 border-b border-[#F2F4F6] w-[180px]">환자 및 치과</th>
                      <th className="py-3 border-b border-[#F2F4F6] w-[240px]">보철 정보</th>
                      <th className="py-3 border-b border-[#F2F4F6]">치식</th>

                      {/* 우측 그룹 */}
                      <th className="py-3 text-center border-b border-[#F2F4F6] w-[130px]">진행 상태</th>
                      <th className="py-3 text-center border-b border-[#F2F4F6] w-[130px]">작업자</th>
                      <th className="py-3 border-b border-[#F2F4F6] w-[130px]">
                        <button
                          onClick={() => handleSort('deadline')}
                          className={`mx-auto flex items-center justify-center gap-1 hover:text-[#4E5968] transition-colors focus:outline-none w-full ${sortConfig?.key === 'deadline' ? 'text-[#3182F6]' : ''}`}
                        >
                          마감일
                          {sortConfig?.key === 'deadline' ? (
                            sortConfig.direction === 'asc' ? <ArrowUp size={13} strokeWidth={2.5} /> : <ArrowDown size={13} strokeWidth={2.5} />
                          ) : (
                            <ChevronsUpDown size={13} className="text-[#D1D6DB]" />
                          )}
                        </button>
                      </th>
                      <th className="py-3 text-center whitespace-nowrap border-b border-[#F2F4F6] w-[130px]">관리</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    <AnimatePresence>
                      {filteredData.map(order => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          isSelected={selectedIds.has(order.id)}
                          onSelect={() => handleSelectItem(order.id)}
                          onAssign={handleAssign}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-0"
              >
                <AnimatePresence>
                  {filteredData.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isSelected={selectedIds.has(order.id)}
                      onSelect={() => handleSelectItem(order.id)}
                      onAssign={handleAssign}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>
    </div>
  );
}
