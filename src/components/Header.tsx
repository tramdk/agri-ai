import { Settings } from "lucide-react";
import { memo } from "react";

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header = memo(function Header({ onOpenSettings }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-farm-border/50 px-5 py-4 sticky top-0 z-30 flex justify-center">
      <div className="flex justify-between items-center w-full max-w-screen-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-farm-primary rounded-[14px] flex items-center justify-center shadow-lg shadow-farm-primary/20">
             <span className="text-white text-xl font-bold">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-farm-text-header leading-tight">
              Nông Y AI
            </h1>
            <p className="text-[10px] text-farm-primary font-bold uppercase tracking-widest opacity-70">
              Smart Agriculture
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenSettings}
            className="p-2.5 rounded-[12px] text-farm-text-muted hover:bg-farm-surface hover:text-farm-primary transition-all active:scale-90"
            aria-label="Cài đặt"
          >
            <Settings className="w-6 h-6" />
          </button>
          <div className="h-8 w-[1px] bg-farm-border mx-1"></div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-farm-surface rounded-full border border-farm-border">
            <span className="text-[12px] font-bold text-farm-text-muted">Bà Con</span>
            <div className="w-5 h-5 flex items-center justify-center grayscale brightness-125">
              🌿
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});
