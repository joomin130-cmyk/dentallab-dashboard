import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, List, LayoutGrid, Bell, User, Printer,
  ArrowDown, ArrowUp, ChevronsUpDown
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

export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [viewMode, setViewMode] = useState('list');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('전체');
  const [sortConfig, setSortConfig] = useState(null);
  const [chipFilters, setChipFilters] = useState({ clinic: null, unconfirmed: false, unassigned: false, deadline: null });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  const bulkAssignRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (bulkAssignRef.current && !bulkAssignRef.current.contains(e.target)) setBulkAssignOpen(false);
    };
    if (bulkAssignOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [bulkAssignOpen]);

  const filteredData = useMemo(() => {
    const today = '2024-10-27';
    const tomorrow = '2024-10-28';
    const startOfWeek = '2024-10-27';
    const endOfWeek = '2024-11-02';
    const result = [...data].filter(order => {
      const mainStatus = getAggregatedStatus(order.items);
      if (activeTab === '요청됨' && mainStatus !== '접수') return false;
      if (activeTab === '작업중' && mainStatus !== '제작중') return false;
      if (activeTab === '완료' && mainStatus !== '배송준비') return false;
      if (chipFilters.clinic && order.clinic !== chipFilters.clinic) return false;
      if (chipFilters.unconfirmed && !(mainStatus === '접수' && order.items.some(i => i.technician === '미배정'))) return false;
      if (chipFilters.unassigned && !order.items.some(i => i.technician === '미배정')) return false;
      if (chipFilters.deadline === 'today' && order.deadline !== today) return false;
      if (chipFilters.deadline === 'tomorrow' && order.deadline !== tomorrow) return false;
      if (chipFilters.deadline === 'week' && !(order.deadline >= startOfWeek && order.deadline <= endOfWeek)) return false;
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
  }, [data, activeTab, sortConfig, chipFilters]);

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

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#333D4B] antialiased flex flex-col pt-0 pb-12">
      <header className="h-16 bg-white flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setSelectedOrder(null)}>
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-[20px] font-bold text-[#191F28] mb-1 tracking-tight">작업 현황</h2>
                  <p className="text-[#8B95A1] text-[12px] font-medium">관리자의 빠른 판단과 실행을 돕는 통합 워크스페이스입니다.</p>
                </div>
                <div className="flex gap-2.5">
                  <div className="flex bg-white p-1 rounded-[14px] items-center relative border border-[#F2F4F6]">
                    <motion.div
                      layout
                      className="absolute bg-[#F2F4F6] rounded-xl z-0"
                      style={{ width: 'calc(50% - 4px)', height: 'calc(100% - 8px)', left: viewMode === 'list' ? 4 : 'calc(50%)', top: 4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                      className="pl-9 pr-4 py-3 bg-white border border-[#F2F4F6] rounded-[12px] text-[12px] w-48 focus:outline-none transition-all placeholder:text-[#D1D6DB] focus:ring-2 focus:ring-[#3182F6]/20"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#3281FA] text-white px-4 py-2 rounded-[12px] text-[13px] font-semibold hover:bg-[#2b72d6]"
                  >
                    새 의뢰 등록
                  </motion.button>
                </div>
              </div>

              <section className="bg-white rounded-[16px] overflow-x-auto">
                <div className="min-w-[1100px]">
                  <div className="px-6 py-5 flex flex-col gap-3 bg-white border-b border-[#F9FAFB]">
                    <div className="flex justify-between items-end w-full">
                      <ListTabCards data={data} activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <InlineFilters data={data} chipFilters={chipFilters} setChipFilters={setChipFilters} />
                      <div className="flex items-center gap-2 shrink-0">
                        <AnimatePresence>
                          {selectedIds.size > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="relative"
                              ref={bulkAssignRef}
                            >
                              <button
                                onClick={() => setBulkAssignOpen(o => !o)}
                                className="flex items-center gap-2 bg-[#3182F6] text-white px-3 py-2 rounded-[10px] text-[13px] font-semibold transition-colors hover:bg-[#2b72d6]"
                              >
                                <User size={14} />
                                <span>전체 {selectedIds.size}건 배정하기</span>
                                <ChevronsUpDown size={13} className="opacity-70" strokeWidth={2.5} />
                              </button>
                              <AnimatePresence>
                                {bulkAssignOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full right-0 mt-1 w-32 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-1.5 z-[100]"
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
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 bg-[#F2F4F6] text-[#4E5968] px-3 py-2 rounded-[10px] text-[13px] font-semibold hover:bg-[#E5E8EB] transition-colors">
                          <Printer size={14} />
                          <span>전체 출력</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white pb-4 min-h-[480px]">
                    {viewMode === 'list' ? (
                      <table className="w-full text-left table-fixed">
                        <thead>
                          <tr className="text-[12px] font-medium text-[#8B95A1] bg-[#F9FAFB]">
                            <th className="py-3 pl-6 pr-3 w-14 border-b border-[#F2F4F6]">
                              <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
                            </th>
                            <th className="py-3 border-b border-[#F2F4F6] w-[180px]">환자 및 치과</th>
                            <th className="py-3 border-b border-[#F2F4F6] w-[240px]">보철 정보</th>
                            <th className="py-3 border-b border-[#F2F4F6]">치식</th>
                            <th className="py-3 text-right pr-4 border-b border-[#F2F4F6] w-[130px]">진행 상태</th>
                            <th className="py-3 text-right pr-4 border-b border-[#F2F4F6] w-[130px]">작업자</th>
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
                        <tbody>
                          {filteredData.length === 0 ? (
                            <tr>
                              <td colSpan="8">
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                  <span className="text-[40px] leading-none">🔍</span>
                                  <p className="text-[14px] font-semibold text-[#4E5968]">조건에 맞는 의뢰가 없어요</p>
                                  <p className="text-[13px] text-[#8B95A1]">필터를 변경하거나 전체 해제해 주세요</p>
                                </div>
                              </td>
                            </tr>
                          ) : filteredData.map(order => (
                            <OrderRow
                              key={order.id}
                              order={order}
                              isSelected={selectedIds.has(order.id)}
                              onSelect={() => handleSelectItem(order.id)}
                              onAssign={handleAssign}
                              onDetailClick={setSelectedOrder}
                            />
                          ))}
                        </tbody>
                      </table>
                    ) : filteredData.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-[#F9FAFB] border-t border-[#F2F4F6]">
                        <span className="text-[40px] leading-none">🔍</span>
                        <p className="text-[14px] font-semibold text-[#4E5968]">조건에 맞는 의뢰가 없어요</p>
                        <p className="text-[13px] text-[#8B95A1]">필터를 변경하거나 전체 해제해 주세요</p>
                      </div>
                    ) : (
                      <div className="p-6 grid grid-cols-3 gap-4 bg-[#F9FAFB]">
                        {filteredData.map(order => (
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
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Toast
        toast={toast}
        onUndo={() => { setData(toast.prevData); setToast(null); }}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
}
