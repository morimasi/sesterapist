
import { GoogleGenAI, Type, Modality } from "@google/genai";

class AIService {
  private getClient() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Kritik Hata: API_KEY bulunamadı. Vercel Environment Variables kontrol edilmelidir.");
    }
    return new GoogleGenAI({ apiKey });
  }

  async generateClinicalProgressReport(data: {
    metrics: any[],
    phonemeScores: any,
    clientNotes: string
  }, config: any = {}) {
    try {
      const ai = this.getClient();
      const prompt = `
        UZMAN KLİNİK ANALİZ TALİMATI (ENGINE: GEMINI 3.0 FLASH):
        Verileri Dil ve Konuşma Terapisti perspektifiyle analiz et:
        ${JSON.stringify(data)}
        GÖREV: Trend analizi, fonetik zorluklar ve stratejik tavsiyeler oluştur.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: config.thinkingBudget || 0 } }
      });

      return response.text;
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return "Analiz raporu şu anda sentezlenemiyor. Lütfen API anahtarınızı ve internet bağlantınızı kontrol edin.";
    }
  }

  async generateMaterial(params: any, config: any = {}) {
    try {
      const ai = this.getClient();
      const structuredPrompt = `GÖREV: Klinik DKT Materyali Üret. Parametreler: ${JSON.stringify(params)}`;

      const metaResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: structuredPrompt,
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
              content: {
                type: Type.OBJECT,
                properties: {
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  wordList: { type: Type.ARRAY, items: { type: Type.STRING } },
                  sentences: { type: Type.ARRAY, items: { type: Type.STRING } },
                  clinicalSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  homeworkNotes: { type: Type.STRING }
                }
              }
            }
          }
        }
      });

      const metadata = JSON.parse(metaResponse.text || '{}');
      metadata.image = `https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800`;
      return metadata;
    } catch (error) {
      console.error("Material Generation Error:", error);
      throw error;
    }
  }

  async summarizeDiscussion(messages: any[]) {
    const ai = this.getClient();
    const text = messages.map(m => `${m.senderName}: ${m.content}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Klinik tartışmayı özetle:\n${text}`
    });
    return response.text;
  }

  async academicSearch(query: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []).map((chunk: any, idx: number) => ({
      id: `p-${idx}`, title: chunk.web?.title, uri: chunk.web?.uri
    }));
    return { text: response.text, sources };
  }

  async analyzeClinicalCase(notes: string, config: any = {}) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: notes,
      config: { thinkingConfig: { thinkingBudget: config.thinkingBudget || 2000 } }
    });
    return response.text;
  }

  connectLive(callbacks: any) {
    const ai = this.getClient();
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      }
    });
  }
}

export const aiService = new AIService();
