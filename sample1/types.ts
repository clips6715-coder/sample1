export interface Scene {
    scene: number;
    script: string;
    animationPrompt: string;
    image?: {
        dataUrl: string;
        base64: string;
        generating?: boolean;
    };
    video?: {
        url: string;
        generating?: boolean;
    };
}

export interface AdvancedOptions {
    genre: string;
    audience: string;
    tone: string;
    include: string;
    avoid: string;
}
