import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Clock,
  User,
  AlertCircle,
  MoreVertical,
  Printer,
  Edit2,
  CheckCircle2,
  Layers,
  BarChart3,
  TrendingUp,
  Activity,
  ChevronUp,
  Bell,
  Home,
  ShoppingBag,
  CreditCard,
  Settings,
  LayoutGrid,
  List,
  Check,
  ChevronsUpDown,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

const INITIAL_DATA = [
  { id: '1', clinic: '서울바른치과', patient: '김철수', deadline: '2024-10-27', priority: 'high', items: [{ type: '크라운', material: '지르코니아', teeth: ['11', '12'], status: '제작중', technician: '이기공' }, { type: '어버트먼트', material: '커스텀', teeth: ['11'], status: '접수', technician: '미배정' }] },
  { id: '2', clinic: '연세미소치과', patient: '이영희', deadline: '2024-10-27', priority: 'medium', items: [{ type: '크라운', material: 'PFM', teeth: ['36', '37'], status: '제작중', technician: '김기공' }] },
  { id: '3', clinic: '미래플란트치과', patient: '박지민', deadline: '2024-10-26', priority: 'urgent', items: [{ type: '인레이', material: '세라믹', teeth: ['44'], status: '배송준비', technician: '최기공' }, { type: '인레이', material: '세라믹', teeth: ['45'], status: '배송준비', technician: '최기공' }] },
  { id: '4', clinic: '하늘치과', patient: '정민수', deadline: '2024-10-28', priority: 'low', items: [{ type: '가이드', material: '서지컬', teeth: ['21', '22', '23'], status: '제작중', technician: '박기공' }] },
  { id: '5', clinic: '튼튼치과', patient: '최윤서', deadline: '2024-10-27', priority: 'medium', items: [{ type: '덴처', material: '풀 덴처', teeth: ['Upper'], status: '검수완료', technician: '김기공' }, { type: '덴처', material: '풀 덴처', teeth: ['Lower'], status: '제작중', technician: '이기공' }] },
  { id: '6', clinic: '미소지음치과', patient: '강하늘', deadline: '2024-10-27', priority: 'high', items: [{ type: '브릿지', material: '지르코니아', teeth: ['14', '15', '16'], status: '제작중', technician: '이기공' }] },
  { id: '7', clinic: '화이트치과', patient: '조세호', deadline: '2024-10-29', priority: 'low', items: [{ type: '어버트먼트', material: '커스텀', teeth: ['46'], status: '접수', technician: '미배정' }, { type: '크라운', material: '지르코니아', teeth: ['46'], status: '접수', technician: '미배정' }] },
  { id: '8', clinic: '디지털치과', patient: '유재석', deadline: '2024-10-26', priority: 'medium', items: [{ type: '크라운', material: '임시치아', teeth: ['11'], status: '배송준비', technician: '최기공' }] },
];

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

