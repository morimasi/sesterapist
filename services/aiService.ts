
import { GoogleGenAI, Type, Modality } from "@google/genai";

class AIService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateClinicalProgressReport(data: {
    metrics: any[],
    phonemeScores: any,
    clientNotes: string
  }, config: any = {}) {
    const ai = this.getClient();
    
    const prompt = `
      UZMAN KLİNİK ANALİZ TALİMATI (ENGINE: GEMINI 3.0 FLASH PREVİEV MULDIMODAL):
      Aşağıdaki verileri bir Dil ve Konuşma Terapisti perspektifiyle analiz et:
      - Zaman Bazlı Metrikler: ${JSON.stringify(data.metrics)}
      - Fonem Başarı Analizi: ${JSON.stringify(data.phonemeScores)}
      - Terapist Gözlemleri: ${data.clientNotes}

      GÖREV:
      1. Klinik Trend Analizi (Gelişim hızı, plato noktaları).
      2. Spesifik Fonetik Zorluklar (Hangi ses dizilimlerinde takılma var?).
      3. Gelecek Projeksiyonu (Mevcut hızla hedefe kaç seansta ulaşılır?).
      4. Stratejik Tavsiyeler (Materyal değişikliği veya yöntem önerisi).
      
      Yanıtı profesyonel, tıbbi bir formatta oluştur.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: config.thinkingBudget || 0 }
      }
    });

    return response.text;
  }

  async summarizeDiscussion(messages: any[], config: any = {}) {
    const ai = this.getClient();
    const discussionText = messages.map(m => `${m.senderName}: ${m.content}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Aşağıdaki klinik tartışmayı GEMINI 3.0 FLASH PREVİEV MULDIMODAL mimarisiyle analiz et ve özetle:\n${discussionText}`,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text;
  }

  async generateMaterial(params: any, config: any = {}) {
    const ai = this.getClient();
    
    const structuredPrompt = `
      SİSTEM ROLÜ: Sen dünyanın en iyi Klinik Dil ve Konuşma Terapisti ve Eğitim Teknolojileri Uzmanısın.
      GÖREV: Aşağıdaki klinik parametrelere göre GERÇEK bir çalışma materyali/egzersiz üret.
      
      PARAMETRELER:
      - Yaş Grubu: ${params.ageGroup}
      - Terapi Hedefi: ${params.goal}
      - Hedef Fonem/Ses: ${params.targetSound}
      - Tema: ${params.theme}
      - Görsel Stil: ${params.visualStyle}
      - Ek Talimatlar: ${params.prompt}

      ÜRETİLECEK VERİ YAPISI:
      1. Başlık ve Açıklama.
      2. Uygulama Yönergesi (Terapist için adım adım).
      3. Materyal İçeriği: (Hedef kelimeler listesi, çalışma cümleleri, hikaye taslağı veya interaktif oyun kurgusu).
      4. Klinik Adımlar (Vakanın takip etmesi gereken hiyerarşi).
      5. Ev Ödevi Notları.

      Lütfen JSON formatında yanıt ver.
    `;

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
                interactivePrompt: { type: Type.STRING },
                homeworkNotes: { type: Type.STRING }
              },
              required: ["instructions", "clinicalSteps"]
            },
            imagePrompt: { type: Type.STRING }
          },
          required: ["title", "description", "duration", "type", "category", "content", "imagePrompt"]
        }
      }
    });

    const metadata = JSON.parse(metaResponse.text || '{}');
    
    // Görsel Üretimi (Gelişmiş Tema Odaklı URL)
    const encodedTheme = encodeURIComponent(`${params.theme} ${params.visualStyle} illustration for child speech therapy`);
    metadata.image = `https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800`;
    
    return metadata;
  }

  async analyzeClinicalCase(notes: string, config: any = {}) {
    const ai = this.getClient();
    const systemInstruction = `
      Sen dünyanın en iyi Klinik Dil ve Konuşma Terapistisin (SLP). 
      Görevin, verilen klinik verileri sentezleyerek profesyonel, kapsamlı ve bilimsel bir değerlendirme raporu oluşturmaktır.
      RAPOR YAPISI: Klinik Özet, Ayrıntılı Analiz (Artikülasyon/Fonoloji/Pragmatik), ICF Sınıflandırması, Terapi Planı ve Öneriler.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: notes,
      config: { 
        systemInstruction,
        thinkingConfig: { thinkingBudget: config.thinkingBudget || 0 } 
      }
    });
    return response.text;
  }

  async academicSearch(query: string, config: any = {}) {
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

  connectLive(callbacks: any, config: any = {}) {
    const ai = this.getClient();
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        systemInstruction: "You are a multimodal speech therapy assistant powered by Gemini 3.0 protocol. Provide clinical articulation feedback in real-time."
      }
    });
  }
}

export const aiService = new AIService();
