import { Settings } from "lucide-react";
import { memo } from "react";

interface HeaderProps {
  onOpenSettings: () => void;
  onLogoClick: () => void;
}

export const Header = memo(function Header({ onOpenSettings, onLogoClick }: HeaderProps) {
  return (
    <header 
      className="bg-white/90 backdrop-blur-xl border-b border-farm-border/40 px-4 sticky top-0 z-30 flex justify-center"
      style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: '12px' }}
    >
      <div className="flex justify-between items-center w-full max-w-screen-xl">
        <div 
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 active:scale-95 transition-all" 
          onClick={onLogoClick}
          role="button"
        >
          <div className="w-9 h-9 bg-farm-primary rounded-[12px] flex items-center justify-center shadow-md shadow-farm-primary/20">
             <span className="text-white text-lg font-bold">N</span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-farm-text-header leading-none">
              Nông Y AI
            </h1>
            <p className="text-[9px] text-farm-primary font-bold uppercase tracking-widest opacity-60">
              Smart Agri
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={onOpenSettings}
            className="p-3 rounded-xl text-farm-text-muted hover:bg-farm-surface hover:text-farm-primary transition-all active:scale-90"
            aria-label="Cài đặt"
          >
            <Settings className="w-6 h-6" />
          </button>
          <div className="h-6 w-[1px] bg-farm-border mx-0.5"></div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-farm-surface/50 rounded-full border border-farm-border/50">
            <span className="text-[11px] font-bold text-farm-text-muted">Bà Con</span>
            <span className="text-xs">🌿</span>
          </div>
        </div>
      </div>
    </header>
  );
});
