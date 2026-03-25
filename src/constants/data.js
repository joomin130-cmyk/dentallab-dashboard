export const INITIAL_DATA = [
  { id: '1', patient: '김철수', clinic: '서울바른치과', deadline: '2024-10-27', priority: 'high', items: [{ type: '크라운', material: 'Zirconia / SCRP / Non-Vital', teeth: ['11', '12'], status: '제작중', technician: '이기공' }, { type: '어버트먼트', material: 'Custom Abutment / Ti', teeth: ['11'], status: '접수', technician: '미배정' }] },
  { id: '2', patient: '이영희', clinic: '연세미소치과', deadline: '2024-10-27', priority: 'medium', items: [{ type: '크라운', material: 'PFM / Base Metal', teeth: ['36', '37'], status: '제작중', technician: '김기공' }] },
  { id: '3', patient: '박지민', clinic: '미래플란트치과', deadline: '2024-10-26', priority: 'urgent', items: [{ type: '인레이', material: 'E-max / Ceramic', teeth: ['44', '45'], status: '배송준비', technician: '최기공' }] },
  { id: '4', patient: '정민수', clinic: '하늘치과', deadline: '2024-10-28', priority: 'low', items: [{ type: '서지컬 가이드', material: 'Surgical Resin', teeth: ['21', '22', '23'], status: '제작중', technician: '미배정' }] },
  { id: '5', patient: '최윤서', clinic: '튼튼치과', deadline: '2024-10-27', priority: 'medium', items: [{ type: '덴처', material: 'Full Denture / Acrylic', teeth: ['Upper'], status: '검수완료', technician: '김기공' }, { type: '개인 트레이', material: 'Custom Tray Resin', teeth: ['Lower'], status: '제작중', technician: '미배정' }] },
  { id: '6', patient: '강하늘', clinic: '미소지음치과', deadline: '2024-10-27', priority: 'high', items: [{ type: '브릿지', material: 'Zirconia / Monolithic', teeth: ['14', '15', '16'], status: '제작중', technician: '이기공' }] },
];

export const TECHNICIANS = ['김기공', '이기공', '최기공', '박기공', '미배정'];
