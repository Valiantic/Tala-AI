
import { toast } from '@/components/ui/use-toast';

// Cache for storing voices to prevent fetching multiple times
let cachedVoices: SpeechSynthesisVoice[] = [];

// Function to get available voices
const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    // If we already have voices cached, return them
    if (cachedVoices.length > 0) {
      resolve(cachedVoices);
      return;
    }

    // Check if speechSynthesis is available
    if (!window.speechSynthesis) {
      console.error('Browser does not support speech synthesis');
      resolve([]);
      return;
    }

    // Get voices
    const voices = window.speechSynthesis.getVoices();
    
    // If voices are already available
    if (voices.length > 0) {
      cachedVoices = voices;
      resolve(voices);
      return;
    }

    // If voices aren't loaded yet, wait for the voiceschanged event
    window.speechSynthesis.onvoiceschanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      cachedVoices = availableVoices;
      resolve(availableVoices);
    };
  });
};

// Define Filipino female voice characteristics to look for
const preferredVoiceNames = [
  'Filipina', 'Filipino Female', 'Philippines', 'Tagalog', 'Manila',
  'Princess', 'Maria', 'Jasmine', 'Sophia', 'Isla', 'Tala', 'Maya', 
  'Amihan', 'Rosa', 'Luna', 'Fe', 'Joy', 'Liza', 'Mara'
];

// Function to find the best Filipino female voice
const findBestFilipinoFemaleVoice = async (): Promise<SpeechSynthesisVoice | null> => {
  const voices = await getVoices();
  
  console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
  
  // Priority order for selecting voice:
  // 1. First try to find a voice that's explicitly Filipino or Tagalog
  const filipinoVoice = voices.find(voice => 
    voice.lang.includes('fil') || 
    voice.lang.includes('tl-PH') ||
    voice.name.toLowerCase().includes('filipin') ||
    voice.name.toLowerCase().includes('tagalog') ||
    voice.name.toLowerCase().includes('philippines')
  );
  
  if (filipinoVoice) return filipinoVoice;
  
  // 2. Try to find a female Asian voice with Filipino-sounding name from our preferred list
  for (const name of preferredVoiceNames) {
    const matchedVoice = voices.find(voice => 
      voice.name.includes(name)
    );
    
    if (matchedVoice) return matchedVoice;
  }
  
  // 3. Try to find any female Asian voice as a fallback
  const asianFemaleVoice = voices.find(voice => 
    (voice.lang.includes('zh') || voice.lang.includes('ja') || 
     voice.lang.includes('ko') || voice.lang.includes('th') || 
     voice.lang.includes('vi') || voice.lang.includes('ms') || 
     voice.lang.includes('id')) && 
    (voice.name.toLowerCase().includes('female') || 
     !voice.name.toLowerCase().includes('male'))
  );
  
  if (asianFemaleVoice) return asianFemaleVoice;
  
  // 4. Any female voice as final fallback
  const femaleVoice = voices.find(voice => 
    voice.name.toLowerCase().includes('female') || 
    voice.name.toLowerCase().includes('woman') ||
    !voice.name.toLowerCase().includes('male')
  );
  
  return femaleVoice || null;
};

// Function to speak using browser's speech synthesis
export const speakWithBrowser = async (text: string): Promise<void> => {
  if (!window.speechSynthesis) {
    console.error('Browser does not support speech synthesis');
    toast({
      title: "Voice Error",
      description: "Your browser doesn't support text-to-speech.",
      variant: "destructive",
    });
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find a Filipino female voice
  const filipinoFemaleVoice = await findBestFilipinoFemaleVoice();
  
  if (filipinoFemaleVoice) {
    console.log('Selected voice:', filipinoFemaleVoice.name, filipinoFemaleVoice.lang);
    utterance.voice = filipinoFemaleVoice;
  } else {
    console.log('No appropriate voice found, using default');
  }
  
  // Adjust speech parameters for more feminine Filipino sound
  utterance.rate = 1.0;    // Normal rate
  utterance.pitch = 1.2;   // Higher pitch for more feminine sound
  utterance.volume = 1.0;
  
  // Show a small toast when starting to speak
  toast({
    title: "Speaking",
    description: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
    duration: 2000,
  });
  
  window.speechSynthesis.speak(utterance);
};
