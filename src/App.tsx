/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Camera, Upload, AlertCircle, Leaf, CheckCircle2, ChevronLeft, Droplets, FlaskConical, Scissors, Info, Sprout, ShieldAlert, Settings, KeyRound, X } from "lucide-react";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { analyzePlantImage, DiseaseAnalysis } from "./services/gemini";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [appState, setAppState] = useState<"IDLE" | "PREVIEW" | "ANALYZING" | "RESULT" | "ERROR">("IDLE");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("");
  const [plantContext, setPlantContext] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const localKey = localStorage.getItem("nongyai_gemini_key");
    if (localKey) setApiKeyInput(localKey);
  }, []);

  const saveApiKey = () => {
    if (apiKeyInput.trim() === "") {
      localStorage.removeItem("nongyai_gemini_key");
    } else {
      localStorage.setItem("nongyai_gemini_key", apiKeyInput.trim());
    }
    setShowSettings(false);
    if (appState === "ERROR" && errorMsg.includes("Gemini AI API Key chưa được cấu hình")) {
      resetToIdle();
    }
  };

  const resetToIdle = () => {
    setAppState("IDLE");
    setImagePreview(null);
    setImageMimeType("");
    setPlantContext("");
    setAnalysisResult(null);
    setErrorMsg("");
  };

  const handleProcessFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chọn một tệp hình ảnh hợp lệ (jpg, png).");
      setAppState("ERROR");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setImageMimeType(file.type);
      setAppState("PREVIEW");
    };
    reader.readAsDataURL(file);
    
    // Clear input so the same file can be selected again if needed
    e.target.value = "";
  };

  const confirmAnalysis = async () => {
    if (!imagePreview) return;
    setAppState("ANALYZING");

    try {
      const base64Data = imagePreview.split(",")[1];
      const { analysis, newHistory } = await analyzePlantImage(base64Data, imageMimeType, plantContext, chatHistory);
      setAnalysisResult(analysis);
      setChatHistory(newHistory);
      setAppState("RESULT");
    } catch (err: any) {
      console.error(err);
      if (err.message === "MISSING_API_KEY") {
        setErrorMsg("Gemini AI API Key chưa được cấu hình. Vui lòng thêm API Key trong phần Cài đặt.");
        setShowSettings(true);
      } else {
        setErrorMsg(err.message || "Đã xảy ra lỗi trong quá trình phân tích hình ảnh.");
      }
      setAppState("ERROR");
    }
  };

  const getMethodIcon = (method: string) => {
    const lower = method.toLowerCase();
    let IconElement = CheckCircle2;
    if (lower.includes("hóa")) IconElement = FlaskConical;
    else if (lower.includes("sinh học")) IconElement = Sprout;
    else if (lower.includes("tỉa") || lower.includes("cơ học")) IconElement = Scissors;
    else if (lower.includes("tưới") || lower.includes("nước")) IconElement = Droplets;
    
    return (
      <div className="w-7 h-7 bg-[var(--color-farm-primary)] rounded-full flex items-center justify-center text-white p-1.5 shadow-sm">
        <IconElement className="w-full h-full" />
      </div>
    );
  };

  const isHealthy = analysisResult && (
      analysisResult.diseaseName.toLowerCase().includes("khỏe mạnh") || 
      analysisResult.diseaseName.toLowerCase().includes("bình thường") ||
      analysisResult.diseaseName.toLowerCase().includes("không phát hiện") ||
      analysisResult.status.toLowerCase().includes("bình thường")
  );

  return (
    <div className="min-h-screen bg-[var(--color-farm-base)] overflow-x-hidden flex flex-col relative w-full sm:max-w-md md:max-w-xl mx-auto border-x border-[var(--color-farm-border)] shadow-[0_20px_50px_rgba(45,51,33,0.08)] bg-[var(--color-farm-card)]">
      
      {/* Header */}
      <header className="bg-[var(--color-farm-card)] border-b border-[var(--color-farm-border)] p-6 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-[var(--color-farm-text-header)] m-0">Nông Y <span className="font-light opacity-60">| AI</span></h1>
          </div>
          <div className="flex items-center gap-3 font-semibold text-[14px] text-[var(--color-farm-text)]">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 mr-1 rounded-full text-[var(--color-farm-text-muted)] hover:bg-[var(--color-farm-surface)] hover:text-[var(--color-farm-text)] transition-colors"
              aria-label="Cài đặt"
            >
              <Settings className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline-block text-[var(--color-farm-text-muted)]">Chào, Bà Con</span>
            <div className="w-[40px] h-[40px] rounded-full bg-[var(--color-farm-border-dashed)] flex items-center justify-center text-lg">
              🌾
            </div>
          </div>
        </div>
      </header>
      
      {/* Hidden Inputs */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={cameraInputRef} 
        onChange={handleProcessFile} 
        className="hidden" 
      />
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleProcessFile} 
        className="hidden" 
      />

      <main className="flex-1 p-5 pb-10 flex flex-col items-stretch relative">
        <AnimatePresence mode="wait">
          
          {/* SETTINGS MODAL */}
          {showSettings && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[var(--color-farm-card)] w-full max-w-sm rounded-[24px] shadow-2xl overflow-hidden border border-[var(--color-farm-border)]"
              >
                <div className="flex justify-between items-center p-5 border-b border-[var(--color-farm-border)] bg-[var(--color-farm-surface)]">
                  <h3 className="text-lg font-bold text-[var(--color-farm-text-header)] flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[var(--color-farm-primary)]" /> Cấu hình Ứng Dụng
                  </h3>
                  <button onClick={() => setShowSettings(false)} className="text-[var(--color-farm-text-muted)] hover:text-red-500 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-5">
                  <label className="block text-[14px] font-bold text-[var(--color-farm-text)] mb-2">Google Gemini API Key (Không bắt buộc trên Web)</label>
                  <p className="text-[13px] text-[var(--color-farm-text-muted)] mb-4 leading-relaxed">
                    Nếu bạn đang dùng bản build APK trên điện thoại, hãy nhập Gemini API Key của bạn để sử dụng tính năng chẩn đoán AI.
                  </p>
                  <div className="relative mb-5">
                    <input 
                      type="password" 
                      placeholder="AIzaSy..."
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      className="w-full bg-[var(--color-farm-base)] border border-[var(--color-farm-border)] rounded-[12px] p-3.5 pl-10 text-[15px] outline-none focus:border-[var(--color-farm-primary)] transition-colors text-[var(--color-farm-text)]"
                    />
                    <KeyRound className="w-5 h-5 text-[var(--color-farm-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button 
                    onClick={saveApiKey}
                    className="w-full bg-[var(--color-farm-primary)] hover:bg-[var(--color-farm-primary-hover)] text-white text-[15px] font-semibold rounded-[12px] p-3.5 shadow-sm active:scale-95 transition-transform"
                  >
                    Lưu Cấu Hình
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* IDLE VIEW */}
          {appState === "IDLE" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col flex-1"
            >
              <div className="text-center mt-8 mb-8 px-5 py-10 bg-[var(--color-farm-surface)] border-2 border-dashed border-[var(--color-farm-border-dashed)] rounded-[24px]">
                <h2 className="text-2xl leading-snug font-bold text-[var(--color-farm-text-header)] mb-3">Chẩn Đoán Sâu Bệnh<br/>Chỉ Bằng Một Bức Ảnh</h2>
                <p className="text-[var(--color-farm-text-muted)] text-[15px] leading-relaxed">
                  Bà con hãy chụp rõ chi tiết phần lá, thân hoặc quả có biểu hiện lạ để AI nhận diện và tư vấn nhé.
                </p>
              </div>

              {chatHistory.length > 0 && (
                <div className="bg-[#f2f7ed] border border-[#d6e8c3] rounded-[20px] p-5 mb-8 flex flex-col gap-2 relative shadow-sm">
                  <div className="flex items-center gap-2.5 text-[var(--color-farm-primary)] font-bold text-[15px]">
                    <div className="bg-[var(--color-farm-primary)] text-white p-1 rounded-full"><Leaf className="w-3.5 h-3.5" /></div>
                    <span>AI Đang Theo Dõi Nông Trại</span>
                  </div>
                  <p className="text-[13.5px] text-[var(--color-farm-text-muted)] leading-relaxed">
                    Hệ thống đã ghi nhớ <b>{chatHistory.length / 2} ảnh & chẩn đoán trước đó</b>. Lần nhận diện tiếp theo sẽ phân tích sâu sắc hơn về tiến trình bệnh tại vườn.
                  </p>
                  <button 
                    onClick={() => setChatHistory([])}
                    className="text-[13px] text-red-600 font-semibold self-start mt-2 hover:underline bg-red-50 px-3 py-1.5 rounded-lg"
                  >
                    Bắt đầu phiên chẩn đoán mới
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-4 px-1 mt-auto pb-8">
                <button 
                  onClick={() => cameraInputRef.current?.click()} 
                  className="bg-[var(--color-farm-primary)] hover:bg-[var(--color-farm-primary-hover)] text-white rounded-[12px] p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform"
                >
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block text-lg font-semibold">Chụp Ảnh Ngay</span>
                    <span className="block text-[13px] text-green-50 mt-0.5 font-normal">Dùng camera chụp trực tiếp</span>
                  </div>
                </button>

                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="bg-white border border-[var(--color-farm-primary)] text-[var(--color-farm-primary)] hover:bg-[var(--color-farm-base)] rounded-[12px] p-4 flex items-center gap-4 shadow-sm active:scale-95 transition-transform tracking-wide"
                >
                  <div className="bg-[var(--color-farm-surface)] p-3 rounded-xl">
                    <Upload className="w-6 h-6 text-[var(--color-farm-primary)]" />
                  </div>
                  <div className="text-left">
                    <span className="block text-lg font-semibold">Tải Ảnh Lên</span>
                    <span className="block text-[13px] opacity-80 mt-0.5 font-normal">Từ thư viện máy tính/điện thoại</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* PREVIEW VIEW */}
          {appState === "PREVIEW" && (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col flex-1"
            >
              <div className="flex gap-4 items-center mb-6">
                <button 
                  onClick={resetToIdle} 
                  className="bg-[var(--color-farm-card)] p-3 rounded-full shadow-sm text-[var(--color-farm-text-muted)] hover:text-[var(--color-farm-text)] active:bg-[var(--color-farm-border)] border border-[var(--color-farm-border)]"
                  aria-label="Quay lại"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-[20px] font-bold text-[var(--color-farm-text-header)]">Xác nhận hình ảnh</h2>
              </div>

              <div className="bg-[var(--color-farm-card)] p-4 rounded-[24px] border border-[var(--color-farm-border)] mb-6">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-full h-[250px] object-cover rounded-[16px] border border-[var(--color-farm-border)] mb-4" />
                )}
                
                <div className="px-1">
                  <label className="block text-[14px] font-bold text-[var(--color-farm-text)] mb-2">Tên cây trồng (Khuyên dùng)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="VD: Cà chua, Lúa, Mai vàng..."
                      value={plantContext}
                      onChange={(e) => setPlantContext(e.target.value)}
                      className="w-full bg-[var(--color-farm-base)] border border-[var(--color-farm-border)] rounded-[12px] p-3.5 pl-10 text-[15px] outline-none focus:border-[var(--color-farm-primary)] transition-colors text-[var(--color-farm-text)] placeholder-[var(--color-farm-text-muted)]"
                    />
                    <Leaf className="w-5 h-5 text-[var(--color-farm-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 opacity-70" />
                  </div>
                  <p className="text-[12px] text-[var(--color-farm-text-muted)] mt-2 italic">Nhập tên cây giúp máy chẩn đoán chính xác hơn khi chỉ chụp một chiếc lá.</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-auto pb-6">
                <button 
                  onClick={confirmAnalysis} 
                  className="w-full bg-[var(--color-farm-primary)] hover:bg-[var(--color-farm-primary-hover)] text-white text-[16px] font-semibold rounded-[12px] p-[14px] shadow-sm active:scale-95 transition-transform tracking-wide"
                >
                  Xác Nhận & Chẩn Đoán
                </button>
                <button 
                  onClick={resetToIdle} 
                  className="w-full border border-[var(--color-farm-border)] bg-transparent text-[var(--color-farm-text-muted)] hover:text-[var(--color-farm-text)] hover:bg-[var(--color-farm-base)] text-[15px] font-semibold rounded-[12px] p-[14px] transition-colors"
                >
                  Chụp Lại / Chọn Ảnh Khác
                </button>
              </div>
            </motion.div>
          )}

          {/* ANALYZING VIEW */}
          {appState === "ANALYZING" && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center flex-1 py-10"
            >
              <div className="relative w-48 h-48 mb-8">
                {imagePreview && (
                  <img src={imagePreview} alt="Đang phân tích" className="w-full h-full object-cover rounded-3xl opacity-50 sepia-[0.2]" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="relative">
                      <div className="w-20 h-20 border-4 border-t-[var(--color-farm-primary)] border-white/60 rounded-full animate-spin"></div>
                      <Leaf className="w-8 h-8 text-[var(--color-farm-primary)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                   </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-farm-text-header)] mb-2">Đang chẩn đoán...</h3>
              <p className="text-[var(--color-farm-text-muted)] text-center text-[15px] max-w-[280px]">AI đang phân tích triệu chứng để tìm ra nguyên nhân và cách chữa trị cho bà con.</p>
            </motion.div>
          )}

          {/* RESULT VIEW */}
          {appState === "RESULT" && analysisResult && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col"
            >
              <div className="flex gap-4 items-center mb-6">
                <button 
                  onClick={resetToIdle} 
                  className="bg-white p-3 rounded-full shadow-sm text-gray-600 hover:text-gray-900 active:bg-gray-100"
                  aria-label="Quay lại"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <h2 className="text-[22px] font-bold text-[var(--color-farm-text-header)]">Kết Quả Phân Tích</h2>
              </div>

              {/* Main Badge / Photo */}
              <div className="bg-[var(--color-farm-card)] rounded-[16px] p-5 mb-6 border border-[var(--color-farm-border)]">
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  {imagePreview && (
                    <img src={imagePreview} alt="Crop" className="w-32 h-32 object-cover rounded-[12px] border border-[var(--color-farm-border)] flex-shrink-0" />
                  )}
                  <div className="flex-1 w-full">
                    <div className="text-[13px] font-semibold text-[var(--color-farm-text-muted)] mb-1 uppercase tracking-wide">Cây Trồng</div>
                    <div className="text-[24px] font-bold text-[var(--color-farm-text-header)] mb-3">{analysisResult.plantName}</div>
                    
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] font-bold text-[11px] uppercase tracking-wide ${isHealthy ? 'bg-[#E9F5E9] text-[#2E7D32]' : 'bg-[#FDECEA] text-[#D32F2F]'}`}>
                      {isHealthy ? <CheckCircle2 className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                      {analysisResult.diseaseName}
                    </div>
                  </div>
                </div>
                
                {!isHealthy && (
                   <div className="mt-5 bg-[var(--color-farm-base)] p-4 rounded-[12px] border border-[var(--color-farm-border)]">
                      <div className="text-[13px] font-bold text-[var(--color-farm-text)] mb-2">Triệu chứng nhận diện</div>
                      <ul className="list-disc leading-[1.5] text-[13px] text-[var(--color-farm-text-muted)] pl-4 space-y-1">
                        {analysisResult.symptoms.map((sym, idx) => (
                          <li key={idx} className="text-base">{sym}</li>
                        ))}
                      </ul>
                   </div>
                )}
              </div>

              {/* Treatment Plans */}
              {!isHealthy && analysisResult.treatments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[18px] font-bold text-[var(--color-farm-text-header)] mb-3 px-1">Hướng Dẫn Khắc Phục</h3>
                  <div className="space-y-3">
                    {analysisResult.treatments.map((treatment, idx) => (
                      <div key={idx} className="bg-[var(--color-farm-card)] rounded-[16px] p-4 border border-[var(--color-farm-border)] flex gap-3 items-start">
                        <div className="mt-0.5">
                          {getMethodIcon(treatment.method)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[14px] font-bold text-[var(--color-farm-text)] mb-1">{treatment.method}</h4>
                          <p className="text-[var(--color-farm-text-muted)] text-[14px] leading-[1.4]">{treatment.instruction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice */}
              <div className="bg-[var(--color-farm-surface)] border border-[var(--color-farm-border-dashed)] rounded-[16px] p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-[var(--color-farm-primary)]" />
                  <h3 className="text-[14px] font-bold text-[var(--color-farm-text-header)]">Lời Khuyên & Phòng Ngừa</h3>
                </div>
                <p className="text-[14px] text-[var(--color-farm-text-muted)] leading-[1.5]">
                  {analysisResult.advice}
                </p>
              </div>
              
              <button 
                  onClick={resetToIdle} 
                  className="w-full bg-[var(--color-farm-primary)] text-white text-[16px] font-semibold rounded-[12px] p-[14px] shadow-sm active:scale-95 transition-transform tracking-wide"
              >
                  Liên hệ & Thử Ảnh Khác
              </button>

            </motion.div>
          )}

          {/* ERROR VIEW */}
          {appState === "ERROR" && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center flex-1 py-10 px-4"
            >
              <div className="bg-[#FDECEA] p-6 rounded-[24px] mb-6 border border-[#D32F2F]/20">
                <ShieldAlert className="w-12 h-12 text-[#D32F2F]" />
              </div>
              <h3 className="text-[20px] font-bold text-[var(--color-farm-text-header)] mb-2 text-center">Đã Có Lỗi Xảy Ra</h3>
              <p className="text-[var(--color-farm-text-muted)] text-center text-[15px] mb-8">{errorMsg}</p>
              <button 
                onClick={resetToIdle} 
                className="bg-[var(--color-farm-primary)] text-white font-semibold rounded-[12px] px-8 py-3.5 active:scale-95 transition-transform w-full sm:w-auto"
              >
                Thử Lại
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

