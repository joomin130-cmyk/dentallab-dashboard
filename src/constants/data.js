// 오늘: 2026-03-28 기준 / 접수일: ~2개월 전(01-28~), 마감일: ~2개월 후(~05-28)
export const INITIAL_DATA = [

  // ── 오늘 마감 ────────────────────────────────────────────────────────────
  { id: '1',  patient: '김철수',   clinic: '서울바른치과',   orderDate: '2026-03-21', deadline: '2026-03-28', priority: 'urgent', items: [{ type: '크라운',        material: 'Zirconia / SCRP / Non-Vital',  teeth: ['11', '12'],       status: '작업중',  technician: '이기공' }, { type: '어버트먼트', material: 'Custom Abutment / Ti', teeth: ['11'], status: '요청됨', technician: '미배정' }] },
  { id: '2',  patient: '임꺽정',   clinic: '연세미소치과',   orderDate: '2026-03-19', deadline: '2026-03-28', priority: 'urgent', items: [{ type: '임플란트',      material: 'Ti-Base',                      teeth: ['46'],             status: '작업중',  technician: '박기공' }] },
  { id: '3',  patient: '이순신',   clinic: '하늘치과',       orderDate: '2026-03-17', deadline: '2026-03-28', priority: 'urgent', items: [{ type: '크라운',        material: 'Gold',                         teeth: ['47'],             status: '작업중',  technician: '김기공' }] },

  // ── D-1 ~ D-3 ────────────────────────────────────────────────────────────
  { id: '4',  patient: '이영희',   clinic: '연세미소치과',   orderDate: '2026-03-22', deadline: '2026-03-29', priority: 'high',   items: [{ type: '크라운',        material: 'PFM / Base Metal',             teeth: ['36', '37'],       status: '작업중',  technician: '김기공' }] },
  { id: '5',  patient: '안중근',   clinic: '미소지음치과',   orderDate: '2026-03-24', deadline: '2026-03-29', priority: 'high',   items: [{ type: '크라운',        material: 'Zirconia',                     teeth: ['12'],             status: '발송됨',  technician: '이기공' }] },
  { id: '6',  patient: '강하늘',   clinic: '미소지음치과',   orderDate: '2026-03-24', deadline: '2026-03-30', priority: 'high',   items: [{ type: '브릿지',        material: 'Zirconia / Monolithic',        teeth: ['14', '15', '16'], status: '작업중',  technician: '이기공' }] },
  { id: '7',  patient: '박지민',   clinic: '미래플란트치과', orderDate: '2026-03-18', deadline: '2026-03-30', priority: 'high',   items: [{ type: '인레이',        material: 'E-max / Ceramic',              teeth: ['44', '45'],       status: '수거완료', technician: '최기공' }] },
  { id: '8',  patient: '정민수',   clinic: '하늘치과',       orderDate: '2026-03-23', deadline: '2026-03-31', priority: 'medium', items: [{ type: '서지컬 가이드', material: 'Surgical Resin',               teeth: ['21', '22', '23'], status: '작업중',  technician: '미배정' }] },

  // ── 이번 주 후반 / 다음 주 ───────────────────────────────────────────────
  { id: '9',  patient: '최윤서',   clinic: '튼튼치과',       orderDate: '2026-03-20', deadline: '2026-04-01', priority: 'medium', items: [{ type: '덴처',          material: 'Full Denture / Acrylic',       teeth: ['Upper'],          status: '발송됨',  technician: '김기공' }, { type: '개인 트레이', material: 'Custom Tray Resin', teeth: ['Lower'], status: '작업중', technician: '미배정' }] },
  { id: '10', patient: '홍길동',   clinic: '서울바른치과',   orderDate: '2026-03-25', deadline: '2026-04-01', priority: 'medium', items: [{ type: '크라운',        material: 'Zirconia / SCRP',              teeth: ['25'],             status: '요청됨',  technician: '미배정' }] },
  { id: '11', patient: '유관순',   clinic: '튼튼치과',       orderDate: '2026-03-22', deadline: '2026-04-02', priority: 'medium', items: [{ type: '덴처',          material: 'Partial Denture',              teeth: ['Lower'],          status: '요청됨',  technician: '미배정' }] },
  { id: '12', patient: '장희빈',   clinic: '미래플란트치과', orderDate: '2026-03-26', deadline: '2026-04-02', priority: 'low',    items: [{ type: '가이드',        material: 'Resin',                        teeth: ['11', '21'],       status: '요청됨',  technician: '미배정' }] },
  { id: '13', patient: '신사임당', clinic: '서울바른치과',   orderDate: '2026-03-25', deadline: '2026-04-04', priority: 'low',    items: [{ type: '라미네이트',    material: 'E-max / Lithium Disilicate',   teeth: ['11', '12', '21', '22'], status: '요청됨', technician: '이기공' }] },
  { id: '14', patient: '세종대왕', clinic: '하늘치과',       orderDate: '2026-03-26', deadline: '2026-04-04', priority: 'medium', items: [{ type: '크라운',        material: 'Zirconia / SCRP',              teeth: ['16'],             status: '작업중',  technician: '박기공' }, { type: '크라운', material: 'Zirconia / SCRP', teeth: ['26'], status: '작업중', technician: '박기공' }] },

  // ── 4월 초중순 ───────────────────────────────────────────────────────────
  { id: '15', patient: '을지문덕', clinic: '연세미소치과',   orderDate: '2026-03-27', deadline: '2026-04-07', priority: 'medium', items: [{ type: '브릿지',        material: 'PFM / High Noble',             teeth: ['34', '35', '36'], status: '요청됨',  technician: '미배정' }] },
  { id: '16', patient: '황진이',   clinic: '미소지음치과',   orderDate: '2026-03-27', deadline: '2026-04-07', priority: 'low',    items: [{ type: '인레이',        material: 'Gold',                         teeth: ['15', '16'],       status: '요청됨',  technician: '최기공' }] },
  { id: '17', patient: '논개',     clinic: '튼튼치과',       orderDate: '2026-03-28', deadline: '2026-04-09', priority: 'low',    items: [{ type: '어버트먼트',    material: 'Stock Abutment / Ti',          teeth: ['36'],             status: '요청됨',  technician: '미배정' }] },
  { id: '18', patient: '김유신',   clinic: '미래플란트치과', orderDate: '2026-03-28', deadline: '2026-04-11', priority: 'low',    items: [{ type: '서지컬 가이드', material: 'Surgical Resin',               teeth: ['13', '14', '15'], status: '요청됨',  technician: '미배정' }] },
  { id: '19', patient: '이율곡',   clinic: '서울바른치과',   orderDate: '2026-03-28', deadline: '2026-04-14', priority: 'low',    items: [{ type: '크라운',        material: 'Zirconia / Monolithic',        teeth: ['27'],             status: '요청됨',  technician: '미배정' }, { type: '크라운', material: 'Zirconia / Monolithic', teeth: ['37'], status: '요청됨', technician: '미배정' }, { type: '크라운', material: 'Zirconia / Monolithic', teeth: ['46'], status: '요청됨', technician: '미배정' }] },
  { id: '20', patient: '허난설헌', clinic: '하늘치과',       orderDate: '2026-03-27', deadline: '2026-04-14', priority: 'low',    items: [{ type: '덴처',          material: 'Full Denture / Thermosens',    teeth: ['Upper', 'Lower'], status: '요청됨',  technician: '미배정' }] },

  // ── 추가 10건 ─────────────────────────────────────────────────────────────

  // 과거 접수 + 이미 완료/발송
  { id: '21', patient: '강감찬',   clinic: '서울바른치과',   orderDate: '2026-01-30', deadline: '2026-02-10', priority: 'high',   items: [{ type: '크라운',        material: 'Zirconia / Monolithic',        teeth: ['16'],             status: '발송됨',  technician: '이기공' }] },
  { id: '22', patient: '원효대사', clinic: '미소지음치과',   orderDate: '2026-02-05', deadline: '2026-02-17', priority: 'medium', items: [{ type: '인레이',        material: 'E-max / Press',                teeth: ['24', '25'],       status: '수거완료', technician: '최기공' }] },
  { id: '23', patient: '최치원',   clinic: '튼튼치과',       orderDate: '2026-02-10', deadline: '2026-02-20', priority: 'medium', items: [{ type: '브릿지',        material: 'PFM / Base Metal',             teeth: ['44', '45', '46'], status: '발송됨',  technician: '김기공' }] },
  { id: '24', patient: '장보고',   clinic: '하늘치과',       orderDate: '2026-02-14', deadline: '2026-02-25', priority: 'high',   items: [{ type: '임플란트',      material: 'Ti-Base / Abutment',           teeth: ['36'],             status: '수거완료', technician: '박기공' }, { type: '크라운', material: 'Zirconia / Monolithic', teeth: ['36'], status: '수거완료', technician: '이기공' }] },

  // 3월 초중순 접수 + 현재 작업중
  { id: '25', patient: '김홍도',   clinic: '연세미소치과',   orderDate: '2026-03-03', deadline: '2026-04-18', priority: 'medium', items: [{ type: '라미네이트',    material: 'E-max / Lithium Disilicate',   teeth: ['21', '22', '23'], status: '작업중',  technician: '이기공' }] },
  { id: '26', patient: '신윤복',   clinic: '미래플란트치과', orderDate: '2026-03-07', deadline: '2026-04-20', priority: 'low',    items: [{ type: '서지컬 가이드', material: 'Surgical Resin',               teeth: ['11', '12', '13'], status: '작업중',  technician: '최기공' }] },
  { id: '27', patient: '정약용',   clinic: '미소지음치과',   orderDate: '2026-03-10', deadline: '2026-04-25', priority: 'medium', items: [{ type: '브릿지',        material: 'Zirconia / Monolithic',        teeth: ['24', '25', '26'], status: '요청됨',  technician: '미배정' }, { type: '임플란트', material: 'Ti-Base', teeth: ['27'], status: '요청됨', technician: '미배정' }] },

  // 4월 후반 ~ 5월 마감 (여유 있는 케이스)
  { id: '28', patient: '이황',     clinic: '서울바른치과',   orderDate: '2026-03-14', deadline: '2026-04-28', priority: 'low',    items: [{ type: '덴처',          material: 'Full Denture / Acrylic',       teeth: ['Upper'],          status: '요청됨',  technician: '미배정' }] },
  { id: '29', patient: '이이',     clinic: '하늘치과',       orderDate: '2026-03-18', deadline: '2026-05-09', priority: 'low',    items: [{ type: '크라운',        material: 'Zirconia / SCRP',              teeth: ['14', '15'],       status: '요청됨',  technician: '미배정' }, { type: '인레이', material: 'E-max / Ceramic', teeth: ['17'], status: '요청됨', technician: '미배정' }] },
  { id: '30', patient: '퇴계',     clinic: '튼튼치과',       orderDate: '2026-03-20', deadline: '2026-05-20', priority: 'low',    items: [{ type: '임플란트',      material: 'Ti-Base / Custom Abutment',    teeth: ['16', '26'],       status: '요청됨',  technician: '미배정' }] },
];

export const TECHNICIANS = ['김기공', '이기공', '최기공', '박기공', '미배정'];
