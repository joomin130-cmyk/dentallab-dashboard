/**
 * ─────────────────────────────────────────────
 *  Diil Design Tokens — Color Palette
 * ─────────────────────────────────────────────
 *
 *  사용 방법
 *  import { colors } from '@/constants/colors';
 *  style={{ color: colors.neutral[700] }}
 */

export const colors = {

  /* ── Neutral ─────────────────────────────────
   *  텍스트 · 배경 · 테두리 · 아이콘에 사용
   * ─────────────────────────────────────────── */
  neutral: {
    900: '#191F28',   // 최상위 제목 (heading)
    800: '#333D4B',   // 기본 본문 텍스트 (body)
    700: '#4E5968',   // 보조 텍스트 (secondary label)
    500: '#8B95A1',   // 비활성 · 힌트 텍스트
    400: '#B0B8C1',   // placeholder · 비활성 아이콘
    300: '#D1D6DB',   // 구분선 · 비활성 보더
    200: '#E5E8EB',   // hover 배경 · 서브 보더
    100: '#F2F4F6',   // 페이지 배경 (page bg)
    50:  '#F9FAFB',   // 카드 대체 배경 (surface alt)
    0:   '#FFFFFF',   // 카드 · 패널 배경 (surface)
  },

  /* ── Primary (Blue) ──────────────────────────
   *  주요 액션 · 링크 · 선택 상태에 사용
   * ─────────────────────────────────────────── */
  primary: {
    700: '#1A5DC8',   // pressed (강조 클릭)
    600: '#2272D6',   // hover (버튼 마우스오버)
    500: '#3182F6',   // default (주 액션 버튼)
    400: '#5A9EF8',   // soft (서브 강조)
    100: '#EBF3FF',   // tint (활성 배경 · 선택 행)
    50:  '#F0F7FF',   // subtle (드롭다운 hover)
  },

  /* ── Status ──────────────────────────────────
   *  보철 의뢰 진행 상태에 사용
   * ─────────────────────────────────────────── */
  status: {
    requested: {
      text: '#D97706',   // 요청됨  — amber
      bg:   '#FEF3C7',
      dot:  '#F59E0B',
    },
    inProgress: {
      text: '#3182F6',   // 작업중  — blue (primary 재사용)
      bg:   '#EBF3FF',
      dot:  '#3182F6',
    },
    shipped: {
      text: '#7C3AED',   // 발송됨  — violet
      bg:   '#EDE9FE',
      dot:  '#8B5CF6',
    },
    collected: {
      text: '#059669',   // 수거완료 — emerald
      bg:   '#D1FAE5',
      dot:  '#10B981',
    },
  },

  /* ── Semantic ────────────────────────────────
   *  시스템 피드백 (성공 · 오류 · 경고)
   * ─────────────────────────────────────────── */
  semantic: {
    success: {
      text: '#059669',
      bg:   '#ECFDF5',
      icon: '#0CC452',
    },
    danger: {
      text: '#E11D48',
      bg:   '#FFF0F1',
      icon: '#F04452',
    },
    warning: {
      text: '#D97706',
      bg:   '#FFFBEB',
      icon: '#F59E0B',
    },
  },
};

/* ── CSS Variable Map (참고용) ──────────────────
 *  index.css 에 추가해 Tailwind arbitrary value 로 사용 가능
 *
 *  :root {
 *    --color-bg:          #F2F4F6;
 *    --color-surface:     #FFFFFF;
 *    --color-text:        #333D4B;
 *    --color-text-sub:    #8B95A1;
 *    --color-border:      #E5E8EB;
 *    --color-primary:     #3182F6;
 *    --color-primary-bg:  #EBF3FF;
 *  }
 * ─────────────────────────────────────────── */
