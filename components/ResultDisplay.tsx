import React from 'react';

interface ResultDisplayProps {
  generatedImage: string | null;
  onRegenerate: () => void;
  onNewDestination: () => void;
  onNewPhoto: () => void;
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
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 01-1.414 1.414L12 6.414l-2.293 2.293a1 1 0 01-1.414-1.414L10 4.293m5.707 7.293a1 1 0 01-1.414 1.414L12 13.414l-2.293 2.293a1 1 0 11-1.414-1.414L10 11.707m-3.707 7.293a1 1 0 011.414-1.414L8 19.586l2.293-2.293a1 1 0 111.414 1.414L10 21.707l-2.293-2.293z" />
  </svg>
);

const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, onRegenerate, onNewDestination, onNewPhoto }) => {
    
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
        <div className="w-full h-full flex flex-col justify-between items-center p-4 animate-fade-in">
            <div className="w-full flex flex-col items-center">
                <h2 className="text-2xl font-bold text-stone-800 mb-4 text-center">🎉 你的魔法变装!</h2>
                <img src={generatedImage || ''} alt="Generated" className="rounded-xl shadow-lg w-full h-auto object-cover aspect-square" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                >
                    <DownloadIcon />
                    下载
                </button>
                 <button
                    onClick={onRegenerate}
                    className="w-full flex items-center justify-center py-3 px-4 bg-orange-600 text-white font-semibold rounded-md shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
                >
                    <SparklesIcon />
                    再试一次
                </button>
                 <button
                    onClick={onNewDestination}
                    className="w-full flex items-center justify-center py-3 px-4 bg-stone-200 text-stone-700 font-semibold rounded-md hover:bg-stone-300 transition-colors duration-300"
                >
                    <RedoIcon />
                    新目的地
                </button>
                 <button
                    onClick={onNewPhoto}
                    className="w-full flex items-center justify-center py-3 px-4 bg-stone-200 text-stone-700 font-semibold rounded-md hover:bg-stone-300 transition-colors duration-300"
                >
                    <PhotoIcon />
                    新照片
                </button>
            </div>
        </div>
    );
};