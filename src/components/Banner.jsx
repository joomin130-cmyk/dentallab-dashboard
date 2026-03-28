import { Sparkles, Info, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Banner — 상황별 배너 컴포넌트
 *
 * variant  | 용도                        | 배경
 * -------- | --------------------------- | --------------------------------
 * notice   | 기능 안내 · 인사이트 유도    | 보라 그라디언트 + shimmer 모션
 * warning  | 액션 필요 · 미완료 항목 안내 | 앰버 (주황)
 * success  | 완료 · 저장 성공 알림        | 에메랄드
 * error    | 오류 · 실패 알림             | 레드
 */

/* ── Framer Motion variants ──────────────────────────── */

// 배너 전체: 진입 애니메이션 + hover scale + tap press
const bannerMotion = {
  initial: { opacity: 0, y: -8, scale: 1 },
  rest:    { opacity: 1, y:  0, scale: 1,     transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
  hover:   { opacity: 1, y:  0, scale: 1.012, transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } },
  tap:     { opacity: 1, y:  0, scale: 0.984, transition: { duration: 0.12, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// 빛줄기 shimmer: hover 진입 시 좌→우 1회 스윕
const shimmerMotion = {
  rest:  { x: '-130%' },
  hover: {
    x: '230%',
    transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
  },
}

// ✦ 스파클 아이콘: hover 시 흔들림 + 살짝 확대
const sparkleMotion = {
  rest:  { rotate: 0, scale: 1 },
  hover: {
    rotate: [0, -18, 16, -10, 8, 0],
    scale:  [1, 1.25, 1.2, 1.15, 1.1, 1.15],
    transition: {
      duration: 0.55,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: 'easeInOut',
    },
  },
}

// 텍스트: hover 시 오른쪽으로 2px 살짝 이동
const textMotion = {
  rest:  { x: 0 },
  hover: { x: 3, transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] } },
}

/* ── Variant 스타일 테이블 ────────────────────────────── */

const VARIANTS = {
  notice: {
    wrapper:    'bg-gradient-to-r from-[#EDE9FE] to-[#EBF0FA]',
    text:       'text-[#6D28D9]',
    btnBase:    'bg-[#7C3AED] hover:bg-[#6D28D9] text-white',
    closeColor: 'text-[#7C3AED]',
  },
  warning: {
    wrapper:    'bg-[#FFF7ED]',
    text:       'text-[#92400E]',
    btnBase:    'bg-[#F97316] hover:bg-[#EA580C] text-white',
    closeColor: 'text-[#F97316]',
  },
  success: {
    wrapper:    'bg-[#ECFDF5]',
    text:       'text-[#065F46]',
    btnBase:    'bg-[#059669] hover:bg-[#047857] text-white',
    closeColor: 'text-[#059669]',
  },
  error: {
    wrapper:    'bg-[#FFF0F1]',
    text:       'text-[#9F1239]',
    btnBase:    'bg-[#F04452] hover:bg-[#E11D48] text-white',
    closeColor: 'text-[#F04452]',
  },
}

/* ── 아이콘 (variant별 별도 정의) ───────────────────── */

function NoticeIcon() {
  return (
    <motion.span variants={sparkleMotion} className="shrink-0 flex items-center">
      <Sparkles size={15} strokeWidth={2} className="text-[#7C3AED]" />
    </motion.span>
  )
}

function WarningIcon() {
  return (
    <Info
      size={15}
      strokeWidth={2}
      className="text-[#F97316] shrink-0"
      fill="#F97316"
      fillOpacity={0.15}
    />
  )
}

function SuccessIcon() {
  return <CheckCircle2 size={15} strokeWidth={2} className="text-[#059669] shrink-0" />
}

function ErrorIcon() {
  return <AlertCircle size={15} strokeWidth={2} className="text-[#F04452] shrink-0" />
}

const ICONS = {
  notice:  <NoticeIcon />,
  warning: <WarningIcon />,
  success: <SuccessIcon />,
  error:   <ErrorIcon />,
}

/* ── 컴포넌트 ────────────────────────────────────────── */

export default function Banner({
  variant     = 'notice',
  message,
  action,
  onAction,
  onClick,
  dismissible = false,
  onDismiss,
}) {
  const v        = VARIANTS[variant] ?? VARIANTS.notice
  const icon     = ICONS[variant]    ?? ICONS.notice
  const isNotice = variant === 'notice'

  return (
    <motion.div
      /* notice: variant 시스템으로 진입 + hover + tap 통합 관리 */
      /* 그 외: 단순 진입 애니메이션만 */
      variants={isNotice ? bannerMotion : undefined}
      initial={isNotice ? 'initial' : { opacity: 0, y: -8 }}
      animate={isNotice ? 'rest'    : { opacity: 1, y:  0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={isNotice ? undefined : { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={isNotice ? 'hover' : undefined}
      whileTap={isNotice && onClick ? 'tap' : undefined}

      onClick={onClick}
      className={`
        relative overflow-hidden
        w-full flex items-center justify-between gap-3
        px-5 py-[14px] rounded-[12px]
        ${v.wrapper}
        ${onClick ? 'cursor-pointer select-none' : ''}
      `}
    >
      {/* ── shimmer 레이어 (notice 전용) ── */}
      {isNotice && (
        <motion.span
          variants={shimmerMotion}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.55) 50%, transparent 75%)',
          }}
        />
      )}

      {/* ── 좌측: 아이콘 + 메시지 ── */}
      <div className="relative z-10 flex items-center gap-2.5 min-w-0">
        {icon}
        <motion.span
          variants={isNotice ? textMotion : undefined}
          className={`text-[13px] font-medium leading-snug ${v.text}`}
        >
          {message}
        </motion.span>
      </div>

      {/* ── 우측: CTA 버튼 · 닫기 버튼 ── */}
      {(action || dismissible) && (
        <div className="relative z-10 flex items-center gap-2 shrink-0">
          {action && (
            <button
              onClick={(e) => { e.stopPropagation(); onAction?.() }}
              className={`
                px-4 py-[6px] text-[13px] font-semibold rounded-[8px]
                transition-colors duration-150
                ${v.btnBase}
              `}
            >
              {action}
            </button>
          )}

          {dismissible && (
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss?.() }}
              className="p-1 rounded-[6px] hover:bg-black/5 transition-colors duration-150"
              aria-label="닫기"
            >
              <X size={14} className={v.closeColor} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
