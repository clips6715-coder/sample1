
import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center my-16">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-300">Generating your masterpiece...</p>
        </div>
    );
};

export default Loader;