// 관리자용 퀵 써머리 패널
const ManagementSummary = ({ data }) => {
  const today = '2024-10-27'; // 기준일 Mock
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

// 카드 뷰
const OrderCard = ({ order, isSelected, onSelect }) => {
  const allTeeth = Array.from(new Set(order.items.flatMap(item => item.teeth)));
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
      className={`p-5 rounded-[16px] flex flex-col justify-between transition-colors group relative ${isSelected ? 'bg-blue-50/60' : 'bg-white'}`}
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

        <div className="flex items-center gap-2 mb-1">
          <h4 className={`text-[15px] font-semibold tracking-tight transition-colors ${isSelected ? 'text-[#3182F6]' : 'text-[#333D4B]'}`}>{order.patient}</h4>
          {isMultiItem && <span className="text-[10px] bg-[#F2F4F6] text-[#8B95A1] px-1.5 py-0.5 rounded-full font-semibold">복합</span>}
        </div>
        <p className="text-[12px] text-[#8B95A1] font-medium mb-3">{order.clinic}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {allTeeth.map(t => (
            <span key={t} className="text-[10px] font-semibold text-[#3182F6] bg-blue-50 px-1.5 py-0.5 rounded-[8px]">{t}</span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#F2F4F6] flex justify-between items-center pl-8">
        <span className="text-[12px] font-semibold text-[#4E5968]">
          {order.items[0].type}, {order.items[0].material} {isMultiItem && <span className="text-[#B0B8C1] font-normal ml-0.5">외 {order.items.length - 1}</span>}
        </span>
        <div className="text-[11px] font-semibold text-[#8B95A1]">
          <span>{formatDate(order.deadline)}</span>
        </div>
      </div>
    </motion.div>
  );
};

// 리스트 뷰
const OrderRow = ({ order, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const allTeeth = Array.from(new Set(order.items.flatMap(item => item.teeth)));
  const mainStatus = getAggregatedStatus(order.items);
  const isMultiItem = order.items.length > 1;

  return (
    <>
      <motion.tr
        layout
        className={`group transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/40' : 'hover:bg-[#F9FAFB]'} ${isExpanded ? 'bg-[#F9FAFB]' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="py-3.5 pl-6 pr-3 w-14">
          <Checkbox checked={isSelected} onChange={onSelect} />
        </td>
        <td className="py-3.5">
          <div className="flex items-center gap-2">
            <span className={`text-[13px] font-semibold transition-colors ${isSelected ? 'text-[#3182F6]' : 'text-[#333D4B]'}`}>{order.patient}</span>
            {isMultiItem && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>}
          </div>
        </td>
        <td className="py-3.5 text-[12px] text-[#4E5968] font-medium">{order.clinic}</td>
        <td className="py-3.5">
          <div className="flex flex-wrap gap-1">
            {allTeeth.map(t => (
              <span key={t} className="text-[10px] font-semibold text-[#3182F6] bg-blue-50 px-1.5 py-0.5 rounded-[8px]">{t}</span>
            ))}
          </div>
        </td>
        <td className="py-3.5 text-[12px] text-[#4E5968] font-semibold">
          {order.items[0].type}, {order.items[0].material} {isMultiItem && <span className="text-[#B0B8C1] font-normal ml-1">외 {order.items.length - 1}</span>}
        </td>
        <td className="py-3.5 text-center">
          <StatusBadge status={mainStatus} />
        </td>
        <td className="py-3.5">
          <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${order.priority === 'urgent' || order.priority === 'high' ? 'text-[#F04452]' : 'text-[#8B95A1]'}`}>
            <span>{formatDate(order.deadline)}</span>
          </div>
        </td>
        <td className="py-3.5 pr-6 text-right w-24">
          <div className="flex items-center justify-end gap-1">
            <button onClick={(e) => e.stopPropagation()} className="p-1.5 text-[#8B95A1] hover:text-[#3182F6] hover:bg-blue-50 rounded-[10px] transition-all">
              <Printer size={14} />
            </button>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="p-1.5 text-[#D1D6DB] hover:text-[#4E5968] transition-colors rounded-[10px] flex items-center justify-center"
            >
              <ChevronDown size={14} />
            </motion.div>
          </div>
        </td>
      </motion.tr>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <tr className="bg-[#F9FAFB]">
            <td colSpan="8" className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="px-8 py-4">
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-[12px] font-semibold text-[#8B95A1]">개별 항목 현황</h4>
                    </div>
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-[10px]">
                          <div className="flex items-center gap-5">
                            <div className="flex items-baseline gap-1.5 min-w-[120px]">
                              <span className="text-[13px] font-semibold text-[#333D4B]">{item.type}</span>
                              <span className="text-[12px] font-medium text-[#8B95A1]">{item.material}</span>
                            </div>
                            <div className="flex gap-1">
                              {item.teeth.map(t => <span key={t} className="text-[10px] font-semibold text-[#3182F6] bg-blue-50 px-1.5 py-0.5 rounded-[8px]">{t}</span>)}
                            </div>
                          </div>
                          <div className="flex items-center gap-5">
                            <div className="flex items-center gap-2 text-[12px] text-[#6B7684]">
                              <User size={12} className="text-[#D1D6DB]" />
                              <span>{item.technician}</span>
                            </div>
                            <StatusBadge status={item.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  const [viewMode, setViewMode] = useState('list');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('전체');
  const [sortConfig, setSortConfig] = useState(null); // { key: 'deadline', direction: 'asc' | 'desc' }

  const filteredData = useMemo(() => {
    let result = [...INITIAL_DATA].filter(order => {
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
  }, [activeTab, sortConfig]);

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

  const isAllSelected = selectedIds.size === filteredData.length && filteredData.length > 0;

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#333D4B] antialiased flex flex-col pt-0">
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
            <h2 className="text-[20px] font-semibold text-[#191F28] mb-1 tracking-tight">작업 현황 및 스케줄</h2>
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

        <ManagementSummary data={INITIAL_DATA} />

        <motion.section
          layout
          className={`rounded-[16px] transition-colors ${viewMode === 'list' ? 'bg-white overflow-hidden' : 'bg-transparent'}`}
        >
          <div className={`px-6 py-4 flex flex-col gap-3 ${viewMode === 'list' ? 'bg-white' : 'mb-4 px-0'}`}>
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
              <motion.table
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full text-left"
              >
                <thead>
                  <tr className="text-[12px] font-medium text-[#8B95A1] bg-[#F9FAFB]">
                    <th className="py-3 pl-6 pr-3 w-14">
                      <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
                    </th>
                    <th className="py-3">환자명</th>
                    <th className="py-3">치과명</th>
                    <th className="py-3">치식</th>
                    <th className="py-3">보철 정보</th>
                    <th className="py-3 text-center">진행 상태</th>
                    <th className="py-3">
                      <button
                        onClick={() => handleSort('deadline')}
                        className={`flex items-center gap-1 hover:text-[#4E5968] transition-colors focus:outline-none ${sortConfig?.key === 'deadline' ? 'text-[#3182F6]' : ''}`}
                      >
                        마감일
                        {sortConfig?.key === 'deadline' ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={13} strokeWidth={2.5} /> : <ArrowDown size={13} strokeWidth={2.5} />
                        ) : (
                          <ChevronsUpDown size={13} className="text-[#D1D6DB]" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 text-right pr-6 whitespace-nowrap">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F6]">
                  <AnimatePresence>
                    {filteredData.map(order => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        isSelected={selectedIds.has(order.id)}
                        onSelect={() => handleSelectItem(order.id)}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </motion.table>
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
