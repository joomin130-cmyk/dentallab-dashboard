import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getAggregatedStatus } from '../utils/helpers';

const ListTabCards = ({ data, activeTab, setActiveTab }) => {
  const today = '2024-10-27';

  const stats = useMemo(() => {
    const requested = data.filter(d => getAggregatedStatus(d.items) === '접수').length;
    const unconfirmed = data.filter(d => getAggregatedStatus(d.items) === '접수' && d.items.some(i => i.technician === '미배정')).length;
    const inProgress = data.filter(d => getAggregatedStatus(d.items) === '제작중').length;
    const todayDeadline = data.filter(d => d.deadline === today).length;
    const done = data.filter(d => getAggregatedStatus(d.items) === '배송준비').length;
    const total = data.length;
    return { requested, unconfirmed, inProgress, todayDeadline, done, total };
  }, [data]);

  const tabs = [
    { id: '전체', label: '전체', count: stats.total },
    { id: '요청됨', label: '요청됨', count: stats.requested, badge: stats.unconfirmed > 0 ? `미확인 ${stats.unconfirmed}건` : null },
    { id: '작업중', label: '작업중', count: stats.inProgress },
    { id: '완료', label: '완료', count: stats.done },
  ];

  return (
    <div className="flex bg-[#F2F4F6] p-1 rounded-[12px] gap-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileTap={{ scale: 0.96 }}
            className="flex flex-col items-start px-4 py-3 rounded-[10px] min-w-[110px] text-left relative"
          >
            {isActive && (
              <motion.div
                layoutId="tabPill"
                className="absolute inset-0 bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="text-[12px] font-semibold leading-none tracking-tight text-[#8B95A1] mb-3 relative z-10">{tab.label}</span>
            <div className="flex items-end gap-1.5 relative z-10">
              <div className="flex items-end gap-0.5">
                <motion.span
                  animate={{ color: isActive ? '#333D4B' : '#8B95A1' }}
                  transition={{ duration: 0.2 }}
                  className="text-[18px] font-semibold leading-none tracking-tight"
                >{tab.count}</motion.span>
                <motion.span
                  animate={{ color: isActive ? '#333D4B' : '#8B95A1' }}
                  transition={{ duration: 0.2 }}
                  className="text-[15px] font-bold leading-none pb-[1.5px]"
                >건</motion.span>
              </div>
              {tab.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[5px] bg-[#FFF0F1] text-[#F04452] leading-none pb-[2px]">{tab.badge}</span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ListTabCards;
