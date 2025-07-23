import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth-v2";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Bot,
  Send,
  Minimize2,
  Maximize2,
  RefreshCw,
  Lightbulb,
  TrendingUp,
  Navigation,
  Zap,
  MessageCircle,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: AssistantSuggestion[];
  actions?: AssistantAction[];
}

interface AssistantSuggestion {
  type: 'navigation' | 'action' | 'insight' | 'optimization';
  title: string;
  description: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

interface AssistantAction {
  type: string;
  label: string;
  data: any;
}

interface AIAssistantWidgetProps {
  className?: string;
  minimized?: boolean;
  onToggleMinimize?: () => void;
}

export function AIAssistantWidget({ 
  className, 
  minimized = false, 
  onToggleMinimize 
}: AIAssistantWidgetProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isWelcomeShown, setIsWelcomeShown] = useState(false);
  
  // Voice functionality states
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-US'); // Default to English
  const [voiceActivity, setVoiceActivity] = useState(0); // 0-100 voice level
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [gestureAnimation, setGestureAnimation] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    const initializeSpeech = () => {
      console.log('Initializing speech functionality...');
      
      // Check for speech recognition support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      console.log('SpeechRecognition available:', !!SpeechRecognition);
      console.log('speechSynthesis available:', 'speechSynthesis' in window);
      
      // Always set speech supported to true to show the buttons
      setSpeechSupported(true);
      
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = voiceLanguage;
          
          recognitionRef.current.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
            setGestureAnimation('listening');
            
            // Trigger haptic feedback if available
            if (navigator.vibrate) {
              navigator.vibrate([50, 50, 50]); // Three short vibrations
            }
          };
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log('Speech recognized:', transcript);
            setInput(transcript);
            setIsListening(false);
            setIsProcessingVoice(true);
            setGestureAnimation('processing');
            
            // Success haptic feedback
            if (navigator.vibrate) {
              navigator.vibrate([100, 50, 100]); // Success pattern
            }
            
            // Auto-submit after brief delay for visual feedback
            setTimeout(() => {
              setIsProcessingVoice(false);
              if (transcript.trim()) {
                handleSendMessage();
              }
              setGestureAnimation('idle');
            }, 1200);
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            setIsProcessingVoice(false);
            setGestureAnimation('idle');
            
