import { Camera, Upload, Leaf, ChevronLeft, BookOpen, Cloud, Sun, Wind, Droplets, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";
import { WeatherData } from "../services/weather";

interface LandingViewProps {
  historyCount: number;
  weather: WeatherData | null;
  onOpenHistory: () => void;
  onOpenHandbook: () => void;
  onOpenChat: () => void;
  onCameraClick: () => void;
  onUploadClick: () => void;
}

export const LandingView = memo(function LandingView({
  historyCount,
  weather,
  onOpenHistory,
  onOpenHandbook,
  onOpenChat,
  onCameraClick,
  onUploadClick
}: LandingViewProps) {

  const getWeatherIcon = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes("nắng") || d.includes("sun") || d.includes("clear")) return <Sun className="w-8 h-8 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />;
    if (d.includes("mưa") || d.includes("rain") || d.includes("drizzle")) return <Droplets className="w-8 h-8 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />;
    if (d.includes("gió") || d.includes("wind")) return <Wind className="w-8 h-8 text-slate-400" />;
    return <Cloud className="w-8 h-8 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />;
  };

  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex flex-col flex-1 max-w-screen-xl mx-auto w-full"
    >
      {/* Premium Weather Widget */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group overflow-hidden bg-gradient-to-br from-farm-primary/10 via-white to-farm-secondary/5 backdrop-blur-xl border border-white shadow-premium rounded-[28px] p-5 mb-6 flex items-center justify-between"
        >
          {/* Decorative shapes */}
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-farm-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-farm-secondary/5 rounded-full blur-2xl"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-white p-3 rounded-[20px] shadow-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
              {getWeatherIcon(weather.description)}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-farm-primary" />
                <span className="text-[15px] font-display font-bold text-farm-text-header">{weather.city}</span>
              </div>
              <p className="text-[12px] text-farm-text-muted font-medium capitalize">{weather.description}</p>
              <div className="flex items-center gap-3 mt-1.5 opacity-60">
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{weather.windSpeed}km/h</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right relative z-10">
            <span className="block text-3xl font-display font-black text-farm-primary leading-none">{weather.temp}°C</span>
          </div>
        </motion.div>
      )}

      <div className="text-center mt-2 mb-6 p-8 bg-white rounded-[32px] shadow-premium border border-farm-border/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-farm-primary via-farm-secondary to-farm-primary opacity-30"></div>
        <div className="mb-4 inline-flex p-4 bg-farm-surface rounded-[20px]">
          <Leaf className="w-10 h-10 text-farm-primary" />
        </div>
        <h2 className="text-3xl leading-tight font-extrabold text-farm-text-header mb-3">
          Chẩn Đoán Sâu Bệnh <br />
          <span className="text-farm-secondary">Thông Minh</span>
        </h2>
        <p className="text-farm-text-muted text-[15px] leading-relaxed max-w-[280px] mx-auto opacity-80">
          AI bảo vệ mùa màng, tư vấn giải pháp điều trị tức thì cho bà con.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Handbook Button */}
        <button
          onClick={onOpenHandbook}
          className="bg-white/60 border border-farm-border/50 rounded-[24px] p-4 relative overflow-hidden backdrop-blur-sm shadow-sm hover:shadow-md transition-all active:scale-95 group"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="bg-farm-secondary/20 text-farm-secondary p-1.5 rounded-[10px] group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[14px] font-bold text-farm-text-header">Cẩm Nang</span>
          </div>
          <p className="text-[11px] text-farm-text-muted leading-tight text-left">
            Kỹ thuật trồng & Chăm sóc cây
          </p>
        </button>

        {/* History Tracker */}
        <button
          onClick={onOpenHistory}
          disabled={historyCount === 0}
          className={`border border-farm-border/50 rounded-[24px] p-4 relative overflow-hidden backdrop-blur-sm shadow-sm transition-all active:scale-95 group ${historyCount > 0 ? 'bg-white/60 hover:shadow-md' : 'bg-gray-50/50 opacity-60 grayscale cursor-not-allowed'}`}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className={`p-1.5 rounded-[10px] ${historyCount > 0 ? 'bg-farm-primary text-white group-hover:scale-110 transition-transform' : 'bg-gray-200 text-gray-500'}`}>
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-[14px] font-bold text-farm-text-header">Lịch Sử</span>
          </div>
          <p className="text-[11px] text-farm-text-muted leading-tight text-left">
            {historyCount > 0 ? `Đã lưu ${historyCount} kết quả` : 'Chưa có hoạt động'}
          </p>
        </button>
      </div>



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
      {/* AI Chat Expert */}
      <button
        onClick={onOpenChat}
        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-[24px] p-4 mb-6 shadow-premium hover:shadow-lg transition-all active:scale-95 group text-left relative overflow-hidden"
      >
        <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/20 p-2.5 rounded-[14px]">
            <span className="text-2xl">👨‍🌾</span>
          </div>
          <div>
            <h3 className="font-bold font-display text-[16px] leading-tight">Hỏi Chuyên Gia AI</h3>
            <p className="text-[12px] opacity-90 mt-0.5">Gửi ảnh hoặc thu âm giọng nói</p>
          </div>
        </div>
      </button>
    </motion.div>
  );
});
