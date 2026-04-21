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
      <div className="flex gap-4 items-center mb-8">
        <button 
          onClick={onBack} 
          className="bg-white p-3.5 rounded-full shadow-premium text-farm-text-muted hover:text-farm-primary hover:bg-farm-surface transition-all active:scale-90 border border-farm-border"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-farm-text-header">Kiểm Tra Lại Hình Ảnh</h2>
      </div>

      <div className="bg-white p-6 rounded-[40px] shadow-premium border border-farm-border mb-8">
        <div className="relative rounded-[28px] overflow-hidden border border-farm-border mb-8 shadow-inner">
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-full h-72 object-cover" />
          )}
        </div>
        
        <div className="px-2">
          <label className="block text-base font-bold text-farm-text mb-3">Tên cây trồng của bà con</label>
          <div className="relative group">
            <input 
              type="text" 
              placeholder="VD: Cà chua, Lúa, Sầu riêng..."
              value={plantContext}
              onChange={(e) => onPlantContextChange(e.target.value)}
              className="w-full bg-farm-surface border-2 border-transparent rounded-[20px] p-5 pl-14 text-lg outline-none focus:border-farm-primary focus:bg-white transition-all text-farm-text placeholder-farm-text-muted/50"
            />
            <Leaf className="w-6 h-6 text-farm-text-muted absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-farm-primary transition-colors opacity-60" />
          </div>
          <p className="text-sm text-farm-text-muted mt-4 italic leading-relaxed px-2">
            * Cung cấp tên cây giúp AI đưa ra chẩn đoán chính xác hơn so với chỉ nhìn lá.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto pb-8">
        <button 
          onClick={onConfirm} 
          className="w-full btn-primary h-[64px] text-xl active:scale-95 transition-transform"
        >
          Bắt Đầu Chẩn Đoán
        </button>
        <button 
          onClick={onBack} 
          className="w-full bg-transparent text-farm-text-muted hover:text-farm-text hover:bg-farm-surface font-bold text-lg h-[64px] rounded-[24px] transition-colors"
        >
          Chọn Ảnh Khác
        </button>
      </div>
    </motion.div>
  );
});
