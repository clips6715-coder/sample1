import type { Scene, AdvancedOptions } from '../types';

/**
 * A helper function to make fetch requests to our new backend API.
 * It handles JSON stringification, headers, and error handling.
 */
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred' }));
        throw new Error(errorData.error || `Request to ${endpoint} failed with status ${response.status}`);
    }
    return response.json();
};

/**
 * A generic polling utility. It calls a function repeatedly until a condition is met.
 * @param fn The async function to call for polling.
 * @param condition A function that returns true when polling should stop.
 * @param ms The interval in milliseconds between polls.
 */
const poll = <T>(fn: () => Promise<T>, condition: (result: T) => boolean, ms: number): Promise<T> => {
    return new Promise((resolve, reject) => {
        const check = async () => {
            try {
                const result = await fn();
                if (condition(result)) {
                    resolve(result);
                } else {
                    setTimeout(check, ms);
                }
            } catch (error) {
                reject(error);
            }
        };
        check();
    });
};


export const generateStoryAndPrompts = async (topic: string, numberOfScenes: number, options: AdvancedOptions): Promise<Scene[]> => {
    return apiFetch('/api/story', {
        method: 'POST',
        body: JSON.stringify({ topic, numberOfScenes, options }),
    });
};

export const generateImage = async (prompt: string): Promise<{ dataUrl: string, base64: string }> => {
    return apiFetch('/api/image', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
    });
};

export const generateVideo = async (prompt: string, imageBase64: string): Promise<string> => {
    // Step 1: Start the video generation process and get an operation name.
    const { operationName } = await apiFetch('/api/video-start', {
        method: 'POST',
        body: JSON.stringify({ prompt, imageBase64 }),
    });

    if (!operationName) {
        throw new Error("Failed to start video generation process.");
    }

    // Step 2: Poll the video status endpoint until it's done.
    const pollFn = () => apiFetch(`/api/video-poll?operationName=${operationName}`);
    
    // The condition function checks if the process is done and throws an error if the API reported one.
    const condition = (result: { done: boolean, videoUrl?: string, error?: string }) => {
        if (result.error) throw new Error(result.error);
        return result.done;
    };

    // Start polling every 10 seconds.
    const finalResult = await poll<{ done: boolean, videoUrl?: string }>(pollFn, condition, 10000);

    if (!finalResult.videoUrl) {
        throw new Error("Video generation finished but no URL was provided.");
    }

    return finalResult.videoUrl;
};
