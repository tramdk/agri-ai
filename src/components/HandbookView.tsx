import { ChevronLeft, BookOpen, Droplets, Sprout, ShieldCheck, Thermometer, Info, Sun } from "lucide-react";
import { motion } from "motion/react";
import { memo, useState } from "react";
import imgRiSatCaPhe from "../assets/benh-ri-sat-ca-phe.jpg";
import imgXiMuSauRieng from "../assets/xi-mu-sau-rieng.png";
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Volume2, Square } from "lucide-react";

interface HandbookViewProps {
  onBack: () => void;
}

type PlantType = "CA_PHE" | "SAU_RIENG";

export const HandbookView = memo(function HandbookView({ onBack }: HandbookViewProps) {
  const [activeTab, setActiveTab] = useState<PlantType>("CA_PHE");
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);

  const handleSpeak = async (text: string, sectionId: string) => {
    try {
      if (speakingSection === sectionId) {
        await TextToSpeech.stop();
        setSpeakingSection(null);
      } else {
        await TextToSpeech.stop(); // Stop anything else
        setSpeakingSection(sectionId);
        await TextToSpeech.speak({
          text: text,
          lang: 'vi-VN',
          rate: 0.9, // slightly slower for better clarity
          pitch: 1.0,
        });
        // Note: Capacitor TTS doesn't reliably fire an event when done, 
        // so we just reset state when they click stop manually or play another.
      }
    } catch (e) {
      console.warn("TTS Error (possibly web platform):", e);
      // Web fallback
      if ('speechSynthesis' in window) {
        if (speakingSection === sectionId) {
          window.speechSynthesis.cancel();
          setSpeakingSection(null);
        } else {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'vi-VN';
          utterance.rate = 0.9;
          utterance.onend = () => setSpeakingSection(null);
          setSpeakingSection(sectionId);
          window.speechSynthesis.speak(utterance);
        }
      }
    }
  };

  // Helper component for TTS Button
  const TTSButton = ({ text, sectionId }: { text: string, sectionId: string }) => {
    const isSpeaking = speakingSection === sectionId;
    return (
      <button 
        onClick={() => handleSpeak(text, sectionId)}
        className={`shrink-0 p-2 rounded-full transition-colors shadow-sm ml-2 ${isSpeaking ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-farm-primary/10 text-farm-primary hover:bg-farm-primary/20'}`}
        aria-label="Đọc văn bản"
      >
        {isSpeaking ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
      </button>
    );
  };

  const ContentCoffee = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white rounded-3xl p-6 border border-farm-border shadow-sm">
        <div className="flex items-start sm:items-center gap-3 mb-5 text-farm-primary">
          <div className="p-2 bg-farm-surface rounded-xl shrink-0 mt-1 sm:mt-0">
            <Info className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-[18px] leading-snug">Lịch Trình Canh Tác Thuần Thục</h4>
        </div>

        <div className="space-y-6">
          <div className="relative pl-8 border-l-2 border-dashed border-farm-border pb-6">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-orange-400 rounded-full border-4 border-white shadow-sm"></div>
            <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-2 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-[15px] font-bold text-farm-text-header">
                  Mùa Khô (T1-T4)
                </span>
                <TTSButton 
                  sectionId="cf-1" 
                  text="Giai đoạn Mùa Khô, từ tháng 1 đến tháng 4. Tập trung vào Tưới và Trổ bông. Cơ chế hóa sinh Tưới ép: Sự khô hạn kéo dài 1 đến 2 tháng làm giảm sút đột ngột Axit Abscisic ở vùng rễ. Khi bà con tưới đẫm nước, áp suất thẩm thấu rễ tăng vọt. Nước đẩy lên cành kết hợp hóc môn đánh thức toàn bộ mầm hoa đang ngủ, ép nụ cương to và bung nở đồng loạt trắng xóa. Dịch hại cần lưu ý: Rệp sáp và Mọt đục cành. Thời tiết khô hạn kéo dài là điều kiện vàng cho rệp sáp phát triển. Cần phun Thuốc ngay khi hoa vừa tàn. Ngoài ra cần đề phòng Bệnh Khô cành khô quả do nấm ẩn nấp từ mùa vụ trước." 
                />
              </div>
              <span className="text-[11px] bg-orange-100 text-orange-700 px-2 py-1 rounded-md font-bold whitespace-nowrap">Tưới & Trổ bông</span>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <span className="text-[14px] font-bold text-blue-800 block mb-2">Cơ chế hóa sinh Tưới ép (Kỹ thuật vàng):</span>
                <p className="text-[14px] text-blue-900 leading-relaxed text-justify">
                  Sự "khô hạn" kéo dài 1-2 tháng làm giảm sút đột ngột Axit Abscisic (ABA) ở vùng rễ. Khi bà con tưới đẫm nước (400-600 lít/gốc bằng béc phun mưa cục bộ), áp suất thẩm thấu rễ tăng vọt. Nước đẩy lên cành kết hợp sự tổng hợp hóc môn Gibberellin (GA), đánh thức toàn bộ mầm hoa đang ngủ (dormancy), ép nụ cương to và bung nở đồng loạt trắng xóa. Phải kết hợp tưới phủ sương nếu không khí quá khô giòn, chống héo cánh hoa.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-3">
                <p className="text-[14px] font-bold text-red-700 mb-2">1. Dịch hại: Rệp sáp & Mọt đục cành</p>
                <div className="text-[14px] text-red-800 leading-relaxed space-y-2">
                  <p><span className="font-bold">Nguyên nhân gốc rễ:</span> Thời tiết khô hạn kéo dài là điều kiện vàng cho rệp sáp phát triển. Chúng cộng sinh với kiến, di chuyển lên các chùm hoa non hút cạn nhựa sống, làm hoa teo và rụng. Mọt đục cành thì tận dụng cành kiệt sức nấp vào đẻ trứng.</p>
                  <p><span className="font-bold">Cách trị:</span> Phun Spirotetramat ngay khi hoa vừa tàn. Cắt bỏ ngay cành héo mang ra ngoài vườn đốt để cắt đứt chu kỳ sinh sản.</p>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-3">
                <p className="text-[14px] font-bold text-red-700 mb-2">2. Bệnh Khô cành khô quả (Thán thư)</p>
                <div className="text-[14px] text-red-800 leading-relaxed space-y-2">
                  <p><span className="font-bold">Cơ chế phát sinh:</span> Nấm ẩn nấp từ mùa vụ trước, gặp sự chênh lệch nhiệt độ lớn ngày và đêm thì tấn công các cành trổ hoa kiệt sức.</p>
                  <p><span className="font-bold">Cách chặn:</span> Giữ lại hệ thống cây che bóng (keo dậu, mắc ca). Bón thúc phân Lân và phun Tebuconazole khi mầm hoa chớm thụ phấn.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-dashed border-farm-border pb-6">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-farm-secondary rounded-full border-4 border-white shadow-sm"></div>
            <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-2 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-[15px] font-bold text-farm-text-header">
                  Mùa Mưa (T5-T8)
                </span>
                <TTSButton 
                  sectionId="cf-2" 
                  text="Đầu Mùa Mưa, từ tháng 5 đến tháng 8. Tập trung phát triển trái. Cơ chế hấp thu Phân bón mùn: Vào mùa mưa dầm, đất Ba dan bị tụt pH. Phải bãi chất độn vôi bột hoặc Đô lô mít ngay từ đầu mùa mưa để nâng độ pH, giúp phân vô cơ tan chảy từ từ, trái mới bung to được. Quan trọng: Báo động Bệnh Rỉ Sắt. Mưa ẩm liên tục giúp bào tử đâm thủng khí khổng, rút sạch canxi và diệp lục làm lá rụng trơ cành. Cần vạt bỏ bớt cành tăm, phun chặn bằng thuốc gốc Đồng. Bệnh Tuyến trùng rễ làm rễ nổi cục bướu, chữa bằng nấm đối kháng Tricho đéc ma." 
                />
              </div>
              <span className="text-[11px] bg-farm-surface text-farm-primary px-2 py-1 rounded-md font-bold whitespace-nowrap">Phát triển trái</span>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                <span className="text-[14px] font-bold text-green-800 block mb-2">Cơ chế hấp thu Phân bón mùn:</span>
                <p className="text-[14px] text-green-900 leading-relaxed text-justify">
                  Vào mùa mưa dầm, trực khuẩn rễ hoạt động mạnh nạp Đạm và Lân qua lông hút. Do hạt mưa làm rửa trôi kiềm, đất Bazan bị tụt pH dưới 4.5. Phải rải vôi bột hoặc Dolomite ngay từ đầu mùa mưa để nâng pH lên 5.5 - 6.5, giúp NPK tan chậm, trái mới bung to không rụng.
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-3">
                <p className="text-[14px] font-bold text-red-700 mb-3">1. Báo động: Bệnh Rỉ Sắt (Hemileia vastatrix)</p>
                <div className="flex flex-col sm:flex-row gap-4 mb-3 items-start">
                  <img src={imgRiSatCaPhe} alt="Coffee Rust on Leaf" className="w-24 h-24 object-cover rounded-xl border border-red-200 flex-shrink-0 bg-white" />
                  <p className="text-[14px] text-red-800 leading-relaxed font-medium">
                    <span className="font-bold underline">Nguyên nhân:</span> Bào tử nấm rỉ sắt bám mặt dưới lá. Mưa ẩm liên tục giúp bào tử mọc giác hút đâm thủng khí khổng, rút sạch can-xi và diệp lục làm lá vàng ươm, rụng trơ cành. Cây kiệt quệ rụng sạch trái non.
                  </p>
                </div>
                <div className="text-[14px] text-red-800 leading-relaxed bg-white/60 p-3 rounded-lg mt-2 space-y-2">
                  <p><span className="font-bold text-red-900">Khắc phục:</span> Đầu mùa vạt bỏ bớt cành tăm cho thoáng. Phun chặn định kỳ bằng gốc Đồng (Copper). Trị bệnh dùng Hexaconazole.</p>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-3">
                <p className="text-[14px] font-bold text-red-700 mb-2">2. Tuyến trùng rễ (Nematodes) - Vàng lá thối rễ</p>
                <div className="text-[14px] text-red-800 leading-relaxed space-y-2">
                  <p><span className="font-bold">Nhận biết & Nguyên nhân:</span> Cây vàng úa không lý do, nhổ rễ thấy rễ tơ nổi u cục có nốt sần. Do tuyến trùng chích cắn làm u rễ.</p>
                  <p><span className="font-bold">Trị liệu chuyên sâu:</span> Đổ gốc bằng hỗn hợp nấm đối kháng Trichoderma. Hạn chế cuốc hố cày xới làm đứt rễ.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-sm"></div>
            <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-2 mb-3">
              <div className="flex items-center gap-1">
                <span className="text-[15px] font-bold text-farm-text-header">
                  Thu Hoạch (T9-T12)
                </span>
                <TTSButton 
                  sectionId="cf-3" 
                  text="Thu Hoạch từ tháng 9 tới tháng 12. Giai đoạn Vào nhân và Chín. Bà con cần bón phân chứa Kali tinh khiết cao vào tháng 9 tới tháng 10 để hạt đông đặc nhân, tích lũy tinh bột tối đa. Tuyệt đối không bón thêm phân đạm lúc này." 
                />
              </div>
              <span className="text-[11px] bg-red-100 text-red-700 px-2 py-1 rounded-md font-bold whitespace-nowrap">Vào nhân & Chín</span>
            </div>
            <div className="space-y-4">
              <p className="text-[14px] text-farm-text-muted leading-relaxed p-4 bg-gray-50 rounded-xl border border-gray-100">
                Bón phân chứa Kali tinh khiết cao vào tháng 9-10 để hạt đông đặc nhân, tích lũy tinh bột tối đa. Tuyệt đối không bón đạm lúc này gây bung đọt đi ngọn.
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
        <div className="flex items-start sm:items-center gap-3 mb-6 text-orange-600">
          <div className="p-2 bg-orange-50 rounded-xl shrink-0 mt-1 sm:mt-0">
            <Sun className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-[18px] leading-snug">Lịch Trình Dona Chuyên Sâu</h4>
        </div>

        <div className="space-y-10">
          <div className="relative pl-10 border-l-2 border-dashed border-farm-border pb-8">
            <div className="absolute left-[-16px] top-0 w-8 h-8 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-bold text-sm shadow-sm">I</div>
            <div className="mb-3">
              <div className="flex items-center gap-1">
                <h5 className="font-bold text-[15px] text-farm-text-header">Làm bông & Sổ nhụy (T11-T2)</h5>
                <TTSButton 
                  sectionId="sr-1" 
                  text="Giai đoạn Làm bông và Sổ nhụy từ tháng 11 đến tháng 2 năm sau. Tại sao phải tạo sốc nhiệt xiết nước? Sầu riêng cần cảm nhận sự đe dọa sinh tồn do hạn hán để chuyển sang chế độ sinh sản. Việc xiết dứt điểm nước kết hợp xịt MKP giúp đánh thức nẩy mắt cua đồng loạt. Về nghệ thuật thụ phấn đêm: Giống sầu riêng Đô Na phấn đực văng hạt kém, nhụy cái chín trước nhị đực. Do đó, phải quét phấn từ bông nở lúc 19 giờ sang bông non lúc 21 giờ. Nhờ vậy múi sầu riêng sẽ đậu tròn, đều, không bị lép cong méo." 
                />
              </div>
            </div>
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-3 mb-4">
              <span className="text-[14px] font-bold text-orange-800 block">Tại sao phải tạo sốc nhiệt? (Xiết nước)</span>
              <p className="text-[14px] text-orange-900 leading-relaxed text-justify">
                Sầu riêng cần cảm nhận sự đe dọa sinh tồn (hạn, sương muối) để chuyển sang chế độ sinh sản. Việc xiết dứt điểm nước kết hợp xịt thuốc MKP giúp đánh thức mầm nẩy mắt cua đồng loạt không lác đác.
              </p>
              <div className="w-full h-px bg-orange-200 my-2"></div>
              <span className="text-[14px] font-bold text-orange-800 block">Nghệ thuật Thụ Phấn Đêm:</span>
              <p className="text-[14px] text-orange-900 leading-relaxed text-justify">
                Giống Dona phấn đực văng hạt kém. Phải quét chéo phấn từ bông nở sớm (19h) sang bông non (21h-22h). Nhờ vậy hộc sầu riêng sẽ đậu tròn, đều, hộc đầy muối, không bị lép hộc cong méo.
              </p>
            </div>
          </div>

          <div className="relative pl-10 border-l-2 border-dashed border-farm-border pb-8">
            <div className="absolute left-[-16px] top-0 w-8 h-8 bg-farm-surface rounded-2xl flex items-center justify-center text-farm-primary font-bold text-sm shadow-sm">II</div>
            <div className="mb-3">
              <div className="flex items-center gap-1">
                <h5 className="font-bold text-[15px] text-farm-text-header">Nuôi trái & Chặn đọt (T3-T6)</h5>
                <TTSButton 
                  sectionId="sr-2" 
                  text="Giai đoạn nuôi trái và chặn đọt từ tháng 3 tới tháng 6. Khi trái non cực kỳ nhạy cảm. Ức chế đọt non là quy luật sống còn. Nếu lá non bung, cây sẽ dồn toàn lực bơm nuôi lá non, dẫn đến rụng trái non đầy gốc. Phải phun chặn ngừa ngay khi thấy le nhú. Dịch hại chính là Rầy nhẩy và Nhện đỏ hút kiệt nhựa đọt non khiến lá rụng trơ cành. Cần luân phiên xịt thuốc Emitraz và Abamectin." 
                />
              </div>
            </div>
            <p className="text-[14px] text-farm-text-muted leading-relaxed mb-4 text-justify p-4 bg-gray-50 rounded-xl border border-gray-100">
              Khi trái ở ngày 45-60 cực kỳ nhạy cảm. <strong>Ức chế cơi đọt là quy luật sống còn.</strong> Nếu đọt non bung, cây sẽ dồn sinh trưởng bơm lên lá non, dẫn đến "đẩy trái" rụng đầy gốc. Phun chặn lá chuyên sâu ngay khi chồi non nhú.
            </p>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <p className="text-[14px] font-bold text-red-700 block mb-2">Dịch hại: Rầy nhẩy & Nhện đỏ</p>
              <p className="text-[14px] text-red-800 leading-relaxed"><span className="font-bold">Hậu quả:</span> Hút kiệt nhựa đọt non và lá già, khiến lá rụng trơ cành. Cây mất nhà máy quang hợp hút mủ, múi sầu Dona sượng, nhạt nhẽo.<br /><br /><span className="font-bold">Xử lý ngay:</span> Luân phiên Emitraz, Abamectin trộn với chế phẩm phủ màng sinh học bọc kín rầy.</p>
            </div>
          </div>

          <div className="relative pl-10">
            <div className="absolute left-[-16px] top-0 w-8 h-8 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm">III</div>
            <div className="mb-3">
              <div className="flex items-center gap-1">
                <h5 className="font-bold text-[15px] text-farm-text-header">Phục hồi & Mùa mưa (T7-T10)</h5>
                <TTSButton 
                  sectionId="sr-3" 
                  text="Giai đoạn phục hồi và mùa mưa, từ tháng 7 đến tháng 10. Chú ý cao độ Bệnh Xì Mủ Thân do nấm phai tốp tho ra gây ra. Nấm theo nước từ đất bắn lên thân vào mạch cây gây xì mủ thối vỏ đen vỏ. Cách tiêu diệt: Dùng cơ chế nội hấp tiêm chích vào mạch cây thuốc Phốt phô nát tinh khiết. Hệ chất lưu kéo thẳng thuốc lên xuống hai chiều. Hoặc cạo sạch vỏ thối rồi quét thuốc Men ta lắc xiu." 
                />
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-3">
              <p className="text-[14px] font-bold text-red-700 mb-3">1. Bệnh Xì Mủ Thân Sầu Riêng (Phytophthora)</p>
              <div className="flex flex-col sm:flex-row gap-4 mb-3 items-start">
                <img src={imgXiMuSauRieng} alt="Phytophthora Canker on Durian" className="w-24 h-24 object-cover rounded-xl border border-red-200 flex-shrink-0 bg-white" />
                <p className="text-[14px] text-red-800 leading-relaxed font-medium">
                  <span className="font-bold underline">Cơ chế xâm nhiễm học:</span> Bào tử nấm bơi lội trong dòng nước văng từ mặt đất lên thân. Men Cellulase tiết ra khoan thủng lớp bảo vệ vỏ, phá hủy mạch dẫn đến xì mủ thối đen loang lổ.
                </p>
              </div>
              <div className="text-[14px] text-red-800 leading-relaxed bg-white/60 p-3 rounded-lg mt-2 space-y-3">
                <p><span className="font-bold text-red-900 block mb-1">1. Tiêm chích mạch:</span> Khoan lỗ góc 45 độ tiêm áp suất Phosphonate tinh khiết. Thuốc lưu dẫn hai chiều kích thích cây phóng kháng thể chủ động vây ráp nấm.</p>
                <div className="w-full h-px bg-red-200 opacity-50"></div>
                <p><span className="font-bold text-red-900 block mb-1">2. Thuốc quét vỏ:</span> Cạo mỏng hết lớp vỏ bầm đen tới gỗ trắng cạn, quét Metalaxyl đậm đặc phối chất bám dính tránh sương rửa trôi.</p>
              </div>
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
