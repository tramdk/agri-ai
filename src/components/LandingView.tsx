import { Camera, Upload, Leaf, BookOpen, Cloud, Sun, Wind, Droplets, MapPin, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
          className="relative group overflow-hidden bg-gradient-to-br from-farm-primary/10 via-white to-farm-secondary/5 backdrop-blur-xl border border-white shadow-premium rounded-[24px] p-4 mb-4 flex items-center justify-between"
        >
          {/* Decorative shapes */}
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-farm-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-farm-secondary/5 rounded-full blur-2xl"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white p-2.5 rounded-[16px] shadow-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
              {getWeatherIcon(weather.description)}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-farm-primary" />
                <span className="text-[14px] font-display font-bold text-farm-text-header">{weather.city}</span>
              </div>
              <p className="text-[11px] text-farm-text-muted font-medium capitalize">{weather.description}</p>
              <div className="flex items-center gap-3 mt-1 opacity-60">
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
            <span className="block text-3xl font-display font-black text-farm-primary leading-none tracking-tighter">{weather.temp}°C</span>
          </div>
        </motion.div>
      )}

      {/* Main Banner Compact */}
      <div className="flex items-center text-left mb-4 p-4 bg-white rounded-[24px] shadow-premium border border-farm-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-farm-primary/10 to-transparent rounded-full blur-2xl"></div>
        <div className="mr-4 p-3 bg-farm-surface rounded-[18px] shrink-0 transform rotate-3">
          <Leaf className="w-8 h-8 text-farm-primary" />
        </div>
        <div className="relative z-10">
          <h2 className="text-lg leading-tight font-extrabold text-farm-text-header">
            Chẩn Đoán Sâu Bệnh <span className="text-farm-secondary">AI</span>
          </h2>
          <p className="text-farm-text-muted text-[12px] leading-snug mt-1.5 opacity-80 max-w-[200px]">
            AI tư vấn và nhận diện giải pháp điều trị bệnh tức thì.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Handbook Button */}
        <button
          onClick={onOpenHandbook}
          className="bg-white/60 border border-farm-border/50 rounded-[20px] p-4 relative overflow-hidden backdrop-blur-sm shadow-sm hover:shadow-md transition-all active:scale-95 group text-left"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="bg-farm-secondary/20 text-farm-secondary p-1.5 rounded-[10px] group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[14px] font-bold text-farm-text-header">Cẩm Nang</span>
          </div>
          <p className="text-[11px] text-farm-text-muted leading-tight">
            Kỹ thuật canh tác
          </p>
        </button>

        {/* History Tracker */}
        <button
          onClick={onOpenHistory}
          disabled={historyCount === 0}
          className={`border border-farm-border/50 rounded-[20px] p-4 relative overflow-hidden text-left backdrop-blur-sm shadow-sm transition-all active:scale-95 group ${historyCount > 0 ? 'bg-white/60 hover:shadow-md' : 'bg-gray-50/50 opacity-60 grayscale cursor-not-allowed'}`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className={`p-1.5 rounded-[10px] ${historyCount > 0 ? 'bg-farm-primary text-white group-hover:scale-110 transition-transform' : 'bg-gray-200 text-gray-500'}`}>
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-[14px] font-bold text-farm-text-header">Lịch Sử</span>
          </div>
          <p className="text-[11px] text-farm-text-muted leading-tight">
            {historyCount > 0 ? `Đã lưu ${historyCount} kết quả` : 'Chưa có hoạt động'}
          </p>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-4">
        <button
          onClick={onCameraClick}
          className="group relative bg-farm-primary hover:bg-farm-primary-hover text-white rounded-[24px] py-4 px-3 flex flex-col items-center justify-center shadow-md transition-all active:scale-[0.97]"
        >
          <div className="bg-white/10 p-2.5 rounded-[14px] mb-2">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className="block text-[15px] font-bold">Chụp Ảnh</span>
          <span className="block text-[11px] text-green-50/70 mt-0.5">Dùng camera</span>
        </button>

        <button
          onClick={onUploadClick}
          className="group relative bg-white border border-farm-border text-farm-text rounded-[24px] py-4 px-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-[0.97]"
        >
          <div className="bg-farm-surface p-2.5 rounded-[14px] mb-2">
            <Upload className="w-6 h-6 text-farm-primary" />
          </div>
          <span className="block text-[15px] font-bold text-farm-text-header">Tải Ảnh Lên</span>
          <span className="block text-[11px] text-farm-text-muted mt-0.5">Từ thư viện</span>
        </button>
      </div>

      {/* AI Chat Expert */}
      <button
        onClick={onOpenChat}
        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-[24px] p-4 shadow-sm hover:shadow-md transition-all active:scale-95 group flex items-center justify-between relative overflow-hidden"
      >
        <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="flex items-center gap-3 relative z-10 w-full text-left">
          <div className="bg-white/20 p-2 rounded-[12px] shrink-0">
            <span className="text-xl leading-none block">👨‍🌾</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold font-display text-[15px] leading-tight text-white/95">Trò chuyện cùng Chuyên Gia</h3>
            <p className="text-[11px] text-white/80 mt-0.5 font-medium tracking-wide">Nhắn tin hoặc gọi thoại trực tiếp</p>
          </div>
        </div>
      </button>
    </motion.div>
  );
});
