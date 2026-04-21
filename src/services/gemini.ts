import { GoogleGenAI, Type } from "@google/genai";

export interface DiseaseAnalysis {
  plantName: string;
  diseaseName: string;
  status: string;
  symptoms: string[];
  treatments: {
    method: string;
    instruction: string;
  }[];
  advice: string;
}

// Helper function to safely extract and clean API Key
function getAIClient(): GoogleGenAI {
  // Try Vite's import.meta.env first, handle safely if process.env is used fallback
  // @ts-ignore
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);
  const localKey = localStorage.getItem("nongyai_gemini_key");
  
  // Clean potential JSON stringify quotes and whitespace
  const rawKey = localKey || envKey || "";
  const apiKey = rawKey.replace(/^["']|["']$/g, '').trim();

  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  return new GoogleGenAI({ apiKey });
}

export async function analyzePlantImage(base64Data: string, mimeType: string, plantContext?: string, history: any[] = []): Promise<{ analysis: DiseaseAnalysis; newHistory: any[] }> {
  const ai = getAIClient();

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      plantName: { type: Type.STRING, description: "Tên loại cây trồng cụ thể" },
      diseaseName: { type: Type.STRING, description: "Tên bệnh hoặc sâu hại, hoặc ghi 'Khỏe mạnh'" },
      status: { type: Type.STRING, description: "Tình trạng chung (ví dụ: Bình thường, Nhẹ, Cần xử lý, Rất Nghiêm Trọng)" },
      symptoms: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Các dấu hiệu nhận biết từ hình ảnh"
      },
      treatments: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            method: { type: Type.STRING, description: "Loại phương pháp (vd: Hóa học, Sinh học, Canh tác, Cắt tỉa...)" },
            instruction: { type: Type.STRING, description: "Hướng dẫn chi tiết (gợi ý loại thuốc/hoạt chất, nồng độ, cách làm cụ thể)" }
          }
        }
      },
      advice: { type: Type.STRING, description: "Lời khuyên theo dõi hoặc phòng bệnh về sau" }
    },
    required: ["plantName", "diseaseName", "status", "symptoms", "treatments", "advice"]
  };

  const contextInstruction = plantContext && plantContext.trim() !== ""
    ? `Tên cây do nông dân cung cấp: "${plantContext}". `
    : "";

  const promptText = `Bạn là kỹ sư nông nghiệp chuyên môn cao. Đây là hình ảnh mới của cây trồng. ${contextInstruction}
QUAN TRỌNG: Hãy phân tích dựa trên sự liên kết với lịch sử chẩn đoán các hình ảnh trước đó (nếu có ở lượt chat trước). Trả lời ngày càng chuyên sâu, đi thẳng vào nguyên nhân gốc rễ, phân tích tiến triển bệnh hoặc xu hướng vườn, thay vì chỉ mô tả bề mặt. Tư vấn giải pháp điều trị và phòng ngừa mang tính toàn diện, triệt để. Trả về JSON theo đúng schema.`;

  const userTurn = {
    role: "user",
    parts: [
      { inlineData: { data: base64Data, mimeType } },
      { text: promptText }
    ]
  };

  const contents = [...history, userTurn];

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Không thể trích xuất kết quả nhận diện.");
  }

  const modelTurn = {
    role: "model",
    parts: [{ text }]
  };

  return {
    analysis: JSON.parse(text) as DiseaseAnalysis,
    newHistory: [...contents, modelTurn]
  };
}

export async function chatWithExpert(message: string, base64Image?: string, mimeType?: string, history: any[] = []): Promise<{ responseText: string; newHistory: any[] }> {
  const ai = getAIClient();

  const systemPrompt = `Bạn là một chuyên gia nông nghiệp hàng đầu Việt Nam, tên là Nông Y AI. Bạn trả lời câu hỏi của bà con nông dân một cách chân thực, dễ hiểu, tận tình và chuyên sâu. Nếu có kèm hình ảnh, hãy phân tích kỹ hình ảnh thay vì chỉ trả lời chung chung. Dùng ngôn ngữ thân thiện, xưng "tôi" và gọi người dùng là "bà con". Format câu trả lời bằng Markdown rõ ràng.`;

  const userParts: any[] = [];
  if (base64Image && mimeType) {
    userParts.push({ inlineData: { data: base64Image, mimeType: mimeType } });
  }
  
  // If no message is provided but image is, add a hint
  const finalMessage = message.trim() || (base64Image ? "Chuyên gia hãy chẩn đoán hình ảnh này giúp tôi nha." : "");
  if (finalMessage) {
    userParts.push({ text: finalMessage });
  }

  const customHistory = history.length === 0 ? [{ role: "user", parts: [{ text: systemPrompt }] }, { role: "model", parts: [{ text: "Vâng, tôi đã hiểu. Chào bà con, tôi là Nông Y AI. Bà con cần tư vấn gì ạ?" }] }] : history;

  const userTurn = {
    role: "user",
    parts: userParts
  };

  const contents = [...customHistory, userTurn];

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: contents,
    config: {
      temperature: 0.5,
    },
  });

  const text = response.text || "Xin lỗi bà con, tôi chưa rõ câu hỏi.";

  const modelTurn = {
    role: "model",
    parts: [{ text }]
  };

  return {
    responseText: text,
    newHistory: [...contents, modelTurn]
  };
}
