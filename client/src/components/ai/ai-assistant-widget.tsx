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
  VolumeX
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
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    const initializeSpeech = () => {
      // Check for speech recognition support
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            title: "Voice Recognition Error",
            description: "Could not process your voice command. Please try again.",
            variant: "destructive"
          });
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
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
  }, [toast]);

  // Show welcome message on first load
  useEffect(() => {
    if (!isWelcomeShown && user) {
      const welcomeMessage: AssistantMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Hello ${user.username}! I'm your AI Production Assistant. I can help you with production planning, quality insights, order management, and system navigation. What would you like to know?`,
        timestamp: new Date(),
        suggestions: [
          {
            type: 'insight',
            title: 'Production Analysis',
            description: 'Get current production efficiency and bottleneck analysis',
            priority: 'high'
          },
          {
            type: 'navigation',
            title: 'Quality Dashboard',
            description: 'View quality metrics and recent checks',
            actionUrl: '/quality',
            priority: 'medium'
          },
          {
            type: 'action',
            title: 'Schedule Optimization',
            description: 'Optimize production schedule for pending orders',
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
        title: "Assistant Error",
        description: "Failed to process your request. Please try again.",
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

  // Voice functionality methods
  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: "Voice Recognition Error",
          description: "Failed to start voice recognition. Please try again.",
          variant: "destructive"
        });
      }
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
      
      // Try to use a pleasant voice if available
      const voices = speechSynthesisRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Alex')
      );
      
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
      title: speechEnabled ? "Speech Disabled" : "Speech Enabled",
      description: speechEnabled ? "AI responses will no longer be spoken" : "AI responses will now be spoken aloud",
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
          AI Assistant
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
                    Thinking...
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
                placeholder={isListening ? "Listening..." : "Ask about production, orders, quality..."}
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
                  title={isListening ? "Stop listening" : "Start voice command"}
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
                  title={speechEnabled ? "Disable voice responses" : "Enable voice responses"}
                >
                  {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
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
          {speechSupported && (
            <div className="text-xs text-muted-foreground mt-2 text-center">
              {isListening ? (
                <span className="text-primary">🎤 Listening for your voice command...</span>
              ) : (
                <span>Click the microphone to use voice commands</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}