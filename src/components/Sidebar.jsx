import { motion } from 'framer-motion';
import { Menu, Settings } from 'lucide-react';

/* ── 커스텀 아이콘 (fill="currentColor") ── */
const IconWork = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.0918 18.3337C3.71108 18.3337 2.5918 17.2144 2.5918 15.8337V8.47255C2.5918 7.68565 2.96228 6.94468 3.5918 6.47255L8.4992 2.79199C9.38809 2.12533 10.6103 2.12533 11.4992 2.79199L16.4066 6.47255C17.0361 6.94468 17.4066 7.68565 17.4066 8.47255V15.8337C17.4066 17.2144 16.2873 18.3337 14.9066 18.3337H12.8511C12.2988 18.3337 11.8511 17.8859 11.8511 17.3337V13.704C11.8511 12.6813 11.022 11.8522 9.9992 11.8522C8.97645 11.8522 8.14735 12.6813 8.14735 13.704V17.3337C8.14735 17.8859 7.69964 18.3337 7.14735 18.3337H5.0918Z" fill="currentColor" />
  </svg>
);

const IconSchedule = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.333 1.66699C13.5371 1.66702 13.7342 1.7423 13.8867 1.87793C14.0391 2.01346 14.1372 2.19982 14.1611 2.40234L14.167 2.5V3.33398H15C15.6376 3.33395 16.2509 3.57732 16.7148 4.01465C17.1787 4.45201 17.4586 5.05011 17.4961 5.68652L17.5 5.83398V15.834C17.5 16.4714 17.2566 17.085 16.8193 17.5488C16.3819 18.0128 15.7831 18.2917 15.1465 18.3291L15 18.334H5C4.36236 18.334 3.7491 18.0898 3.28516 17.6523C2.82123 17.2149 2.54135 16.617 2.50391 15.9805L2.5 15.834V5.83398C2.49996 5.19633 2.74323 4.58211 3.18066 4.11816C3.61813 3.65421 4.21694 3.3753 4.85352 3.33789L5 3.33398H5.83301V2.5C5.83333 2.28772 5.91481 2.08308 6.06055 1.92871C6.20634 1.77437 6.40621 1.68139 6.61816 1.66895C6.83001 1.6566 7.03841 1.72615 7.20117 1.8623C7.36393 1.99853 7.46895 2.19162 7.49414 2.40234L7.5 2.5V3.33398H12.5V2.5C12.5001 2.2791 12.5879 2.06734 12.7441 1.91113C12.9003 1.75493 13.1121 1.66708 13.333 1.66699ZM9.58203 9.13867L9.48535 9.14453C9.27444 9.16962 9.08066 9.27462 8.94434 9.4375C8.80819 9.60026 8.73863 9.80868 8.75098 10.0205C8.76342 10.2325 8.85727 10.4323 9.01172 10.5781C9.16604 10.7237 9.36991 10.8053 9.58203 10.8057V12.4717L9.58789 12.5693C9.61298 12.7802 9.71798 12.974 9.88086 13.1104C10.0437 13.2466 10.2529 13.3152 10.4648 13.3027C10.6768 13.2902 10.8757 13.1973 11.0215 13.043C11.1673 12.8885 11.2488 12.6841 11.249 12.4717V9.97168L11.2432 9.87402C11.2192 9.67166 11.1219 9.48511 10.9697 9.34961C10.8173 9.21404 10.62 9.13877 10.416 9.13867H9.58203Z" fill="currentColor" />
  </svg>
);

