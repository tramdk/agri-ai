import { ChevronLeft, Trash2, Calendar, Leaf } from "lucide-react";
import { motion } from "motion/react";
import { memo, useMemo } from "react";
import { HistoryEntry } from "../services/history";

interface HistoryListViewProps {
  items: HistoryEntry[];
  onSelectItem: (item: HistoryEntry) => void;
  onDeleteItem: (id: string) => void;
  onBack: () => void;
  onClearAll: () => void;
}

export const HistoryListView = memo(function HistoryListView({
  items,
  onSelectItem,
  onDeleteItem,
  onBack,
  onClearAll
}: HistoryListViewProps) {
  
  const groupedItems = useMemo(() => {
    const groups: Record<string, HistoryEntry[]> = {};
    items.forEach(item => {
      const plant = item.analysis.plantName || "Khác";
      if (!groups[plant]) groups[plant] = [];
      groups[plant].push(item);
    });
    return groups;
  }, [items]);

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1"
    >
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-farm-surface text-farm-text transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h3 className="text-xl font-display font-bold text-farm-text-header">Lịch sử tra cứu</h3>
        <button 
          onClick={() => {
            if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử?")) {
              onClearAll();
            }
          }}
          className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
          title="Xóa tất cả"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-farm-surface p-6 rounded-full mb-4">
            <Leaf className="w-12 h-12 text-farm-primary opacity-30" />
          </div>
          <p className="text-farm-text-muted font-medium">Chưa có lịch sử tra cứu nào.</p>
        </div>
      ) : (
        <div className="space-y-8 pb-10">
          {Object.entries(groupedItems).map(([plantName, entries]) => (
            <div key={plantName} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-6 bg-farm-secondary rounded-full"></div>
                <h4 className="font-bold text-farm-text-header text-lg">{plantName}</h4>
                <span className="text-xs font-bold bg-farm-surface text-farm-primary px-2 py-0.5 rounded-full">
                  {entries.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {entries.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={() => onSelectItem(item)}
                      className="flex-1 flex text-left bg-white border border-farm-border rounded-[24px] p-3 hover:shadow-premium transition-all active:scale-[0.98] group overflow-hidden"
                    >
                      <div className="w-20 h-20 rounded-[16px] overflow-hidden flex-shrink-0 border border-farm-border bg-farm-surface">
                        <img 
                          src={item.image} 
                          alt={item.analysis.plantName} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col justify-center min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-farm-text-header text-[15px] truncate mr-2">
                            {item.analysis.diseaseName}
                          </span>
                          <div className="flex items-center text-[11px] text-farm-text-muted font-medium flex-shrink-0">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(item.timestamp).split(',')[0]}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.analysis.status.includes("Khỏe") || item.analysis.status.includes("Bình thường")
                              ? "bg-green-100 text-green-700"
                              : item.analysis.status.includes("Nặng") || item.analysis.status.includes("Trọng")
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}>
                            {item.analysis.status}
                          </span>
                        </div>
                        <p className="text-[12px] text-farm-text-muted line-clamp-1 opacity-80 italic">
                          {item.analysis.advice}
                        </p>
                      </div>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Xóa bản ghi này?")) onDeleteItem(item.id);
                      }}
                      className="p-2.5 rounded-xl hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
});
