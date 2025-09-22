// Vercel Serverless Function to poll video generation status.

interface VercelRequest { method?: string; query: any; }
interface VercelResponse { status: (code: number) => { json: (data: any) => void; }; }

import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.API_KEY) {
        return res.status(500).json({ error: "API_KEY environment variable not set" });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const { operationName } = req.query;
        if (!operationName || typeof operationName !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid operationName query parameter' });
        }

        // FIX: The `getVideosOperation` method expects an operation object, not just the name string.
        // We pass an object containing the `operationName` as the `name` property.
        const operation = await ai.operations.getVideosOperation({ operation: { name: operationName } as any });

        if (operation.done) {
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (!downloadLink) {
                 return res.status(500).json({ done: true, error: "Video processing finished, but URI not found in response." });
            }
            // The API key is required to access the download link
            const finalUrl = `${downloadLink}&key=${process.env.API_KEY}`;
            res.status(200).json({ done: true, videoUrl: finalUrl });
        } else {
            // The operation is not done yet.
            res.status(200).json({ done: false });
        }

    } catch (error) {
        console.error("Error in /api/video-poll:", error);
        res.status(500).json({ error: "Failed to poll video status from Gemini API." });
    }
}
