import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import StoryDisplay from './components/StoryDisplay';
import Loader from './components/Loader';
import AdvancedOptionsModal from './components/AdvancedOptionsModal';
import { generateStoryAndPrompts, generateImage, generateVideo } from './services/geminiService';
import type { Scene, AdvancedOptions } from './types';

const App: React.FC = () => {
    const [topic, setTopic] = useState<string>('');
    const [numberOfScenes, setNumberOfScenes] = useState<number>(5);
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);
    const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
        genre: '',
        audience: '',
        tone: '',
        include: '',
        avoid: '',
    });

    const [currentlyPlayingScene, setCurrentlyPlayingScene] = useState<number | null>(null);

    // Clean up speech synthesis on component unmount or when dependencies change
    useEffect(() => {
        return () => {
            speechSynthesis.cancel();
        };
    }, []);

    const handleGenerateStory = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic for your story.");
            return;
        }
        speechSynthesis.cancel();
        setCurrentlyPlayingScene(null);
        setIsLoading(true);
        setError(null);
        setScenes([]);

        try {
            const generatedScenes = await generateStoryAndPrompts(topic, numberOfScenes, advancedOptions);
            setScenes(generatedScenes);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateImage = async (sceneNumber: number, prompt: string) => {
        setScenes(prevScenes => prevScenes.map(scene =>
            scene.scene === sceneNumber ? { ...scene, image: { ...scene.image, dataUrl: '', base64: '', generating: true } } : scene
        ));

        try {
            const imageData = await generateImage(prompt);
            setScenes(prevScenes => prevScenes.map(scene =>
                scene.scene === sceneNumber ? { ...scene, image: { ...imageData, generating: false } } : scene
            ));
        } catch (err) {
            setError(`Failed to generate image for scene ${sceneNumber}.`);
            setScenes(prevScenes => prevScenes.map(scene =>
                scene.scene === sceneNumber ? { ...scene, image: { ...scene.image, dataUrl: '', base64: '', generating: false } } : scene
            ));
        }
    };

    const handleGenerateVideo = async (sceneNumber: number, prompt: string, imageBase64: string) => {
        setScenes(prevScenes => prevScenes.map(scene =>
            scene.scene === sceneNumber ? { ...scene, video: { ...scene.video, url: '', generating: true } } : scene
        ));

        try {
            const videoUrl = await generateVideo(prompt, imageBase64);
            setScenes(prevScenes => prevScenes.map(scene =>
                scene.scene === sceneNumber ? { ...scene, video: { url: videoUrl, generating: false } } : scene
            ));
        } catch (err) {
            setError(`Failed to generate video for scene ${sceneNumber}.`);
            setScenes(prevScenes => prevScenes.map(scene =>
                scene.scene === sceneNumber ? { ...scene, video: { ...scene.video, url: '', generating: false } } : scene
            ));
        }
    };
    
    const handlePlayVoiceover = (sceneNumber: number, script: string) => {
        if (currentlyPlayingScene === sceneNumber) {
            speechSynthesis.cancel();
            setCurrentlyPlayingScene(null);
            return;
        }

        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(script);
        utterance.onstart = () => setCurrentlyPlayingScene(sceneNumber);
        utterance.onend = () => setCurrentlyPlayingScene(null);
        utterance.onerror = () => {
            setCurrentlyPlayingScene(null);
            setError("Text-to-speech playback failed. Your browser might not support this feature.");
        };
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <div className="container mx-auto px-4 py-8 md:py-16">
                <Hero
                    topic={topic}
                    onTopicChange={setTopic}
                    onGenerate={handleGenerateStory}
                    isLoading={isLoading}
                    numberOfScenes={numberOfScenes}
                    onNumberOfScenesChange={setNumberOfScenes}
                    onOpenAdvancedOptions={() => setIsAdvancedOptionsOpen(true)}
                />

                {error && (
                    <div className="my-8 max-w-2xl mx-auto bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                        <p>{error}</p>
                    </div>
                )}
                
                {isLoading && scenes.length === 0 && <Loader />}
                
                {scenes.length > 0 && (
                    <StoryDisplay 
                        scenes={scenes} 
                        onGenerateImage={handleGenerateImage} 
                        onGenerateVideo={handleGenerateVideo}
                        onPlayVoiceover={handlePlayVoiceover}
                        currentlyPlayingScene={currentlyPlayingScene}
                    />
                )}

                <AdvancedOptionsModal 
                    isOpen={isAdvancedOptionsOpen}
                    onClose={() => setIsAdvancedOptionsOpen(false)}
                    options={advancedOptions}
                    onOptionsChange={setAdvancedOptions}
                />
            </div>
             <footer className="text-center py-6 text-gray-500 text-sm">
                <p>Powered by Google Gemini. UI inspired by visionary concepts.</p>
            </footer>
        </div>
    );
};

export default App;