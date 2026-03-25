const TeethGrid = ({ teeth = [], fill = false }) => {
  const ur = teeth.filter(t => /^[1][1-8]$/.test(t));
  const ul = teeth.filter(t => /^[2][1-8]$/.test(t));
  const ll = teeth.filter(t => /^[3][1-8]$/.test(t));
  const lr = teeth.filter(t => /^[4][1-8]$/.test(t));
  const others = teeth.filter(t => !/^[1-4][1-8]$/.test(t));

  return (
    <div className={`flex flex-col gap-1 ${fill ? 'w-full' : 'w-[260px]'}`}>
      {others.length > 0 && (
        <div className="flex gap-1 mb-1">
          {others.map(t => <span key={t} className="text-[14px] font-bold text-[#3182F6] bg-blue-50 px-2.5 py-1 rounded-[8px]">{t}</span>)}
        </div>
      )}
      <div className="flex flex-col w-full h-[120px] bg-[#F9FAFB] rounded-[12px] border border-[#E5E8EB] overflow-hidden relative">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#E5E8EB]"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#E5E8EB]"></div>

        <div className="flex flex-1">
          <div className="flex-1 flex items-end justify-end p-2 gap-1.5 flex-wrap">
            {ur.map(t => <span key={t} className="text-[14px] font-bold text-[#3182F6] bg-[#E8F3FF] px-2 py-1 rounded-[8px] leading-none">{t}</span>)}
          </div>
          <div className="flex-1 flex items-end justify-start p-2 gap-1.5 flex-wrap">
            {ul.map(t => <span key={t} className="text-[14px] font-bold text-[#3182F6] bg-[#E8F3FF] px-2 py-1 rounded-[8px] leading-none">{t}</span>)}
          </div>
        </div>
        <div className="flex flex-1">
          <div className="flex-1 flex items-start justify-end p-2 gap-1.5 flex-wrap">
            {lr.map(t => <span key={t} className="text-[14px] font-bold text-[#3182F6] bg-[#E8F3FF] px-2 py-1 rounded-[8px] leading-none">{t}</span>)}
          </div>
          <div className="flex-1 flex items-start justify-start p-2 gap-1.5 flex-wrap">
            {ll.map(t => <span key={t} className="text-[14px] font-bold text-[#3182F6] bg-[#E8F3FF] px-2 py-1 rounded-[8px] leading-none">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeethGrid;
