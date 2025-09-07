import React from 'react';

interface ResultDisplayProps {
  generatedImage: string | null;
  onRegenerate: () => void;
  onNewDestination: () => void;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.086V3a1 1 0 112 0v8.086l1.293-1.379a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const RedoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a1.5 1.5 0 013 0V5a1.5 1.5 0 01-3 0V3.5zM3.5 10a1.5 1.5 0 010-3H5a1.5 1.5 0 010 3H3.5zm11.5 0a1.5 1.5 0 010 3H15a1.5 1.5 0 010-3h1.5zm-10 5.5a1.5 1.5 0 013 0v1.5a1.5 1.5 0 01-3 0V15.5z" />
        <path fillRule="evenodd" d="M10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
    </svg>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, onRegenerate, onNewDestination }) => {
    
    const handleDownload = () => {
        if(!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'cultural-makeover.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full h-full flex flex-col justify-between items-center p-6 bg-white/70 rounded-xl backdrop-blur-sm border border-stone-200/80 shadow-sm animate-fade-in">
            <div className="w-full flex flex-col items-center">
                <h2 className="text-2xl font-bold text-stone-800 mb-4">Your Makeover!</h2>
                <img src={generatedImage || ''} alt="Generated" className="rounded-xl shadow-lg w-full h-auto object-cover aspect-square" />
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                >
                    <DownloadIcon />
                    Download
                </button>
                 <button
                    onClick={onRegenerate}
                    className="w-full flex items-center justify-center py-3 px-4 bg-orange-600 text-white font-semibold rounded-md shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
                >
                    <SparklesIcon />
                    Try Another
                </button>
                 <button
                    onClick={onNewDestination}
                    className="w-full sm:col-span-2 lg:col-span-1 flex items-center justify-center py-3 px-4 bg-stone-200 text-stone-700 font-semibold rounded-md hover:bg-stone-300 transition-colors duration-300"
                >
                    <RedoIcon />
                    New Destination
                </button>
            </div>
        </div>
    );
};