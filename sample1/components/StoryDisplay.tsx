import React from 'react';
import type { Scene } from '../types';
import { CopyIcon, ImageIcon, VideoIcon, DownloadIcon, PlayIcon, PauseIcon } from './icons';

interface SceneCardProps {
    scene: Scene;
    onGenerateImage: (sceneNumber: number, prompt: string) => void;
    onGenerateVideo: (sceneNumber: number, prompt: string, imageBase64: string) => void;
    onPlayVoiceover: (sceneNumber: number, script: string) => void;
    currentlyPlayingScene: number | null;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, onGenerateImage, onGenerateVideo, onPlayVoiceover, currentlyPlayingScene }) => {
    const [copied, setCopied] = React.useState<'script' | 'prompt' | null>(null);
    const isPlaying = currentlyPlayingScene === scene.scene;

    const handleCopy = (text: string, type: 'script' | 'prompt') => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 flex flex-col md:flex-row gap-6 animate-fade-in">
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center space-y-4">
                <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden relative">
                    {scene.image?.generating ? (
                         <div className="flex flex-col items-center justify-center text-gray-400">
                             <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                             <p className="mt-2 text-sm">Generating Image...</p>
                         </div>
                    ) : scene.image?.dataUrl ? (
                        <img src={scene.image.dataUrl} alt={`Scene ${scene.scene}`} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-16 h-16 text-gray-600" />
                    )}
                </div>
                <button
                    onClick={() => onGenerateImage(scene.scene, scene.animationPrompt)}
                    disabled={scene.image?.generating || scene.video?.generating}
                    className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <ImageIcon className="w-5 h-5" />
                    {scene.image?.dataUrl ? 'Regenerate Image' : 'Generate Image'}
                </button>
                {scene.image?.dataUrl && (
                    <div className="w-full flex flex-col items-center space-y-4">
                         {scene.video?.generating ? (
                            <div className="w-full text-center p-2 rounded-lg bg-gray-700 text-sm">
                                <div className="flex items-center justify-center text-gray-300">
                                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Generating Video... (may take a minute)
                                </div>
                            </div>
                        ) : scene.video?.url ? (
                             <a
                                href={scene.video.url}
                                download={`scene_${scene.scene}_video.mp4`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full px-4 py-2 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <DownloadIcon className="w-5 h-5" />
                                Download Video
                            </a>
                        ) : (
                            <button
                                onClick={() => onGenerateVideo(scene.scene, scene.animationPrompt, scene.image!.base64)}
                                disabled={scene.video?.generating}
                                className="w-full px-4 py-2 bg-cyan-500 text-white font-semibold rounded-full hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <VideoIcon className="w-5 h-5" />
                                Generate Video
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className="w-full md:w-2/3 space-y-4">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Scene {scene.scene}</h3>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold text-gray-200">Voiceover Script</h4>
                        <div className="flex items-center gap-2">
                             <button
                                onClick={() => onPlayVoiceover(scene.scene, scene.script)}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700"
                                title={isPlaying ? "Stop Voiceover" : "Play Voiceover"}
                             >
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                <span className="sr-only">{isPlaying ? 'Stop' : 'Play'}</span>
                             </button>
                            <button onClick={() => handleCopy(scene.script, 'script')} className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700">
                               <CopyIcon />
                               <span className="sr-only">{copied === 'script' ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>
                    <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg text-sm font-mono">{scene.script}</p>
                     {copied === 'script' && <span className="text-xs text-green-400 ml-2">Copied!</span>}
                </div>
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold text-gray-200">Animation Prompt</h4>
                         <button onClick={() => handleCopy(scene.animationPrompt, 'prompt')} className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700">
                           <CopyIcon />
                           <span className="sr-only">{copied === 'prompt' ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                    <p className="text-gray-300 bg-gray-900/50 p-3 rounded-lg text-sm font-mono">{scene.animationPrompt}</p>
                    {copied === 'prompt' && <span className="text-xs text-green-400 ml-2">Copied!</span>}
                </div>
            </div>
        </div>
    );
}


interface StoryDisplayProps {
    scenes: Scene[];
    onGenerateImage: (sceneNumber: number, prompt: string) => void;
    onGenerateVideo: (sceneNumber: number, prompt: string, imageBase64: string) => void;
    onPlayVoiceover: (sceneNumber: number, script: string) => void;
    currentlyPlayingScene: number | null;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ scenes, onGenerateImage, onGenerateVideo, onPlayVoiceover, currentlyPlayingScene }) => {
    return (
        <div className="max-w-4xl mx-auto my-12 space-y-8">
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
            {scenes.map((scene, index) => (
                <div key={scene.scene} style={{ animationDelay: `${index * 100}ms`}}>
                    <SceneCard 
                        scene={scene} 
                        onGenerateImage={onGenerateImage} 
                        onGenerateVideo={onGenerateVideo} 
                        onPlayVoiceover={onPlayVoiceover}
                        currentlyPlayingScene={currentlyPlayingScene}
                    />
                </div>
            ))}
        </div>
    );
};

export default StoryDisplay;