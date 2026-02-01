import { GoogleGenAI } from "@google/genai";

export const getGymAssistantResponse = async (userMessage: string, history: {role: 'user' | 'model', parts: {text: string}[]}[]) => {
  try {
    // The API key is injected via process.env.API_KEY
    if (!process.env.API_KEY) {
      return "KEY_REQUIRED";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are "Ninja Bot", the official AI guide for Ninja Fitz Gym. 
        Your goal is to help potential members. 
        Prices: 
        - Single Warrior: ₹1,500/mo, ₹9,000/yr
        - Couples: ₹2,600/mo, ₹16,000/yr
        - Students: ₹1,300/mo, ₹8,000/yr
        Features: 24/7 Biometric Access, Group Zumba sessions, Muscle-Specific stations.
        When someone asks about duration, mention that memberships are calculated from the day they join.
        Be professional, brief, and motivating. Always use the ₹ symbol.`,
      },
      history: history,
    });

    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error: any) {
    console.error("AI Error:", error);
    if (error?.message?.includes("entity was not found") || error?.status === 404) {
      return "KEY_REQUIRED";
    }
    return "I'm having trouble connecting to the Dojo. Please try again later, warrior.";
  }
};