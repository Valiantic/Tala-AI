
interface CommandHandler {
  pattern: RegExp;
  handler: (matches: RegExpMatchArray) => Promise<string>;
}

const urlMap: Record<string, string> = {
  youtube: 'https://www.youtube.com',
  google: 'https://www.google.com',
  facebook: 'https://www.facebook.com',
  twitter: 'https://twitter.com',
  github: 'https://github.com',
  gmail: 'https://mail.google.com',
  amazon: 'https://www.amazon.com',
  netflix: 'https://www.netflix.com',
  spotify: 'https://www.spotify.com',
  reddit: 'https://www.reddit.com',
  linkedin: 'https://www.linkedin.com',
  instagram: 'https://www.instagram.com',
};

const greetings = [
  "Hello! How can I assist you today?",
  "Hi there! What can I do for you?",
  "Greetings! How may I help you?",
  "Hey! I'm listening. What do you need?",
  "Hello! I'm ready to assist you."
];

const howAreYouResponses = [
  "I'm doing well, thank you for asking! How about you?",
  "I'm functioning perfectly! How are you today?",
  "All systems operational and ready to help! How are you?",
  "I'm great! It's nice of you to ask. How's your day going?",
  "I'm excellent, thanks for asking! How about yourself?"
];

const commands: CommandHandler[] = [
  // Open website command
  {
    pattern: /open\s+(.*)/i,
    handler: async (matches) => {
      const site = matches[1].toLowerCase().trim();
      
      if (urlMap[site]) {
        window.open(urlMap[site], '_blank');
        return `Opening ${site} for you.`;
      } else {
        // Try to open with https
        try {
          window.open(`https://${site}.com`, '_blank');
          return `Trying to open ${site}.com for you.`;
        } catch (error) {
          return `I'm not sure how to open ${site}. Could you try a different website?`;
        }
      }
    }
  },
  
  // Greeting commands
  {
    pattern: /^(hi|hello|hey|greetings)/i,
    handler: async () => {
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
  },
  
  // How are you command
  {
    pattern: /how are you/i,
    handler: async () => {
      return howAreYouResponses[Math.floor(Math.random() * howAreYouResponses.length)];
    }
  },
  
  // What can you do command
  {
    pattern: /what can you do/i,
    handler: async () => {
      return "I can chat with you, open websites, and assist with various tasks. Try saying 'open YouTube' or just chat with me!";
    }
  },
  
  // Who are you command
  {
    pattern: /who are you/i,
    handler: async () => {
      return "I'm your AI voice assistant, designed to help you with conversations and tasks like opening websites.";
    }
  },
  
  // Thanks command
  {
    pattern: /thank(s| you)/i,
    handler: async () => {
      return "You're welcome! Is there anything else I can help you with?";
    }
  }
];

export const processCommand = async (transcript: string): Promise<string> => {
  for (const command of commands) {
    const matches = transcript.match(command.pattern);
    if (matches) {
      return await command.handler(matches);
    }
  }
  
  // Default response if no command matches
  return "I'm not sure how to respond to that. Try saying 'What can you do' to learn more.";
};