const IconClients = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4C5 2.89688 5.89688 2 7 2H13C14.1031 2 15 2.89688 15 4V6H17C18.1031 6 19 6.89688 19 8V16C19 17.1031 18.1031 18 17 18H3C1.89688 18 1 17.1031 1 16V8C1 6.89688 1.89688 6 3 6H5V4ZM9.5 13C8.94687 13 8.5 13.4469 8.5 14V16.5H11.5V14C11.5 13.4469 11.0531 13 10.5 13H9.5ZM5 13.5V12.5C5 12.225 4.775 12 4.5 12H3.5C3.225 12 3 12.225 3 12.5V13.5C3 13.775 3.225 14 3.5 14H4.5C4.775 14 5 13.775 5 13.5ZM4.5 10C4.775 10 5 9.775 5 9.5V8.5C5 8.225 4.775 8 4.5 8H3.5C3.225 8 3 8.225 3 8.5V9.5C3 9.775 3.225 10 3.5 10H4.5ZM17 13.5V12.5C17 12.225 16.775 12 16.5 12H15.5C15.225 12 15 12.225 15 12.5V13.5C15 13.775 15.225 14 15.5 14H16.5C16.775 14 17 13.775 17 13.5ZM16.5 10C16.775 10 17 9.775 17 9.5V8.5C17 8.225 16.775 8 16.5 8H15.5C15.225 8 15 8.225 15 8.5V9.5C15 9.775 15.225 10 15.5 10H16.5ZM9.25 5.25V6.25H8.25C7.975 6.25 7.75 6.475 7.75 6.75V7.25C7.75 7.525 7.975 7.75 8.25 7.75H9.25V8.75C9.25 9.025 9.475 9.25 9.75 9.25H10.25C10.525 9.25 10.75 9.025 10.75 8.75V7.75H11.75C12.025 7.75 12.25 7.525 12.25 7.25V6.75C12.25 6.475 12.025 6.25 11.75 6.25H10.75V5.25C10.75 4.975 10.525 4.75 10.25 4.75H9.75C9.475 4.75 9.25 4.975 9.25 5.25Z" fill="currentColor" />
  </svg>
);

const IconAnalytics = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip-analytics)">
      <path d="M5.00065 10.833H1.66732C1.16732 10.833 0.833984 11.1663 0.833984 11.6663V18.333C0.833984 18.833 1.16732 19.1663 1.66732 19.1663H5.00065C5.50065 19.1663 5.83398 18.833 5.83398 18.333V11.6663C5.83398 11.1663 5.50065 10.833 5.00065 10.833ZM18.334 7.49967H15.0006C14.5006 7.49967 14.1673 7.83301 14.1673 8.33301V18.333C14.1673 18.833 14.5006 19.1663 15.0006 19.1663H18.334C18.834 19.1663 19.1673 18.833 19.1673 18.333V8.33301C19.1673 7.83301 18.834 7.49967 18.334 7.49967ZM11.6673 0.833008H8.33398C7.83398 0.833008 7.50065 1.16634 7.50065 1.66634V18.333C7.50065 18.833 7.83398 19.1663 8.33398 19.1663H11.6673C12.1673 19.1663 12.5007 18.833 12.5007 18.333V1.66634C12.5007 1.16634 12.1673 0.833008 11.6673 0.833008Z" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip-analytics">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const IconAlarm = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 18.3337C10.5161 18.3343 11.0195 18.1742 11.4404 17.8755C11.8613 17.5768 12.1786 17.1544 12.3483 16.667H7.65167C7.82138 17.1544 8.13873 17.5768 8.55959 17.8755C8.98045 18.1742 9.48392 18.3343 10 18.3337ZM15.8333 12.1553V8.33366C15.8333 5.65283 14.0125 3.39449 11.5458 2.71533C11.3017 2.10033 10.705 1.66699 10 1.66699C9.295 1.66699 8.69833 2.10033 8.45417 2.71533C5.9875 3.39533 4.16667 5.65283 4.16667 8.33366V12.1553L2.74417 13.5778C2.58788 13.7341 2.50005 13.946 2.5 14.167V15.0003C2.5 15.2213 2.5878 15.4333 2.74408 15.5896C2.90036 15.7459 3.11232 15.8337 3.33333 15.8337H16.6667C16.8877 15.8337 17.0996 15.7459 17.2559 15.5896C17.4122 15.4333 17.5 15.2213 17.5 15.0003V14.167C17.5 13.946 17.4121 13.7341 17.2558 13.5778L15.8333 12.1553Z" fill="currentColor" />
  </svg>
);

