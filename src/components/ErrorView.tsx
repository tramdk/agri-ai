import { ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";

interface ErrorViewProps {
  errorMsg: string;
  onReset: () => void;
}

export const ErrorView = memo(function ErrorView({
  errorMsg,
  onReset
}: ErrorViewProps) {
  return (
    <motion.div 
      key="error"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center flex-1 py-12 px-6"
    >
      <div className="bg-red-50 p-10 rounded-[48px] mb-8 border-2 border-red-100 shadow-xl shadow-red-500/5">
        <ShieldAlert className="w-20 h-20 text-red-600" />
      </div>
      <h3 className="text-3xl font-bold text-farm-text-header mb-4 text-center">Đã Có Lỗi Xảy Ra</h3>
      <p className="text-farm-text-muted text-center text-lg mb-10 max-w-sm leading-relaxed">{errorMsg}</p>
      <button 
        onClick={onReset} 
        className="btn-primary px-12 py-5 text-xl min-w-[240px]"
      >
        Thử Lại
      </button>
    </motion.div>
  );
});
