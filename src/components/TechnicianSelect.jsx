import DropdownMenu from './DropdownMenu';
import { TECHNICIANS } from '../constants/data';

const TechnicianSelect = ({ name, type = 'single', onAssign }) => {
  if (type === 'multi-assigned') {
    return <div className="h-[28px] flex items-center text-[11px] font-medium text-[#8B95A1] px-1">복수 작업자</div>;
  }

  const isUnassigned = name === '미배정' || type === 'multi-unassigned';

  const options = TECHNICIANS.map(tech => ({
    id: tech,
    label: tech,
    dimmed: tech === '미배정',
  }));

  return (
    <DropdownMenu
      label={name}
      options={options}
      selected={isUnassigned ? null : name}
      onSelect={onAssign}
      minWidth="w-24"
      align="center"
      size="sm"
    />
  );
};

export default TechnicianSelect;
