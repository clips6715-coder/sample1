// Vercel Serverless Function to start video generation.

interface VercelRequest { method?: string; body: any; }
interface VercelResponse { status: (code: number) => { json: (data: any) => void; }; }

import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.API_KEY) {
        return res.status(500).json({ error: "API_KEY environment variable not set" });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const { prompt, imageBase64 } = req.body;
        if (!prompt || !imageBase64) {
            return res.status(400).json({ error: 'Missing required parameters: prompt, imageBase64' });
        }

        const initialOperation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: imageBase64,
                mimeType: 'image/jpeg',
            },
            config: {
                numberOfVideos: 1
            }
        });
        
        if (!initialOperation.name) {
             throw new Error("Video operation started but no name was returned.");
        }

        // Return the operation name so the client can poll for status.
        res.status(202).json({ operationName: initialOperation.name });

    } catch (error) {
        console.error("Error in /api/video-start:", error);
        res.status(500).json({ error: "Failed to start video generation from Gemini API." });
    }
}
