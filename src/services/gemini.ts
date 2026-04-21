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

export async function analyzePlantImage(base64Data: string, mimeType: string, plantContext?: string, history: any[] = []): Promise<{ analysis: DiseaseAnalysis; newHistory: any[] }> {
  const envKey = process.env.GEMINI_API_KEY;
  const localKey = localStorage.getItem("nongyai_gemini_key");
  const apiKey = envKey || localKey;

  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });

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
