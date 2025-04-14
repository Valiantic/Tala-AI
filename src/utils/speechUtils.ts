
import { toast } from '@/components/ui/use-toast';

// Define types for Web Speech API since TypeScript doesn't have built-in types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

// Define our own type for the SpeechRecognition constructor
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  grammars: any;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Get the appropriate SpeechRecognition object for the browser
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: SpeechRecognition | null = null;

export const initSpeechRecognition = (
  onResult: (transcript: string, isFinal: boolean) => void,
  onEnd: () => void
): { start: () => void; stop: () => void } => {
  if (!SpeechRecognitionAPI) {
    toast({
      title: "Error",
      description: "Speech recognition is not supported in this browser.",
      variant: "destructive",
    });
    return {
      start: () => {},
      stop: () => {},
    };
  }

  // Initialize a speech recognition instance
  recognition = new SpeechRecognitionAPI();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const result = event.results[event.resultIndex];
    const transcript = result[0].transcript.trim();
    const isFinal = result.isFinal;
    
    onResult(transcript, isFinal);
  };

  recognition.onend = onEnd;

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    
    // Don't call onEnd for "aborted" errors as they're often just part of normal operation
    // when stopping recognition deliberately
    if (event.error !== 'aborted') {
      onEnd();
      
      if (event.error === 'no-speech') {
        toast({
          title: "No speech detected",
          description: "Please try speaking again.",
        });
      } else {
        toast({
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive",
        });
      }
    }
  };

  return {
    start: () => {
      try {
        // If there's an existing instance, stop it first to prevent overlapping sessions
        if (recognition) {
          try {
            recognition.abort();
          } catch (error) {
            console.log('Error aborting previous recognition:', error);
          }
        }
        recognition = new SpeechRecognitionAPI();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
        
        // Reattach event handlers to the new instance
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const result = event.results[event.resultIndex];
          const transcript = result[0].transcript.trim();
          const isFinal = result.isFinal;
          
          onResult(transcript, isFinal);
        };
        
        recognition.onend = onEnd;
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error !== 'aborted') {
            onEnd();
            
            if (event.error === 'no-speech') {
              toast({
                title: "No speech detected",
                description: "Please try speaking again.",
              });
            } else {
              toast({
                title: "Error",
                description: `Speech recognition error: ${event.error}`,
                variant: "destructive",
              });
            }
          }
        };
        
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    },
    stop: () => {
      try {
        if (recognition) {
          recognition.stop();
        }
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    },
  };
};
