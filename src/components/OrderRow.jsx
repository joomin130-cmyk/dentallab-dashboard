import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Printer, MoreVertical, Edit2 } from 'lucide-react';
import Checkbox from './Checkbox';
import StatusBadge from './StatusBadge';
import TechnicianSelect from './TechnicianSelect';
import { getAggregatedStatus, formatDate } from '../utils/helpers';

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
              <span className="text-[12px] font-medium text-[#B0B8C1]">하단 참조</span>
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
          <div className="mt-1 flex justify-end pr-4">
            <StatusBadge status={mainStatus} />
          </div>
        </td>

        <td className="py-4 align-top">
          <div className="mt-1 flex justify-end pr-4">
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
                animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
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

export default OrderRow;
