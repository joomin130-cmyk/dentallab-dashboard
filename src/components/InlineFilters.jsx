import { useState, useMemo, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { getAggregatedStatus } from '../utils/helpers';
import DropdownMenu from './DropdownMenu';

const InlineFilters = ({ data, chipFilters, setChipFilters }) => {
  const today = '2024-10-27';
  const tomorrow = '2024-10-28';
  const startOfWeek = '2024-10-27';
  const endOfWeek = '2024-11-02';

  const counts = useMemo(() => {
    const unconfirmed = data.filter(d => getAggregatedStatus(d.items) === '접수' && d.items.some(i => i.technician === '미배정')).length;
    const unassigned = data.filter(d => d.items.some(i => i.technician === '미배정')).length;
    const todayCount = data.filter(d => d.deadline === today).length;
    const tomorrowCount = data.filter(d => d.deadline === tomorrow).length;
    const weekCount = data.filter(d => d.deadline >= startOfWeek && d.deadline <= endOfWeek).length;
    const clinicCounts = {};
    data.forEach(d => { clinicCounts[d.clinic] = (clinicCounts[d.clinic] || 0) + 1; });
    return { unconfirmed, unassigned, todayCount, tomorrowCount, weekCount, clinicCounts };
  }, [data]);

  const clinics = useMemo(() => {
    return [...new Set(data.map(d => d.clinic))].sort();
  }, [data]);

  const toggle = (key) => setChipFilters(prev => ({ ...prev, [key]: !prev[key] }));

  const clinicOptions = [
    { id: '__all__', label: '전체 치과' },
    ...clinics.map(clinic => ({ id: clinic, label: clinic, count: counts.clinicCounts[clinic] || 0 })),
  ];

  const deadlineOptions = [
    { id: 'today', label: '오늘', count: counts.todayCount },
    { id: 'tomorrow', label: '내일', count: counts.tomorrowCount },
    { id: 'week', label: '이번주', count: counts.weekCount },
  ];

  const chipClass = (active) =>
    `flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-[8px] transition-all cursor-pointer select-none ${active
      ? 'bg-[#F2F4F6] text-[#3182F6]'
      : 'bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]'
    }`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* 치과 dropdown */}
      <DropdownMenu
        label={chipFilters.clinic || '치과'}
        options={clinicOptions}
        selected={chipFilters.clinic}
        onSelect={(id) => setChipFilters(prev => ({ ...prev, clinic: id === '__all__' ? null : id }))}
        minWidth="min-w-[160px]"
        align="left"
      />

      {/* 미확인 */}
      <button onClick={() => toggle('unconfirmed')} className={chipClass(chipFilters.unconfirmed)}>
        미확인
        <span className={`text-[11px] font-bold leading-none ${chipFilters.unconfirmed ? 'text-[#3182F6]' : 'text-[#B0B8C1]'}`}>
          {counts.unconfirmed}
        </span>
      </button>

      {/* 미배정 */}
      <button onClick={() => toggle('unassigned')} className={chipClass(chipFilters.unassigned)}>
        미배정
        <span className={`text-[11px] font-bold leading-none ${chipFilters.unassigned ? 'text-[#3182F6]' : 'text-[#B0B8C1]'}`}>
          {counts.unassigned}
        </span>
      </button>

      {/* 마감일 dropdown */}
      <DropdownMenu
        label={chipFilters.deadline ? (deadlineOptions.find(d => d.id === chipFilters.deadline)?.label ?? '마감일') : '마감일'}
        options={deadlineOptions}
        selected={chipFilters.deadline}
        onSelect={(id) => setChipFilters(prev => ({ ...prev, deadline: prev.deadline === id ? null : id }))}
        minWidth="min-w-[120px]"
        align="left"
      />

      {/* 전체 해제 */}
      {(chipFilters.clinic || chipFilters.unconfirmed || chipFilters.unassigned || chipFilters.deadline) && (
        <button
          onClick={() => setChipFilters({ clinic: null, unconfirmed: false, unassigned: false, deadline: null })}
          className="flex items-center gap-1 text-[12px] font-semibold text-[#8B95A1] hover:text-[#F04452] transition-colors px-2"
        >
          <RotateCcw size={11} /> 전체 해제
        </button>
      )}
    </div>
  );
};

export default InlineFilters;
