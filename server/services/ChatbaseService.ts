const CHATBASE_AGENT_ID = '6aWohxDZKFG3KTXT_tO5S';
const CHATBASE_API_URL = 'https://www.chatbase.co/api/v1/chat';

// Crisis helplines for India
const CRISIS_HELPLINES = {
  aasra: { name: 'Aasra', number: '1860-025-9999', available: '24/7' },
  iCall: { name: 'iCall', number: '9152987821', available: '9am-11pm' },
  vandrevala: { name: 'Vandrevala Foundation', number: '9999 666 555', available: '24/7' },
  amiable: { name: 'AMIABLE', number: '09175177177', available: '24/7' }
};

export class ChatbaseService {
  // Detect crisis keywords in user message
  private detectCrisisKeywords(message: string): boolean {
    const crisisKeywords = [
      'want to die',
      'i want to die',
      'suicide',
      'kill myself',
      'end my life',
      'no point in living',
      'better off dead',
      'harm myself',
      'hurt myself',
      'self harm',
      'abuse',
      'abusing',
      'abused',
      'assault',
      'rape',
      'domestic violence',
      'need help',
      'im helpless',
      'hopeless',
      'cant take it anymore',
      'cant handle this',
      'overwhelmed',
      'no one cares',
      'worthless',
      'useless',
      'nobody loves me'
    ];

    const lowerMessage = message.toLowerCase();
    
    // Check for exact phrase matches first (higher priority)
    for (const keyword of crisisKeywords) {
      if (lowerMessage.includes(keyword)) {
        // Additional check to avoid false positives
        if (keyword.includes('die') || keyword.includes('suicide') || 
            keyword.includes('kill') || keyword.includes('harm') ||
            keyword.includes('abuse') || keyword.includes('assault')) {
          return true;
        }
        
        // For "need help" and "hopeless", require more context
        if ((keyword === 'need help' || keyword === 'hopeless') && lowerMessage.length < 10) {
          continue;
        }
        
        return true;
      }
    }
    
    return false;
  }

  // Get crisis response with helplines
  private getCrisisResponse(): string {
    return `
🆘 CRISIS SUPPORT - WE'RE HERE FOR YOU

If you're in immediate danger, please call emergency services (911 in US, 112 in India).

📞 EMERGENCY HELPLINES (India):
• Aasra: ${CRISIS_HELPLINES.aasra.number} (${CRISIS_HELPLINES.aasra.available})
• iCall: ${CRISIS_HELPLINES.iCall.number} (${CRISIS_HELPLINES.iCall.available})
• Vandrevala Foundation: ${CRISIS_HELPLINES.vandrevala.number} (${CRISIS_HELPLINES.vandrevala.available})
• AMIABLE: ${CRISIS_HELPLINES.amiable.number} (${CRISIS_HELPLINES.amiable.available})

💙 YOU ARE NOT ALONE. YOUR LIFE HAS VALUE.

What you're feeling right now is temporary. Please reach out to someone you trust or call a helpline. 

Would you like to:
1. Talk to someone on the helpline
2. Speak with someone you trust
3. Take a moment with our meditation exercises

Your safety is the priority. Please take action today.`;
  }

  async sendMessage(userMessage: string, conversationId: string): Promise<string> {
    // Check for crisis keywords FIRST
    if (this.detectCrisisKeywords(userMessage)) {
      console.log('Crisis keywords detected - returning emergency support');
      return this.getCrisisResponse();
    }

    try {
      const response = await fetch(CHATBASE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId: CHATBASE_AGENT_ID,
          message: userMessage,
          conversationId: conversationId,
        }),
      });

      if (!response.ok) {
        console.error(`Chatbase API error: ${response.status} ${response.statusText}`);
        return this.getFallbackResponse(userMessage);
      }

      const data = await response.json();
      return data.text || this.getFallbackResponse(userMessage);
    } catch (error) {
      console.error('Chatbase API error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): string {
    const keywords = userMessage.toLowerCase();
    
    if (keywords.includes('anxious') || keywords.includes('anxiety')) {
      return "I understand you're feeling anxious. Try taking slow, deep breaths. The breathing exercise or meditation games might help calm your mind.";
    }
    if (keywords.includes('stress') || keywords.includes('stressed')) {
      return "Stress is a natural part of life. Have you tried the Zen Garden or a guided meditation? These can help you find inner peace.";
    }
    if (keywords.includes('sad') || keywords.includes('depression')) {
      return "It's okay to feel this way sometimes. Please remember that support is available. Consider talking to someone you trust or seeking professional help if needed.";
    }
    if (keywords.includes('sleep') || keywords.includes('insomnia')) {
      return "Quality sleep is important for your mental health. Try listening to our calming audio tracks (528 Hz or binaural beats) before bed.";
    }
    if (keywords.includes('game') || keywords.includes('play')) {
      return "Playing the mindfulness games can be a great way to find peace. Which game interests you most - drawing, puzzle solving, or meditation?";
    }

    const responses = [
      "I'm here to listen and support you. What's on your mind today?",
      "Thank you for sharing. How does that make you feel?",
      "That sounds challenging. What would help you feel better right now?",
      "I hear you. Remember to be kind to yourself.",
      "Would you like to try one of our wellness games to feel more centered?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const chatbaseService = new ChatbaseService();
