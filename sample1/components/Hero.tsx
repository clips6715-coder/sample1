import React from 'react';
import { SettingsIcon } from './icons';

interface HeroProps {
    topic: string;
    onTopicChange: (value: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    numberOfScenes: number;
    onNumberOfScenesChange: (value: number) => void;
    onOpenAdvancedOptions: () => void;
}

const Hero: React.FC<HeroProps> = ({ topic, onTopicChange, onGenerate, isLoading, numberOfScenes, onNumberOfScenesChange, onOpenAdvancedOptions }) => {
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onGenerate();
        }
    };
    
    return (
        <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                AI Powder Learning
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Turn your ideas into animated stories. Generate a script and detailed 3D animation prompts, then use them with your favorite AI tools like <strong className="text-cyan-400">Pixverse.ai</strong> for video and <strong className="text-purple-400">ElevenLabs</strong> for voice.
            </p>
            <div className="flex flex-col gap-4 justify-center items-center">
                <div className="w-full max-w-xl flex flex-col sm:flex-row gap-2 items-center">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => onTopicChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., A robot discovering a magical forest"
                        className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                        disabled={isLoading}
                    />
                    <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
                        <button
                            onClick={onGenerate}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                "✨ Generate"
                            )}
                        </button>
                         <button
                            onClick={onOpenAdvancedOptions}
                            disabled={isLoading}
                            className="p-4 bg-gray-700 text-gray-300 font-bold rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            title="Advanced Options"
                            aria-label="Advanced story generation options"
                        >
                            <SettingsIcon />
                        </button>
                    </div>
                </div>

                <div className="mt-4 w-full max-w-lg">
                    <label htmlFor="scene-slider" className="block mb-2 text-sm font-medium text-gray-400">
                        Number of Scenes: <span className="font-bold text-cyan-400 text-base">{numberOfScenes}</span>
                    </label>
                    <input
                        id="scene-slider"
                        type="range"
                        min="3"
                        max="10"
                        value={numberOfScenes}
                        onChange={(e) => onNumberOfScenesChange(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
                        disabled={isLoading}
                    />
                </div>
            </div>
            <style>{`
                .range-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #22d3ee; /* cyan-400 */
                    border-radius: 50%;
                    cursor: pointer;
                    margin-top: -8px; /* Vertically center */
                    transition: background 0.3s;
                }
                .range-thumb::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: #22d3ee;
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                    transition: background 0.3s;
                }
                .range-thumb:disabled::-webkit-slider-thumb {
                    background: #6b7280; /* gray-500 */
                    cursor: not-allowed;
                }
                .range-thumb:disabled::-moz-range-thumb {
                    background: #6b7280;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default Hero;