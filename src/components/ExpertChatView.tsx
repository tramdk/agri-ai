import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Send, Mic, Image as ImageIcon, X, Loader2, MicOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { chatWithExpert, parseGeminiError } from "../services/gemini";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { KeepAwake } from '@capacitor-community/keep-awake';

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
  
  const fileInputRef = useRef<HTMLInputElement | null>(null); // kept for web fallback only
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Track continuous raw history for Gemini
  const [geminiHistory, setGeminiHistory] = useState<any[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    // Setup Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "vi-VN";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
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

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
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
    } catch (err: any) {
      console.error("Chat Error:", err);
      const friendlyMsg = parseGeminiError(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "expert",
        text: friendlyMsg
      }]);
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
      className="flex flex-col bg-farm-base z-20" style={{ height: '100dvh' }}> 
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center border-b border-farm-border shadow-sm shrink-0">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-farm-text hover:bg-farm-surface active:scale-90 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="ml-3">
          <h3 className="font-bold text-farm-text-header leading-tight">Chuyên Gia AI</h3>
          <p className="text-xs text-farm-secondary font-medium">Sẵn sàng hỗ trợ</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 scroll-smooth">
        <div className="space-y-6 max-w-2xl mx-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
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
        className="bg-white border-t border-farm-border shrink-0"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))', padding: '16px 16px max(16px, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-2xl mx-auto">
          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-farm-border shadow-sm" />
              <button 
                onClick={() => { setSelectedImage(null); setSelectedMimeType(null); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2 bg-farm-base rounded-[24px] p-2 border border-farm-border focus-within:border-farm-primary focus-within:ring-2 focus-within:ring-farm-primary/20 transition-all">
            <button 
              onClick={handleImageSelect}
              className="p-3 text-farm-primary hover:bg-farm-surface rounded-xl transition-colors shrink-0"
            >
              <ImageIcon className="w-6 h-6" />
            </button>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Hỏi chuyên gia về cây trồng..."
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-[15px] text-farm-text placeholder:text-farm-text-muted/60"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button 
              onClick={toggleListening}
              className={`p-3 rounded-xl transition-colors shrink-0 ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-farm-primary hover:bg-farm-surface'}`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button 
              onClick={handleSend}
              disabled={isTyping || (!inputText.trim() && !selectedImage)}
              className="p-3 bg-farm-primary text-white rounded-xl disabled:opacity-50 disabled:bg-farm-primary/50 hover:bg-farm-primary-hover transition-colors shrink-0 shadow-sm"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
