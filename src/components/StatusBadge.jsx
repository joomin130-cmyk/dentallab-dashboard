const STATUS_CONFIG = {
  '요청됨':  { text: 'text-amber-600',   bg: 'bg-amber-50'     },
  '작업중':  { text: 'text-[#3182F6]',   bg: 'bg-[#EBF3FF]'   },
  '발송됨':  { text: 'text-purple-600',  bg: 'bg-purple-50'    },
  '수거완료': { text: 'text-emerald-600', bg: 'bg-emerald-50'   },
};

/** withBg=true  → 배경 칩 (상세 의뢰 등)
 *  withBg=false → 텍스트만 (기본, 리스트 등) */
const StatusBadge = ({ status, withBg = false }) => {
  const c = STATUS_CONFIG[status] || { text: 'text-slate-500', bg: 'bg-slate-50' };
  return (
    <span
      className={`text-[13px] font-semibold whitespace-nowrap ${c.text} ${
        withBg ? `${c.bg} px-3 py-1.5 rounded-[8px]` : ''
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
