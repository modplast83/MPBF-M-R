import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bot,
  BarChart3,
  Settings,
  Send,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Wrench,
  Play,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAssistantDashboardProps {
  className?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistantDashboard({ className }: AIAssistantDashboardProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "مرحبًا بك في المساعد الذكي! كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date()
    }
  ]);
  const queryClient = useQueryClient();

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          context: {
            currentPage: 'ai-dashboard',
            activeTab,
            timestamp: new Date().toISOString()
          }
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: data.response || 'تم استلام رد فارغ. يرجى المحاولة مرة أخرى.',
        timestamp: new Date()
      }]);
    },
    onError: (error) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: `خطأ: ${error instanceof Error ? error.message : 'حدث خطأ غير معروف'}`,
        timestamp: new Date()
      }]);
    }
  });

  // Fetch insights data
  const { data: insights, refetch: refetchInsights } = useQuery({
    queryKey: ['/api/ai/insights'],
    queryFn: async () => {
      const response = await fetch('/api/ai/insights');
      if (!response.ok) throw new Error('فشل في جلب التحليلات');
      return response.json();
    },
    enabled: activeTab === "insights",
    staleTime: 5 * 60 * 1000
  });

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(chatInput);
    setChatInput("");
  };

  const handleRefresh = () => {
    refetchInsights();
    queryClient.invalidateQueries({ queryKey: ['/api/ai'] });
  };

  const suggestionCards = [
    {
      title: "تحليل الإنتاج",
      description: "تحقق من حالة الإنتاج الحالية",
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => setChatInput("تحليل الإنتاج")
    },
    {
      title: "فحص الجودة",
      description: "مراجعة مؤشرات الجودة",
      icon: <CheckCircle className="h-5 w-5" />,
      action: () => setChatInput("فحص الجودة")
    },
    {
      title: "حالة الصيانة",
      description: "تحقق من حالة الماكينات",
      icon: <Wrench className="h-5 w-5" />,
      action: () => setChatInput("حالة الصيانة")
    }
  ];

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between" dir="rtl">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            المساعد الذكي
          </h1>
          <p className="text-muted-foreground text-lg">
            مساعد ذكي لتسهيل عمليات المصنع
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 ml-2" />
          تحديث
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            المحادثة
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            التحليلات
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            الأتمتة
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" dir="rtl">
                    <MessageSquare className="h-5 w-5" />
                    مساعد المحادثة
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex",
                            message.type === 'user' ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] p-3 rounded-lg",
                              message.type === 'user'
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      {sendMessageMutation.isPending && (
                        <div className="flex justify-start">
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">جارٍ التفكير...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-4" dir="rtl">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="اكتب سؤالك هنا..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={sendMessageMutation.isPending}
                    />
                    <Button onClick={handleSendMessage} disabled={sendMessageMutation.isPending}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-4" dir="rtl">
              <h3 className="font-semibold">إجراءات سريعة</h3>
              {suggestionCards.map((card, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={card.action}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-primary">{card.icon}</div>
                      <div>
                        <h4 className="font-medium text-sm">{card.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  رؤى الإنتاج
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">الكفاءة</span>
                    <span className="font-medium">{insights?.efficiency || '87%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">معدل الإنتاج</span>
                    <span className="font-medium">{insights?.outputRate || '92%'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  مقاييس الجودة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">درجة الجودة</span>
                    <span className="font-medium">{insights?.qualityScore || '96%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">معدل العيوب</span>
                    <span className="font-medium">{insights?.defectRate || '2.1%'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-500" />
                  تنبيهات الصيانة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">أعمال صيانة معلقة</span>
                    <span className="font-medium">{insights?.pendingMaintenance || '3'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">الصيانة المجدولة القادمة</span>
                    <span className="font-medium text-xs">{insights?.nextScheduled || 'غداً'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                التوصيات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(insights?.recommendations || [
                  { type: 'optimization', message: 'يفضل إعادة جدولة أوامر الإنتاج مساءً لتحسين الكفاءة', priority: 'medium' },
                  { type: 'maintenance', message: 'الصيانة الوقائية للآلة A3 مطلوبة خلال 24 ساعة', priority: 'high' }
                ]).map((rec: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      rec.priority === 'high' ? 'bg-red-500' :
                      rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    )} />
                    <div className="flex-1">
                      <p className="text-sm">{rec.message}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {rec.priority === 'high' ? 'عالي' : rec.priority === 'medium' ? 'متوسط' : 'منخفض'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>الفحوصات الآلية للجودة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  فعل فحص الجودة التلقائي لتقليل التدخل البشري وتحسين الكفاءة
                </p>
                <Button className="w-full">
                  <Play className="h-4 w-4 ml-2" />
                  تفعيل
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الجدولة الذكية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  تحسين ترتيب أوامر التشغيل بناءً على الأداء والطاقة المتاحة
                </p>
                <Button className="w-full">
                  <Play className="h-4 w-4 ml-2" />
                  تنشيط
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تنبيهات تنبؤية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  تلقي تنبيهات ذكية قبل حدوث أعطال أو انخفاض الأداء
                </p>
                <Button className="w-full">
                  <Play className="h-4 w-4 ml-2" />
                  تكوين
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تحسين سير العمل</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  اقتراحات لتحسين تسلسل العمليات وتقليل الهدر
                </p>
                <Button className="w-full">
                  <Play className="h-4 w-4 ml-2" />
                  تحسين
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}