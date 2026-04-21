import { WifiOff, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { memo, useEffect, useState } from "react";

export const OfflineNotice = memo(function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-6 right-6 z-[9999] flex justify-center"
        >
          <div className="bg-red-500 text-white px-6 py-4 rounded-[24px] shadow-2xl shadow-red-500/30 flex items-center gap-4 border border-white/20 backdrop-blur-md max-w-md w-full">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <WifiOff className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[15px]">Mất Kết Nối Internet</h4>
              <p className="text-[12px] opacity-90 leading-tight">Vui lòng kiểm tra kết nối mạng để tiếp tục sử dụng các tính năng trực tuyến.</p>
            </div>
            <div className="animate-pulse">
              <AlertCircle className="w-5 h-5 text-white/60" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
