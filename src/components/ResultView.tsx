import { ChevronLeft, AlertCircle, CheckCircle2, FlaskConical, Sprout, Scissors, Droplets, Info } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";
import { DiseaseAnalysis } from "../services/gemini";

interface ResultViewProps {
  analysisResult: DiseaseAnalysis;
  imagePreview: string | null;
  onReset: () => void;
}

const getMethodIcon = (method: string) => {
  const lower = method.toLowerCase();
  let IconElement = CheckCircle2;
  if (lower.includes("hóa")) IconElement = FlaskConical;
  else if (lower.includes("sinh học")) IconElement = Sprout;
  else if (lower.includes("tỉa") || lower.includes("cơ học")) IconElement = Scissors;
  else if (lower.includes("tưới") || lower.includes("nước")) IconElement = Droplets;
  
  return (
    <div className="w-10 h-10 bg-farm-primary/10 rounded-2xl flex items-center justify-center text-farm-primary p-2">
      <IconElement className="w-full h-full" />
    </div>
  );
};

export const ResultView = memo(function ResultView({
  analysisResult,
  imagePreview,
  onReset
}: ResultViewProps) {
  const isHealthy = 
    analysisResult.diseaseName.toLowerCase().includes("khỏe mạnh") || 
    analysisResult.diseaseName.toLowerCase().includes("bình thường") ||
    analysisResult.diseaseName.toLowerCase().includes("không phát hiện") ||
    analysisResult.status.toLowerCase().includes("bình thường");

  return (
    <motion.div 
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col max-w-2xl mx-auto w-full px-1"
    >
      <div className="flex gap-4 items-center mb-6">
        <button 
          onClick={onReset} 
          className="bg-white p-3 rounded-2xl shadow-premium text-farm-text-muted hover:text-farm-primary transition-all active:scale-90 border border-farm-border"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-farm-text-header">Kết Quả Chẩn Đoán</h2>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-[32px] p-6 mb-6 border border-farm-border shadow-premium relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1.5 ${isHealthy ? 'bg-farm-primary' : 'bg-farm-accent'}`}></div>
        
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {imagePreview && (
            <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden border-4 border-farm-surface shadow-sm flex-shrink-0">
              <img src={imagePreview} alt="Crop" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-farm-primary uppercase tracking-[0.2em] mb-1 block opacity-60">Loại Cây</span>
              <h3 className="text-3xl font-bold text-farm-text-header leading-tight">{analysisResult.plantName}</h3>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm shadow-sm ${isHealthy ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {isHealthy ? <CheckCircle2 className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
              {analysisResult.diseaseName}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[13px] font-bold text-farm-text-muted">Tình trạng:</span>
              <span className={`text-[13px] px-3 py-0.5 rounded-full font-bold border ${isHealthy ? 'bg-green-100/50 text-green-800 border-green-200' : 'bg-orange-100/50 text-orange-800 border-orange-200'}`}>
                {analysisResult.status}
              </span>
            </div>
          </div>
        </div>
        
        {!isHealthy && (
           <div className="mt-8 pt-6 border-t border-farm-surface">
              <div className="flex items-center gap-2 mb-4 text-farm-text-header font-bold text-lg">
                 <div className="w-2 h-6 bg-farm-accent rounded-full"></div>
                 <h4>Triệu chứng nhận diện</h4>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {analysisResult.symptoms.map((sym, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 bg-farm-surface/50 p-3 rounded-xl text-[14px] text-farm-text-muted border border-farm-surface"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-farm-accent flex-shrink-0"></div>
                    {sym}
                  </motion.div>
                ))}
              </div>
           </div>
        )}
      </div>

      {/* Treatment Plans */}
      {!isHealthy && analysisResult.treatments.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xl font-bold text-farm-text-header">Hướng Dẫn Khắc Phục</h3>
            <span className="text-[11px] bg-farm-primary/10 text-farm-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Expert Advice</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {analysisResult.treatments.map((treatment, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-white rounded-[24px] p-5 border border-farm-border flex gap-4 items-start shadow-sm border-b-4 border-b-farm-surface"
              >
                <div className="flex-shrink-0">
                  {getMethodIcon(treatment.method)}
                </div>
                <div className="flex-1">
                  <h4 className="text-[16px] font-bold text-farm-text-header mb-1">{treatment.method}</h4>
                  <p className="text-farm-text-muted text-[14px] leading-relaxed">
                    {treatment.instruction}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Advice Card */}
      <div className="bg-farm-primary text-white rounded-[32px] p-6 mb-8 overflow-hidden relative shadow-lg shadow-farm-primary/20">
        <div className="absolute -right-4 -bottom-4 opacity-10">
           <Sprout className="w-32 h-32" />
        </div>
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Info className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold">Lời khuyên chăm sóc</h3>
        </div>
        <p className="text-[15px] text-white/90 leading-relaxed relative z-10 font-medium">
          {analysisResult.advice}
        </p>
      </div>
      
      <button 
          onClick={onReset} 
          className="w-full btn-primary h-[60px] text-lg active:scale-95 transition-transform mb-10 shadow-xl shadow-farm-primary/20"
      >
          Quay lại & Chụp Ảnh Khác
      </button>
    </motion.div>
  );
});
