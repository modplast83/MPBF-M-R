import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  MessageSquare, 
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Clock,
  Users,
  Settings,
  Zap,
  Brain,
  Target,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

const AIAssistantPage = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    { 
      icon: TrendingUp, 
      label: 'Production Analysis', 
      description: 'Get real-time production insights',
      color: 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20',
      prompt: 'Analyze current production performance and identify optimization opportunities'
    },
    { 
      icon: AlertCircle, 
      label: 'Quality Control', 
      description: 'Review quality metrics and issues',
      color: 'bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20',
      prompt: 'Show me quality control metrics and identify any potential issues'
    },
    { 
      icon: Users, 
      label: 'HR Analytics', 
      description: 'Employee performance and attendance',
      color: 'bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20',
      prompt: 'Provide HR analytics including attendance, performance, and staffing insights'
    },
    { 
      icon: Settings, 
      label: 'System Status', 
      description: 'Check system health and performance',
      color: 'bg-purple-500/10 text-purple-600 border-purple-200 hover:bg-purple-500/20',
      prompt: 'Check system health, machine status, and overall operational performance'
    },
  ];

  const suggestions = [
    "What's our production efficiency this week?",
    "Show me quality control metrics",
    "Generate maintenance schedule report",
    "Analyze bottleneck trends",
    "Create a new order for customer ABC Company",
    "What are the current inventory levels?",
    "Show me recent machine maintenance status",
    "Help me optimize our workflow processes"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputValue,
          context: {
            currentPage: 'ai-assistant',
            timestamp: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('AI Response:', data);

      let assistantContent = '';
      if (data.error) {
        assistantContent = `I encountered an error: ${data.error}`;
      } else if (data.response) {
        assistantContent = data.response;
      } else {
        assistantContent = 'I received an empty response. Please try rephrasing your question.';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      let errorContent = 'I\'m experiencing technical difficulties. ';
      
      if (error instanceof Error) {
        if (error.message.includes('500')) {
          errorContent += 'The AI service is currently unavailable. Please try again in a few moments.';
        } else if (error.message.includes('404')) {
          errorContent += 'The AI endpoint was not found. Please contact support.';
        } else {
          errorContent += `Error: ${error.message}`;
        }
      } else {
        errorContent += 'Please try again later.';
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: errorContent,
        timestamp: new Date(),
        status: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition logic would go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <p className="text-sm text-slate-500">Intelligent manufacturing insights</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Zap className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Quick Actions
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Click to ask AI about key areas
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left h-auto p-3 transition-all duration-200 hover:scale-[1.02]",
                      action.color
                    )}
                    onClick={() => {
                      setInputValue(action.prompt);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    <div className="flex items-start w-full">
                      <action.icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{action.label}</div>
                        <div className="text-xs opacity-70 mt-1">{action.description}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-2 opacity-50 flex-shrink-0" />
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
                  Smart Suggestions
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Popular questions to get started
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(suggestion);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                    className="w-full text-left p-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-md group"
                  >
                    <span className="flex items-start">
                      <span className="text-amber-500 mr-2 mt-0.5 group-hover:text-amber-600 transition-colors">💡</span>
                      <span className="group-hover:font-medium transition-all">"{suggestion}"</span>
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm h-[calc(100vh-12rem)]">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">Conversation</CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        Ask me anything about your production system
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Real-time
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col h-full">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-6">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="w-12 h-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        Welcome to AI Assistant
                      </h3>
                      <p className="text-slate-500 max-w-md">
                        I'm here to help you analyze production data, generate insights, and optimize your manufacturing operations.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex items-start space-x-3",
                            message.type === 'user' ? 'justify-end' : 'justify-start'
                          )}
                        >
                          {message.type === 'assistant' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}

                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm animate-slide-in",
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                : 'bg-white border border-slate-200'
                            )}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                            <div className={cn(
                              "text-xs mt-2 opacity-70",
                              message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                            )}>
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>

                          {message.type === 'user' && (
                            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              </div>
                              <span className="text-sm text-slate-500">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t border-slate-100 p-6 bg-gradient-to-r from-slate-50/80 to-blue-50/40 pt-[0px] pb-[0px]">
                  <div className="flex items-end space-x-4">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about production metrics, quality issues, or system status..."
                        className="pr-16 min-h-[48px] resize-none border-slate-200 bg-white/90 backdrop-blur-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm text-base"
                        disabled={isLoading}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleListening}
                        className={cn(
                          "absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 transition-colors duration-200",
                          isListening ? 'text-red-500 hover:text-red-600' : 'text-slate-400 hover:text-slate-600'
                        )}
                      >
                        {isListening ? (
                          <MicOff className="w-4 h-4" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <div className="flex items-center space-x-4">
                      <span>Press Enter to send, Shift+Enter for new line</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>AI ready</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;