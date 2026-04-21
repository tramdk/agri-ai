import { Leaf } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";

interface AnalyzingViewProps {
  imagePreview: string | null;
}

export const AnalyzingView = memo(function AnalyzingView({ imagePreview }: AnalyzingViewProps) {
  return (
    <motion.div 
      key="analyzing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center flex-1 py-12"
    >
      <div className="relative w-64 h-64 mb-10">
        <div className="absolute inset-0 bg-farm-primary/10 rounded-[50px] blur-3xl animate-pulse"></div>
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Đang phân tích" 
            className="w-full h-full object-cover rounded-[48px] shadow-2xl opacity-40 grayscale-[0.5]" 
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="relative">
              {/* Animated rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-farm-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-farm-secondary/30 border-b-transparent rounded-full animate-spin duration-1000"></div>
              
              <div className="relative bg-white p-6 rounded-[32px] shadow-xl">
                 <Leaf className="w-10 h-10 text-farm-primary" />
              </div>
           </div>
        </div>
      </div>
      <h3 className="text-3xl font-bold text-farm-text-header mb-4">Đang Chẩn Đoán...</h3>
      <p className="text-farm-text-muted text-center text-lg max-w-sm px-6 leading-relaxed">
        AI đang phân tích triệu chứng để tìm nguyên nhân và thuốc chữa cho cây của bà con. Vui lòng đợi chút lát.
      </p>
    </motion.div>
  );
});
