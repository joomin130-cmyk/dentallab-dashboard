import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TODAY = '2026-03-28'

const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}



export default function CalendarWidget({ data, selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(new Date('2026-03-01'))
  const [mode, setMode] = useState('deadline')
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  /* 마감일별 의뢰 건수 */
  const deadlineCounts = useMemo(() => {
    const map = {}
    data.forEach(o => {
      if (o.deadline) map[o.deadline] = (map[o.deadline] || 0) + 1
    })
    return map
  }, [data])

  /* 접수일별 의뢰 건수 */
  const requestCounts = useMemo(() => {
    const map = {}
    data.forEach(o => {
      if (o.orderDate) map[o.orderDate] = (map[o.orderDate] || 0) + 1
    })
    return map
  }, [data])

  const counts = mode === 'deadline' ? deadlineCounts : requestCounts

  /* 현재 보이는 월의 총 건수 */
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthTotal = Object.entries(counts)
    .filter(([ds]) => ds.startsWith(monthPrefix))
    .reduce((sum, [, n]) => sum + n, 0)

  /* 캘린더 셀 배열 */
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const handleModeChange = (newMode) => {
    setMode(newMode)
    onSelectDate(null, newMode)
  }

  const handleDayClick = (d) => {
    const ds = toDateStr(year, month, d)
    onSelectDate(selectedDate === ds ? null : ds, mode)
  }

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-[300px] flex-shrink-0 bg-white rounded-[16px] p-5 self-start"
    >
      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-[14px]">
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-bold text-gray-700">
            {year}년 {MONTH_NAMES[month]}
          </span>
          {monthTotal > 0 && (
            <span className="text-[15px] font-bold text-gray-400">{monthTotal}</span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="p-1 rounded-[6px] hover:bg-[#F2F4F6] text-[#8B95A1] hover:text-[#4E5968] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="p-1 rounded-[6px] hover:bg-[#F2F4F6] text-[#8B95A1] hover:text-[#4E5968] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── 모드 토글 ── */}
      <div className="flex items-center gap-1 mb-[14px] bg-[#F2F4F6] rounded-[10px] p-[3px]">
        {[{ key: 'request', label: '요청일' }, { key: 'deadline', label: '마감일' }].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleModeChange(key)}
            className={`
              flex-1 py-[5px] text-[13px] font-semibold rounded-[8px] transition-all duration-150
              ${mode === key ? 'bg-white text-[#191F28]' : 'text-[#8B95A1] hover:text-[#4E5968]'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── 요일 헤더 ── */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[13px] font-semibold py-1
              ${i === 0 ? 'text-[#F04452]' : i === 6 ? 'text-[#3182F6]' : 'text-[#B0B8C1]'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── 날짜 그리드 ── */}
      <div className="grid grid-cols-7 gap-y-[4px]">
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />

          const ds = toDateStr(year, month, d)
          const count = counts[ds] || 0
          const isToday = ds === TODAY
          const isSelected = ds === selectedDate
          const isPast = ds < TODAY
          const dow = (firstDow + d - 1) % 7   // 0=일, 6=토

          return (
            <button
              key={d}
              onClick={() => handleDayClick(d)}
              className={`
                flex flex-col items-center gap-[2px] py-[6px] rounded-[8px]
                transition-colors duration-150
                ${isSelected && !isToday ? 'bg-[#EBF3FF]' : !isSelected ? 'hover:bg-[#F9FAFB]' : ''}
              `}
            >
              {/* 날짜 숫자 */}
              <span className={`
                w-[28px] h-[28px] flex items-center justify-center rounded-full
                text-[14px] font-medium leading-none
                ${isToday ? 'bg-[#3182F6] text-white font-bold' : ''}
                ${!isToday && isPast ? 'text-[#D1D6DB]' : ''}
                ${!isToday && !isPast && dow === 0 ? 'text-[#F04452]' : ''}
                ${!isToday && !isPast && dow === 6 ? 'text-[#3182F6]' : ''}
                ${!isToday && !isPast && dow !== 0 && dow !== 6 ? 'text-[#4E5968]' : ''}
              `}>
                {d}
              </span>

              {/* 건수 뱃지 */}
              {count > 0 && (
                <span className="text-[12px] font-semibold px-[6px] py-[1px] rounded-full leading-[15px] text-gray-300">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── 선택된 날짜 정보 ── */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-[#F2F4F6]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-semibold text-gray-700">
                  {selectedDate.slice(5).replace('-', '월 ')}일 {mode === 'deadline' ? '마감' : '요청'}
                </span>
                <span className="text-[13px] font-bold text-blue-500">
                  {counts[selectedDate] || 0}건
                </span>
              </div>
              <button
                onClick={() => onSelectDate(null)}
                className="w-full py-[8px] text-[12px] font-semibold text-gray-400 hover:text-gray-400 bg-gray-100 hover:bg-gray-200 rounded-[8px] transition-colors font-medium"
              >
                필터 해제
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}
