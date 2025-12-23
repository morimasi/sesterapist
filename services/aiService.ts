
import { GoogleGenAI, Type, Modality } from "@google/genai";

class AIService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Gemini 3 Flash ile hızlı materyal üretimi ve Gemini 2.5 Flash Image ile görselleştirme.
   */
  async generateMaterial(prompt: string) {
    const ai = this.getClient();
    
    // 1. Metin ve Yapı Oluşturma
    const metaResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Profesyonel bir dil konuşma terapisti materyali tasarla. Talep: "${prompt}". Klinik doğruluk ve çocuk dostu bir dil kullan.`,
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
            imagePrompt: { type: Type.STRING, description: "Görsel üretim modeli için detaylı ingilizce betimleme." }
          },
          required: ["title", "description", "duration", "type", "category", "imagePrompt"]
        }
      }
    });

    const metadata = JSON.parse(metaResponse.text || '{}');

    // 2. Görsel Üretimi (Gemini 2.5 Flash Image - Hızlı ve Etkili)
    try {
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `High-quality clinical therapy material illustration: ${metadata.imagePrompt}. 3D render, soft clay style, white background, bright colors.` }]
        },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      for (const part of imgResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          metadata.image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (e) {
      metadata.image = "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400";
    }

    return metadata;
  }

  /**
   * Gemini 3 Flash + Thinking Budget ile Derin Klinik Analiz (Pro yerine Flash kullanılıyor)
   */
  async analyzeClinicalCase(notes: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Aşağıdaki seans notlarını profesyonel bir DKT perspektifiyle analiz et: "${notes}". 
      Raporu Markdown formatında hazırla. ICF kodlarını ve akademik referansları dahil et.`,
      config: {
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text;
  }

  /**
   * Google Search Grounding ile Akademik Literatür Taraması
   */
  async academicSearch(query: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `"${query}" konusuyla ilgili en güncel klinik çalışmaları ve uygulama protokollerini bul.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Bilimsel Kaynak",
      uri: chunk.web?.uri
    })).filter((p: any) => p.uri) || [];

    return { text: response.text, sources };
  }

  /**
   * Live API Entegrasyonu (Native Audio Modeli)
   */
  connectLive(callbacks: any) {
    const ai = this.getClient();
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        },
        systemInstruction: 'Sen uzman bir Dil ve Konuşma Terapisti asistanısın. Kullanıcı konuşmasını dinle, artikülasyon hatalarını tespit et ve anlık klinik geri bildirimler ver.'
      }
    });
  }
}

export const aiService = new AIService();
