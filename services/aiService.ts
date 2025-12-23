
import { GoogleGenAI, Type, Modality } from "@google/genai";

class AIService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async summarizeDiscussion(messages: any[], config: any = {}) {
    const ai = this.getClient();
    const discussionText = messages.map(m => `${m.senderName}: ${m.content}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: `Aşağıdaki klinik tartışmayı analiz et ve şu başlıklarla özetle:
      1. TARTIŞILAN TEMEL KONU
      2. SUNULAN KLİNİK GÖRÜŞLER
      3. VARILAN SONUÇ/ÖNERİLER
      4. İLGİLİ AKADEMİK REFERANS ÖNERİLERİ
      
      Tartışma Notları:
      ${discussionText}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    return response.text;
  }

  async generateMaterial(params: any, config: any = {}) {
    const ai = this.getClient();
    const structuredPrompt = `UZMAN TERAPİST MATERYALİ: ${JSON.stringify(params)}`;
    const metaResponse = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
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
            imagePrompt: { type: Type.STRING }
          },
          required: ["title", "description", "duration", "type", "category", "imagePrompt"]
        }
      }
    });
    return JSON.parse(metaResponse.text || '{}');
  }

  async analyzeClinicalCase(notes: string, config: any = {}) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: notes,
      config: { thinkingConfig: { thinkingBudget: 32000 } }
    });
    return response.text;
  }

  async academicSearch(query: string, config: any = {}) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []).map((chunk: any, idx: number) => ({
      id: `p-${idx}`, title: chunk.web?.title, uri: chunk.web?.uri
    }));
    return { text: response.text, sources };
  }

  connectLive(callbacks: any, config: any = {}) {
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
