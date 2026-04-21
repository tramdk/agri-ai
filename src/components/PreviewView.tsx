import { ChevronLeft, Leaf } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";

interface PreviewViewProps {
  imagePreview: string | null;
  plantContext: string;
  onPlantContextChange: (val: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export const PreviewView = memo(function PreviewView({
  imagePreview,
  plantContext,
  onPlantContextChange,
  onBack,
  onConfirm
}: PreviewViewProps) {
  return (
    <motion.div 
      key="preview"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex flex-col flex-1 max-w-lg mx-auto w-full"
    >
      <div className="flex gap-3 items-center mb-5">
        <button 
          onClick={onBack} 
          className="bg-white p-2.5 rounded-xl shadow-premium text-farm-text-muted hover:text-farm-primary transition-all active:scale-90 border border-farm-border/50"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-farm-text-header">Xác Nhận Hình Ảnh</h2>
      </div>

      <div className="bg-white p-5 rounded-[24px] shadow-premium border border-farm-border/40 mb-6">
        <div className="relative rounded-[20px] overflow-hidden border border-farm-border/20 mb-6 bg-farm-surface">
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
          )}
        </div>
        
        <div className="px-1">
          <label className="block text-[14px] font-bold text-farm-text-header mb-2.5">Bà con đang trồng cây gì?</label>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="VD: Cà chua, Lúa, Sầu riêng..."
              value={plantContext}
              onChange={(e) => onPlantContextChange(e.target.value)}
              className="w-full bg-farm-surface/50 border-2 border-transparent rounded-[16px] py-4 pl-12 pr-5 text-[15px] outline-none focus:border-farm-primary focus:bg-white transition-all text-farm-text placeholder-farm-text-muted/40"
            />
            <Leaf className="w-5 h-5 text-farm-text-muted absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-farm-primary transition-colors opacity-50" />
          </div>
          <p className="text-[12px] text-farm-text-muted mt-3 italic leading-tight px-1 opacity-70">
            * Nhập tên cây giúp AI đưa ra kết quả chẩn đoán chính xác nhất.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-8">
        <button 
          onClick={onConfirm} 
          className="w-full btn-primary h-[54px] text-[16px] active:scale-95 transition-transform shadow-lg shadow-farm-primary/15"
        >
          Bắt Đầu Chẩn Đoán
        </button>
        <button 
          onClick={onBack} 
          className="w-full bg-farm-surface text-farm-text-muted font-bold text-[14px] h-[54px] rounded-xl active:scale-95 transition-all border border-farm-border/30"
        >
          Chọn Lại Ảnh Khác
        </button>
      </div>
    </motion.div>
  );
});