            // Error haptic feedback
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 200]); // Error pattern
            }
            
            toast({
              title: "Voice Recognition Error",
              description: `Speech recognition failed: ${event.error}`,
              variant: "destructive"
            });
          };
          
          recognitionRef.current.onend = () => {
            console.log('Speech recognition ended');
            if (!isProcessingVoice) {
              setIsListening(false);
              setGestureAnimation('idle');
            }
          };
        } catch (error) {
          console.error('Failed to initialize speech recognition:', error);
        }
      }
      
      // Check for speech synthesis support
      if ('speechSynthesis' in window) {
        speechSynthesisRef.current = window.speechSynthesis;
      }
    };

    initializeSpeech();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, [toast, voiceLanguage]);

  // Show welcome message on first load
  useEffect(() => {
    if (!isWelcomeShown && user) {
      const welcomeMessage: AssistantMessage = {
        id: 'welcome',
        type: 'assistant',
        content: t("ai.welcome.message", { username: user.username }),
        timestamp: new Date(),
        suggestions: [
          {
            type: 'insight',
            title: t("ai.welcome.suggestions.production_analysis.title"),
            description: t("ai.welcome.suggestions.production_analysis.description"),
            priority: 'high'
          },
          {
            type: 'navigation',
            title: t("ai.welcome.suggestions.quality_dashboard.title"),
            description: t("ai.welcome.suggestions.quality_dashboard.description"),
            actionUrl: '/quality',
            priority: 'medium'
          },
          {
            type: 'action',
            title: t("ai.welcome.suggestions.schedule_optimization.title"),
            description: t("ai.welcome.suggestions.schedule_optimization.description"),
            priority: 'medium'
          }
        ]
      };
      setMessages([welcomeMessage]);
      setIsWelcomeShown(true);
    }
  }, [user, isWelcomeShown]);

  // Query for production insights
  const { data: productionInsights, refetch: refetchInsights } = useQuery({
    queryKey: ['/api/ai/production-insights'],
    queryFn: async () => {
      const response = await fetch('/api/ai/production-insights');
      if (!response.ok) throw new Error('Failed to fetch insights');
      return response.json();
    },
    enabled: false // Only fetch when requested
  });

  // Mutation for sending assistant queries
  const assistantMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: {
            currentPage: location,
            userId: user?.id,
            userRole: user?.isAdmin ? 'admin' : 'user'
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to process query');
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: AssistantMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions,
        actions: data.actions
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response if speech is enabled
      if (speechEnabled && speechSynthesisRef.current) {
        speakText(data.response);
      }
    },
    onError: () => {
      toast({
        title: t("ai.errors.assistant_error"),
        description: t("ai.errors.assistant_error_desc"),
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    await assistantMutation.mutateAsync(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = async (suggestion: AssistantSuggestion) => {
    if (suggestion.actionUrl) {
      window.location.href = suggestion.actionUrl;
      return;
    }

    // Handle special suggestion types
    switch (suggestion.type) {
      case 'insight':
        if (suggestion.title.includes('Production')) {
          refetchInsights();
        }
        break;
      case 'action':
        await assistantMutation.mutateAsync(`Please help me with: ${suggestion.title}`);
        break;
      default:
        await assistantMutation.mutateAsync(suggestion.description);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'navigation': return <Navigation className="h-4 w-4" />;
      case 'action': return <Zap className="h-4 w-4" />;
      case 'insight': return <Lightbulb className="h-4 w-4" />;
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  // Voice gesture animation styles
  const getGestureAnimationClass = () => {
    switch (gestureAnimation) {
      case 'listening':
        return 'animate-pulse bg-blue-500 border-blue-400';
      case 'processing':
        return 'animate-bounce bg-yellow-500 border-yellow-400';
      case 'speaking':
        return 'animate-ping bg-green-500 border-green-400';
      default:
        return 'bg-gray-500 border-gray-400';
    }
  };

  // Voice activity indicator component
  const VoiceActivityIndicator = () => {
    if (gestureAnimation === 'idle') return null;
    
    return (
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/80 text-white px-3 py-2 rounded-lg text-xs z-10">
        <div className={`w-2 h-2 rounded-full ${getGestureAnimationClass()}`}></div>
        <span>
          {gestureAnimation === 'listening' && 'Listening...'}
          {gestureAnimation === 'processing' && 'Processing...'}
          {gestureAnimation === 'speaking' && 'Speaking...'}
        </span>
      </div>
    );
  };

  // Voice functionality methods
  const startListening = () => {
    console.log('Attempting to start listening...');
    console.log('Recognition ref:', !!recognitionRef.current);
    console.log('Speech supported:', speechSupported);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        console.log('Speech recognition start called');
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: "Voice Recognition Error",
          description: `Failed to start speech recognition: ${(error as Error).message}`,
          variant: "destructive"
        });
      }
    } else {
      // Show error if speech recognition is not available
      toast({
        title: "Voice Recognition Unavailable",
        description: "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if (speechSynthesisRef.current && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Set language based on current voice language setting
      utterance.lang = voiceLanguage;
      
      // Try to use appropriate voice for the language
      const voices = speechSynthesisRef.current.getVoices();
      let preferredVoice;
      
      if (voiceLanguage.startsWith('ar')) {
        // Arabic voice preferences
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith('ar') || 
          voice.name.includes('Arabic') ||
          voice.name.includes('عربي')
        );
      } else {
        // English voice preferences
        preferredVoice = voices.find(voice => 
          voice.name.includes('Female') || 
          voice.name.includes('Samantha') || 
          voice.name.includes('Alex')
        );
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesisRef.current.speak(utterance);
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    
    if (speechEnabled && speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    
    toast({
      title: speechEnabled ? t("ai.speech.disabled") : t("ai.speech.enabled"),
      description: speechEnabled ? t("ai.speech.disabled_desc") : t("ai.speech.enabled_desc"),
    });
  };

  const toggleLanguage = () => {
    const newLanguage = voiceLanguage === 'en-US' ? 'ar-SA' : 'en-US';
    setVoiceLanguage(newLanguage);
    
    // Update speech recognition language if available
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLanguage;
    }
    
    toast({
      title: t("ai.speech.language_changed"),
      description: newLanguage === 'ar-SA' ? t("ai.speech.arabic_mode") : t("ai.speech.english_mode"),
    });
  };

  if (minimized) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn("w-full max-w-md h-[600px] flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-primary" />
          {t("ai.title")}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchInsights()}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {onToggleMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[85%]",
                    message.type === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="text-sm">{message.content}</div>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={cn(
                            "w-full text-left p-2 rounded-md border transition-colors text-xs",
                            getPriorityColor(suggestion.priority),
                            "hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {getSuggestionIcon(suggestion.type)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{suggestion.title}</div>
                              <div className="text-xs opacity-75 mt-1">
                                {suggestion.description}
                              </div>
                            </div>
                            {suggestion.actionUrl && (
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-50 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {assistantMutation.isPending && (
              <div className="flex gap-3 justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 max-w-[85%]">
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {t("ai.voice.processing")}
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1 flex gap-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? t("ai.voice.listening") : t("ai.placeholder")}
                className="flex-1"
                disabled={assistantMutation.isPending || isListening}
              />
              {speechSupported && (
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={assistantMutation.isPending}
                  size="sm"
                  variant={isListening ? "destructive" : "outline"}
                  className={cn(
                    "px-2",
                    isListening && "animate-pulse"
                  )}
                  title={isListening ? t("ai.buttons.stop_listening") : t("ai.buttons.start_voice_command")}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              {speechSynthesisRef.current && (
                <Button
                  onClick={toggleSpeech}
                  disabled={assistantMutation.isPending}
                  size="sm"
                  variant="outline"
                  className="px-2"
                  title={speechEnabled ? t("ai.buttons.disable_voice_responses") : t("ai.buttons.enable_voice_responses")}
                >
                  {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              )}
              {speechSupported && (
                <Button
                  onClick={toggleLanguage}
                  disabled={assistantMutation.isPending}
                  size="sm"
                  variant="outline"
                  className="px-2 font-bold"
                  title={voiceLanguage === 'ar-SA' ? t("ai.buttons.switch_to_english") : t("ai.buttons.switch_to_arabic")}
                >
                  {voiceLanguage === 'ar-SA' ? 'ع' : 'EN'}
                </Button>
              )}
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!input.trim() || assistantMutation.isPending}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs mt-2 text-center relative">
            {speechSupported ? (
              <div className={cn(
                "transition-all duration-300 rounded-md px-3 py-2",
                isListening && "bg-blue-50 border border-blue-200 text-blue-700 animate-pulse",
                isProcessingVoice && "bg-yellow-50 border border-yellow-200 text-yellow-700 animate-bounce",
                gestureAnimation === 'speaking' && "bg-green-50 border border-green-200 text-green-700 animate-ping",
                gestureAnimation === 'idle' && "text-muted-foreground"
              )}>
                {isListening && (
                  <span className="font-medium flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    🎤 Listening... ({voiceLanguage === 'ar-SA' ? 'Arabic' : 'English'})
                  </span>
                )}
                {isProcessingVoice && (
                  <span className="font-medium flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
                    ⚡ Processing voice command...
                  </span>
                )}
                {gestureAnimation === 'speaking' && (
                  <span className="font-medium flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    🔊 AI is speaking...
                  </span>
                )}
                {gestureAnimation === 'idle' && (
                  <span>
                    Click microphone to speak ({voiceLanguage === 'ar-SA' ? 'Arabic' : 'English'} mode)
                  </span>
                )}
              </div>
            ) : (
              <span className="text-orange-600 bg-orange-50 border border-orange-200 rounded-md px-3 py-2 inline-block">
                Voice recognition unavailable - use Chrome, Edge, or Safari
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}