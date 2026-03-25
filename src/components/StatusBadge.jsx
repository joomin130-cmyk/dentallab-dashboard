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

export default StatusBadge;
