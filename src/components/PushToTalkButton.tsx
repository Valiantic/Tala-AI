
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface PushToTalkButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const PushToTalkButton: React.FC<PushToTalkButtonProps> = ({ isListening, onClick }) => {
  return (
    <div className="relative flex items-center justify-center mt-8">
      <button
        onClick={onClick}
        className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center focus:outline-none transition-all duration-300 ${
          isListening 
            ? 'bg-tech-highlight text-white circle-glow' 
            : 'bg-tech-purple text-white hover:bg-tech-highlight'
        }`}
        aria-label={isListening ? 'Stop Listening' : 'Start Listening'}
      >
        {isListening ? (
          <>
            <div className="pulse-ring"></div>
            <MicOff className="h-10 w-10" />
          </>
        ) : (
          <Mic className="h-10 w-10" />
        )}
      </button>
    </div>
  );
};

export default PushToTalkButton;
