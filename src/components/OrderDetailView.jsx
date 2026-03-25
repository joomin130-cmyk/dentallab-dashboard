import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, Edit2, FileText, RotateCcw, ChevronUp } from 'lucide-react';
import StatusBadge from './StatusBadge';
import TeethGrid from './TeethGrid';
import TechnicianSelect from './TechnicianSelect';
import HistoryTimeline from './HistoryTimeline';
import { getAggregatedStatus, formatDate } from '../utils/helpers';

const OrderDetailView = ({ order, onBack, onAssign }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState('change');

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
            transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
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
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
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
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
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
                  <img src={i === 1 ? 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=300' : 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=300'} alt="Shade" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
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
              <p className="text-[13px] text-[#8B95A1] font-medium mb-1.5">향후 보철 계획</p>
              <p className="text-[16px] text-[#191F28] font-medium leading-relaxed whitespace-pre-wrap">{safeFuturePlan}</p>
            </div>
          </motion.div>
        </div>

        <div className="col-span-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
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
                  '치과에서 요청한 의뢰의 내용이 적절한지 분석해 줄래?',
                  '추가적으로 치과 측에 문의하면 좋을 질문이 있을까?',
                  '현재 제작 중인 다른 보철물과의 우선순위를 어떻게 할까?',
                  '원장님과 전화 소통 시 대답을 더 잘 이끌어낼 방법이 있을까?',
                  '특정 치식 부위에 대해 더 깊이 파고들 수 있는 참고 자료를 보여줄래?'
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

export default OrderDetailView;
