import React, { useState, useRef, useCallback } from 'react';
import type { ImageValidationResult } from '../types';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  validationResult: ImageValidationResult | null;
  isLoading: boolean;
  apiError: string | null;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const hasValidationMessage = validationResult || apiError;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
        <form 
            className={`p-8 border-2 border-dashed rounded-xl w-full text-center transition-colors duration-300 ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-stone-300 bg-stone-50 hover:border-stone-400'}`}
            onDragEnter={handleDrag} 
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onSubmit={(e) => e.preventDefault()}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleChange}
            />
            <div className="flex flex-col items-center justify-center space-y-4">
                <UploadIcon />
                <p className="text-stone-500">
                    <button type="button" onClick={onButtonClick} className="font-semibold text-orange-600 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-50 focus:ring-orange-500 rounded">
                        Click to upload
                    </button>
                    {' '} or drag and drop
                </p>
                <p className="text-xs text-stone-400">PNG, JPG, or WEBP (5MB max)</p>
            </div>
        </form>
         {isLoading && (
            <div className="mt-4 text-center text-stone-600">Analyzing your photo...</div>
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