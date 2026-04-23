import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Send, Mic, Image as ImageIcon, X, MicOff, Camera as CameraIcon, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatWithExpert, parseGeminiError } from "../services/gemini";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

interface ExpertChatViewProps {
  onBack: () => void;
  apiKey: string;
}

interface Message {
  id: string;
  role: "user" | "expert";
  text: string;
  image?: string;
  mimeType?: string;
}

export const ExpertChatView = ({ onBack, apiKey }: ExpertChatViewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "expert",
      text: "Chào bà con, tôi là Nông Y AI - kỹ sư nông nghiệp số của bà con. Bà con gặp vấn đề gì về cây trồng hôm nay ạ? Hãy kể tôi nghe hoặc gửi ảnh nhé!"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const webRecognitionRef = useRef<any>(null);
  
  // Track continuous raw history for Gemini
  const [geminiHistory, setGeminiHistory] = useState<any[]>([]);

  useEffect(() => {
    return () => {
      TextToSpeech.stop().catch(() => {});
      if (webRecognitionRef.current) {
        webRecognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    // Check and request permissions on mount for smoother UX — only on native
    if (Capacitor.isNativePlatform()) {
      SpeechRecognition.requestPermissions().catch(console.warn);
    }
  }, []);

  const handleImageSelect = useCallback(async () => {
    try {
      const photo = await Camera.getPhoto({
        source: CameraSource.Photos,
        resultType: CameraResultType.DataUrl,
        quality: 85,
        allowEditing: false,
      });
      if (photo.dataUrl) {
        setSelectedImage(photo.dataUrl);
        setSelectedMimeType(photo.format === 'png' ? 'image/png' : 'image/jpeg');
      }
    } catch (err: any) {
      if (!err.message?.includes('cancelled')) {
        console.error('Gallery error:', err);
      }
    }
  }, []);

  const handleCameraCapture = useCallback(async () => {
    try {
      const photo = await Camera.getPhoto({
        source: CameraSource.Camera,
        resultType: CameraResultType.DataUrl,
        quality: 85,
        allowEditing: false,
      });
      if (photo.dataUrl) {
        setSelectedImage(photo.dataUrl);
        setSelectedMimeType(photo.format === 'png' ? 'image/png' : 'image/jpeg');
      }
    } catch (err: any) {
      if (!err.message?.includes('cancelled')) {
        console.error('Camera error:', err);
      }
    }
  }, []);

  useEffect(() => {
    // Add result listener (native only)
    const resultListener = SpeechRecognition.addListener('partialResults', (data: { matches: string[] }) => {
      if (data.matches && data.matches.length > 0) {
        setInputText(data.matches[0]);
      }
    });

    // Android: listen for recognition stopped event to reset UI state
    const speechStoppedHandler = () => setIsListening(false);
    window.addEventListener('speechRecognitionStopped', speechStoppedHandler);

    return () => {
      resultListener.remove();
      window.removeEventListener('speechRecognitionStopped', speechStoppedHandler);
    };
  }, []);

  const toggleListening = async () => {
    if (isListening) {
      if (Capacitor.isNativePlatform()) {
        await SpeechRecognition.stop().catch(() => {});
      } else if (webRecognitionRef.current) {
        webRecognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      if (!Capacitor.isNativePlatform()) {
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
          alert("Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói này.");
          return;
        }

        setIsListening(true);
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = 'vi-VN';
        recognition.interimResults = true;
        recognition.continuous = false; // Stop when the user stops speaking
        
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setInputText(transcript);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error("Web Speech API Error:", event.error);
          setIsListening(false);
        };

        webRecognitionRef.current = recognition;
        recognition.start();
        return;
      }

      const { available } = await SpeechRecognition.available();
      if (!available) {
        alert("Điện thoại của bạn không hỗ trợ tính năng nhận diện giọng nói này.");
        return;
      }

      const { display } = await SpeechRecognition.checkPermissions();
      if (display !== 'granted') {
        const { display: newStatus } = await SpeechRecognition.requestPermissions();
        if (newStatus !== 'granted') {
          alert("Bà con cần cấp quyền Truy cập Micro để sử dụng tính năng này nha.");
          return;
        }
      }

      setIsListening(true);
      await SpeechRecognition.start({
        language: "vi-VN",
        partialResults: true, // Use true to see text update live
        prompt: "Bà con hãy nói nội dung cần hỏi...",
      });
    } catch (e: any) {
      console.error("Speech Start Error:", e);
      setIsListening(false);
      // Fallback or warning
      if (e.message?.includes("speech recognition engine")) {
        alert("Hệ thống nhận diện giọng nói chưa sẵn sàng. Bà con thử nhấn lại lần nữa nhé.");
      }
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;
    if (!apiKey) {
      alert("Vui lòng cấu hình API Key trong mục Cài đặt trước khi chat.");
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: inputText,
      image: selectedImage || undefined,
      mimeType: selectedMimeType || undefined
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputText;
    const currentImage = selectedImage;
    const currentMimeType = selectedMimeType;
    
    let base64Code = undefined;
    if (currentImage) {
        base64Code = currentImage.split(",")[1];
    }

    setInputText("");
    setSelectedImage(null);
    setSelectedMimeType(null);
    setIsTyping(true);

    try {
      await KeepAwake.keepAwake().catch(() => {});

      const { responseText, newHistory } = await chatWithExpert(currentInput, base64Code, currentMimeType || undefined, geminiHistory);
      
      setGeminiHistory(newHistory);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "expert",
        text: responseText
      }]);
      
      if (isVoiceEnabled) {
        // Stop current speech if any
        await TextToSpeech.stop().catch(() => {});
        // Basic markdown cleanup for TTS
        const cleanText = responseText.replace(/[#*`_]/g, '');
        TextToSpeech.speak({
          text: cleanText,
          lang: 'vi-VN',
          rate: 1.0,
        }).catch(err => console.warn("TTS Error:", err));
      }
    } catch (err: any) {
      console.error("Chat Error:", err);
      const friendlyMsg = parseGeminiError(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "expert",
        text: friendlyMsg
      }]);
      
      if (isVoiceEnabled) {
        await TextToSpeech.stop().catch(() => {});
        TextToSpeech.speak({
          text: friendlyMsg,
          lang: 'vi-VN',
          rate: 1.0,
        }).catch(err => console.warn("TTS Error:", err));
      }
    } finally {
      setIsTyping(false);
      await KeepAwake.allowSleep().catch(() => {});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 flex flex-col bg-farm-base z-50 h-[100dvh]"
    > 
      {/* Header */}
      <div 
        className="bg-white px-4 flex items-center border-b border-farm-border shadow-sm shrink-0 justify-between"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: '12px' }}
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl text-farm-text hover:bg-farm-surface active:scale-90 transition-all border border-farm-border/30 bg-farm-surface/30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-farm-primary rounded-[10px] flex items-center justify-center shadow-sm">
               <span className="text-white text-sm font-bold">N</span>
            </div>
            <div>
              <h3 className="font-bold text-farm-text-header leading-tight text-[16px]">Chuyên Gia AI</h3>
              <p className="text-[10px] text-farm-secondary font-bold uppercase tracking-wider opacity-70">Sẵn sàng hỗ trợ</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isVoiceEnabled) TextToSpeech.stop().catch(() => {});
              setIsVoiceEnabled(!isVoiceEnabled);
            }}
            className={`p-2 rounded-full border transition-colors ${
              isVoiceEnabled 
                ? 'bg-farm-primary/10 text-farm-primary border-farm-primary/20' 
                : 'bg-farm-surface/50 text-farm-text-muted border-farm-border/50'
            }`}
            title={isVoiceEnabled ? "Tắt đọc âm thanh" : "Bật đọc âm thanh"}
          >
            {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-farm-surface/50 rounded-full border border-farm-border/50">
            <span className="text-[10px] font-bold text-farm-text-muted">Bà Con</span>
            <span className="text-xs">🌿</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 scroll-smooth">
        <div className="space-y-6 max-w-2xl mx-auto w-full">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[90%] rounded-2xl p-3.5 ${
                msg.role === "user" 
                  ? "bg-farm-primary text-white rounded-tr-sm" 
                  : "bg-white border border-farm-border shadow-sm text-farm-text rounded-tl-sm"
              }`}>
                {msg.image && (
                  <img 
                    src={msg.image} 
                    alt="User Upload" 
                    className="w-full max-w-[200px] h-auto rounded-xl mb-3 border border-black/10"
                  />
                )}
                {msg.text && (
                  <div className={`prose prose-sm max-w-none ${msg.role === "user" ? "text-white prose-invert" : "text-farm-text"}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm p-4 bg-white border border-farm-border shadow-sm">
                <div className="flex items-center gap-1.5 h-5">
                  <div className="w-2 h-2 rounded-full bg-farm-secondary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-farm-secondary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-farm-secondary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - with safe area padding for Android nav bar */}
      <div 
        className="bg-white border-t border-farm-border shrink-0 px-3 pt-3"
        style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-2xl mx-auto w-full">
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-xl border border-farm-border shadow-sm" />
              <button 
                onClick={() => { setSelectedImage(null); setSelectedMimeType(null); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-1.5 bg-farm-base rounded-[24px] p-1.5 border border-farm-border focus-within:border-farm-primary transition-all">
            <div className="flex shrink-0">
              <button 
                onClick={handleCameraCapture}
                className="p-2.5 text-farm-primary hover:bg-farm-surface rounded-xl transition-colors"
                title="Chụp ảnh"
              >
                <CameraIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={handleImageSelect}
                className="p-2.5 text-farm-primary hover:bg-farm-surface rounded-xl transition-colors"
                title="Chọn từ thư viện"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Hỏi chuyên gia..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[40px] py-2.5 text-[15px] text-farm-text placeholder:text-farm-text-muted/50"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <div className="flex shrink-0 items-center gap-1">
              <button 
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-farm-primary hover:bg-farm-surface'}`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button 
                onClick={handleSend}
                disabled={isTyping || (!inputText.trim() && !selectedImage)}
                className="p-2.5 bg-farm-primary text-white rounded-[18px] disabled:opacity-50 disabled:bg-farm-primary/30 hover:bg-farm-primary-hover transition-colors shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
