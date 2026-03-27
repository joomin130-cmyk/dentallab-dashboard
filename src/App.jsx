import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, User, Printer, Menu,
  ArrowDown, ArrowUp, ChevronsUpDown,
  CalendarDays, Building2, BarChart2, Settings,
} from 'lucide-react';

import { INITIAL_DATA, TECHNICIANS } from './constants/data';
import { getAggregatedStatus } from './utils/helpers';
import Checkbox from './components/Checkbox';
import ListTabCards from './components/ListTabCards';
import InlineFilters from './components/InlineFilters';
import OrderRow from './components/OrderRow';
import OrderCard from './components/OrderCard';
import OrderDetailView from './components/OrderDetailView';
import Toast from './components/Toast';
import Pagination from './components/Pagination';
import Sidebar, { SIDEBAR_OPEN_W, SIDEBAR_CLOSE_W, IconAlarm } from './components/Sidebar';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('work');
  const [data, setData] = useState(INITIAL_DATA);
  const [viewMode, setViewMode] = useState('list');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('전체');
  const [sortConfig, setSortConfig] = useState(null);
  const [chipFilters, setChipFilters] = useState({ orderDate: null, unassigned: false, deadline: null, clinic: null, prostheticsType: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const bulkAssignRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, chipFilters]);

  useEffect(() => {
    const handler = (e) => {
      if (bulkAssignRef.current && !bulkAssignRef.current.contains(e.target)) setBulkAssignOpen(false);
    };
    if (bulkAssignOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [bulkAssignOpen]);

  const filteredData = useMemo(() => {
    const today = '2024-10-27';
    const yesterday = '2024-10-26';
    const threeDaysAgo = '2024-10-24';
    const tomorrow = '2024-10-28';
    const startOfWeek = '2024-10-27';
    const endOfWeek = '2024-11-02';
    const result = [...data].filter(order => {
      const mainStatus = getAggregatedStatus(order.items);
      if (activeTab === '요청됨' && mainStatus !== '요청됨') return false;
      if (activeTab === '작업중' && mainStatus !== '작업중') return false;
      if (activeTab === '발송됨' && mainStatus !== '발송됨') return false;
      if (activeTab === '수거완료' && mainStatus !== '수거완료') return false;

      // 접수일 필터
      if (chipFilters.orderDate === 'today' && order.orderDate !== today) return false;
      if (chipFilters.orderDate === 'yesterday' && order.orderDate !== yesterday) return false;
      if (chipFilters.orderDate === '3days' && order.orderDate < threeDaysAgo) return false;
      if (chipFilters.orderDate && !['today', 'yesterday', '3days', 'custom'].includes(chipFilters.orderDate) && order.orderDate !== chipFilters.orderDate) return false;

      if (chipFilters.clinic && order.clinic !== chipFilters.clinic) return false;
      if (chipFilters.unassigned && !order.items.some(i => i.technician === '미배정')) return false;
      if (chipFilters.deadline === 'today' && order.deadline !== today) return false;
      if (chipFilters.deadline === 'tomorrow' && order.deadline !== tomorrow) return false;
      if (chipFilters.deadline === 'week' && !(order.deadline >= startOfWeek && order.deadline <= endOfWeek)) return false;

      // 보철 종류 필터
      if (chipFilters.prostheticsType && !order.items.some(i => i.type === chipFilters.prostheticsType)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchPatient = order.patient?.toLowerCase().includes(q);
        const matchClinic = order.clinic?.toLowerCase().includes(q);
        if (!matchPatient && !matchClinic) return false;
      }
      return true;
    });

    if (sortConfig !== null) {
      result.sort((a, b) => {
        const key = sortConfig.key === 'orderDate' ? 'orderDate' : 'deadline';
        const dateA = new Date(a[key] || '2024-10-28');
        const dateB = new Date(b[key] || '2024-10-28');
        if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, activeTab, sortConfig, chipFilters, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(item => item.id)));
    }
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      setSortConfig(null);
      return;
    }
    setSortConfig({ key, direction });
  };

  const handleAssign = (orderId, itemIdx, technicianName) => {
    setData(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      if (itemIdx === 'all') {
        return { ...order, items: order.items.map(i => ({ ...i, technician: technicianName })) };
      }
      return { ...order, items: order.items.map((i, idx) => idx === itemIdx ? { ...i, technician: technicianName } : i) };
    }));
  };

  const handleStatusChange = (orderId, itemIdx, newStatus) => {
    setData(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      if (itemIdx === 'all') {
        return { ...order, items: order.items.map(i => ({ ...i, status: newStatus })) };
      }
      return { ...order, items: order.items.map((i, idx) => idx === itemIdx ? { ...i, status: newStatus } : i) };
    }));
  };

  const handleBulkAssign = (technicianName) => {
    const prevData = data;
    setData(prev => prev.map(order => {
      if (!selectedIds.has(order.id)) return order;
      return { ...order, items: order.items.map(i => ({ ...i, technician: technicianName })) };
    }));
    setBulkAssignOpen(false);
    setSelectedIds(new Set());
    setToast({
      message: `${selectedIds.size}건이 ${technicianName}에게 배정되었어요`,
      prevData,
    });
  };

  const isAllSelected = selectedIds.size === filteredData.length && filteredData.length > 0;

  /* ── 페이지 진입 stagger 애니메이션 variants ── */
  const EASE = [0.25, 0.46, 0.45, 0.94];
  const pageVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };
  const fadeUpSubtle = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  };

  const SIDEBAR_W = sidebarOpen ? SIDEBAR_OPEN_W : SIDEBAR_CLOSE_W;

  /* ── 준비 중 페이지 (작업관리 외 메뉴) ── */
  const PlaceholderPage = ({ label, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-[#B0B8C1]">
      <Icon size={40} strokeWidth={1.5} />
      <p className="text-[15px] font-semibold text-[#8B95A1]">{label}</p>
      <p className="text-[13px]">해당 페이지는 준비 중이에요</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#333D4B] antialiased">

      {/* ── SIDEBAR (top-0, 전체 높이 — 햄버거 포함) ── */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        activeMenu={activeMenu}
        setActiveMenu={(id) => { setActiveMenu(id); setSelectedOrder(null); }}
      />

      {/* ── TOP BAR (사이드바 오른쪽에서 시작, z-40) ── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0, left: SIDEBAR_W }}
        transition={{
          opacity: { duration: 0.35, delay: 0.08 },
          y: { duration: 0.4, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
          left: { type: 'spring', stiffness: 380, damping: 34 },
        }}
        className="h-16 bg-[#F2F4F6] fixed top-0 right-0 z-40 flex items-center"
      >
        {/* [A] 로고 SVG */}
        <div
          className="flex items-center cursor-pointer pl-4 pr-4"
          onClick={() => { setActiveMenu('work'); setSelectedOrder(null); }}
        >
          <img src="/logo.svg" alt="diil logo" className="h-[38px] w-auto" />
        </div>

        {/* [B] 검색바 — 헤더 내 중앙 */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-[440px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8D0D9]" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="환자, 치과, 의뢰 검색"
              className="w-full pl-9 pr-4 py-2.5 bg-white rounded-[10px] text-[13px] border-none focus:outline-none focus:ring-2 focus:ring-[#3182F6]/20 transition-all placeholder:text-[#B0B8C1]"
            />
          </div>
        </div>

        {/* [C] 우측: 알림 + 프로필 */}
        <div className="flex items-center gap-3 pr-6">
          <button className="w-[42px] h-[42px] flex items-center justify-center rounded-[12px] text-gray-400 hover:text-[#4E5968] hover:bg-white/70 transition-colors">
            <IconAlarm />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#B0B8C1] group-hover:bg-[#E5E8EB] transition-colors">
              <User size={15} />
            </div>
            <span className="text-[13px] font-medium text-[#4E5968]">최고 관리자</span>
          </div>
        </div>
      </motion.header>

      {/* ── MAIN CONTENT ── */}
      <motion.div
        animate={{ marginLeft: SIDEBAR_W }}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        className="pt-16 min-h-screen"
      >
        <main className="max-w-[1300px] w-full mx-auto p-8 pb-12 flex-1">
          {/* 작업 관리가 아닌 메뉴 → 준비 중 placeholder */}
          {activeMenu === 'schedule' && <PlaceholderPage label="일정 현황" icon={CalendarDays} />}
          {activeMenu === 'clients' && <PlaceholderPage label="거래처" icon={Building2} />}
          {activeMenu === 'analytics' && <PlaceholderPage label="성과 분석" icon={BarChart2} />}
          {activeMenu === 'settings' && <PlaceholderPage label="설정" icon={Settings} />}

          {/* 작업 관리 본문 */}
          {activeMenu === 'work' && (
            <AnimatePresence mode="wait">
              {selectedOrder ? (
                <OrderDetailView
                  key="detail"
                  order={selectedOrder}
                  onBack={() => setSelectedOrder(null)}
                  onAssign={handleAssign}
                />
              ) : (
                <motion.div
                  key="dashboard"
                  variants={pageVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                >
                  <motion.div variants={fadeUp}>
                    <div className="mb-6">
                      <h2 className="text-[20px] font-bold text-[#191F28] mb-1 tracking-tight">작업 현황</h2>
                      <p className="text-[#8B95A1] text-[12px] font-medium">관리자의 빠른 판단과 실행을 돕는 통합 워크스페이스입니다.</p>
                    </div>
                  </motion.div>

                  <motion.section variants={fadeUp} className="bg-white rounded-[16px] overflow-x-auto">
                    <div className="min-w-[1100px]">
                      <div className="px-6 py-5 flex flex-col gap-3 bg-white border-b border-[#F9FAFB]">
                        <motion.div variants={fadeUpSubtle} className="flex justify-between items-center w-full">
                          <ListTabCards data={data} activeTab={activeTab} setActiveTab={setActiveTab} />
                        </motion.div>
                        <motion.div variants={fadeUpSubtle} className="flex items-center justify-between gap-4">
                          <InlineFilters data={data} chipFilters={chipFilters} setChipFilters={setChipFilters} />
                          <div className="relative flex-shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D1D6DB]" size={13} />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                              placeholder="환자 또는 치과 검색"
                              className="pl-8 pr-4 py-2 bg-[#F2F4F6] border-none rounded-[10px] text-[12px] w-44 focus:outline-none focus:ring-2 focus:ring-[#3182F6]/20 focus:bg-white transition-all placeholder:text-[#B0B8C1]"
                            />
                          </div>
                        </motion.div>
                      </div>

                      <AnimatePresence initial={false}>
                        {selectedIds.size > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 py-3 bg-white flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 bg-[#F2F4F6] text-[#4E5968] px-3 py-1.5 rounded-[10px] text-[13px] font-semibold hover:bg-[#F9FAFB] transition-colors"
                              >
                                <Printer size={14} />
                                <span>선택한 {selectedIds.size}건 출력하기</span>
                              </motion.button>
                              <div className="relative" ref={bulkAssignRef}>
                                <motion.button
                                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={() => setBulkAssignOpen(o => !o)}
                                  className="flex items-center gap-2 bg-[#3182F6] text-white px-3 py-1.5 rounded-[10px] text-[13px] font-semibold transition-colors hover:bg-[#2b72d6]"
                                >
                                  <User size={14} />
                                  <span>전체 {selectedIds.size}건 배정하기</span>
                                  <ChevronsUpDown size={13} className="opacity-70" strokeWidth={2.5} />
                                </motion.button>
                                <AnimatePresence>
                                  {bulkAssignOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute top-full left-0 mt-1 w-32 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-1.5 z-[100]"
                                    >
                                      {TECHNICIANS.filter(t => t !== '미배정').map(tech => (
                                        <button
                                          key={tech}
                                          onClick={() => handleBulkAssign(tech)}
                                          className="w-full text-left px-4 py-2 text-[13px] font-semibold text-[#4E5968] hover:bg-[#F2F4F6] transition-colors"
                                        >
                                          {tech}
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="bg-white pb-4 min-h-[480px]">
                        {viewMode === 'list' ? (
                          <table className="w-full text-left table-fixed border-separate border-spacing-y-1 border-spacing-x-0">
                            <thead>
                              <tr className="text-[12px] font-semibold text-[#8B95A1] bg-[#F9FAFB]">
                                <th className="py-3 pl-6 pr-3 w-14 border-b border-[#F2F4F6]">
                                  <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
                                </th>
                                <th className="py-3 border-b border-[#F2F4F6] w-[260px]">환자</th>
                                <th className="py-3 border-b border-[#F2F4F6] w-[160px]">치식</th>
                                <th className="py-3 border-b border-[#F2F4F6] w-[140px]">
                                  <button
                                    onClick={() => handleSort('orderDate')}
                                    className={`inline-flex items-center gap-1 hover:text-[#4E5968] transition-colors focus:outline-none ${sortConfig?.key === 'orderDate' ? 'text-[#3182F6]' : ''}`}
                                  >
                                    접수일
                                    {sortConfig?.key === 'orderDate' ? (
                                      sortConfig.direction === 'asc' ? <ArrowUp size={13} strokeWidth={2.5} /> : <ArrowDown size={13} strokeWidth={2.5} />
                                    ) : (
                                      <ChevronsUpDown size={13} className="text-[#D1D6DB]" />
                                    )}
                                  </button>
                                </th>
                                <th className="py-3 border-b border-[#F2F4F6] w-[140px]">
                                  <button
                                    onClick={() => handleSort('deadline')}
                                    className={`inline-flex items-center gap-1 hover:text-[#4E5968] transition-colors focus:outline-none ${sortConfig?.key === 'deadline' ? 'text-[#3182F6]' : ''}`}
                                  >
                                    마감일
                                    {sortConfig?.key === 'deadline' ? (
                                      sortConfig.direction === 'asc' ? <ArrowUp size={13} strokeWidth={2.5} /> : <ArrowDown size={13} strokeWidth={2.5} />
                                    ) : (
                                      <ChevronsUpDown size={13} className="text-[#D1D6DB]" />
                                    )}
                                  </button>
                                </th>
                                <th className="py-3 border-b border-[#F2F4F6] w-[140px]">상태</th>
                                <th className="py-3 border-b border-[#F2F4F6] w-[140px]">작업자</th>
                                <th className="py-3 border-b border-[#F2F4F6] w-[88px]"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedData.length === 0 ? (
                                <tr>
                                  <td colSpan="8">
                                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                                      <span className="text-[40px] leading-none">🔍</span>
                                      <p className="text-[14px] font-semibold text-[#4E5968]">조건에 맞는 의뢰가 없어요</p>
                                      <p className="text-[13px] text-[#8B95A1]">필터를 변경하거나 전체 해제해 주세요</p>
                                    </div>
                                  </td>
                                </tr>
                              ) : paginatedData.map((order, idx) => (
                                <OrderRow
                                  key={order.id}
                                  order={order}
                                  index={idx}
                                  isSelected={selectedIds.has(order.id)}
                                  onSelect={() => handleSelectItem(order.id)}
                                  onAssign={handleAssign}
                                  onStatusChange={handleStatusChange}
                                  onDetailClick={setSelectedOrder}
                                />
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-6">
                            {paginatedData.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-20 gap-3 bg-[#F9FAFB] border border-[#F2F4F6] rounded-[16px]">
                                <span className="text-[40px] leading-none">🔍</span>
                                <p className="text-[14px] font-semibold text-[#4E5968]">조건에 맞는 의뢰가 없어요</p>
                                <p className="text-[13px] text-[#8B95A1]">필터를 변경하거나 전체 해제해 주세요</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedData.map(order => (
                                  <OrderCard
                                    key={order.id}
                                    order={order}
                                    isSelected={selectedIds.has(order.id)}
                                    onSelect={() => handleSelectItem(order.id)}
                                    onAssign={handleAssign}
                                    onDetailClick={setSelectedOrder}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          setCurrentPage={setCurrentPage}
                        />
                      </div>
                    </div>
                  </motion.section>
                </motion.div>
              )}
            </AnimatePresence>

          )} {/* /activeMenu === 'work' */}
        </main>
      </motion.div>

      <Toast
        toast={toast}
        onUndo={() => { setData(toast.prevData); setToast(null); }}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
}
