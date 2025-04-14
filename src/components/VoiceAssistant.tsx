
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PushToTalkButton from './PushToTalkButton';
import ResponseDisplay from './ResponseDisplay';
import { initSpeechRecognition } from '@/utils/speechUtils';
import { processCommand } from '@/utils/commandUtils';
import { speakWithBrowser } from '@/utils/speechSynthesisUtils';
import { useToast } from '@/components/ui/use-toast';

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  // Initialize speech recognition with callbacks
  const initializeRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;
    
    const recognition = initSpeechRecognition(
      (newTranscript, isFinal) => {
        setTranscript(newTranscript);
        if (isFinal && newTranscript) {
          setIsProcessing(true);
          processCommand(newTranscript).then(result => {
            setResponse(result);
            speakWithBrowser(result);
            setIsProcessing(false);
          });
        }
      },
      () => {
        setIsListening(false);
      }
    );
    
    recognitionRef.current = recognition;
    return recognition;
  }, []);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setTranscript('');
      setIsListening(true);
      const recognition = initializeRecognition();
      recognition.start();
    }
  }, [isListening, initializeRecognition]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-between min-h-[80vh] w-full max-w-lg mx-auto p-4">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-tech-purple to-tech-blue bg-clip-text text-transparent">
          Tala 
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Your modern voice assistant
        </p>
        
        {/* Transcript display */}
        {isListening && transcript && (
          <div className="w-full p-3 bg-secondary rounded-md mb-4 animate-fade-in">
            <p className="text-sm text-gray-300">Heard: {transcript}</p>
          </div>
        )}
        
        {/* Response display component */}
        <ResponseDisplay 
          message={response} 
          isProcessing={isProcessing} 
        />
      </div>
      
      {/* Push to talk button at bottom */}
      <div className="mt-auto mb-8">
        <PushToTalkButton 
          isListening={isListening}
          onClick={toggleListening}
        />
        <p className="text-center text-sm text-gray-400 mt-2">
          {isListening ? 'Tap to stop listening' : 'Tap to speak'}
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