const NAV_ITEMS = [
  { id: 'work', label: '작업 관리', Icon: IconWork },
  { id: 'schedule', label: '일정 현황', Icon: IconSchedule },
  { id: 'clients', label: '거래처', Icon: IconClients },
  { id: 'analytics', label: '성과 분석', Icon: IconAnalytics },
];

const BOTTOM_ITEMS = [
  { id: 'settings', label: '설정', Icon: () => <Settings size={20} fill="currentColor" strokeWidth={0} /> },
];

export const SIDEBAR_OPEN_W = 216;
export const SIDEBAR_CLOSE_W = 64;

/* ── 개별 아이템 ── */
const SidebarItem = ({ item, isOpen, isActive, onClick }) => {
  const { Icon } = item;
  return (
    /* 닫힘: 64px 중앙 / 열림: 왼쪽 고정 (w-auto) */
    <div className={`flex w-full px-2 ${isOpen ? 'justify-start' : 'justify-center'}`}>
      <button
        onClick={onClick}
        className={`
          relative flex items-center h-[42px] rounded-[12px] transition-colors overflow-hidden
          ${isOpen ? 'gap-3 px-3 pr-5' : 'w-[42px] justify-center gap-0'}
          ${isActive ? 'text-[#3182F6]' : 'text-[#A8B0BE] hover:text-[#4E5968] hover:bg-[#F2F4F6]'}
        `}
      >
        {/* 활성 배경 pill */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active-pill"
            className="absolute inset-0 bg-[#DFE3E9] rounded-[12px]"
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
        )}

        <span className="relative z-10 flex-shrink-0 flex items-center justify-center">
          <Icon />
        </span>

        {/* 라벨 — 닫힘 시 max-w-0 으로 클리핑 */}
        <span
          className={`
            relative z-10 text-[13px] font-semibold whitespace-nowrap overflow-hidden
            transition-all duration-150
            ${isOpen ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}
          `}
        >
          {item.label}
        </span>
      </button>
    </div>
  );
};

/* ── 사이드바 본체 ── */
const Sidebar = ({ isOpen, onToggle, activeMenu, setActiveMenu }) => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: isOpen ? SIDEBAR_OPEN_W : SIDEBAR_CLOSE_W }}
      transition={{
        x:       { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
        opacity: { duration: 0.35 },
        width:   { type: 'spring', stiffness: 380, damping: 34 },
      }}
      className="fixed left-0 top-0 bottom-0 bg-[#EBEDF0] border-r border-[#F2F4F6] z-50 flex flex-col overflow-hidden"
    >
      {/* 햄버거 — nav 아이콘과 동일한 축 */}
      <div className={`h-16 flex-shrink-0 flex items-center px-2 ${isOpen ? '' : 'justify-center'}`}>
        <button
          onClick={onToggle}
          className={`w-[42px] h-[42px] flex items-center rounded-[12px] text-[#8B95A1] hover:text-[#4E5968] hover:bg-[#F2F4F6] transition-colors
            ${isOpen ? 'justify-start pl-3' : 'justify-center'}`}
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>
      </div>

      {/* 상단 내비 */}
      <div className="flex-1 pt-1 pb-2 flex flex-col gap-1">
        {NAV_ITEMS.map(item => (
          <SidebarItem
            key={item.id}
            item={item}
            isOpen={isOpen}
            isActive={activeMenu === item.id}
            onClick={() => setActiveMenu(item.id)}
          />
        ))}
      </div>

      {/* 하단 설정 */}
      <div className="pb-5 pt-2 border-t border-[#F2F4F6] flex flex-col gap-1">
        {BOTTOM_ITEMS.map(item => (
          <SidebarItem
            key={item.id}
            item={item}
            isOpen={isOpen}
            isActive={activeMenu === item.id}
            onClick={() => setActiveMenu(item.id)}
          />
        ))}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
