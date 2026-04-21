import { ChevronLeft, BookOpen, Droplets, Sprout, ShieldCheck, Thermometer, Info, Sun } from "lucide-react";
import { motion } from "motion/react";
import { memo, useState } from "react";

interface HandbookViewProps {
  onBack: () => void;
}

type PlantType = "CA_PHE" | "SAU_RIENG";

export const HandbookView = memo(function HandbookView({ onBack }: HandbookViewProps) {
  const [activeTab, setActiveTab] = useState<PlantType>("CA_PHE");

  const ContentCoffee = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white rounded-3xl p-6 border border-farm-border shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-farm-primary">
          <div className="p-2 bg-farm-surface rounded-xl">
             <Info className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-lg">Lịch Trình Canh Tác Thuần Thục</h4>
        </div>
        
        <div className="space-y-6">
          <div className="relative pl-8 border-l-2 border-dashed border-farm-border pb-6">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-orange-400 rounded-full border-4 border-white shadow-sm"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-bold text-farm-text-header">Giai đoạn Mùa Khô (T1 - T4)</span>
              <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md font-bold">Tưới & Trổ bông</span>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-farm-text-muted leading-relaxed">
                Tưới nước đợt 1 ngay sau khi mầm hoa đã phân hóa rõ. Đây là thời điểm quyết định năng suất. Tưới đủ 400-600 lít/gốc để hoa nở đồng loạt, tránh hoa "chanh".
              </p>
              <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                <p className="text-[11px] font-bold text-red-700 mb-1">Dịch hại: Rệp sáp & Mọt đục cành</p>
                <p className="text-[10px] text-red-600 leading-relaxed">
                  <span className="font-bold">Cách trị:</span> Phun hoạt chất Spirotetramat ngay khi hoa vừa tàn nếu thấy dấu hiệu rệp. Với mọt, cần cắt bỏ cành héo và tiêu hủy ngoài vườn.
                </p>
              </div>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-dashed border-farm-border pb-6">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-farm-secondary rounded-full border-4 border-white shadow-sm"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-bold text-farm-text-header">Giai đoạn Đầu Mùa Mưa (T5 - T8)</span>
              <span className="text-[10px] bg-farm-surface text-farm-primary px-2 py-0.5 rounded-md font-bold">Phát triển trái</span>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-farm-text-muted leading-relaxed">
                Cây cần lượng đạm và lân cao. Bón đợt 1 (T5) và đợt 2 (T7). Kiểm soát cỏ dại để tránh cạnh tranh dinh dưỡng.
              </p>
              <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                <p className="text-[11px] font-bold text-red-700 mb-1">Dịch hại: Rỉ sắt & Nấm hồng</p>
                <p className="text-[10px] text-red-600 leading-relaxed">
                  <span className="font-bold">Cách trị:</span> Phun định kỳ Hexaconazole hoặc hoạt chất chứa đồng để bảo vệ bộ lá. Tăng cường bón vôi để cải thiện độ pH đất mùa mưa.
                </p>
              </div>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-sm"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-bold text-farm-text-header">Giai đoạn Thu Hoạch (T9 - T12)</span>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-bold">Vào nhân & Chín</span>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-farm-text-muted leading-relaxed">
                Tăng cường bón Kali để hạt vào nhân chắc, đạt độ chín đồng đều. Thu hoạch khi tỷ lệ quả chín trên cây đạt trên 90%.
              </p>
              <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                <p className="text-[11px] font-bold text-red-700 mb-1">Dịch hại: Nấm thối cuống quả</p>
                <p className="text-[10px] text-red-600 leading-relaxed">
                  <span className="font-bold">Cách trị:</span> Phun thuốc phòng nấm trước thu hoạch 30 ngày. Thu hoạch đúng độ chín, không để quả khô quá lâu trên cây.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const ContentDurian = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <section className="bg-white rounded-3xl p-6 border border-farm-border shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-orange-600">
          <div className="p-2 bg-orange-50 rounded-xl">
             <Sun className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-lg">Lịch Trình Dona (Monthong) Chuyên Sâu</h4>
        </div>
        
        <div className="space-y-8">
          {/* Phase 1: Blooming */}
          <div className="relative pl-10 border-l border-farm-border pb-8">
            <div className="absolute left-[-16px] top-0 w-8 h-8 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-xs shadow-sm">I</div>
            <div className="mb-2">
              <h5 className="font-bold text-[15px] text-farm-text-header">Làm bông & Sổ nhụy (T11 - T2)</h5>
            </div>
            <p className="text-[12px] text-farm-text-muted mb-3 leading-relaxed">Kích mắt cua bằng MKP. Xiết nước tạo sốc nhiệt. Thụ phấn thủ công ban đêm từ 19h - 22h.</p>
            <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
               <p className="text-[11px] font-bold text-red-700 block mb-1">Dịch hại: Bệnh thán thư bông</p>
               <p className="text-[10px] text-red-800"><span className="font-bold">Xử lý:</span> Phun Amistar hoặc thuốc chứa hoạt chất Metalaxyl định kỳ 7 ngày/lần. Tránh để sương muối đọng trên bông.</p>
            </div>
          </div>

          {/* Phase 2: Fruit Dev */}
          <div className="relative pl-10 border-l border-farm-border pb-8">
            <div className="absolute left-[-16px] top-0 w-8 h-8 bg-farm-surface rounded-2xl flex items-center justify-center text-farm-primary font-bold text-xs shadow-sm">II</div>
            <div className="mb-2">
              <h5 className="font-bold text-[15px] text-farm-text-header">Nuôi trái & Chặn đọt (T3 - T6)</h5>
            </div>
            <p className="text-[12px] text-farm-text-muted mb-3 leading-relaxed">Bón NPK 12-11-18. Kiểm soát cơi đọt không cho cây đi đọt non khi đang nuôi trái để tránh cạnh tranh dinh dưỡng làm rụng trái.</p>
            <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
               <p className="text-[11px] font-bold text-red-700 block mb-1">Dịch hại: Rầy nhảy & Sâu đục quả</p>
               <p className="text-[10px] text-red-800"><span className="font-bold">Xử lý:</span> Phun hoạt chất Emamectin hoặc Abamectin phối hợp với dầu khoáng vào chiều tối để diệt sâu nằm trong kẽ gai sầu riêng.</p>
            </div>
          </div>

           {/* Phase 3: Recovery */}
           <div className="relative pl-10 border-l border-farm-border">
            <div className="absolute left-[-16px] top-0 w-8 h-8 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm">III</div>
            <div className="mb-2">
              <h5 className="font-bold text-[15px] text-farm-text-header">Phục hồi & Mùa mưa (T7 - T10)</h5>
            </div>
            <p className="text-[12px] text-farm-text-muted mb-3 leading-relaxed">Tỉa cành, xử lý gốc bằng vôi. Bổ sung hữu cơ đậm đặc để phục hồi dàn rễ và tăng sức đề kháng.</p>
            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
               <p className="text-[11px] font-bold text-blue-700 block mb-1">Bệnh: Xì mủ & Thối rễ (Phytophthora)</p>
               <p className="text-[10px] text-blue-800"><span className="font-bold">Xử lý:</span> Mùa mưa Tây Nguyên ẩm độ cao, cần quét gốc thuốc gốc Đồng (Copper) và đảm bảo rãnh thoát nước thông thoáng.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col flex-1"
    >
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2.5 rounded-xl bg-white shadow-sm border border-farm-border text-farm-text active:scale-90 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h3 className="text-xl font-display font-bold text-farm-text-header">Cẩm Nang Nông Nghiệp</h3>
          <p className="text-[11px] text-farm-text-muted font-medium uppercase tracking-wider">Thổ nhưỡng Tây Nguyên</p>
        </div>
      </div>

      <div className="flex p-1.5 bg-farm-surface/50 rounded-2xl mb-8 border border-farm-border/50">
        <button
          onClick={() => setActiveTab("CA_PHE")}
          className={`flex-1 py-3 px-4 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "CA_PHE" ? "bg-white text-farm-primary shadow-sm" : "text-farm-text-muted"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Cà Phê
        </button>
        <button
          onClick={() => setActiveTab("SA_RIENG" as any === "SA_RIENG" ? "SAU_RIENG" : "SAU_RIENG")} // Fix type if typo
          onMouseDown={() => setActiveTab("SAU_RIENG")}
          className={`flex-1 py-3 px-4 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "SAU_RIENG" ? "bg-white text-farm-primary shadow-sm" : "text-farm-text-muted"
          }`}
        >
          <Info className="w-4 h-4" />
          Sầu Riêng
        </button>
      </div>

      {activeTab === "CA_PHE" ? <ContentCoffee /> : <ContentDurian />}

      <footer className="mt-auto pt-10 pb-6 text-center">
        <p className="text-[10px] text-farm-text-muted/60 font-medium">
          Dữ liệu kỹ thuật cập nhật theo tiêu chuẩn VietGAP & GlobalGAP <br/> 
          Phù hợp cho Lâm Đồng, Đắk Lắk, Gia Lai, Đắk Nông.
        </p>
      </footer>
    </motion.div>
  );
});
