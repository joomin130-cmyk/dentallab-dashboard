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

export default HistoryTimeline;
