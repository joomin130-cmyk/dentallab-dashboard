import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
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
  Edit2,
  Save,
  Layers,
  FileText,
  Camera,
  ChevronUp,
  RotateCcw,
  AlertCircle,
  CheckCircle2
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

const simplifyMaterial = (material) => {
  if (!material) return '';
  return material.split('/')[0].trim();
};

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
    className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${checked ? 'bg-[#3182F6]' : 'bg-white border border-[#D1D6DB] hover:bg-[#F9FAFB]'}`}
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

// [NEW] FDI Teeth Grid
const TeethGrid = ({ teeth = [], fill = false }) => {
  const ur = teeth.filter(t => /^[1][1-8]$/.test(t));
  const ul = teeth.filter(t => /^[2][1-8]$/.test(t));
  const ll = teeth.filter(t => /^[3][1-8]$/.test(t));
  const lr = teeth.filter(t => /^[4][1-8]$/.test(t));
  const others = teeth.filter(t => !/^[1-4][1-8]$/.test(t));

  return (
    <div className={`flex flex-col gap-1 ${fill ? 'w-full' : 'w-[260px]'}`}>
      {others.length > 0 && (
        <div className="flex gap-1 mb-1">
          {others.map(t => <span key={t} className="text-[14px] font-bold text-[#3182F6] bg-blue-50 px-2.5 py-1 rounded-[8px]">{t}</span>)}
        </div>
      )}
      <div className="flex flex-col w-full h-[120px] bg-[#F9FAFB] rounded-[12px] border border-[#E5E8EB] overflow-hidden relative">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#E5E8EB]"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#E5E8EB]"></div>

        <div className="flex flex-1">
          <div className="flex-1 flex items-end justify-end p-2 gap-1.5 flex-wrap">
            {ur.map(t => <span key={t} className="text-[14px] font-bold text-[#3182F6] bg-[#E8F3FF] px-2 py-1 rounded-[8px] leading-none">{t}</span>)}
          </div>
          <div className="flex-1 flex items-end justify-start p-2 gap-1.5 flex-wrap">
            {ul.map(t => <span key={t} className="text-[14px] font-bold text-[#3182F6] bg-[#E8F3FF] px-2 py-1 rounded-[8px] leading-none">{t}</span>)}
          </div>
        </div>
        <div className="flex flex-1">
          <div className="flex-1 flex items-start justify-end p-2 gap-1.5 flex-wrap">
            {lr.map(t => <span key={t} className="text-[14px] font-bold text-[#3182F6] bg-[#E8F3FF] px-2 py-1 rounded-[8px] leading-none">{t}</span>)}
          </div>
          <div className="flex-1 flex items-start justify-start p-2 gap-1.5 flex-wrap">
            {ll.map(t => <span key={t} className="text-[14px] font-bold text-[#3182F6] bg-[#E8F3FF] px-2 py-1 rounded-[8px] leading-none">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

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

// [NEW] History Timeline (Flat Design Applied)
const HistoryTimeline = ({ history = [], type }) => {
  if (!history || history.length === 0) {
    return (
      <div className="py-10 text-center text-[#B0B8C1] text-[13px] font-medium">
        이력이 존재하지 않습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#F2F4F6]">
      {history.map((item, i) => (
        <div key={i} className="relative pl-8">
          <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-[3px] border-white flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-[#3182F6] text-white' : 'bg-[#D1D6DB] text-white'}`}>
            {type === 'version' ? (item.version ? item.version.replace('v', '') : '') : ''}
          </div>
          <div>
            <div className="flex justify-between items-start mb-0.5">
              <p className={`text-[13px] font-bold tracking-tight ${i === 0 ? 'text-[#3182F6]' : 'text-[#4E5968]'}`}>
                {type === 'version' ? item.version : item.item}
              </p>
              <span className="text-[11px] text-[#B0B8C1] font-bold tracking-tight">{item.date}</span>
            </div>
            <p className="text-[12px] text-[#8B95A1] font-medium leading-snug">
              {type === 'version' ? item.reason : `${item.clinic} · ${item.teeth?.join(', ')}번`}
            </p>
            {type === 'version' && <p className="text-[11px] text-[#B0B8C1] mt-1 italic font-medium">{item.author}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

// [NEW] Order Detail View (Strictly Flat Design, No Air Shadow)
const OrderDetailView = ({ order, onBack, onAssign }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState('change');

  // Defensive defaults as requested to prevent missing data crashes
  const safeDoctor = order.doctor || '김의사';
  const safeStaff = order.staff || '이실장';
  const safeOrderDate = order.orderDate || '2024.10.25';
  const safeScanInfo = order.scanInfo || '3 Shape Communicate';
  const safeShade = order.shade || 'D2';
  const safeMemo = order.memo || '힐링 16- 50717- 459';
  const safeFuturePlan = order.futurePlan || '23년12월 처음 셋팅하시고 깨져서 다시 제작 24년 11월 셋팅 하신건데 깨져서 오심';
  const safeModificationHistory = order.modificationHistory || [{ version: 'v1', author: '시스템', date: '방금', reason: '초기 생성' }];
  const safePatientHistory = order.patientHistory || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      transition={{ duration: 0.2 }}
      className="pb-20"
    >
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#8B95A1] hover:text-[#333D4B] transition-colors group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-bold tracking-tight">의뢰 목록으로 돌아가기</span>
        </button>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="bg-white border border-[#F2F4F6] text-[#4E5968] px-4 py-2 rounded-[10px] text-[13px] font-bold hover:bg-[#F9FAFB] transition-colors">취소</button>
              <button onClick={() => setIsEditing(false)} className="bg-[#3182F6] text-white px-4 py-2 rounded-[10px] text-[13px] font-bold flex items-center gap-1.5 hover:bg-[#2b72d6] transition-colors">
                <Save size={14} /> 변경사항 저장
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="bg-white border border-[#F2F4F6] text-[#4E5968] px-4 py-2 rounded-[10px] text-[13px] font-bold hover:bg-[#F9FAFB] transition-colors">
                <Edit2 size={13} className="inline mr-1" /> 수정하기
              </button>
              <button className="bg-[#3281FA] text-white px-4 py-2 rounded-[10px] text-[13px] font-bold hover:bg-[#2b72d6] transition-colors">
                작업 완료 처리
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            className="bg-white p-6 rounded-[16px]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1.5">
                  {isEditing ? (
                    <input type="text" defaultValue={order.patient} className="text-[22px] font-bold text-[#191F28] border-b border-[#3182F6] outline-none w-32 pb-0.5" />
                  ) : (
                    <h3 className="text-[20px] font-bold text-[#191F28] tracking-tight">{order.patient}</h3>
                  )}
                  <StatusBadge status={getAggregatedStatus(order.items)} />
                  <span className="bg-[#F2F4F6] text-[#8B95A1] px-2 py-0.5 rounded-[6px] text-[11px] font-bold">재제작</span>
                </div>
                <p className="text-[14px] text-[#8B95A1] font-medium">{order.clinic}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#B0B8C1] font-bold mb-0.5 tracking-wider">마감일</p>
                <p className={`text-[18px] font-bold tracking-tight ${order.priority === 'urgent' || order.priority === 'high' ? 'text-[#F04452]' : 'text-[#333D4B]'}`}>{formatDate(order.deadline)}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-[#F2F4F6]">
              {[
                { label: '담당 의사', value: safeDoctor },
                { label: '치과위생사', value: safeStaff },
                { label: '접수일', value: safeOrderDate },
                { label: '스캔 정보', value: safeScanInfo },
              ].map((info, idx) => (
                <div key={idx}>
                  <p className="text-[11px] text-[#B0B8C1] font-semibold mb-1">{info.label}</p>
                  <p className="text-[14px] font-semibold text-[#4E5968] tracking-tight">{info.value}</p>
                </div>
              ))}
            </div>

            {/* 카드 안에 자연스럽게 스며드는 히스토리 영역 */}
            <div className="mt-8 pt-8 border-t border-[#F2F4F6]">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-[16px] font-bold text-[#191F28] tracking-tight">상세 히스토리</h4>
                <div className="flex bg-[#F2F4F6] p-1 rounded-[8px]">
                  <button 
                    onClick={() => setActiveHistoryTab('change')}
                    className={`px-3.5 py-1.5 text-[12px] font-bold rounded-[6px] transition-colors ${activeHistoryTab === 'change' ? 'bg-white text-[#333D4B] shadow-sm' : 'text-[#8B95A1] hover:text-[#4E5968]'}`}
                  >
                    의뢰 변경 이력
                  </button>
                  <button 
                    onClick={() => setActiveHistoryTab('patient')}
                    className={`px-3.5 py-1.5 text-[12px] font-bold rounded-[6px] transition-colors ${activeHistoryTab === 'patient' ? 'bg-white text-[#333D4B] shadow-sm' : 'text-[#8B95A1] hover:text-[#4E5968]'}`}
                  >
                    환자 사전 정보
                  </button>
                </div>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto pr-2">
                {activeHistoryTab === 'change' ? (
                  <HistoryTimeline history={safeModificationHistory} type="version" />
                ) : (
                  <HistoryTimeline history={safePatientHistory} type="patient" />
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="bg-white p-8 rounded-[16px]"
          >
            <h4 className="text-[20px] font-bold text-[#191F28] mb-8 tracking-tight">보철 및 치식 정보</h4>
            <div className="space-y-20">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-4 relative">
                  {idx > 0 && <div className="absolute -top-5 left-0 right-0 h-[1px] bg-[#F2F4F6]"></div>}
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-[15px] font-semibold text-[#191F28] mb-0.5">{item.material}</h5>
                      <p className="text-[14px] font-medium text-[#8B95A1]">{item.type}</p>
                    </div>
                    <div className="flex items-center justify-end gap-8">
                      <div className="flex flex-col items-end">
                        <p className="text-[12px] text-[#B0B8C1] font-semibold mb-1">작업자</p>
                        <div className="relative z-10 w-fit">
                          <TechnicianSelect name={item.technician} onAssign={(tch) => onAssign(order.id, idx, tch)} />
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-[12px] text-[#B0B8C1] font-semibold mb-1">진행 상태</p>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </div>
                  <TeethGrid teeth={item.teeth} fill={true} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="bg-white p-8 rounded-[16px]"
          >
            <h4 className="text-[20px] font-bold text-[#191F28] mb-6 tracking-tight">쉐이드</h4>
            <div className="mb-4">
              <p className="text-[16px] font-bold text-[#191F28] leading-tight">{safeShade}</p>
              <p className="text-[13px] text-[#8B95A1] font-medium mt-1">쉐이드</p>
            </div>
            <div className="flex gap-4">
              {[1, 2].map(i => (
                <div key={i} className="w-[160px] h-[160px] bg-[#F9FAFB] rounded-[16px] overflow-hidden border border-[#E5E8EB]">
                  <img src={i === 1 ? "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=300" : "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=300"} alt="Shade" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="bg-white p-8 rounded-[16px]"
          >
            <h4 className="text-[20px] font-bold text-[#191F28] mb-5 tracking-tight">추가 정보</h4>
            <div className="bg-[#F2F4F6] text-[#4E5968] font-semibold text-[13px] px-3.5 py-1.5 rounded-[8px] w-fit mb-8">
              보험 적용 : 아니오
            </div>

            <div className="mb-8">
              <p className="text-[13px] text-[#8B95A1] font-medium mb-1.5">메모</p>
              {isEditing ? (
                <textarea className="w-full bg-[#F9FAFB] border border-[#E5E8EB] p-4 rounded-[12px] outline-none text-[16px] text-[#191F28] font-medium resize-none min-h-[100px]" defaultValue={safeMemo}></textarea>
              ) : (
                <p className="text-[16px] text-[#191F28] font-medium leading-relaxed whitespace-pre-wrap">{safeMemo}</p>
              )}
            </div>

            <div>

              <div>
                <p className="text-[13px] text-[#8B95A1] font-medium mb-1.5">향후 보철 계획</p>
                <p className="text-[16px] text-[#191F28] font-medium leading-relaxed whitespace-pre-wrap">{safeFuturePlan}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-span-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="bg-[#F9FAFB] rounded-[16px] flex flex-col h-[calc(100vh-140px)] sticky top-[100px]"
          >
            <div className="flex justify-end items-center p-6 pb-2">
              <button className="bg-[#191F28] text-white px-5 py-2.5 text-[13px] font-bold rounded-[8px] tracking-tight shadow-md hover:bg-[#333D4B] transition-colors">
                치과 요청사항 자동 분배하기
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-10 custom-scrollbar">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white border-[3px] border-black flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-[16px] font-black text-black">O</span>
                </div>
                <div className="flex flex-col gap-3 w-full mt-0.5">
                  <div className="bg-white p-4 pr-10 rounded-[12px] border border-[#E5E8EB] flex items-center gap-3 w-fit shadow-xs cursor-pointer hover:bg-gray-50 transition-colors">
                    <FileText size={18} className="text-[#8B95A1]" />
                    <span className="text-[13px] font-bold text-[#4E5968] tracking-tight">수유 이치과 의뢰내용 요약 리포트</span>
                  </div>
                  
                  <div className="flex items-center gap-6 mt-1 ml-1 text-[#B0B8C1]">
                    <button className="hover:text-[#4E5968] transition-colors"><RotateCcw size={16} /></button>
                    <button className="hover:text-[#4E5968] transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg></button>
                    <button className="hover:text-[#4E5968] transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg></button>
                    <button className="hover:text-[#4E5968] transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg></button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h5 className="text-[15px] font-bold text-[#333D4B] ml-1 mb-2">다음 기능으로 추천드려요</h5>
                {[
                  "치과에서 요청한 의뢰의 내용이 적절한지 분석해 줄래?",
                  "추가적으로 치과 측에 문의하면 좋을 질문이 있을까?",
                  "현재 제작 중인 다른 보철물과의 우선순위를 어떻게 할까?",
                  "원장님과 전화 소통 시 대답을 더 잘 이끌어낼 방법이 있을까?",
                  "특정 치식 부위에 대해 더 깊이 파고들 수 있는 참고 자료를 보여줄래?"
                ].map((q, i) => (
                  <button key={i} className="w-full text-left bg-[#F2F4F6] text-[#4E5968] p-4 rounded-[12px] text-[13px] font-bold hover:bg-[#E5E8EB] transition-colors tracking-tight">
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 pt-2 bg-[#F9FAFB] border-t border-transparent shrink-0">
              <div className="flex gap-2 mb-4">
                <button className="flex-1 bg-white border border-[#E5E8EB] py-3 rounded-[10px] text-[12px] font-bold text-[#4E5968] hover:bg-gray-50 transition-colors shadow-sm">참고자료 추가</button>
                <button className="flex-1 bg-white border border-[#E5E8EB] py-3 rounded-[10px] text-[12px] font-bold text-[#4E5968] hover:bg-gray-50 transition-colors shadow-sm">작업 순서 재정렬</button>
                <button className="flex-1 bg-white border border-[#E5E8EB] py-3 rounded-[10px] text-[12px] font-bold text-[#4E5968] hover:bg-gray-50 transition-colors shadow-sm">소통 대본 만들기</button>
              </div>

              <div className="bg-white flex flex-col justify-between rounded-[20px] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] h-[130px] focus-within:ring-2 focus-within:ring-[#3182F6] transition-shadow">
                <input type="text" placeholder="원하는 업무를 요청해 보세요!" className="w-full text-[15px] font-bold text-[#191F28] placeholder-[#B0B8C1] outline-none bg-transparent" />
                <div className="flex justify-between items-center mt-auto">
                  <button className="flex items-center gap-1.5 text-[14px] font-bold text-[#8B95A1] hover:text-[#4E5968] transition-colors rounded-md p-1">
                    <span className="text-[18px] pb-0.5 leading-none">⊕</span> 파일
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#E5E8EB] text-white flex items-center justify-center hover:bg-[#4E5968] transition-colors shrink-0">
                    <ChevronUp size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
              <div className="text-center mt-5 mb-1">
                <span className="text-[11px] font-extrabold text-[#B0B8C1]">DIIT Copilot powered by Antigravity</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};


// 카드 뷰
const OrderCard = ({ order, isSelected, onSelect, onAssign, onDetailClick }) => {
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
      className={`p-5 rounded-[16px] flex flex-col justify-between transition-colors group relative border border-[#F2F4F6] ${isSelected ? 'bg-blue-50/60' : 'bg-white'}`}
    >
      <div className="absolute top-5 left-5">
        <Checkbox checked={isSelected} onChange={onSelect} />
      </div>
      <div className="pl-8">
        <div className="flex justify-between items-start mb-3">
          <StatusBadge status={mainStatus} />
          <div className="flex gap-1 border border-[#F2F4F6] rounded-[8px] p-0.5 bg-white">
            <button onClick={(e) => { e.stopPropagation(); onDetailClick(order); }} className="w-6 h-6 flex items-center justify-center text-[#B0B8C1] hover:text-[#3182F6] hover:bg-blue-50 transition-colors rounded-[6px]"><MoreVertical size={13} /></button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1 cursor-pointer w-fit hover:underline decoration-[#3182F6]/50 underline-offset-2" onClick={(e) => { e.stopPropagation(); onDetailClick(order); }}>
          <h4 className={`text-[15px] font-semibold tracking-tight transition-colors ${isSelected ? 'text-[#3182F6]' : 'text-[#333D4B]'}`}>{order.patient}</h4>
          {isMultiItem && <span className="text-[10px] items-center flex bg-[#F2F4F6] text-[#8B95A1] px-1.5 py-0.5 rounded-[6px] font-semibold tracking-tight">복합</span>}
        </div>
        <p className="text-[12px] text-[#8B95A1] font-medium mb-3">{order.clinic}</p>

        <div className="flex flex-wrap gap-1 mb-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); onDetailClick(order); }}>
          {allTeeth.map(t => (
            <span key={t} className="text-[10px] font-semibold text-[#3182F6] bg-blue-50 px-1.5 py-0.5 rounded-[8px]">{t}</span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#F2F4F6] flex justify-between items-center pl-8">
        <span className="text-[12px] font-semibold text-[#4E5968] truncate pr-2">
          {order.items[0].type}, {simplifyMaterial(order.items[0].material)} {isMultiItem && <span className="text-[#B0B8C1] font-normal ml-0.5">외 {order.items.length - 1}</span>}
        </span>
        <div className="text-[11px] font-semibold text-[#8B95A1] whitespace-nowrap">
          <span>{formatDate(order.deadline)}</span>
        </div>
      </div>
    </motion.div>
  );
};

// 리스트 뷰 Row
const OrderRow = ({ order, isSelected, onSelect, onAssign, onDetailClick }) => {
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

        {/* 환자 및 치과 (상세보기 클릭 이벤트 포함) */}
        <td className="py-4 align-top">
          <div className="flex flex-col gap-0.5 mt-0.5">
            <div
              className="flex items-center gap-1.5 cursor-pointer hover:underline decoration-[#3182F6]/50 underline-offset-2 w-fit"
              onClick={(e) => { e.stopPropagation(); onDetailClick(order); }}
            >
              <span className={`text-[13px] font-semibold tracking-tight transition-colors ${isSelected ? 'text-[#3182F6]' : 'text-[#333D4B]'}`}>{order.patient}</span>
              {isMultiItem && <span className="text-[10px] font-semibold bg-blue-50 text-[#3182F6] px-1.5 py-0.5 rounded-[8px]">복합</span>}
            </div>
            <span className="text-[12px] text-[#8B95A1] font-medium">{order.clinic}</span>
          </div>
        </td>

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

        <td className="py-4 align-top">
          <div className="mt-1 min-h-[24px] flex items-center">
            {isMultiItem ? (
              <span className="text-[12px] font-medium text-[#B0B8C1]">하단 상세 참조</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {order.items[0].teeth.map(t => (
                  <span key={t} className="text-[10px] font-semibold text-[#3182F6] bg-blue-50 px-1.5 py-0.5 rounded-[6px]">{t}</span>
                ))}
              </div>
            )}
          </div>
        </td>

        <td className="py-4 align-top">
          <div className="mt-1 flex justify-center">
            <StatusBadge status={mainStatus} />
          </div>
        </td>

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

        <td className="py-4 align-top">
          <div className={`mt-1 flex justify-center items-center gap-1.5 text-[13px] font-semibold ${order.priority === 'urgent' || order.priority === 'high' ? 'text-[#F04452]' : 'text-[#8B95A1]'}`}>
            <span>{formatDate(order.deadline)}</span>
          </div>
        </td>

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
                      <div className="w-[180px]"></div>
                      <div className="w-[240px]">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] font-medium text-[#333D4B]">{item.material}</span>
                          <span className="text-[11px] font-medium text-[#8B95A1]">{item.type}</span>
                        </div>
                      </div>
                      <div className="flex-1 flex items-center pr-4">
                        <div className="flex flex-wrap gap-1">
                          {item.teeth.map(t => <span key={t} className="text-[10px] font-semibold text-[#3182F6] bg-blue-50/70 px-1.5 py-0.5 rounded-[8px]">{t}</span>)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-[130px] flex justify-center">
                          <StatusBadge status={item.status} />
                        </div>
                        <div className="w-[130px] flex justify-center relative z-20">
                          <TechnicianSelect name={item.technician} onAssign={(tch) => onAssign(order.id, idx, tch)} />
                        </div>
                        <div className="w-[130px]"></div>
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

// 메인 앱
export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [viewMode, setViewMode] = useState('list');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('전체');
  const [sortConfig, setSortConfig] = useState(null);

  // 새로 추가된 상세 뷰용 상태
  const [selectedOrder, setSelectedOrder] = useState(null);

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

              <ManagementSummary data={data} />

              <section className="bg-white rounded-[16px] overflow-hidden">
                <div className="px-6 py-4 flex flex-col gap-3 bg-white border-b border-[#F9FAFB]">
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
                      <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8B95A1] hover:text-[#4E5968] hover:bg-[#F2F4F6] px-3 py-1.5 rounded-xl transition-all">
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
                            className="flex items-center gap-2 bg-[#3182F6] text-white px-3 py-2 rounded-[10px] text-[13px] font-semibold transition-all hover:bg-[#2b72d6]"
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

                <div className="bg-white pb-4">
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
                        {filteredData.map(order => (
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
                  ) : (
                    <div className="p-6 grid grid-cols-3 gap-4 bg-[#F9FAFB] border-t border-[#F2F4F6]">
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
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
