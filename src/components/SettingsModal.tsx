import { X, KeyRound, Settings } from "lucide-react";
import { motion } from "motion/react";
import { useState, memo } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialApiKey: string;
  onSave: (apiKey: string) => void;
}

export const SettingsModal = memo(function SettingsModal({ 
  isOpen, 
  onClose, 
  initialApiKey, 
  onSave 
}: SettingsModalProps) {
  const [tempKey, setTempKey] = useState(initialApiKey);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden border border-farm-border"
      >
        <div className="flex justify-between items-center p-6 border-b border-farm-border bg-farm-surface/50">
          <h3 className="text-xl font-bold text-farm-text-header flex items-center gap-2.5">
            <div className="p-2 bg-farm-primary/10 rounded-lg">
              <Settings className="w-5 h-5 text-farm-primary" />
            </div>
            Cấu hình
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 text-farm-text-muted hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-farm-text mb-2.5">Google Gemini API Key</label>
              <p className="text-[13px] text-farm-text-muted mb-4 leading-relaxed">
                Nhập API Key của bạn để sử dụng tính năng chẩn đoán AI. Dữ liệu được lưu an toàn trên máy bạn.
              </p>
              <div className="relative group">
                <input 
                  type="password" 
                  placeholder="AIzaSy..."
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="w-full bg-farm-base border-2 border-farm-border rounded-2xl p-4 pl-12 text-[15px] outline-none focus:border-farm-primary focus:bg-white transition-all text-farm-text"
                />
                <KeyRound className="w-5 h-5 text-farm-text-muted absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-farm-primary transition-colors" />
              </div>
            </div>
            
            <button 
              onClick={() => onSave(tempKey)}
              className="w-full btn-primary h-[56px] text-lg active:scale-95 transition-transform"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});
