export const simplifyMaterial = (material) => {
  if (!material) return '';
  return material.split('/')[0].trim();
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}.${d.getDate()}`;
};

export const getAggregatedStatus = (items) => {
  const statusPriority = { '접수': 0, '제작중': 1, '검수완료': 2, '배송준비': 3 };
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
