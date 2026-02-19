
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GenerationParams } from "../types";

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
        config: { thinkingConfig: { thinkingBudget: config.thinkingBudget || 0 } as any }
      });

      return response.text;
    } catch (error) {
      console.error("AI Analysis Error:", error);
      return "Analiz raporu şu anda sentezlenemiyor. Lütfen API anahtarınızı ve internet bağlantınızı kontrol edin.";
    }
  }

  /**
   * Generates highly structured clinical materials based on specific activity types.
   */
  async generateMaterial(params: GenerationParams) {
    try {
      const ai = this.getClient();
      
      let systemInstruction = `
        You are an expert Speech-Language Pathologist AI engine. 
        Your task is to generate precise, clinical-grade therapy materials in TURKISH.
        
        Target Audience: ${params.ageGroup}
        Target Phoneme: /${params.targetSound}/
        Position: ${params.position}
        Difficulty: ${params.difficulty}
        Theme: ${params.theme}
        
        CRITICAL RULES:
        1. Ensure all words actually contain the target sound in the specified position.
        2. Adapt vocabulary complexity to the age group.
        3. Maintain the requested theme strictly.
        4. Return ONLY valid JSON.
      `;

      let prompt = "";
      let responseSchema: any = {};

      // Define Schema based on Type
      if (params.type === 'Flashcards') {
        prompt = `Generate a set of 8-12 flashcard words and accompanying sentences.`;
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            content: {
              type: Type.OBJECT,
              properties: {
                wordList: { type: Type.ARRAY, items: { type: Type.STRING } },
                sentences: { type: Type.ARRAY, items: { type: Type.STRING } },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                homeworkNotes: { type: Type.STRING }
              }
            }
          }
        };
      } else if (params.type === 'Story') {
        prompt = `Generate a short therapy story loaded with the target sound /${params.targetSound}/. Include comprehension questions.`;
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            content: {
              type: Type.OBJECT,
              properties: {
                storyText: { type: Type.STRING },
                wordList: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Target words found in story" },
                clozeQuestions: { 
                    type: Type.ARRAY, 
                    items: { 
                        type: Type.OBJECT, 
                        properties: {
                            sentence: { type: Type.STRING },
                            answer: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    } 
                },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                homeworkNotes: { type: Type.STRING }
              }
            }
          }
        };
      } else if (params.type === 'MinimalPairs') {
        prompt = `Generate 5-8 minimal pairs contrasting /${params.targetSound}/ with a common substitution error (e.g., /r/ vs /y/ or /k/ vs /t/).`;
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            content: {
              type: Type.OBJECT,
              properties: {
                minimalPairs: { 
                    type: Type.ARRAY, 
                    items: { 
                        type: Type.OBJECT, 
                        properties: {
                            target: { type: Type.STRING },
                            foil: { type: Type.STRING }
                        }
                    } 
                },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                homeworkNotes: { type: Type.STRING }
              }
            }
          }
        };
      } else {
        // General fallback
        prompt = `Generate a general therapy activity structure.`;
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            content: {
              type: Type.OBJECT,
              properties: {
                wordList: { type: Type.ARRAY, items: { type: Type.STRING } },
                sentences: { type: Type.ARRAY, items: { type: Type.STRING } },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                homeworkNotes: { type: Type.STRING }
              }
            }
          }
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      const metadata = JSON.parse(response.text || '{}');
      
      // Dynamic Image Mapping based on Theme
      // Since we don't have DALL-E, we map themes to reliable Unsplash queries
      const themeQuery = params.theme.split(' ')[0] || 'education';
      metadata.image = `https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800&search=${themeQuery}`;
      
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
      config: { thinkingConfig: { thinkingBudget: config.thinkingBudget || 2000 } as any }
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
