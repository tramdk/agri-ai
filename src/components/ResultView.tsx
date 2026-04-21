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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col max-w-2xl mx-auto w-full"
    >
      <div className="flex gap-4 items-center mb-8">
        <button 
          onClick={onReset} 
          className="bg-white p-3.5 rounded-full shadow-premium text-gray-600 hover:text-farm-primary transition-all active:scale-90 border border-farm-border"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <h2 className="text-3xl font-bold text-farm-text-header">Kết Quả Phân Tích</h2>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-[40px] p-8 mb-8 border border-farm-border shadow-premium relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full ${isHealthy ? 'bg-farm-primary' : 'bg-farm-accent'}`}></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {imagePreview && (
            <div className="w-full md:w-48 h-48 rounded-3xl overflow-hidden border-2 border-farm-surface shadow-md flex-shrink-0">
              <img src={imagePreview} alt="Crop" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 space-y-4">
            <div>
              <span className="text-xs font-bold text-farm-text-muted uppercase tracking-widest mb-1 block">Cây Trồng</span>
              <h3 className="text-4xl font-bold text-farm-text-header">{analysisResult.plantName}</h3>
            </div>
            
            <div className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide shadow-sm ${isHealthy ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {isHealthy ? <CheckCircle2 className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
              {analysisResult.diseaseName}
            </div>

            <div className="pt-2">
              <span className="text-[14px] font-bold text-farm-text block mb-1">Mức độ:</span>
              <span className={`text-[15px] px-3 py-1 rounded-lg font-semibold ${isHealthy ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {analysisResult.status}
              </span>
            </div>
          </div>
        </div>
        
        {!isHealthy && (
           <div className="mt-10 pt-8 border-t border-farm-surface">
              <div className="flex items-center gap-2 mb-4 text-farm-text font-bold text-xl">
                 <AlertCircle className="w-6 h-6 text-farm-accent" />
                 <h4>Triệu chứng nhận diện</h4>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.symptoms.map((sym, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-farm-surface p-4 rounded-2xl text-[15px] text-farm-text-muted leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-farm-secondary mt-2 flex-shrink-0"></div>
                    {sym}
                  </li>
                ))}
              </ul>
           </div>
        )}
      </div>

      {/* Treatment Plans */}
      {!isHealthy && analysisResult.treatments.length > 0 && (
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-farm-text-header mb-6 px-2">Hướng Dẫn Khắc Phục</h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {analysisResult.treatments.map((treatment, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[32px] p-6 border border-farm-border flex flex-col sm:flex-row gap-5 items-start md:items-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  {getMethodIcon(treatment.method)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-farm-text-header mb-1">{treatment.method}</h4>
                  <p className="text-farm-text-muted text-[15px] leading-relaxed italic">
                    "{treatment.instruction}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Advice Card */}
      <div className="bg-farm-primary/5 border-2 border-dashed border-farm-primary/30 rounded-[32px] p-8 mb-10 overflow-hidden relative">
        <div className="absolute -right-8 -top-8 opacity-10">
           <Info className="w-32 h-32 text-farm-primary" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-farm-primary rounded-xl text-white">
            <Info className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-farm-text-header">Lời Khuyên & Phòng Ngừa</h3>
        </div>
        <p className="text-[17px] text-farm-text-muted leading-relaxed relative z-10">
          {analysisResult.advice}
        </p>
      </div>
      
      <button 
          onClick={onReset} 
          className="w-full btn-primary h-[64px] text-xl active:scale-95 transition-transform mb-12"
      >
          Quay lại & Thử Ảnh Khác
      </button>
    </motion.div>
  );
});
