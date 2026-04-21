import { Camera, Upload, Leaf } from "lucide-react";
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
      className="flex flex-col flex-1 max-w-screen-xl mx-auto w-full px-1"
    >
      <div className="text-center mt-4 mb-8 p-10 bg-white rounded-[40px] shadow-premium border border-farm-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-farm-primary via-farm-secondary to-farm-primary opacity-30"></div>
        <div className="mb-6 inline-flex p-5 bg-farm-surface rounded-[24px] shadow-sm">
          <Leaf className="w-12 h-12 text-farm-primary" />
        </div>
        <h2 className="text-4xl leading-tight font-bold text-farm-text-header mb-4 max-w-md mx-auto">
          Chẩn Đoán Sâu Bệnh <br/>
          <span className="text-farm-secondary bg-farm-surface px-3 py-1 rounded-xl">Thông Minh</span>
        </h2>
        <p className="text-farm-text-muted text-[17px] leading-relaxed max-w-sm mx-auto">
          Công nghệ AI tiên tiến giúp bảo vệ mùa màng, tư vấn giải pháp điều trị tức thì cho bà con.
        </p>
      </div>

      {chatHistoryLength > 0 && (
        <div className="bg-white/60 border border-farm-border rounded-[32px] p-6 mb-8 relative overflow-hidden backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="bg-farm-primary text-white p-2 rounded-[14px] shadow-lg shadow-farm-primary/20">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-farm-text-header">Theo Dõi Vườn Cây</span>
          </div>
          <p className="text-[15px] text-farm-text-muted leading-relaxed mb-5">
            Đã lưu <b>{chatHistoryLength / 2}</b> kết quả trước đó để phân tích chuyên sâu hơn.
          </p>
          <button 
            onClick={onClearHistory}
            className="w-full sm:w-auto px-6 py-3 bg-red-50 text-red-600 font-bold text-sm rounded-2xl hover:bg-red-100 transition-all active:scale-95 border border-red-100"
          >
            Xóa lịch sử & Bắt đầu lại
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-auto pb-6">
        <button 
          onClick={onCameraClick} 
          className="group relative bg-farm-primary hover:bg-farm-primary-hover text-white rounded-[32px] p-8 flex flex-col items-center gap-5 shadow-xl shadow-farm-primary/15 transition-all active:scale-[0.96]"
        >
          <div className="bg-white/15 p-6 rounded-[24px] group-hover:scale-110 transition-transform">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold mb-1">Chụp Ảnh 📸</span>
            <span className="block text-sm text-green-50/80 font-medium">Sử dụng máy ảnh</span>
          </div>
        </button>

        <button 
          onClick={onUploadClick} 
          className="group relative bg-white border-2 border-farm-border text-farm-text rounded-[32px] p-8 flex flex-col items-center gap-5 shadow-premium hover:bg-farm-surface hover:border-farm-primary/30 transition-all active:scale-[0.96]"
        >
          <div className="bg-farm-surface p-6 rounded-[24px] group-hover:scale-110 transition-transform shadow-inner">
            <Upload className="w-10 h-10 text-farm-primary" />
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold mb-1 text-farm-text-header">Tải Ảnh Lên</span>
            <span className="block text-sm text-farm-text-muted font-medium">Từ thư viện ảnh</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
});
