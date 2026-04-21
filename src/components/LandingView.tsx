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
      className="flex flex-col flex-1 max-w-screen-xl mx-auto w-full"
    >
      <div className="text-center mt-6 mb-10 p-12 bg-white rounded-[40px] shadow-premium border border-farm-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-farm-primary via-farm-secondary to-farm-primary opacity-20"></div>
        <div className="mb-6 inline-flex p-4 bg-farm-surface rounded-3xl">
          <Leaf className="w-10 h-10 text-farm-primary" />
        </div>
        <h2 className="text-4xl leading-tight font-bold text-farm-text-header mb-4 max-w-md mx-auto">
          Chẩn Đoán Sâu Bệnh <span className="text-farm-secondary">Chỉ Với Một Bức Ảnh</span>
        </h2>
        <p className="text-farm-text-muted text-lg leading-relaxed max-w-sm mx-auto">
          Công nghệ AI tiên tiến giúp nhận diện và tư vấn giải pháp điều trị ngay lập tức cho vườn cây của bà con.
        </p>
      </div>

      {chatHistoryLength > 0 && (
        <div className="bg-farm-primary/5 border border-farm-primary/20 rounded-[32px] p-8 mb-10 relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="bg-farm-primary text-white p-1.5 rounded-full shadow-lg shadow-farm-primary/20">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-farm-text-header">AI Đang Theo Dõi Nông Trại</span>
          </div>
          <p className="text-[16px] text-farm-text-muted leading-relaxed mb-6">
            Hệ thống đang ghi nhớ <b>{chatHistoryLength / 2}</b> kết quả trước đó để phân tích chuyên sâu hơn.
          </p>
          <button 
            onClick={onClearHistory}
            className="px-5 py-2.5 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors active:scale-95"
          >
            Bắt đầu lại từ đầu
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto pb-8">
        <button 
          onClick={onCameraClick} 
          className="group relative bg-farm-primary hover:bg-farm-primary-hover text-white rounded-[32px] p-8 flex flex-col items-center gap-4 shadow-xl shadow-farm-primary/10 transition-all active:scale-[0.98]"
        >
          <div className="bg-white/10 p-5 rounded-[24px] group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold mb-1">Chụp Ảnh</span>
            <span className="block text-sm text-green-50/70 font-normal">Sử dụng camera điện thoại</span>
          </div>
        </button>

        <button 
          onClick={onUploadClick} 
          className="group relative bg-white border border-farm-border text-farm-text rounded-[32px] p-8 flex flex-col items-center gap-4 shadow-premium hover:bg-farm-surface transition-all active:scale-[0.98]"
        >
          <div className="bg-farm-surface p-5 rounded-[24px] group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8 text-farm-primary" />
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold mb-1 text-farm-text-header">Tải Ảnh</span>
            <span className="block text-sm text-farm-text-muted font-normal">Từ thư viện thiết bị</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
});
