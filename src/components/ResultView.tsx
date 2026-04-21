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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col max-w-2xl mx-auto w-full pb-8"
    >
      <div className="flex gap-3 items-center mb-5">
        <button 
          onClick={onReset} 
          className="bg-white p-2.5 rounded-xl shadow-premium text-farm-text-muted hover:text-farm-primary transition-all active:scale-90 border border-farm-border/50"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-farm-text-header">Kết Quả Chẩn Đoán</h2>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-[24px] p-5 mb-5 border border-farm-border/50 shadow-premium relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-1 ${isHealthy ? 'bg-farm-primary' : 'bg-farm-accent'}`}></div>
        
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {imagePreview && (
            <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden border-2 border-farm-surface shadow-sm flex-shrink-0">
              <img src={imagePreview} alt="Crop" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 space-y-2.5">
            <div>
              <span className="text-[9px] font-bold text-farm-primary uppercase tracking-[0.1em] mb-0.5 block opacity-60">Loại Cây</span>
              <h3 className="text-2xl font-extrabold text-farm-text-header leading-tight">{analysisResult.plantName}</h3>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-[13px] shadow-sm ${isHealthy ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {isHealthy ? <CheckCircle2 className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
              {analysisResult.diseaseName}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-farm-text-muted">Tình trạng:</span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${isHealthy ? 'bg-green-100/50 text-green-800 border-green-200' : 'bg-orange-100/50 text-orange-800 border-orange-200'}`}>
                {analysisResult.status}
              </span>
            </div>
          </div>
        </div>
        
        {!isHealthy && (
           <div className="mt-6 pt-4 border-t border-farm-surface">
              <div className="flex items-center gap-2 mb-3 text-farm-text-header font-bold text-[16px]">
                 <div className="w-1.5 h-5 bg-farm-accent rounded-full"></div>
                 <h4>Triệu chứng</h4>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {analysisResult.symptoms.map((sym, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-2.5 bg-farm-surface/40 p-2.5 rounded-lg text-[13px] text-farm-text-muted border border-farm-surface/50"
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
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-lg font-bold text-farm-text-header">Cách Khắc Phục</h3>
            <span className="text-[9px] bg-farm-primary/10 text-farm-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Expert</span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {analysisResult.treatments.map((treatment, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="bg-white rounded-[20px] p-4 border border-farm-border flex gap-3.5 items-start shadow-sm"
              >
                <div className="flex-shrink-0">
                  {getMethodIcon(treatment.method)}
                </div>
                <div className="flex-1">
                  <h4 className="text-[14px] font-bold text-farm-text-header mb-0.5">{treatment.method}</h4>
                  <p className="text-farm-text-muted text-[13px] leading-relaxed">
                    {treatment.instruction}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Advice Card */}
      <div className="bg-farm-primary text-white rounded-[24px] p-5 mb-6 overflow-hidden relative shadow-lg shadow-farm-primary/10">
        <div className="absolute -right-3 -bottom-3 opacity-10">
           <Sprout className="w-24 h-24" />
        </div>
        <div className="flex items-center gap-2.5 mb-2.5 relative z-10">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Info className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-[16px] font-bold">Lời khuyên</h3>
        </div>
        <p className="text-[14px] text-white/90 leading-relaxed relative z-10 font-medium">
          {analysisResult.advice}
        </p>
      </div>
      
      <button 
          onClick={onReset} 
          className="w-full btn-primary h-[54px] text-[16px] active:scale-95 transition-transform shadow-lg shadow-farm-primary/20"
      >
          Quay lại & Chụp Ảnh Khác
      </button>
    </motion.div>
  );
});
