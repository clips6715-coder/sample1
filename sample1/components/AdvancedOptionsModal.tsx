import React from 'react';
import type { AdvancedOptions } from '../types';
import { CloseIcon } from './icons';

interface AdvancedOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    options: AdvancedOptions;
    onOptionsChange: React.Dispatch<React.SetStateAction<AdvancedOptions>>;
}

const formRowClass = "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4";
const labelClass = "text-gray-300 font-semibold w-full sm:w-1/4 text-sm sm:text-right";
const inputClass = "w-full sm:w-3/4 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200";

const AdvancedOptionsModal: React.FC<AdvancedOptionsModalProps> = ({ isOpen, onClose, options, onOptionsChange }) => {
    if (!isOpen) return null;

    const handleOptionChange = (field: keyof AdvancedOptions, value: string) => {
        onOptionsChange(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="advanced-options-title"
        >
            <div 
                className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 id="advanced-options-title" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        Advanced Story Options
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close advanced options">
                        <CloseIcon />
                    </button>
                </header>

                <main className="p-6 space-y-6 overflow-y-auto">
                    <div className={formRowClass}>
                        <label htmlFor="genre" className={labelClass}>Genre</label>
                        <select id="genre" value={options.genre} onChange={e => handleOptionChange('genre', e.target.value)} className={inputClass}>
                            <option value="">Any</option>
                            <option value="Science Fiction">Science Fiction</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Comedy">Comedy</option>
                            <option value="Drama">Drama</option>
                            <option value="Horror">Horror</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Adventure">Adventure</option>
                        </select>
                    </div>

                    <div className={formRowClass}>
                        <label htmlFor="audience" className={labelClass}>Target Audience</label>
                        <select id="audience" value={options.audience} onChange={e => handleOptionChange('audience', e.target.value)} className={inputClass}>
                            <option value="">Any</option>
                            <option value="Young Children">Young Children</option>
                            <option value="Teenagers">Teenagers</option>
                            <option value="Adults">Adults</option>
                            <option value="A general audience">A general audience</option>
                        </select>
                    </div>

                    <div className={formRowClass}>
                        <label htmlFor="tone" className={labelClass}>Tone</label>
                        <select id="tone" value={options.tone} onChange={e => handleOptionChange('tone', e.target.value)} className={inputClass}>
                            <option value="">Any</option>
                            <option value="Humorous">Humorous</option>
                            <option value="Serious & Dramatic">Serious & Dramatic</option>
                            <option value="Whimsical & Lighthearted">Whimsical & Lighthearted</option>
                            <option value="Educational">Educational</option>
                            <option value="Suspenseful">Suspenseful</option>
                            <option value="Inspirational">Inspirational</option>
                        </select>
                    </div>

                     <div className={formRowClass}>
                        <label htmlFor="include" className={labelClass}>Elements to Include</label>
                        <textarea
                            id="include"
                            rows={3}
                            value={options.include}
                            onChange={e => handleOptionChange('include', e.target.value)}
                            placeholder="e.g., a talking squirrel, a mysterious glowing artifact, a plot twist at the end"
                            className={inputClass}
                        />
                    </div>

                     <div className={formRowClass}>
                        <label htmlFor="avoid" className={labelClass}>Elements to Avoid</label>
                        <textarea
                            id="avoid"
                            rows={3}
                            value={options.avoid}
                            onChange={e => handleOptionChange('avoid', e.target.value)}
                            placeholder="e.g., violence, sad endings, complex dialogue"
                            className={inputClass}
                        />
                    </div>
                </main>
                
                <footer className="p-4 flex justify-end border-t border-gray-700 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full hover:from-cyan-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-300"
                    >
                        Done
                    </button>
                </footer>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AdvancedOptionsModal;
