import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import Checkbox from './Checkbox';
import StatusBadge from './StatusBadge';
import { getAggregatedStatus, simplifyMaterial, getDDay, getDDayStyle } from '../utils/helpers';

const OrderCard = ({ order, isSelected, onSelect, onAssign, onDetailClick }) => {
  const allTeeth = Array.from(new Set(order.items.flatMap(item => item.teeth)));
  const mainStatus = getAggregatedStatus(order.items);
  const isMultiItem = order.items.length > 1;
  const dday = getDDay(order.deadline);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`p-5 rounded-[16px] flex flex-col justify-between transition-colors group relative shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${isSelected ? 'bg-blue-50/60' : 'bg-white'}`}
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
        <div className="flex items-center">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[6px] ${getDDayStyle(dday)}`}>
            {dday}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
