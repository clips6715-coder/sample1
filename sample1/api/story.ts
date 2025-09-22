// Vercel Serverless Function to generate stories.
// This code runs on the server, not in the browser.

// Define minimal types to avoid dependency on @vercel/node
interface VercelRequest { method?: string; body: any; }
interface VercelResponse { status: (code: number) => { json: (data: any) => void; }; }

import { GoogleGenAI, Type } from "@google/genai";
import type { AdvancedOptions } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.API_KEY) {
        return res.status(500).json({ error: "API_KEY environment variable not set" });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const { topic, numberOfScenes, options } = req.body as { topic: string, numberOfScenes: number, options: AdvancedOptions };

        if (!topic || !numberOfScenes) {
            return res.status(400).json({ error: 'Missing required parameters: topic, numberOfScenes' });
        }

        let instructions = "You are a creative director for an animation studio. Your task is to take a user's topic and generate a short, compelling story suitable for a 3D animated video.";

        if (options.genre) instructions += ` The genre must be ${options.genre}.`;
        if (options.audience) instructions += ` The target audience is ${options.audience}.`;
        if (options.tone) instructions += ` The tone should be ${options.tone}.`;
        if (options.include) instructions += ` IMPORTANT: You must include the following elements, ideas, or plot points: "${options.include}".`;
        if (options.avoid) instructions += ` IMPORTANT: You must avoid the following elements, ideas, or themes: "${options.avoid}".`;

        const prompt = `
            ${instructions}

            The story should be broken down into exactly ${numberOfScenes} scenes. For each scene, provide:
            1. A concise voiceover script.
            2. A detailed animation prompt for a text-to-video AI model like Pixverse.ai. This prompt should describe the scene's visuals, character actions, camera movements (e.g., 'dolly zoom', 'crane shot', 'handheld follow'), and overall mood. Use descriptive keywords like 'cinematic lighting', 'hyperrealistic', '4K', 'Unreal Engine'.

            User's Topic: "${topic}"

            Please provide the output in a structured JSON format.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            scene: { type: Type.INTEGER },
                            script: { type: Type.STRING },
                            animationPrompt: { type: Type.STRING }
                        },
                        required: ["scene", "script", "animationPrompt"]
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        if (!Array.isArray(parsedData) || parsedData.length === 0) {
            return res.status(500).json({ error: "Invalid or empty response from API." });
        }

        res.status(200).json(parsedData);

    } catch (error) {
        console.error("Error in /api/story:", error);
        res.status(500).json({ error: "Failed to generate story from Gemini API." });
    }
}
