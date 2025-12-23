
import { GoogleGenAI, Type, Modality } from "@google/genai";

class AIService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * Generates a new therapy material with metadata and an AI-generated image.
   */
  async generateMaterial(prompt: string) {
    const ai = this.getClient();
    
    // Step 1: Generate Metadata
    const metaResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a professional speech therapy material. User request: "${prompt}". Focus on clinical accuracy and engagement.`,
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
            imagePrompt: { type: Type.STRING, description: "A detailed descriptive prompt to generate an image for this material." }
          },
          required: ["title", "description", "duration", "type", "category", "imagePrompt"]
        }
      }
    });

    const metadata = JSON.parse(metaResponse.text || '{}');

    // Step 2: Generate Image
    try {
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Clinical speech therapy material illustration for children: ${metadata.imagePrompt}. Soft colors, friendly, clean background.` }]
        },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      for (const part of imgResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          metadata.image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (e) {
      console.warn("Image generation failed, falling back to placeholder", e);
      metadata.image = "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400";
    }

    return metadata;
  }

  /**
   * Complex clinical reasoning using Thinking Budget.
   */
  async analyzeClinicalCase(notes: string, context?: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep clinical analysis for a speech therapy session. 
      Notes: "${notes}"
      Context: "${context || 'No specific context provided'}"
      Format as a professional clinical report using ICF standards.`,
      config: {
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text;
  }

  /**
   * Academic search with grounding.
   */
  async academicSearch(query: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the most recent academic papers and clinical guidelines for: "${query}" in the field of speech-language pathology.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const results = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Academic Source",
      uri: chunk.web?.uri
    })).filter((p: any) => p.uri) || [];

    return {
      text: response.text,
      sources: results
    };
  }

  /**
   * Real-time session helper (Logic for Live API bridge)
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
        systemInstruction: 'You are an expert Speech-Language Pathologist assistant. Monitor the user audio and provide brief, encouraging feedback and clinical observations in text or speech.'
      }
    });
  }
}

export const aiService = new AIService();
