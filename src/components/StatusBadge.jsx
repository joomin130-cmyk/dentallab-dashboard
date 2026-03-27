const StatusBadge = ({ status }) => {
  const colors = {
    '요청됨': 'text-amber-600',
    '작업중': 'text-[#3182F6]',
    '발송됨': 'text-purple-600',
    '수거완료': 'text-emerald-600',
  };
  return (
    <span className={`text-[13px] font-semibold whitespace-nowrap ${colors[status] || 'text-slate-500'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
