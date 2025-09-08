import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { CountrySelector } from './components/CountrySelector';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { analyzeImage, transformImage } from './services/geminiService';
import type { ImageValidationResult } from './types';
import { AppState } from './types';

const HotDestinations = ({ onSelect, selected }: { onSelect: (country: string) => void; selected: string }) => {
  const hotSpots = [
    { name: '日本和服', flag: '🇯🇵', country: 'Japan' },
    { name: '印度纱丽', flag: '🇮🇳', country: 'India' },
    { name: '苏格兰裙', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', country: 'Scotland' },
    { name: '埃及法老', flag: '🇪🇬', country: 'Egypt' },
    { name: '墨西哥传统', flag: '🇲🇽', country: 'Mexico' },
    { name: '中国汉服', flag: '🇨🇳', country: 'China' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {hotSpots.map((spot) => (
        <button
          key={spot.country}
          onClick={() => onSelect(spot.country)}
          className={`px-6 py-3 rounded-xl transition-all duration-300 text-stone-800 flex items-center gap-3 text-lg font-medium shadow-md hover:shadow-lg hover:scale-105 ${selected === spot.country ? 'bg-orange-400 ring-2 ring-orange-200' : 'bg-white/80 hover:bg-white'}`}
        >
          <span>{spot.flag}</span>
          <span>{spot.name}</span>
        </button>
      ))}
    </div>
  );
};

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
          setImageBase64(null);
        }
      } catch (error) {
        console.error("Image validation failed:", error);
        setApiError("抱歉，我们无法分析您的图片。请再试一次。");
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
      setApiError("魔法变装失败了。请换一张图片或国家试试。");
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
    if (appState === AppState.RESULT) {
       return <ResultDisplay 
                  generatedImage={generatedImage} 
                  onRegenerate={handleRegenerate} 
                  onNewDestination={handleNewDestination}
                  onNewPhoto={handleFullReset}
                />;
    }
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
      <div className="p-6 h-full flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4 text-center">🖼️ 你的照片</h2>
        <img src={`data:${originalMimeType};base64,${imageBase64}`} alt="Uploaded Portrait" className="rounded-xl shadow-lg object-contain max-h-[400px] w-full" />
        <button 
          onClick={handleFullReset}
          className="mt-4 text-sm text-orange-600 hover:text-orange-500 transition-colors"
        >
          上传一张新照片
        </button>
      </div>
    );
  };
  
  const renderRightPanel = () => {
    if (appState === AppState.TRANSFORMING || appState === AppState.RESULT) {
       return <div className="p-6 h-full flex flex-col justify-center items-center">
         <h2 className="text-2xl font-bold text-stone-800 mb-4 text-center">🗺️ 你的原图</h2>
         <img src={`data:${originalMimeType};base64,${imageBase64}`} alt="Uploaded Portrait" className="rounded-xl shadow-lg object-contain max-h-[400px] w-full" />
       </div>;
    }
    return <CountrySelector onCountrySelect={setSelectedCountry} selectedCountry={selectedCountry} />;
  };

  const activeStep = useMemo(() => {
    if (appState === AppState.RESULT || appState === AppState.TRANSFORMING) return 3;
    if (imageBase64 && validationResult?.isValid) return 2;
    return 1;
  }, [appState, imageBase64, validationResult]);

  const showTransformButton = appState === AppState.SELECTING || appState === AppState.TRANSFORMING;
  const showHotDestinations = appState === AppState.SELECTING || appState === AppState.UPLOADING || appState === AppState.VALIDATING;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="container mx-auto">
        <Header activeStep={activeStep} />
        <main className="mt-8 flex-grow flex flex-col items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
            <div className="bg-white/90 text-stone-800 rounded-2xl p-2 sm:p-4 shadow-lg backdrop-blur-sm">
              {appState === AppState.TRANSFORMING ? <LoadingSpinner /> : renderLeftPanel()}
            </div>
            
            <div className="bg-white/90 text-stone-800 rounded-2xl p-2 sm:p-4 shadow-lg backdrop-blur-sm">
              {renderRightPanel()}
            </div>
          </div>
          
          {showTransformButton && (
            <div className="my-8 text-center animate-fade-in">
              <button
                onClick={handleTransform}
                disabled={!selectedCountry || !imageBase64 || appState === AppState.TRANSFORMING}
                className="px-10 py-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold shadow-lg hover:shadow-xl disabled:from-stone-400 disabled:to-stone-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
              >
                ✨ 开始魔法变装
              </button>
            </div>
          )}

          {showHotDestinations && (
            <div className="w-full max-w-5xl mt-8 text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-white/90">🔥 热门目的地</h3>
              <HotDestinations onSelect={setSelectedCountry} selected={selectedCountry} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;