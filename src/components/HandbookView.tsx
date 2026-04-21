import { ChevronLeft, BookOpen, Droplets, Sprout, ShieldCheck, Thermometer, Info, Sun } from "lucide-react";
import { motion } from "motion/react";
import { memo, useState } from "react";
import imgRiSatCaPhe from "../assets/benh-ri-sat-ca-phe.jpg";
import imgXiMuSauRieng from "../assets/xi-mu-sau-rieng.png";

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
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <span className="text-[11px] font-bold text-blue-800 block mb-1">Cơ chế hóa sinh Tưới ép (Kỹ thuật vàng):</span>
                <p className="text-[11px] text-blue-900 leading-relaxed text-justify">
                  Sự "khô hạn" kéo dài 1-2 tháng làm giảm sút đột ngột Axit Abscisic (ABA) ở vùng rễ. Khi bà con tưới đẫm nước (400-600 lít/gốc bằng béc phun mưa cục bộ), áp suất thẩm thấu rễ tăng vọt. Nước đẩy lên cành kết hợp sự tổng hợp hóc môn Gibberellin (GA), đánh thức toàn bộ mầm hoa đang ngủ (dormancy), ép nụ cương to và bung nở đồng loạt trắng xóa. Phải kết hợp tưới phủ sương nếu không khí quá khô dòn, chống héo cánh hoa.
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
                <p className="text-[11px] font-bold text-red-700 mb-1">1. Dịch hại: Rệp sáp & Mọt đục cành</p>
                <div className="text-[10px] text-red-800 leading-relaxed space-y-1">
                  <p><span className="font-bold">Nguyên nhân gốc rễ:</span> Thời tiết khô hạn kéo dài là điều kiện vàng cho rệp sáp phát triển. Chúng cộng sinh với kiến, di chuyển lên các chùm hoa non hút cạn nhựa sống, làm hoa teo và rụng. Mọt đục cành thì tận dụng cành kiệt sức nấp vào đẻ trứng.</p>
                  <p><span className="font-bold">Cách trị:</span> Phun Spirotetramat ngay khi hoa vừa tàn. Cắt bỏ ngay cành héo mang ra ngoài vườn đốt để cắt đứt chu kỳ sinh sản.</p>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
                <p className="text-[11px] font-bold text-red-700 mb-1">2. Bệnh Khô cành khô quả (Thán thư - Colletotrichum coffeanum)</p>
                <div className="text-[10px] text-red-800 leading-relaxed space-y-1">
                  <p><span className="font-bold">Cơ chế phát sinh:</span> Nấm này ẩn nấp từ mùa vụ trước, gặp sự chênh lệch nhiệt độ lớn giữa ngày và đêm trong mùa khô thì tấn công các cành đã trổ hoa nhưng kiệt sức, làm cành thâm đen từ ngọn xuống.</p>
                  <p><span className="font-bold">Cách chặn:</span> Giữ lại hệ thống cây che bóng (như keo dậu, mắc ca) trong vườn để điều hòa tiểu khí hậu. Bón thúc phân Lân và phun Tebuconazole khi mầm hoa chớm thụ phấn.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-dashed border-farm-border pb-6">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-farm-secondary rounded-full border-4 border-white shadow-sm"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-bold text-farm-text-header">Đầu Mùa Mưa (T5 - T8)</span>
              <span className="text-[10px] bg-farm-surface text-farm-primary px-2 py-0.5 rounded-md font-bold">Phát triển trái</span>
            </div>
            <div className="space-y-3">
              <div className="bg-green-50/50 p-3 rounded-xl border border-green-100">
                <span className="text-[11px] font-bold text-green-800 block mb-1">Cơ chế hấp thu Phân bón mùn:</span>
                <p className="text-[11px] text-green-900 leading-relaxed text-justify">
                  Vào mùa mưa dầm, trực khuẩn rễ hoạt động mạnh nạp Đạm (N) và Lân (P) qua lông hút theo cơ chế trao đổi ion H+. Do hạt mưa làm rửa trôi kiềm, đất Bazan bị tụt pH dưới 4.5, Al3+ sẽ phóng thích làm thối đầu rễ tơ bó vón Lân lại. Phải bãi chất độn vôi bột hoặc Dolomite ngay từ đầu mùa mưa để nâng pH lên 5.5 - 6.5, tạo khoảng đệm (buffer) cho NPK tan chảy từ từ, trái mới bung to được không rụng.
                </p>
              </div>

              <div className="bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
                <p className="text-[12px] font-bold text-red-700 mb-2">1. Báo động: Bệnh Rỉ Sắt (Hemileia vastatrix)</p>
                <div className="flex gap-3 mb-2 items-start">
                  <img src={imgRiSatCaPhe} alt="Coffee Rust on Leaf" className="w-16 h-16 object-cover rounded-lg border border-red-200 flex-shrink-0 bg-white" />
                  <p className="text-[11px] text-red-800 leading-relaxed font-medium">
                    <span className="font-bold underline">Nguyên nhân:</span> Bào tử nấm rỉ sắt bám mặt dưới lá. Mưa ẩm liên tục giúp bào tử mọc giác hút đâm thủng khí khổng, rút sạch can-xi và diệp lục làm lá vàng ươm, rụng trơ cành. Cây kiệt quệ rụng sạch trái non.
                  </p>
                </div>
                <div className="text-[11px] text-red-800 leading-relaxed bg-white/50 p-2 rounded-lg mt-1 space-y-1">
                  <p><span className="font-bold text-red-900">Khắc phục:</span> Đầu mùa vạt bỏ bớt cành tăm, chồi vượt cho gió luồn vào. Phun chặn định kỳ bằng gốc thuốc Đồng (Copper). Trị bệnh dùng Hexaconazole hoặc Validamycin.</p>
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
                <p className="text-[12px] font-bold text-red-700 mb-2">2. Tuyến trùng rễ (Nematodes) - Vàng lá thối rễ</p>
                <div className="text-[10px] text-red-800 leading-relaxed space-y-1">
                  <p><span className="font-bold">Nhận biết & Nguyên nhân:</span> Giữa mùa mưa bỗng thấy cây vàng úa không lý do, nhổ rễ lên thấy rễ tơ nổi u cục có nốt sần. Do tuyến trùng chích cắn rễ tụt nhựa, nấm Fusarium chui qua vết cắn gây thối rễ triệt để.</p>
                  <p><span className="font-bold">Trị liệu chuyên sâu:</span> Đổ gốc bằng hỗn hợp nấm đối kháng Trichoderma phối trộn với thuốc Clinoptilolite hoặc Cytokinin để kích mọc lại rễ tơ. Hạn chế cuốc móc rễ tổn thương thêm.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-sm"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-bold text-farm-text-header">Thu Hoạch (T9 - T12)</span>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-bold">Vào nhân & Chín</span>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-farm-text-muted leading-relaxed">
                Bón phân chứa Kali tinh khiết cao vào tháng 9-10 để hạt đông đặc nhân, tích lũy tinh bột tối đa. Không tưới dẫm hay bón đạm lúc này.
              </p>
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
          <div className="relative pl-10 border-l border-farm-border pb-8">
            <div className="absolute left-[-16px] top-0 w-8 h-8 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-xs shadow-sm">I</div>
            <div className="mb-2">
              <h5 className="font-bold text-[15px] text-farm-text-header">Làm bông & Sổ nhụy (T11 - T2)</h5>
            </div>
            <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100 space-y-2 mb-3">
              <span className="text-[11px] font-bold text-orange-800 block">Tại sao phải tạo sốc nhiệt? (Xiết nước)</span>
              <p className="text-[11px] text-orange-900 leading-relaxed">
                Sầu riêng cần cảm nhận sự đe dọa sinh tồn (hạn ngập sương muối) để chuyển sang chế độ sinh sản. Việc xiết dứt điểm nước kết hợp xịt MKP giúp đẩy lùi hóc môn sinh trưởng nảy mầm (Gibberellin), đánh thức nẩy mắt cua đồng loạt không lác đác.
              </p>
              <span className="text-[11px] font-bold text-orange-800 block mt-2">Nghệ thuật Thụ Phấn Đêm:</span>
              <p className="text-[11px] text-orange-900 leading-relaxed">
                Giống Dona phấn đực văng hạt kém, nhụy cái chín trước nhị đực. Do đó, phải quét phấn từ bông nở hộc 19h sang bông non lúc 21h-22h. Nhờ vậy hộc sầu riêng sẽ đậu tròn, đều, không bị lép cong méo.
              </p>
            </div>
          </div>

          <div className="relative pl-10 border-l border-farm-border pb-8">
            <div className="absolute left-[-16px] top-0 w-8 h-8 bg-farm-surface rounded-2xl flex items-center justify-center text-farm-primary font-bold text-xs shadow-sm">II</div>
            <div className="mb-2">
              <h5 className="font-bold text-[15px] text-farm-text-header">Nuôi trái & Chặn đọt (T3 - T6)</h5>
            </div>
            <p className="text-xs text-farm-text-muted leading-relaxed mb-3">
              Khi trái ở ngày 45-60 cực kỳ nhạy cảm. Ức chế cơi đọt là quy luật sống còn bốc trái Dona. Nếu lá non bung, cây sẽ dồn toàn lực bơm lên lá mầm non, dẫn đến "chống trái" rụng đầy gốc. Phun chặn già lá ngay khi thấy le nhú.
            </p>
            <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
              <p className="text-[11px] font-bold text-red-700 block mb-1">Dịch hại: Rầy nhẩy & Nhện đỏ</p>
              <p className="text-[10px] text-red-800 leading-relaxed"><span className="font-bold">Hậu quả:</span> Hút kiệt nhựa đọt non và lá già, khiến lá rụng trơ cành. Cây mất nhà máy quang hợp tụt áp, múi sầu Dona sượng, nhạt nhẽo.<br /><span className="font-bold">Xử lý ngay:</span> Luân phiên Emitraz, Abamectin trộn với chế phẩm phủ màng sinh học.</p>
            </div>
          </div>

          <div className="relative pl-10 border-l border-farm-border">
            <div className="absolute left-[-16px] top-0 w-8 h-8 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm">III</div>
            <div className="mb-2">
              <h5 className="font-bold text-[15px] text-farm-text-header">Phục hồi & Mùa mưa ẩm (T7 - T10)</h5>
            </div>

            <div className="bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
              <p className="text-[12px] font-bold text-red-700 mb-2">1. Bệnh Xì Mủ Thân Sầu Riêng (Phytophthora palmivora)</p>
              <div className="flex gap-3 mb-2 items-start">
                <img src={imgXiMuSauRieng} alt="Phytophthora Canker on Durian" className="w-16 h-16 object-cover rounded-lg border border-red-200 flex-shrink-0 bg-white" />
                <p className="text-[11px] text-red-800 leading-relaxed font-medium">
                  <span className="font-bold underline">Cơ chế xâm nhiễm học:</span> Bào tử động (Zoospores) mang 2 tiên mao bơi lội trong dòng nước văng từ mặt đất lên thân. Men Cellulase tiết ra khoan thủng lớp Suberin bảo vệ vỏ, luồn sợ nấm cắm thẳng vào nhu mô và hệ mạch rây (Phloem), phá hủy mạch dẫn đến xì mủ thối đen.
                </p>
              </div>
              <div className="text-[11px] text-red-800 leading-relaxed bg-white/50 p-2 rounded-lg mt-1 space-y-1">
                <p><span className="font-bold text-red-900">1. Cơ chế nội hấp tiêm chích mạch:</span> Khoan lỗ góc 45 độ tiêm áp suất Phosphonate tinh khiết. Hệ chất lưu kéo Lân nội hấp hai chiều lên xuống thân, kích thích cây phóng Phytoalexin chủ động vây ráp tiêu diệt nấm từ bên trong.</p>
                <p><span className="font-bold text-red-900">2. Thuốc quét tiếp xúc:</span> Quét Metalaxyl phối chất bám dính (Surfactant) ngoài mặt vỏ đã cạo sạch tạo lớp màng diệt nấm thụ động.</p>
              </div>
            </div>

            <div className="bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
              <p className="text-[11px] font-bold text-red-700 mb-1">2. Bệnh Cháy lá (Rhizoctonia solani)</p>
              <p className="text-[10px] text-red-800 leading-relaxed">
                <span className="font-bold">Nguyên nhân:</span> Trong điều kiện ẩm độ bão hòa cuối mùa, hệ nấm nhện trắng sẽ nhang chóng lây từ lá nọ sang lá kia làm đám lá dính lại thành chùm và cháy xém cháy rụi như bị trụng nước sôi.<br />
                <span className="font-bold mt-1 inline-block">Khắc phục:</span> Kéo dãn tán cho nắng rọi xuyên qua. Phun thuốc nấm Validamycin 5%.
              </p>
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
          className={`flex-1 py-3 px-4 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "CA_PHE" ? "bg-white text-farm-primary shadow-sm" : "text-farm-text-muted"
            }`}
        >
          <BookOpen className="w-4 h-4" />
          Cà Phê
        </button>
        <button
          onClick={() => setActiveTab("SA_RIENG" as any === "SA_RIENG" ? "SAU_RIENG" : "SAU_RIENG")} // Fix type if typo
          onMouseDown={() => setActiveTab("SAU_RIENG")}
          className={`flex-1 py-3 px-4 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "SAU_RIENG" ? "bg-white text-farm-primary shadow-sm" : "text-farm-text-muted"
            }`}
        >
          <Info className="w-4 h-4" />
          Sầu Riêng
        </button>
      </div>

      {activeTab === "CA_PHE" ? <ContentCoffee /> : <ContentDurian />}

      <footer className="mt-auto pt-10 pb-6 text-center">
        <p className="text-[10px] text-farm-text-muted/60 font-medium">
          Dữ liệu kỹ thuật cập nhật theo tiêu chuẩn VietGAP & GlobalGAP <br />
          Phù hợp cho Lâm Đồng, Đắk Lắk, Gia Lai, Đắk Nông.
        </p>
      </footer>
    </motion.div>
  );
});
