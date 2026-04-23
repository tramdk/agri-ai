import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhoneOff, Mic, MicOff, Image as ImageIcon, X, Camera as CameraIcon, Volume2, Volume1 } from "lucide-react";
import { chatWithExpert } from "../services/gemini";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';
import { KeepAwake } from '@capacitor-community/keep-awake';

interface CallExpertViewProps {
  onEndCall: () => void;
  apiKey: string;
}

export const CallExpertView = ({ onEndCall, apiKey }: CallExpertViewProps) => {
  const [status, setStatus] = useState<"connecting" | "listening" | "analyzing" | "speaking" | "error">("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  
  const webRecognitionRef = useRef<any>(null);
  const isComponentMounted = useRef(true);
  const isMutedRef = useRef(false); // Use ref to avoid stale closure in async callbacks
  const statusRef = useRef<"connecting" | "listening" | "analyzing" | "speaking" | "error">("connecting");

  // Initialize call
  useEffect(() => {
    isComponentMounted.current = true;
    
    // Request permissions right away on native platform
    if (Capacitor.isNativePlatform()) {
      SpeechRecognition.requestPermissions().catch(console.warn);
      Camera.requestPermissions().catch(console.warn);
    }
    
    
    const initCall = async () => {
      // Simulate connection time
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (!isComponentMounted.current) return;
      
      setStatus("speaking");
      statusRef.current = "speaking";
      await speakText("Chào bà con. Tôi là Nông Y AI. Xin mời bà con nói.");
      if (isComponentMounted.current && !isMutedRef.current) {
        startListening();
      }
    };
    
    initCall();
    
    return () => {
      isComponentMounted.current = false;
      stopListening();
      TextToSpeech.stop().catch(() => {});
    };
  }, []);

  const speakText = async (text: string) => {
    try {
      await TextToSpeech.stop().catch(() => {});
      const cleanText = text.replace(/[#*`_]/g, '');
      await TextToSpeech.speak({
        text: cleanText,
        lang: 'vi-VN',
        rate: 1.0,
        volume: isSpeakerOn ? 1.0 : 0.2,
      });
    } catch (err) {
      console.warn("TTS Error:", err);
    }
  };

  const processUserInput = async (text: string) => {
    await processUserInputWithImage(text, undefined, undefined);
  };

  const processUserInputWithImage = async (text: string, base64Code?: string, mimeType?: string) => {
    if (!text.trim() && !base64Code) return;
    if (!apiKey) {
      setStatus("error");
      statusRef.current = "error";
      speakText("Vui lòng cấu hình API Key trước khi gọi.");
      return;
    }

    setStatus("analyzing");
    statusRef.current = "analyzing";
    setSelectedImage(null);
    setSelectedMimeType(null);

    try {
      await KeepAwake.keepAwake().catch(() => {});
      const { responseText, newHistory } = await chatWithExpert(text, base64Code, mimeType, history);
      
      if (!isComponentMounted.current) return;
      
      setHistory(newHistory);
      setStatus("speaking");
      statusRef.current = "speaking";
      
      await speakText(responseText);
      
      if (isComponentMounted.current && !isMutedRef.current) {
        startListening();
      } else if (isComponentMounted.current) {
         setStatus("listening");
         statusRef.current = "listening";
      }

    } catch (err: any) {
      if (!isComponentMounted.current) return;
      console.error("Chat Error:", err);
      setStatus("error");
      statusRef.current = "error";
      await speakText("Xin lỗi, tôi không thể xử lý yêu cầu lúc này.");
      setTimeout(() => {
        if (isComponentMounted.current) startListening();
      }, 3000);
    } finally {
      await KeepAwake.allowSleep().catch(() => {});
    }
  };

  const startListening = async () => {
    if (!isComponentMounted.current || isMutedRef.current) return;
    setStatus("listening");
    statusRef.current = "listening";
    
    try {
      if (!Capacitor.isNativePlatform()) {
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
          console.warn("Trình duyệt không hỗ trợ Web Speech API.");
          return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;
        recognition.continuous = false;
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          processUserInput(transcript);
        };
        
        recognition.onend = () => {
          // Only restart if still in listening state (not if processUserInput took over)
          if (isComponentMounted.current && statusRef.current === "listening") {
            // timed out without result — reset state so user can tap mic
            setStatus("listening");
          }
        };

        webRecognitionRef.current = recognition;
        recognition.start();
        return;
      }

      const { display } = await SpeechRecognition.checkPermissions();
      if (display !== 'granted') {
        await SpeechRecognition.requestPermissions();
      }

      await SpeechRecognition.start({
        language: "vi-VN",
        partialResults: false,
        prompt: "Đang nghe...",
      });
      
      // Native plugin needs listener setup if we don't have it globally, 
      // but for simplicity in this demo, let's just listen once
      const resultListener = SpeechRecognition.addListener('partialResults', (data: { matches: string[] }) => {
        if (data.matches && data.matches.length > 0) {
           processUserInput(data.matches[0]);
           resultListener.remove();
        }
      });
      
    } catch (e: any) {
      console.error("Speech Start Error:", e);
    }
  };

  const stopListening = async () => {
    if (Capacitor.isNativePlatform()) {
      await SpeechRecognition.stop().catch(() => {});
    } else if (webRecognitionRef.current) {
      webRecognitionRef.current.stop();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMutedRef.current;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      // becoming muted
      stopListening();
      if (statusRef.current === "listening") {
        setStatus("connecting");
        statusRef.current = "connecting";
      }
    } else {
      // becoming unmuted
      startListening();
    }
  };

  const handleImageSource = async (source: CameraSource) => {
    try {
      const photo = await Camera.getPhoto({
        source,
        resultType: CameraResultType.Base64, // Base64 is safer on Android than DataUrl
        quality: 80,
        allowEditing: false,
      });
      if (photo.base64String) {
        const mime = photo.format === 'png' ? 'image/png' : 'image/jpeg';
        const dataUrl = `data:${mime};base64,${photo.base64String}`;
        
        setSelectedImage(dataUrl);
        setSelectedMimeType(mime);
        
        // Pass image directly to avoid async setState race condition
        if (statusRef.current === "listening" || statusRef.current === "connecting") {
          const base64 = photo.base64String;
          stopListening();
          await processUserInputWithImage("Tôi vừa gửi cho bạn một hình ảnh, hãy phân tích và chẩn đoán bệnh trên cây.", base64, mime);
        }
      }
    } catch (err: any) {
      if (!err.message?.includes('cancelled')) {
        console.log('Camera error:', err);
        alert(`Lỗi khi mở Camera/Thư viện: ${err.message}`);
      }
    }
  };

  // UI mapping
  const statusConfig = {
    connecting: { text: "Đang kết nối...", color: "text-gray-400", bg: "bg-gray-100" },
    listening: { text: "Đang nghe...", color: "text-blue-500", bg: "bg-blue-100" },
    analyzing: { text: "Đang suy nghĩ...", color: "text-purple-500", bg: "bg-purple-100" },
    speaking: { text: "Nông Y AI đang nói...", color: "text-green-500", bg: "bg-green-100" },
    error: { text: "Có lỗi xảy ra", color: "text-red-500", bg: "bg-red-100" }
  };

  const currentConfig = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white h-[100dvh]"
    >
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-12 text-center w-full px-6">
          <h2 className="text-2xl font-bold font-display mb-2">Chuyên Gia AI</h2>
          <p className={`text-sm font-medium transition-colors ${currentConfig.color}`}>
            {currentConfig.text}
          </p>
        </div>

        {/* Avatar and animations */}
        <div className="relative mb-12 mt-10">
          <AnimatePresence>
            {(status === "speaking" || status === "listening" || status === "analyzing") && (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.2 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ 
                    duration: status === "analyzing" ? 1 : 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className={`absolute inset-0 rounded-full ${currentConfig.bg}`}
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ 
                    duration: status === "analyzing" ? 1 : 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.4
                  }}
                  className={`absolute inset-0 rounded-full ${currentConfig.bg}`}
                />
              </>
            )}
          </AnimatePresence>

          <div className="relative w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl z-10 border-4 border-slate-800">
             <span className="text-6xl">👨‍🌾</span>
          </div>
          
          {selectedImage && (
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-black rounded-2xl border-4 border-slate-900 z-20 overflow-hidden shadow-xl">
              <img src={selectedImage} alt="Attachment" className="w-full h-full object-cover" />
              <button 
                onClick={() => { setSelectedImage(null); setSelectedMimeType(null); }}
                className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-slate-800 rounded-t-[40px] p-6 pb-12 flex items-center justify-center gap-4 sm:gap-6">
        <button 
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors active:scale-90 ${isSpeakerOn ? 'bg-white text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          {isSpeakerOn ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume1 className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>

        <button 
          onClick={toggleMute}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors active:scale-90 ${isMuted ? 'bg-white text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>

        <button 
          onClick={onEndCall}
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors active:scale-90 flex-shrink-0"
        >
          <PhoneOff className="w-7 h-7 sm:w-8 sm:h-8" />
        </button>

        <button 
          onClick={() => handleImageSource(CameraSource.Camera)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-600 transition-colors active:scale-90"
        >
          <CameraIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button 
          onClick={() => handleImageSource(CameraSource.Photos)}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-600 transition-colors active:scale-90"
        >
          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </motion.div>
  );
};
