import { Camera, Upload, Leaf, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";

interface LandingViewProps {
  chatHistoryLength: number;
  onClearHistory: () => void;
  onCameraClick: () => void;
  onUploadClick: () => void;
}

export const LandingView = memo(function LandingView({
  chatHistoryLength,
  onClearHistory,
  onCameraClick,
  onUploadClick
}: LandingViewProps) {
  return (
    <motion.div 
      key="idle"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col flex-1 max-w-screen-xl mx-auto w-full"
    >
      <div className="text-center mt-2 mb-6 p-8 bg-white rounded-[32px] shadow-premium border border-farm-border/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-farm-primary via-farm-secondary to-farm-primary opacity-30"></div>
        <div className="mb-4 inline-flex p-4 bg-farm-surface rounded-[20px]">
          <Leaf className="w-10 h-10 text-farm-primary" />
        </div>
        <h2 className="text-3xl leading-tight font-extrabold text-farm-text-header mb-3">
          Chẩn Đoán Sâu Bệnh <br/>
          <span className="text-farm-secondary">Thông Minh</span>
        </h2>
        <p className="text-farm-text-muted text-[15px] leading-relaxed max-w-[280px] mx-auto opacity-80">
          AI bảo vệ mùa màng, tư vấn giải pháp điều trị tức thì cho bà con.
        </p>
      </div>

      {chatHistoryLength > 0 && (
        <div className="bg-white/60 border border-farm-border/50 rounded-[24px] p-5 mb-6 relative overflow-hidden backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 mb-1.5">
            <div className="bg-farm-primary text-white p-1.5 rounded-[10px]">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-farm-text-header">Theo Dõi Vườn Cây</span>
          </div>
          <p className="text-[14px] text-farm-text-muted leading-relaxed mb-4">
            Đã lưu <b>{chatHistoryLength / 2}</b> kết quả trước đó.
          </p>
          <button 
            onClick={onClearHistory}
            className="w-full px-5 py-2.5 bg-red-50 text-red-600 font-bold text-[13px] rounded-xl active:scale-95 border border-red-100"
          >
            Làm mới lịch sử
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 pb-6">
        <button 
          onClick={onCameraClick} 
          className="group relative bg-farm-primary hover:bg-farm-primary-hover text-white rounded-[24px] py-6 px-8 flex items-center justify-between shadow-lg shadow-farm-primary/10 transition-all active:scale-[0.97]"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-[16px]">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-bold">Chụp Ảnh 📸</span>
              <span className="block text-[12px] text-green-50/70">Dùng camera máy</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
          </div>
        </button>

        <button 
          onClick={onUploadClick} 
          className="group relative bg-white border border-farm-border text-farm-text rounded-[24px] py-6 px-8 flex items-center justify-between shadow-premium transition-all active:scale-[0.97]"
        >
          <div className="flex items-center gap-4">
            <div className="bg-farm-surface p-3 rounded-[16px]">
              <Upload className="w-7 h-7 text-farm-primary" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-bold text-farm-text-header">Tải Ảnh Lên</span>
              <span className="block text-[12px] text-farm-text-muted">Từ bộ nhớ máy</span>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-farm-border rotate-180" />
        </button>
      </div>
    </motion.div>
  );
});
