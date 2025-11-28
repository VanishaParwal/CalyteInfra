import { Layout } from '@/components/Layout';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Mic, MicOff, MessageSquare, Volume2, Bot, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const { isDarkMode } = useTheme();
  const [mode, setMode] = useState<'text' | 'speech'>('text');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI wellness companion. How are you feeling today? I\'m here to listen and provide support.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const modeRef = useRef(mode);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showChatbaseEmbed, setShowChatbaseEmbed] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        
        if (modeRef.current === 'speech') {
          setTimeout(() => {
            const speechInput = transcript;
            if (!speechInput.trim()) return;
            handleSendMessage(speechInput);
          }, 100);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            { role: 'user', content: text }
          ],
        }),
      });

      let aiContent = getWellnessResponse(text);
      
      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          aiContent = data.text;
        }
      }
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      if (mode === 'speech') {
        speakMessage(aiMessage.content);
      }
    } catch (error) {
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: getWellnessResponse(text),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      if (mode === 'speech') {
        speakMessage(aiMessage.content);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getWellnessResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('anxious') || input.includes('anxiety') || input.includes('worried')) {
      return "I understand feeling anxious can be overwhelming. Let's try a grounding exercise together. Can you name 5 things you can see around you right now? This simple practice can help bring you back to the present moment. Would you like to try some breathing exercises as well?";
    }
    
    if (input.includes('sad') || input.includes('depressed') || input.includes('down')) {
      return "I'm sorry you're feeling this way. Your feelings are valid, and it takes courage to share them. Remember that difficult emotions, like clouds, do pass. What's one small thing that has brought you comfort in the past?";
    }
    
    if (input.includes('stress') || input.includes('overwhelmed') || input.includes('pressure')) {
      return "It sounds like you're carrying a lot right now. Sometimes when we're overwhelmed, it helps to focus on just one thing at a time. What feels most pressing to you right now? Let's break it down together.";
    }
    
    if (input.includes('sleep') || input.includes('insomnia') || input.includes('tired')) {
      return "Sleep difficulties can really affect our wellbeing. Have you tried establishing a calming bedtime routine? Our Sleep section has some wonderful guided relaxations. Would you like me to suggest some techniques for better rest?";
    }
    
    if (input.includes('meditation') || input.includes('mindful') || input.includes('calm')) {
      return "That's wonderful that you're interested in meditation! Starting with just 5 minutes a day can make a difference. Would you like to explore our guided meditation sessions? They're designed for all experience levels.";
    }
    
    if (input.includes('happy') || input.includes('good') || input.includes('great') || input.includes('well')) {
      return "I'm so glad to hear you're feeling positive! It's important to acknowledge and savor these moments. What's contributing to your good mood today?";
    }
    
    if (input.includes('help') || input.includes('support') || input.includes('need')) {
      return "I'm here to support you in whatever way I can. Whether you'd like to talk about what's on your mind, try some relaxation techniques, or just have a calm conversation - I'm listening. What would be most helpful for you right now?";
    }
    
    const responses = [
      "Thank you for sharing that with me. How does that make you feel on a deeper level?",
      "I appreciate you opening up. Can you tell me more about what's been going on?",
      "That's interesting. What aspects of this situation have the biggest impact on your wellbeing?",
      "I'm here to listen. Is there anything specific you'd like to explore or work through together?",
      "Your perspective matters. How long have you been experiencing these feelings?",
      "It sounds like you're processing a lot. Would you find it helpful to try a breathing exercise or continue our conversation?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = () => {
    handleSendMessage();
  };

  if (showChatbaseEmbed) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
          <div className="mb-6 flex items-center justify-between">
            <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-3xl`}>
              AI Wellness Chat
            </h2>
            <Button variant="outline" onClick={() => setShowChatbaseEmbed(false)}>
              Use Custom Interface
            </Button>
          </div>
          <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-900/10'} backdrop-blur-xl overflow-hidden`}>
            <iframe
              ref={iframeRef}
              src="https://www.chatbase.co/chatbot-iframe/6aWohxDZKFG3KTXT_tO5S"
              width="100%"
              style={{ height: '600px', minHeight: '600px' }}
              frameBorder="0"
              title="Wellness AI Chatbot"
            />
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative w-24 h-24">
              <div 
                className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-purple-400/80 via-pink-400/80 to-blue-400/80' : 'bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500'} 
                  rounded-full flex items-center justify-center shadow-lg`}
              >
                <Bot className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          
          <h2 className={`${isDarkMode ? 'text-white/95' : 'text-slate-900'} font-serif text-4xl mb-4`}>
            AI Wellness Companion
          </h2>
          <p className={isDarkMode ? 'text-white/70' : 'text-slate-700'}>
            Your safe space for anonymous support and guidance
          </p>

          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <Button
              onClick={() => setMode('text')}
              variant={mode === 'text' ? 'default' : 'outline'}
              className="gap-2"
              data-testid="button-mode-text"
            >
              <MessageSquare className="w-4 h-4" />
              Text Chat
            </Button>
            <Button
              onClick={() => {
                if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
                  alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
                  return;
                }
                setMode('speech');
              }}
              variant={mode === 'speech' ? 'default' : 'outline'}
              className="gap-2"
              data-testid="button-mode-speech"
            >
              <Volume2 className="w-4 h-4" />
              Voice Chat
            </Button>
            <Button
              onClick={() => setShowChatbaseEmbed(true)}
              variant="outline"
              className="gap-2"
              data-testid="button-chatbase-embed"
            >
              <Bot className="w-4 h-4" />
              Full Chatbot
            </Button>
          </div>
        </div>

        <Card className={`${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-900/10'} backdrop-blur-xl mb-4`}>
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    message.role === 'user'
                      ? isDarkMode ? 'bg-primary/90 text-white' : 'bg-primary text-white'
                      : isDarkMode ? 'bg-white/10 text-white/90' : 'bg-slate-100 text-slate-900'
                  }`}
                  data-testid={`message-${message.id}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4" />
                      <Badge variant="outline" className="text-xs">AI Companion</Badge>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className={`text-xs mt-2 block ${message.role === 'user' ? 'text-white/70' : isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-5 py-3 ${isDarkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className={isDarkMode ? 'text-white/70' : 'text-slate-600'}>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={`border-t ${isDarkMode ? 'border-white/10' : 'border-slate-900/10'} p-4`}>
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={mode === 'speech' ? 'Click the mic button to speak...' : 'Type your message...'}
                className={`${isDarkMode ? 'bg-white/5 border-white/10 text-white/90 placeholder:text-white/40' : 'bg-slate-50 border-slate-200 text-slate-900'} resize-none`}
                rows={2}
                disabled={isLoading}
                data-testid="textarea-message"
              />
              <div className="flex flex-col gap-2">
                {mode === 'speech' && (
                  <>
                    <Button
                      onClick={toggleListening}
                      size="icon"
                      variant={isListening ? 'default' : 'outline'}
                      className={isListening ? 'animate-pulse' : ''}
                      disabled={isLoading}
                      data-testid="button-voice-input"
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    {isSpeaking && (
                      <Button
                        onClick={stopSpeaking}
                        size="icon"
                        variant="outline"
                        data-testid="button-stop-speech"
                      >
                        <Volume2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </>
                )}
                <Button
                  onClick={handleSend}
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  data-testid="button-send"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-6`}>
          {[
            "I'm feeling anxious",
            "Help me relax",
            "I can't sleep",
            "I need motivation"
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(suggestion);
                handleSendMessage(suggestion);
              }}
              disabled={isLoading}
              className="text-xs"
              data-testid={`suggestion-${index}`}
            >
              {suggestion}
            </Button>
          ))}
        </div>

        <p className={`text-center text-sm ${isDarkMode ? 'text-white/50' : 'text-slate-500'}`}>
          Your conversations are private and anonymous. This AI provides support but is not a substitute for professional help.
        </p>
      </div>
    </Layout>
  );
}

