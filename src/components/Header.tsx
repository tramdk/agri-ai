import { Settings } from "lucide-react";
import { memo } from "react";

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header = memo(function Header({ onOpenSettings }: HeaderProps) {
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-farm-border p-6 sticky top-0 z-30">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-farm-primary rounded-lg flex items-center justify-center">
             <span className="text-white text-lg font-bold">N</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-farm-text-header m-0">
            Nông Y <span className="font-light opacity-50">AI</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl text-farm-text-muted hover:bg-farm-surface hover:text-farm-primary transition-all active:scale-95"
            aria-label="Cài đặt"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-farm-surface rounded-full border border-farm-border">
            <span className="text-[13px] font-medium text-farm-text-muted hidden sm:inline">Bà Con</span>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm">
              🌾
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});
