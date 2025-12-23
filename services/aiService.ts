
import { GoogleGenAI, Type, Modality } from "@google/genai";

class AIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Hızlı materyal üretimi için Flash 3.0 kullanır.
   */
  async generateMaterial(prompt: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dil konuşma terapisi için profesyonel bir materyal oluştur. Kullanıcı isteği: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            duration: { type: Type.NUMBER },
            type: { type: Type.STRING },
            category: { type: Type.STRING },
            image: { type: Type.STRING }
          },
          required: ["title", "description", "duration", "type", "category"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  }

  /**
   * Karmaşık klinik raporlar için Pro 3.0 ve Thinking Budget kullanır.
   */
  async generateClinicalReport(notes: string, fileName?: string) {
    const prompt = `Lütfen profesyonel bir Dil ve Konuşma Terapisti gibi klinik bir rapor oluştur. 
    Raporu Markdown formatında ve ICF standartlarına göre hazırla.
    Girdi: "${notes}". Ek Dosya: ${fileName || 'Yok'}`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text;
  }

  /**
   * Akademik tarama için Google Search Grounding kullanır.
   */
  async academicSearch(query: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `"${query}" konusuyla ilgili en güncel dil ve konuşma terapisi makalelerini bul.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    return response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter((p: any) => p.uri) || [];
  }
}

export const aiService = new AIService();
