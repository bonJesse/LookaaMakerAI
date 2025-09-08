import React, { useState, useRef, useCallback } from 'react';
import type { ImageValidationResult } from '../types';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  validationResult: ImageValidationResult | null;
  isLoading: boolean;
  apiError: string | null;
}

const CameraIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-16 w-16 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, validationResult, isLoading, apiError }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (files: FileList | null) => {
    if (files && files[0]) {
      onImageUpload(files[0]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  }, [handleFile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };
  
  const onSelectFileClick = () => {
    if (inputRef.current) {
        inputRef.current.removeAttribute('capture');
        inputRef.current.click();
    }
  };

  const onTakePhotoClick = () => {
    if (inputRef.current) {
        inputRef.current.setAttribute('capture', 'user');
        inputRef.current.click();
    }
  };

  const hasValidationMessage = validationResult || apiError;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">🖼️ 你的照片</h2>
        <div 
            className={`p-8 border-2 border-dashed rounded-xl w-full text-center transition-colors duration-300 ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-stone-300 bg-stone-50/50'}`}
            onDragEnter={handleDrag} 
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleChange}
            />
            <div className="flex flex-col items-center justify-center space-y-2">
                <CameraIcon />
                <p className="text-lg font-semibold text-stone-600">点击上传照片</p>
                <p className="text-sm text-stone-500">支持 JPG, PNG 格式，最大 10MB</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <button type="button" onClick={onSelectFileClick} className="w-full py-3 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105">
                选择文件
            </button>
            <button type="button" onClick={onTakePhotoClick} className="w-full py-3 px-4 bg-white text-stone-700 font-semibold rounded-lg border border-stone-300 shadow-sm hover:bg-stone-100 transition-colors duration-300">
                拍照
            </button>
        </div>

        <div className="mt-4 text-sm text-stone-500 bg-stone-100 py-2 px-4 rounded-lg">
            💡 提示: 选择清晰的正面照片效果更佳
        </div>

         {isLoading && (
            <div className="mt-4 text-center text-stone-600">正在分析您的照片...</div>
        )}
        {hasValidationMessage && !isLoading && (
          <div className={`mt-4 p-3 rounded-lg flex items-center text-sm ${validationResult?.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {validationResult?.isValid ? <CheckIcon /> : <ExclamationIcon />}
            <span>{apiError || validationResult?.reason}</span>
          </div>
        )}
    </div>
  );
};