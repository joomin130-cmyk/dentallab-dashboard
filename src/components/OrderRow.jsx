import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Printer, MoreVertical, Edit2 } from 'lucide-react';
import Checkbox from './Checkbox';
import StatusBadge from './StatusBadge';
import StatusSelect from './StatusSelect';
import TechnicianSelect from './TechnicianSelect';
import { getAggregatedStatus, formatKoreanDate, getDDayLabel, getDDayStyle } from '../utils/helpers';

const OrderRow = ({ order, index = 0, isSelected, onSelect, onAssign, onStatusChange, onDetailClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMultiItem = order.items.length > 1;
  const isCard = isExpanded && isMultiItem;
  const mainStatus = getAggregatedStatus(order.items);
  const unassignedCount = order.items.filter(i => i.technician === '미배정').length;

  const prostheticLabel = isMultiItem
    ? `${order.items[0].type} 외 ${order.items.length - 1}건`
    : `${order.items[0].type} · ${order.items[0].material}`;

  /* ── 부모 행 td 배경 ─────────────────────────────────────
   *  카드 상태  → 흰색 + 상단 라운드 (테두리 없음)
   *  일반 상태  → 호버 배경
   * ─────────────────────────────────────────────────────── */
  const hoverBase = isSelected ? 'bg-blue-50/40' : 'group-hover:bg-[#F9FAFB] transition-colors duration-150';

  const tdFirst = isCard
    ? `py-4 pl-6 pr-3 w-14 align-middle bg-[#F9FAFB] rounded-tl-[14px]`
    : `py-4 pl-6 pr-3 w-14 align-middle ${hoverBase} group-hover:rounded-l-[12px]`;

  const tdMid = isCard
    ? `align-middle bg-[#F9FAFB]`
    : `align-middle ${hoverBase}`;

  const tdLast = isCard
    ? `py-4 pr-6 align-middle bg-[#F9FAFB] rounded-tr-[14px]`
    : `py-4 pr-6 align-middle ${hoverBase} group-hover:rounded-r-[12px]`;

  return (
    <>
      <motion.tr
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={isCard ? {} : { scale: 0.995 }}
        transition={{
          opacity: { duration: 0.32, delay: 0.36 + index * 0.045, ease: [0.25, 0.46, 0.45, 0.94] },
          y: { duration: 0.32, delay: 0.36 + index * 0.045, ease: [0.25, 0.46, 0.45, 0.94] },
          scale: { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        className="group relative z-10"
        onClick={() => { if (isMultiItem) setIsExpanded(!isExpanded); }}
        style={{ cursor: isMultiItem ? 'pointer' : 'default' }}
      >
        {/* 체크박스 */}
        <td className={tdFirst} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          <div className="w-fit cursor-pointer">
            <Checkbox checked={isSelected} onChange={onSelect} />
          </div>
        </td>

        {/* 환자 */}
        <td className={`py-4 ${tdMid}`}>
          <div className="flex flex-col gap-0.5">
            <div
              className="flex items-center gap-1.5 cursor-pointer hover:underline decoration-[#3182F6]/50 underline-offset-2 w-fit"
              onClick={(e) => { e.stopPropagation(); onDetailClick(order); }}
            >
              <span className={`text-[13px] font-semibold tracking-tight transition-colors ${isSelected ? 'text-[#3182F6]' : 'text-[#333D4B]'}`}>{order.patient}</span>
              <span className="text-[12px] text-[#8B95A1] font-medium">{order.clinic}</span>
              {isMultiItem && <span className="text-[10px] font-semibold bg-blue-50 text-[#3182F6] px-1.5 py-0.5 rounded-[8px]">복합</span>}
            </div>
            <span className="text-[12px] text-[#4E5968] font-medium">{prostheticLabel}</span>
          </div>
        </td>

        {/* 치식 */}
        <td className={`py-4 ${tdMid}`}>
          {isMultiItem ? (
            <span className="text-[12px] font-medium text-[#B0B8C1]">하단 참조</span>
          ) : (
            <span className="text-[13px] font-medium text-[#4E5968]">{order.items[0].teeth.join(', ')}</span>
          )}
        </td>

        {/* 접수일 */}
        <td className={`py-4 ${tdMid}`}>
          <span className="text-[13px] font-medium text-[#4E5968]">{formatKoreanDate(order.orderDate)}</span>
        </td>

        {/* 마감일 */}
        <td className={`py-4 ${tdMid}`}>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[#4E5968]">{formatKoreanDate(order.deadline)}</span>
            {getDDayLabel(order.deadline) && (
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-[6px] ${getDDayStyle(order.deadline)}`}>
                {getDDayLabel(order.deadline)}
              </span>
            )}
          </div>
        </td>

        {/* 상태 */}
        <td className={`py-4 ${tdMid}`} onClick={(e) => e.stopPropagation()}>
          {isMultiItem ? (
            <StatusSelect status={mainStatus} onStatusChange={(s) => onStatusChange(order.id, 'all', s)} />
          ) : (
            <StatusSelect status={order.items[0].status} onStatusChange={(s) => onStatusChange(order.id, 0, s)} />
          )}
        </td>

        {/* 작업자 */}
        <td className={`py-4 ${tdMid}`}>
          {isMultiItem ? (
            unassignedCount > 0 ? (
              <TechnicianSelect name={`${unassignedCount}건 미배정`} type="multi-unassigned" onAssign={(tch) => onAssign(order.id, 'all', tch)} />
            ) : (
              <TechnicianSelect name="" type="multi-assigned" />
            )
          ) : (
            <TechnicianSelect name={order.items[0].technician} onAssign={(tch) => onAssign(order.id, 0, tch)} />
          )}
        </td>

        {/* 관리 */}
        <td className={tdLast}>
          <div className="flex items-center justify-start gap-1">
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

      {/* ── 복합 의뢰 펼침 ────────────────────────────────────
       *  부모 행과 동일한 흰색 배경 → 하나의 카드처럼 연결
       * ─────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isExpanded && isMultiItem && (
          <tr className="relative z-0">
            <td
              colSpan="8"
              className="p-0 bg-[#F9FAFB] rounded-bl-[14px] rounded-br-[14px] relative -top-[6px]"
            >
              <motion.div
                initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
                exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                {/* 컬럼 축을 부모 테이블과 맞춘 중첩 테이블 */}
                <table className="w-full table-fixed border-separate border-spacing-0">
                  <colgroup>
                    <col className="w-14" />
                    <col className="w-[220px]" />
                    <col className="w-[130px]" />
                    <col className="w-[110px]" />
                    <col className="w-[120px]" />
                    <col className="w-[110px]" />
                    <col className="w-[130px]" />
                    <col className="w-[80px]" />
                  </colgroup>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 pl-6 pr-3" />
                        <td className="py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[13px] font-medium text-[#333D4B]">{item.type}</span>
                            <span className="text-[11px] font-medium text-[#8B95A1]">{item.material}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-[13px] font-medium text-[#4E5968]">{item.teeth.join(', ')}</span>
                        </td>
                        <td className="py-3" />
                        <td className="py-3" />
                        <td className="py-3" onClick={(e) => e.stopPropagation()}>
                          <StatusSelect
                            status={item.status}
                            onStatusChange={(s) => onStatusChange(order.id, idx, s)}
                          />
                        </td>
                        <td className="py-3 relative z-20">
                          <TechnicianSelect name={item.technician} onAssign={(tch) => onAssign(order.id, idx, tch)} />
                        </td>
                        <td className="py-3 pr-6">
                          <button className="p-1.5 text-[#D1D6DB] hover:text-[#4E5968] rounded-[8px] transition-all hover:bg-[#E5E8EB]">
                            <Edit2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* 카드 하단 여백 */}
                    <tr><td colSpan="8" className="h-2" /></tr>
                  </tbody>
                </table>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderRow;
