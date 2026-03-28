import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Save, Edit2, FileText, RotateCcw,
  User, Send, Plus, Globe, Type, Mic, MessageSquare,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import TeethGrid from './TeethGrid';
import TechnicianSelect from './TechnicianSelect';
import HistoryTimeline from './HistoryTimeline';
import Banner from './Banner';
import { getAggregatedStatus, getDDay, getDDayStyle, formatKoreanDate } from '../utils/helpers';

const MOCK_MESSAGES = [
  { id: 1, sender: 'clinic', name: '치과 (원장님)', text: '안녕하세요. 이번 의뢰건 쉐이드 가이드 사진 보냈습니다. 확인 부탁드려요.', time: '오전 10:20', type: 'text' },
  { id: 2, sender: 'clinic', name: '치과 (원장님)', img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=300', filename: 'shade_guide_01.jpg', time: '오전 10:22', type: 'image' },
  { id: 3, sender: 'lab',    name: '나 (이기공)',   text: '네, 원장님. 확인했습니다. 해당 쉐이드에 맞춰서 진행하도록 하겠습니다.',  time: '오전 10:45', read: true, type: 'text' },
];

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-bold text-[#B0B8C1] tracking-widest uppercase mb-4">{children}</p>
);

const OrderDetailView = ({ order, onBack, onAssign }) => {
  const [isEditing,       setIsEditing]       = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState('change');
  const [inputValue,      setInputValue]      = useState('');
  const [showChat,        setShowChat]        = useState(true);

  const safeDoctor            = order.doctor            || '김의사';
  const safeStaff             = order.staff             || '이실장';
  const safeOrderDate         = order.orderDate         || '2026-03-28';
  const safeScanInfo          = order.scanInfo          || '3Shape Communicate';
  const safeShade             = order.shade             || 'D2';
  const safeMemo              = order.memo              || '힐링 16- 50717- 459';
  const safeFuturePlan        = order.futurePlan        || '23년12월 처음 셋팅하시고 깨져서 다시 제작, 24년 11월 셋팅 하신건데 깨져서 오심';
  const safeModificationHistory = order.modificationHistory || [{ version: 'v1', author: '시스템', date: '방금', reason: '초기 생성' }];
  const safePatientHistory    = order.patientHistory    || [];
  const isInsured             = order.insurance === true || order.insurance === '예';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="pb-20"
    >
      {/* ── Top Bar ──────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#8B95A1] hover:text-[#333D4B] transition-colors group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-bold tracking-tight">의뢰 목록으로 돌아가기</span>
        </button>

        <div className="flex gap-2 items-center">
          {/* 채팅 토글 버튼 */}
          <button
            onClick={() => setShowChat(v => !v)}
            title={showChat ? '채팅 닫기' : '채팅 열기'}
            className={`p-2 rounded-[10px] border transition-colors ${
              showChat
                ? 'bg-[#3182F6] border-[#3182F6] text-white shadow-sm'
                : 'bg-white border-[#E5E8EB] text-[#4E5968] hover:bg-[#F9FAFB]'
            }`}
          >
            <MessageSquare size={16} strokeWidth={2} />
          </button>

          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-white border border-[#E5E8EB] text-[#4E5968] px-4 py-2 rounded-[10px] text-[13px] font-bold hover:bg-[#F9FAFB] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-[#3182F6] text-white px-4 py-2 rounded-[10px] text-[13px] font-bold flex items-center gap-1.5 hover:bg-[#2b72d6] transition-colors"
              >
                <Save size={14} /> 변경사항 저장
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white border border-[#E5E8EB] text-[#4E5968] px-4 py-2 rounded-[10px] text-[13px] font-bold hover:bg-[#F9FAFB] transition-colors"
              >
                <Edit2 size={13} className="inline mr-1" /> 수정하기
              </button>
              <button className="bg-[#3182F6] text-white px-4 py-2 rounded-[10px] text-[13px] font-bold hover:bg-[#2b72d6] transition-colors">
                작업 완료 처리
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="flex gap-4 items-start">

        {/* ══ LEFT: Detail Card ══════════════════════════════ */}
        <div className="flex-1 min-w-0">
          <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white rounded-[20px] overflow-y-auto h-[calc(100vh-140px)] sticky top-[100px] custom-scrollbar"
          >

            {/* Section 1: 환자 헤더 */}
            <div className="px-8 pt-8 pb-6 border-b border-[#F2F4F6]">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={order.patient}
                        className="text-[22px] font-bold text-[#191F28] border-b border-[#3182F6] outline-none w-36 pb-0.5"
                      />
                    ) : (
                      <h3 className="text-[22px] font-bold text-[#191F28] tracking-tight">{order.patient}</h3>
                    )}
                    <StatusBadge status={getAggregatedStatus(order.items)} />
                    <span className="bg-[#F2F4F6] text-[#8B95A1] px-2 py-0.5 rounded-[6px] text-[11px] font-bold">재제작</span>
                  </div>
                  <p className="text-[14px] text-[#8B95A1] font-medium">{order.clinic}</p>
                </div>

                {/* D-day 뱃지 */}
                <div className="text-right flex flex-col items-end">
                  <p className="text-[11px] text-[#B0B8C1] font-bold mb-1.5 tracking-wider uppercase">D-day</p>
                  <div className={`px-2.5 py-1 rounded-[8px] font-bold text-[14px] ${getDDayStyle(getDDay(order.deadline))}`}>
                    {getDDay(order.deadline)}
                  </div>
                </div>
              </div>

              {/* 4-col 정보 그리드: 스캔 정보 → 마감일로 교체 */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {[
                  { label: '담당 의사',   value: safeDoctor },
                  { label: '치과위생사',  value: safeStaff },
                  { label: '접수일',      value: formatKoreanDate(safeOrderDate) },
                  { label: '마감일',      value: formatKoreanDate(order.deadline) },
                ].map((info, idx) => (
                  <div key={idx}>
                    <p className="text-[11px] text-[#B0B8C1] font-semibold mb-1">{info.label}</p>
                    <p className="text-[13px] font-semibold text-[#4E5968]">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: 보철 및 치식 정보 */}
            <div className="px-8 py-6 border-b border-[#F2F4F6]">
              <SectionLabel>보철 및 치식 정보</SectionLabel>
              <div className="space-y-8">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-4">
                    {idx > 0 && <div className="h-[1px] bg-[#F2F4F6] mb-2" />}
                    <div className="flex justify-between items-start">
                      <div>
                        {/* ★ material 색상 → gray-800 */}
                        <h5 className="text-[15px] font-semibold text-[#333D4B]">{item.material}</h5>
                        <p className="text-[13px] font-medium text-[#8B95A1] mt-0.5">{item.type}</p>
                      </div>

                      {/* 작업자 · 진행상태: 높이 일치 */}
                      <div className="flex items-start gap-8">
                        <div className="flex flex-col items-end gap-1.5">
                          <p className="text-[11px] text-[#B0B8C1] font-semibold">작업자</p>
                          <div className="h-[32px] flex items-center">
                            <TechnicianSelect
                              name={item.technician}
                              onAssign={(tch) => onAssign(order.id, idx, tch)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <p className="text-[11px] text-[#B0B8C1] font-semibold">진행 상태</p>
                          {/* ★ 상세 뷰에서는 bg 칩 표시 */}
                          <div className="h-[32px] flex items-center">
                            <StatusBadge status={item.status} withBg />
                          </div>
                        </div>
                      </div>
                    </div>
                    <TeethGrid teeth={item.teeth} fill={true} />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: 스캔 정보 (독립 섹션으로 이동) */}
            <div className="px-8 py-6 border-b border-[#F2F4F6]">
              <SectionLabel>스캔 정보</SectionLabel>
              <p className="text-[15px] font-semibold text-[#333D4B]">{safeScanInfo}</p>
              <p className="text-[12px] text-[#8B95A1] font-medium mt-1">스캔 시스템</p>
            </div>

            {/* Section 4: 쉐이드 */}
            <div className="px-8 py-6 border-b border-[#F2F4F6]">
              <SectionLabel>쉐이드</SectionLabel>
              {/* ★ shade 색상 → gray-800 */}
              <p className="text-[16px] font-bold text-[#333D4B] mb-1">{safeShade}</p>
              <p className="text-[12px] text-[#8B95A1] font-medium mb-4">쉐이드</p>
              <div className="flex gap-3">
                {[1, 2].map(i => (
                  <div key={i} className="w-[140px] h-[140px] bg-[#F9FAFB] rounded-[14px] overflow-hidden border border-[#E5E8EB]">
                    <img
                      src={i === 1
                        ? 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=300'
                        : 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=300'}
                      alt="Shade"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: 추가 정보 */}
            <div className="px-8 py-6 border-b border-[#F2F4F6]">
              <SectionLabel>추가 정보</SectionLabel>

              {/* ★ 보험 배너 */}
              <div className="mb-5">
                <Banner
                  variant={isInsured ? 'success' : 'notice'}
                  message={isInsured ? '보험 적용 대상 의뢰건입니다.' : '보험 미적용 의뢰건입니다.'}
                />
              </div>

              <div className="mb-5">
                <p className="text-[12px] text-[#8B95A1] font-semibold mb-1.5">메모</p>
                {isEditing ? (
                  <textarea
                    className="w-full bg-[#F9FAFB] border border-[#E5E8EB] p-3.5 rounded-[12px] outline-none text-[14px] text-[#191F28] font-medium resize-none min-h-[80px]"
                    defaultValue={safeMemo}
                  />
                ) : (
                  <p className="text-[14px] text-[#191F28] font-medium leading-relaxed">{safeMemo}</p>
                )}
              </div>
              <div>
                <p className="text-[12px] text-[#8B95A1] font-semibold mb-1.5">향후 보철 계획</p>
                <p className="text-[14px] text-[#191F28] font-medium leading-relaxed whitespace-pre-wrap">{safeFuturePlan}</p>
              </div>
            </div>

            {/* Section 6: 상세 히스토리 */}
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <SectionLabel>상세 히스토리</SectionLabel>
                <div className="flex bg-[#F2F4F6] p-1 rounded-[8px]">
                  {[
                    { key: 'change',  label: '의뢰 변경 이력' },
                    { key: 'patient', label: '환자 사전 정보' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveHistoryTab(tab.key)}
                      className={`px-3 py-1.5 text-[12px] font-bold rounded-[6px] transition-colors ${
                        activeHistoryTab === tab.key
                          ? 'bg-white text-[#333D4B] shadow-sm'
                          : 'text-[#8B95A1] hover:text-[#4E5968]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-h-[260px] overflow-y-auto pr-1">
                {activeHistoryTab === 'change'
                  ? <HistoryTimeline history={safeModificationHistory} type="version" />
                  : <HistoryTimeline history={safePatientHistory}      type="patient" />}
              </div>
            </div>

          </motion.div>
        </div>

        {/* ══ RIGHT: Chat Panel (toggleable) ═════════════════ */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, x: 28, width: 340 }}
              animate={{ opacity: 1, x: 0,  width: 340 }}
              exit={{   opacity: 0, x: 28,  width: 0   }}
              transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="shrink-0 overflow-hidden"
              style={{ width: 340 }}
            >
              <div
                className="flex flex-col h-[calc(100vh-140px)] sticky top-[100px]"
                style={{ width: 340 }}
              >
                {/* 치과명 헤더 */}
                <div className="flex items-center gap-2 px-1 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#F2F4F6] flex items-center justify-center text-[#B0B8C1]">
                    <User size={14} />
                  </div>
                  <span className="text-[13px] font-bold text-[#333D4B]">{order.clinic}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] ml-0.5" />
                  <span className="text-[11px] font-semibold text-[#B0B8C1]">실시간 소통 가능</span>
                </div>

                {/* 메시지 목록 */}
                <div className="flex-1 overflow-y-auto px-1 py-2 flex flex-col gap-4 custom-scrollbar">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-[1px] bg-[#F2F4F6]" />
                    <span className="text-[10px] font-bold text-[#C9CDD3]">2026.03.28</span>
                    <div className="flex-1 h-[1px] bg-[#F2F4F6]" />
                  </div>

                  {MOCK_MESSAGES.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-1 ${
                        msg.sender === 'lab'
                          ? 'items-end self-end max-w-[88%]'
                          : 'items-start max-w-[88%]'
                      }`}
                    >
                      <span className={`text-[10px] font-bold px-0.5 ${msg.sender === 'lab' ? 'text-[#3182F6]' : 'text-[#8B95A1]'}`}>
                        {msg.name}
                      </span>
                      {msg.type === 'text' && (
                        <div className={`px-3.5 py-2.5 rounded-[14px] ${
                          msg.sender === 'lab'
                            ? 'bg-[#3182F6] rounded-tr-[4px]'
                            : 'bg-white border border-[#EAECEF] rounded-tl-[4px]'
                        }`}>
                          <p className={`text-[13px] font-medium leading-[1.6] ${msg.sender === 'lab' ? 'text-white' : 'text-[#4E5968]'}`}>
                            {msg.text}
                          </p>
                        </div>
                      )}
                      {msg.type === 'image' && (
                        <div className="bg-white border border-[#EAECEF] rounded-[14px] rounded-tl-[4px] overflow-hidden">
                          <img src={msg.img} alt={msg.filename} className="w-full max-w-[200px] object-cover" />
                          <div className="px-3 py-2 flex items-center gap-1.5">
                            <FileText size={12} className="text-[#3182F6]" />
                            <span className="text-[11px] font-semibold text-[#4E5968]">{msg.filename}</span>
                          </div>
                        </div>
                      )}
                      <div className={`flex items-center gap-1.5 px-0.5 ${msg.sender === 'lab' ? 'flex-row-reverse' : ''}`}>
                        {msg.read && <span className="text-[10px] text-[#B0B8C1] font-medium">읽음</span>}
                        <span className="text-[10px] text-[#C9CDD3] font-medium">{msg.time}</span>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-[1px] bg-[#F2F4F6]" />
                    <span className="text-[10px] font-semibold text-[#C9CDD3] whitespace-nowrap">채팅 내용이 기록되었습니다</span>
                    <div className="flex-1 h-[1px] bg-[#F2F4F6]" />
                  </div>
                </div>

                {/* 입력 영역 */}
                <div className="pt-3">
                  <div className="flex gap-1.5 mb-3 flex-wrap px-1">
                    {['쉐이드 확인 요청', '일정 문의', '수정 요청'].map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setInputValue(q)}
                        className="px-2.5 py-1 bg-[#F2F4F6] text-[#8B95A1] font-semibold text-[11px] rounded-full hover:bg-[#E5E8EB] hover:text-[#4E5968] transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <div className="bg-white rounded-[20px] border border-[#E8EAED] shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow">
                    <textarea
                      rows="2"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="치과에 보낼 메시지를 입력하세요"
                      className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-[#191F28] px-5 pt-4 pb-2 placeholder-[#C9CDD3] resize-none scrollbar-hide leading-relaxed"
                    />
                    <div className="flex items-center justify-between px-4 pb-3.5 pt-1">
                      <div className="flex items-center gap-3 text-[#B0B8C1]">
                        <button className="hover:text-[#4E5968] transition-colors"><Plus  size={18} strokeWidth={2} /></button>
                        <button className="hover:text-[#4E5968] transition-colors"><Globe size={16} strokeWidth={2} /></button>
                        <button className="hover:text-[#4E5968] transition-colors"><Type  size={15} strokeWidth={2} /></button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-[#B0B8C1] hover:text-[#4E5968] transition-colors">
                          <Mic size={18} strokeWidth={2} />
                        </button>
                        <button className={`w-8 h-8 flex items-center justify-center rounded-full transition-all shrink-0 ${
                          inputValue.trim()
                            ? 'bg-gradient-to-br from-[#FF7B54] to-[#FF4D4D] text-white shadow-md'
                            : 'bg-[#F2F4F6] text-[#C9CDD3]'
                        }`}>
                          <Send size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default OrderDetailView;
