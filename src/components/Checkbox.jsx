import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Checkbox = ({ checked, onChange }) => (
  <motion.div
    whileTap={{ scale: 0.85 }}
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${checked ? 'bg-[#3182F6]' : 'bg-white border border-[#D1D6DB] hover:bg-[#F9FAFB]'}`}
  >
    {checked && <Check size={14} className="text-white" strokeWidth={3} />}
  </motion.div>
);

export default Checkbox;
