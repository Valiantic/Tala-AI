
import React from 'react';

interface ResponseDisplayProps {
  message: string;
  isProcessing: boolean;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ message, isProcessing }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-tech-darkBg bg-opacity-50 backdrop-blur-sm rounded-lg border border-tech-purple border-opacity-30 shadow-lg mt-8">
      <div className="min-h-[120px] flex flex-col justify-center items-center">
        {isProcessing ? (
          <div className="wave-group">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        ) : message ? (
          <p className="text-lg text-white animate-fade-in">{message}</p>
        ) : (
          <p className="text-gray-400 text-center">Say something like "Hello" or "Open YouTube"</p>
        )}
      </div>
    </div>
  );
};

export default ResponseDisplay;
