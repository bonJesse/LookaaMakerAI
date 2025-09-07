import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { CountrySelector } from './components/CountrySelector';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeImage, transformImage } from './services/geminiService';
import type { ImageValidationResult } from './types';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOADING);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ImageValidationResult | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setAppState(AppState.VALIDATING);
    setApiError(null);
    setValidationResult(null);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      setImageBase64(base64Data);
      setOriginalMimeType(file.type);

      try {
        const result = await analyzeImage(base64Data, file.type);
        setValidationResult(result);
        if (result.isValid) {
          setAppState(AppState.SELECTING);
        } else {
          setAppState(AppState.UPLOADING);
          setImageBase64(null); // Clear image if invalid
        }
      } catch (error) {
        console.error("Image validation failed:", error);
        setApiError("Sorry, we couldn't analyze the image. Please try again.");
        setAppState(AppState.UPLOADING);
        setImageBase64(null);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleTransform = useCallback(async () => {
    if (!imageBase64 || !selectedCountry) return;

    setAppState(AppState.TRANSFORMING);
    setApiError(null);

    try {
      const result = await transformImage(imageBase64, originalMimeType, selectedCountry);
      setGeneratedImage(result);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error("Image transformation failed:", error);
      setApiError("The makeover failed. Please try a different image or country.");
      setAppState(AppState.SELECTING);
    }
  }, [imageBase64, selectedCountry, originalMimeType]);
  
  const handleRegenerate = () => {
    handleTransform();
  };

  const handleNewDestination = () => {
    setAppState(AppState.SELECTING);
    setGeneratedImage(null);
    setSelectedCountry('');
    setApiError(null);
  };

  const handleFullReset = () => {
    setAppState(AppState.UPLOADING);
    setImageBase64(null);
    setValidationResult(null);
    setSelectedCountry('');
    setGeneratedImage(null);
    setApiError(null);
    setOriginalMimeType('');
  };

  const renderLeftPanel = () => {
    if (!imageBase64 || appState === AppState.UPLOADING) {
      return (
        <ImageUploader 
          onImageUpload={handleImageUpload} 
          validationResult={validationResult}
          isLoading={appState === AppState.VALIDATING}
          apiError={apiError}
        />
      );
    }
    return (
      <div className="p-6 bg-white/70 rounded-xl h-full flex flex-col justify-center items-center backdrop-blur-sm border border-stone-200/80 shadow-sm">
        <h2 className="text-2xl font-bold text-stone-800 mb-4 text-center">Your Portrait</h2>
        <img src={`data:${originalMimeType};base64,${imageBase64}`} alt="Uploaded Portrait" className="rounded-xl shadow-lg object-contain max-h-[400px] w-full" />
        <button 
          onClick={handleFullReset}
          className="mt-4 text-sm text-orange-600 hover:text-orange-500 transition-colors"
        >
          Upload a new photo
        </button>
      </div>
    );
  };
  
  const renderRightPanel = () => {
    switch (appState) {
      case AppState.TRANSFORMING:
        return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;
      case AppState.RESULT:
        return <ResultDisplay 
                  generatedImage={generatedImage} 
                  onRegenerate={handleRegenerate} 
                  onNewDestination={handleNewDestination}
                />;
      default:
        return <CountrySelector onCountrySelect={setSelectedCountry} selectedCountry={selectedCountry} />;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="container mx-auto">
        <Header />
        <main className="mt-8 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-8 items-stretch h-full">
            <div className="lg:col-span-5 h-full">
              {renderLeftPanel()}
            </div>
            
            <div className="lg:col-span-1 flex items-center justify-center my-4 lg:my-0">
                {(appState === AppState.SELECTING || appState === AppState.TRANSFORMING) && (
                    <button
                        onClick={handleTransform}
                        disabled={!selectedCountry || appState === AppState.TRANSFORMING}
                        className="p-4 rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-700 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
                        aria-label="Transform Image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="lg:col-span-5 h-full">
              {renderRightPanel()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;