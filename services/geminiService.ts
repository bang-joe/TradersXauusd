
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeChart = async (
    imageBase64: string,
    mimeType: string,
    pairName: string,
    timeframe: string
): Promise<string> => {
    
    const model = 'gemini-2.5-flash';
    const prompt = `
Analisa chart pada gambar berikut untuk pair ${pairName} timeframe ${timeframe}.
Susun hasil dengan format berikut:

1. 📊 Trend Utama: …
2. 🧭 Support & Resistance: …
3. 📉 Pola Candlestick: …
4. 📐 Indikator (MA 50/200, RSI, MACD): …
5. 🎯 Rekomendasi Entry: …
   - Entry: …
   - Stop Loss: …
   - Take Profit: …
`;

    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        };

        const textPart = {
            text: prompt,
        };
        
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
        });

        if (!response.text) {
            throw new Error('API returned an empty response.');
        }

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from AI. Please check the console for more details.");
    }
};
