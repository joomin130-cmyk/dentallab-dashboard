export const simplifyMaterial = (material) => {
  if (!material) return '';
  return material.split('/')[0].trim();
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}.${d.getDate()}`;
};

export const formatKoreanDate = (dateStr) => {
  if (!dateStr) return '-';
  const parts = dateStr.includes('-') ? dateStr.split('-') : dateStr.split('.');
  const year = parseInt(parts[0]) % 100; // 4자리 → 2자리
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  return `${year}년 ${month}월 ${day}일`;
};

export const getAggregatedStatus = (items) => {
  const statusPriority = { '요청됨': 0, '작업중': 1, '발송됨': 2, '수거완료': 3 };
  let minPriority = 4;
  let status = items[0].status;
  items.forEach(item => {
    if (statusPriority[item.status] < minPriority) {
      minPriority = statusPriority[item.status];
      status = item.status;
    }
  });
  return status;
};

// diff: 양수 = 남은 일수, 0 = 오늘, 음수 = 지남
export const getDDayDiff = (dateStr) => {
  const today = new Date('2026-03-28');
  const target = new Date(dateStr);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

// 구 API 호환용 (OrderCard, OrderDetailView)
export const getDDay = (dateStr) => {
  const diff = getDDayDiff(dateStr);
  if (diff === 0) return '오늘 마감';
  if (diff < 0) return `D+${Math.abs(diff)}`;
  return `D-${diff}`;
};

// D-day 뱃지 레이블 (D-3 이내 또는 지난 건만 표시, 나머지 null)
export const getDDayLabel = (dateStr) => {
  const diff = getDDayDiff(dateStr);
  if (diff === 0) return '오늘';
  if (diff < 0) return `D+${Math.abs(diff)}`;
  if (diff <= 3) return `D-${diff}`;
  return null;
};

// 뱃지 색상: 오늘·지남 = 빨강, D-1~D-3 = 회색
// dateStr(날짜 문자열) 또는 ddayLabel(문자열) 모두 수용
export const getDDayStyle = (input) => {
  // 날짜 문자열이면 diff 계산, 아니면 레이블 파싱
  if (input && input.includes('-') && input.length > 4) {
    const diff = getDDayDiff(input);
    if (diff <= 0) return 'bg-[#FFF0F1] text-[#F04452]';
    return 'bg-[#F2F4F6] text-[#8B95A1]';
  }
  // 레이블 문자열 (구 API 호환)
  if (input === '오늘 마감' || (input && input.startsWith('D+'))) return 'bg-[#FFF0F1] text-[#F04452]';
  return 'bg-[#F2F4F6] text-[#8B95A1]';
};
