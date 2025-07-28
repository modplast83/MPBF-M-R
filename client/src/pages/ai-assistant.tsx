import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth-v2";
import { useTranslation } from "react-i18next";
import {
  Bot,
  Send,
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
  Languages,
  BarChart3,
  Settings,
  Star,
  Target,
  Brain,
  Cpu,
  Activity,
  PieChart,
  Users,
  Package,
  Calendar,
  Wrench,
  Shield,
  Rocket
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

export default function AIAssistantPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [isWelcomeShown, setIsWelcomeShown] = useState(false);

  // Voice functionality states
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [gestureAnimation, setGestureAnimation] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

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
          };
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log('Speech recognition result:', transcript);
            setInput(transcript);
            setIsProcessingVoice(true);
            setGestureAnimation('processing');
            
            // Auto-send the voice command
            setTimeout(() => {
              setIsProcessingVoice(false);
              setGestureAnimation('idle');
              // Just set the input, the user can send it manually or we'll handle it later
              setInput(transcript);
            }, 500);
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            setIsProcessingVoice(false);
            setGestureAnimation('idle');
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
        content: `Welcome to the AI Production Assistant, ${user.username}! I'm here to help you optimize production, analyze performance, and solve challenges. How can I assist you today?`,
        timestamp: new Date(),
        suggestions: [
          {
            type: 'insight',
            title: 'Production Analysis',
            description: 'Get detailed insights about current production performance',
            priority: 'high'
          },
          {
            type: 'navigation',
            title: 'Quality Dashboard',
            description: 'View quality metrics and recommendations',
            actionUrl: '/quality',
            priority: 'medium'
          },
          {
            type: 'action',
            title: 'Schedule Optimization',
            description: 'Optimize production schedules for better efficiency',
            priority: 'medium'
          }
        ]
      };
      setMessages([welcomeMessage]);
      setIsWelcomeShown(true);
    }
  }, [user, isWelcomeShown]);

  // Auto-send voice commands
  useEffect(() => {
    if (input && isProcessingVoice) {
      const timer = setTimeout(() => {
        if (input.trim()) {
          handleSendMessage();
        }
        setIsProcessingVoice(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [input, isProcessingVoice]);

  // Query for production insights
  const { data: productionInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/ai/production-insights'],
    queryFn: async () => {
      const response = await fetch('/api/ai/production-insights');
      if (!response.ok) throw new Error('Failed to fetch insights');
      return response.json();
    }
  });

  // Query for AI health status
  const { data: aiHealth } = useQuery({
    queryKey: ['/api/ai/health'],
    queryFn: async () => {
      const response = await fetch('/api/ai/health');
      if (!response.ok) throw new Error('Failed to fetch AI health');
      return response.json();
    }
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
            currentPage: '/ai-assistant',
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
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const messageContent = input.trim();
    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    try {
      await assistantMutation.mutateAsync(messageContent);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: AssistantMessage = {
        id: Date.now().toString() + '_error',
        type: 'assistant',
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
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
    await assistantMutation.mutateAsync(`Please help me with: ${suggestion.title}`);
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
    console.log('Attempting to start listening...');
    console.log('Recognition ref:', !!recognitionRef.current);
    console.log('Speech supported:', speechSupported);
    
    // Check if already listening
    if (isListening) {
      console.log('Already listening, stopping first...');
      stopListening();
      return;
    }
    
    if (recognitionRef.current) {
      try {
        // Check if user has granted microphone permissions
        navigator.mediaDevices?.getUserMedia?.({ audio: true })
          .then(() => {
            console.log('Microphone permission granted');
            recognitionRef.current.start();
            toast({
              title: "Voice Recognition Started",
              description: `Listening in ${voiceLanguage === 'ar-SA' ? 'Arabic' : 'English'} mode`,
            });
          })
          .catch((error) => {
            console.error('Microphone permission denied:', error);
            toast({
              title: "Microphone Permission Required",
              description: "Please allow microphone access to use voice commands",
              variant: "destructive"
            });
          });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Voice Recognition Error",
          description: "Failed to start voice recognition",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Voice Recognition Unavailable",
        description: "Voice recognition is not supported in this browser",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    console.log('Stopping speech recognition...');
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setGestureAnimation('idle');
      console.log('Speech recognition stopped');
    }
  };

  const speakText = (text: string) => {
    if (!speechSynthesisRef.current || !speechEnabled) return;
    
    console.log('Speaking text:', text);
    setGestureAnimation('speaking');
    
    // Cancel any existing speech
    speechSynthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLanguage;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      console.log('Speech synthesis started');
      setGestureAnimation('speaking');
    };
    
    utterance.onend = () => {
      console.log('Speech synthesis ended');
      setGestureAnimation('idle');
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setGestureAnimation('idle');
      toast({
        title: "Speech Error",
        description: "Failed to speak the response",
        variant: "destructive"
      });
    };
    
    speechSynthesisRef.current.speak(utterance);
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    
    if (speechEnabled && speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setGestureAnimation('idle');
    }
    
    toast({
      title: speechEnabled ? "Voice Responses Disabled" : "Voice Responses Enabled",
      description: speechEnabled ? "AI will no longer speak responses" : "AI will speak responses aloud",
    });
  };

  const toggleLanguage = () => {
    const newLanguage = voiceLanguage === 'en-US' ? 'ar-SA' : 'en-US';
    setVoiceLanguage(newLanguage);
    
    // Update recognition language if it exists
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLanguage;
    }
    
    // Stop any ongoing speech
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    
    toast({
      title: "Language Changed",
      description: newLanguage === 'ar-SA' ? 'Arabic voice mode activated' : 'English voice mode activated',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  AI Production Assistant
                </h1>
                <p className="text-gray-600 text-lg font-medium">
                  Intelligent production management and optimization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                variant="outline" 
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-all duration-200",
                  aiHealth?.status === 'healthy' 
                    ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" 
                    : "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                )}
              >
                {aiHealth?.status === 'healthy' ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">AI Online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 animate-pulse" />
                    <span className="font-semibold">Connecting...</span>
                  </div>
                )}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-16 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl border border-gray-200/50">
            <TabsTrigger 
              value="chat" 
              className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-lg m-1"
            >
              <MessageCircle className="h-5 w-5" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-lg m-1"
            >
              <BarChart3 className="h-5 w-5" />
              Production Insights
            </TabsTrigger>
            <TabsTrigger 
              value="automation" 
              className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 rounded-lg m-1"
            >
              <Cpu className="h-5 w-5" />
              Smart Automation
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="h-[700px] flex flex-col shadow-xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      Production Assistant Chat
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 px-6">
                      <div className="space-y-4 py-6">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-4",
                              message.type === 'user' ? "justify-end" : "justify-start"
                            )}
                          >
                            {message.type === 'assistant' && (
                              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                                <Bot className="h-6 w-6 text-blue-600" />
                              </div>
                            )}
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-3 max-w-[85%] shadow-sm",
                                message.type === 'user'
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                  : "bg-white border border-gray-200"
                              )}
                            >
                              <div className="text-sm leading-relaxed">{message.content}</div>
                              
                              {message.suggestions && message.suggestions.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  {message.suggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleSuggestionClick(suggestion)}
                                      className={cn(
                                        "w-full text-left p-3 rounded-lg border transition-all text-sm hover:shadow-md",
                                        getPriorityColor(suggestion.priority),
                                        "hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                      )}
                                    >
                                      <div className="flex items-start gap-3">
                                        {getSuggestionIcon(suggestion.type)}
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium">{suggestion.title}</div>
                                        </div>
                                        {suggestion.actionUrl && (
                                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            {message.type === 'user' && (
                              <div className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full">
                                <Users className="h-6 w-6 text-gray-600" />
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {assistantMutation.isPending && (
                          <div className="flex gap-4 justify-start">
                            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                              <Bot className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-[85%] shadow-sm">
                              <div className="flex items-center gap-3 text-sm">
                                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                                <span>AI is thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    
                    <div className="p-6 border-t bg-gray-50/50">
                      <div className="flex gap-2">
                        <div className="flex-1 flex gap-1">
                          <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isListening ? "Listening..." : "Ask me about production, quality, scheduling, or anything else..."}
                            className="flex-1 h-12 text-base bg-white"
                            disabled={assistantMutation.isPending || isListening}
                          />
                          {speechSupported && (
                            <Button
                              onClick={isListening ? stopListening : startListening}
                              disabled={assistantMutation.isPending}
                              size="lg"
                              variant={isListening ? "destructive" : "outline"}
                              className={cn(
                                "px-3",
                                isListening && "animate-pulse"
                              )}
                              title={isListening ? "Stop listening" : "Start voice command"}
                            >
                              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </Button>
                          )}
                          {speechSynthesisRef.current && (
                            <Button
                              onClick={toggleSpeech}
                              disabled={assistantMutation.isPending}
                              size="lg"
                              variant="outline"
                              className="px-3"
                              title={speechEnabled ? "Disable voice responses" : "Enable voice responses"}
                            >
                              {speechEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                            </Button>
                          )}
                          {speechSupported && (
                            <Button
                              onClick={toggleLanguage}
                              disabled={assistantMutation.isPending}
                              size="lg"
                              variant="outline"
                              className="px-3 font-bold text-sm"
                              title={voiceLanguage === 'ar-SA' ? "Switch to English" : "Switch to Arabic"}
                            >
                              {voiceLanguage === 'ar-SA' ? 'ع' : 'EN'}
                            </Button>
                          )}
                        </div>
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!input.trim() || assistantMutation.isPending}
                          size="lg"
                          className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      {/* Voice status indicator */}
                      <div className="text-xs mt-3 text-center">
                        {speechSupported ? (
                          <div className={cn(
                            "transition-all duration-300 rounded-md px-3 py-2",
                            isListening && "bg-blue-50 border border-blue-200 text-blue-700 animate-pulse",
                            isProcessingVoice && "bg-yellow-50 border border-yellow-200 text-yellow-700 animate-bounce",
                            gestureAnimation === 'speaking' && "bg-green-50 border border-green-200 text-green-700",
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
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-6">
                <Card className="shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Rocket className="h-5 w-5 text-blue-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { icon: TrendingUp, label: "Production Analysis", color: "text-green-600" },
                      { icon: Target, label: "Quality Metrics", color: "text-blue-600" },
                      { icon: Calendar, label: "Schedule Review", color: "text-purple-600" },
                      { icon: Wrench, label: "Maintenance Check", color: "text-orange-600" },
                      { icon: PieChart, label: "Cost Analysis", color: "text-red-600" }
                    ].map((action, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start h-12 hover:bg-blue-50"
                        onClick={() => setInput(`Help me with ${action.label.toLowerCase()}`)}
                      >
                        <action.icon className={cn("h-5 w-5 mr-3", action.color)} />
                        {action.label}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="h-5 w-5 text-purple-500" />
                      AI Capabilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    {aiHealth?.capabilities?.slice(0, 6).map((capability: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{capability}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Production Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insightsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="shadow-lg">
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                [
                  {
                    title: "Production Efficiency",
                    icon: TrendingUp,
                    value: "87.5%",
                    change: "+5.2%",
                    color: "text-green-600",
                    bgColor: "bg-green-50"
                  },
                  {
                    title: "Quality Score",
                    icon: Star,
                    value: "94.2%",
                    change: "+2.1%",
                    color: "text-blue-600",
                    bgColor: "bg-blue-50"
                  },
                  {
                    title: "Machine Utilization",
                    icon: Activity,
                    value: "78.9%",
                    change: "-1.3%",
                    color: "text-orange-600",
                    bgColor: "bg-orange-50"
                  },
                  {
                    title: "Order Completion",
                    icon: CheckCircle,
                    value: "92.7%",
                    change: "+3.8%",
                    color: "text-purple-600",
                    bgColor: "bg-purple-50"
                  },
                  {
                    title: "Cost Efficiency",
                    icon: PieChart,
                    value: "€2.45/unit",
                    change: "-0.15€",
                    color: "text-green-600",
                    bgColor: "bg-green-50"
                  },
                  {
                    title: "Downtime",
                    icon: Clock,
                    value: "2.3 hrs",
                    change: "-0.7 hrs",
                    color: "text-red-600",
                    bgColor: "bg-red-50"
                  }
                ].map((metric, index) => (
                  <Card key={index} className="shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className={cn("p-2 rounded-lg", metric.bgColor)}>
                          <metric.icon className={cn("h-5 w-5", metric.color)} />
                        </div>
                        {metric.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <Badge variant={metric.change.startsWith('+') ? "default" : "destructive"}>
                          {metric.change}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Smart Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-blue-500" />
                    Active Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Quality Alert System", status: "Active", icon: Shield },
                    { name: "Inventory Optimization", status: "Running", icon: Package },
                    { name: "Maintenance Scheduler", status: "Monitoring", icon: Wrench }
                  ].map((workflow, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <workflow.icon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">{workflow.name}</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {workflow.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                    Smart Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "Optimize Machine Schedule",
                      description: "Reduce idle time by 15% with better scheduling",
                      priority: "high"
                    },
                    {
                      title: "Quality Check Enhancement",
                      description: "Implement automated quality monitoring",
                      priority: "medium"
                    },
                    {
                      title: "Inventory Rebalancing",
                      description: "Adjust stock levels based on demand forecast",
                      priority: "low"
                    }
                  ].map((suggestion, index) => (
                    <div key={index} className={cn(
                      "p-4 rounded-lg border-l-4",
                      suggestion.priority === 'high' ? "border-red-400 bg-red-50" :
                      suggestion.priority === 'medium' ? "border-yellow-400 bg-yellow-50" :
                      "border-blue-400 bg-blue-50"
                    )}>
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      <Button size="sm" variant="outline" className="mt-3">
                        Implement
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}