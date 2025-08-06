import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Cog, 
  DollarSign, 
  FileText, 
  Download, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  production: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    completionRate: number;
    averageProcessingTime: number;
  };
  quality: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    qualityScore: number;
    defectRate: number;
  };
  efficiency: {
    machineUtilization: number;
    materialWaste: number;
    energyConsumption: number;
    overallEfficiency: number;
  };
  workforce: {
    totalEmployees: number;
    attendanceRate: number;
    productivityScore: number;
    trainingHours: number;
  };
  financial: {
    totalRevenue: number;
    productionCosts: number;
    profitMargin: number;
    costPerUnit: number;
  };
}

interface PerformanceReport {
  id: string;
  generatedAt: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'custom';
  metrics: PerformanceMetrics;
  insights: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    trends: string[];
    alerts: string[];
  };
  charts: {
    productionTrends: any[];
    qualityTrends: any[];
    efficiencyMetrics: any[];
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function PerformanceReportGenerator() {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [customPeriod, setCustomPeriod] = useState({
    startDate: '',
    endDate: ''
  });
  const [generatedReport, setGeneratedReport] = useState<PerformanceReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Quick summary for dashboard
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['/api/performance-reports/summary'],
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  // Report history
  const { data: reportHistory } = useQuery({
    queryKey: ['/api/performance-reports/history'],
    select: (data: any) => data?.reports || []
  });

  const generateReportMutation = useMutation({
    mutationFn: async (params: { reportType: string; customPeriod?: any }) => {
      return await apiRequest('/api/performance-reports/generate', 'POST', params);
    },
    onSuccess: (data) => {
      setGeneratedReport(data.report);
      toast({
        title: "تم إنشاء التقرير بنجاح",
        description: data.message
      });
      queryClient.invalidateQueries({ queryKey: ['/api/performance-reports/history'] });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء التقرير",
        description: error.message || "فشل في إنشاء التقرير",
        variant: "destructive"
      });
    }
  });

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    const params: any = { reportType };
    if (reportType === 'custom' && customPeriod.startDate && customPeriod.endDate) {
      params.customPeriod = customPeriod;
    }

    await generateReportMutation.mutateAsync(params);
    setIsGenerating(false);
  };

  const formatNumber = (num: number, decimals: number = 0) => {
    return new Intl.NumberFormat('ar-SA', { 
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals 
    }).format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { 
      style: 'currency', 
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getScoreColor = (score: number, threshold: number = 80) => {
    if (score >= threshold) return "text-green-600";
    if (score >= threshold * 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مولد تقارير الأداء</h1>
          <p className="text-gray-600">إنشاء تقارير شاملة عن أداء المصنع بنقرة واحدة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 ml-2" />
            سجل التقارير
          </Button>
        </div>
      </div>

      {/* Quick Performance Summary */}
      {summary && (summary as any).summary && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              ملخص الأداء السريع
            </CardTitle>
            <CardDescription>آخر تحديث: {new Date((summary as any).generatedAt).toLocaleString('ar-SA')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor((summary as any).summary.completionRate, 85)}`}>
                  {formatNumber((summary as any).summary.completionRate, 1)}%
                </div>
                <div className="text-sm text-gray-600">معدل الإنجاز</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor((summary as any).summary.qualityScore, 90)}`}>
                  {formatNumber((summary as any).summary.qualityScore, 1)}%
                </div>
                <div className="text-sm text-gray-600">نقاط الجودة</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor((summary as any).summary.efficiency, 80)}`}>
                  {formatNumber((summary as any).summary.efficiency, 1)}%
                </div>
                <div className="text-sm text-gray-600">الكفاءة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(summary as any).summary.pendingOrders}
                </div>
                <div className="text-sm text-gray-600">طلبيات معلقة</div>
              </div>
            </div>
            
            {(summary as any).summary.insights && (
              <div className="mt-4 p-3 bg-white/70 rounded-lg">
                <p className="text-sm font-medium mb-2">💡 نصيحة اليوم:</p>
                <p className="text-sm text-gray-700">{(summary as any).summary.insights.topRecommendation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            إنشاء تقرير أداء جديد
          </CardTitle>
          <CardDescription>
            اختر نوع التقرير والفترة الزمنية لإنشاء تقرير مفصل عن أداء المصنع
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reportType">نوع التقرير</Label>
              <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التقرير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="custom">فترة مخصصة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {reportType === 'custom' && (
              <>
                <div>
                  <Label htmlFor="startDate">تاريخ البداية</Label>
                  <Input
                    type="date"
                    value={customPeriod.startDate}
                    onChange={(e) => setCustomPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">تاريخ النهاية</Label>
                  <Input
                    type="date"
                    value={customPeriod.endDate}
                    onChange={(e) => setCustomPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </>
            )}
          </div>

          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating || generateReportMutation.isPending}
            className="w-full md:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري إنشاء التقرير...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 ml-2" />
                إنشاء التقرير
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Report Display */}
      {generatedReport && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    تقرير الأداء - {generatedReport.reportType === 'daily' ? 'يومي' : 
                                      generatedReport.reportType === 'weekly' ? 'أسبوعي' : 
                                      generatedReport.reportType === 'monthly' ? 'شهري' : 'مخصص'}
                  </CardTitle>
                  <CardDescription>
                    تم إنشاؤه في: {new Date(generatedReport.generatedAt).toLocaleString('ar-SA')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 ml-2" />
                    تصدير PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 ml-2" />
                    حفظ
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="production">الإنتاج</TabsTrigger>
                  <TabsTrigger value="quality">الجودة</TabsTrigger>
                  <TabsTrigger value="efficiency">الكفاءة</TabsTrigger>
                  <TabsTrigger value="insights">التحليلات</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Key Metrics Overview */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">معدل الإنجاز</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatNumber(generatedReport.metrics.production.completionRate, 1)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">نقاط الجودة</p>
                            <p className="text-2xl font-bold text-green-600">
                              {formatNumber(generatedReport.metrics.quality.qualityScore, 1)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Cog className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">كفاءة الآلات</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {formatNumber(generatedReport.metrics.efficiency.machineUtilization, 1)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Users className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">معدل الحضور</p>
                            <p className="text-2xl font-bold text-orange-600">
                              {formatNumber(generatedReport.metrics.workforce.attendanceRate, 1)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">الملخص التنفيذي</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {generatedReport.insights.summary}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Alerts */}
                  {generatedReport.insights.alerts.length > 0 && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription>
                        <div className="space-y-1">
                          {generatedReport.insights.alerts.map((alert, index) => (
                            <div key={index} className="text-orange-800">• {alert}</div>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="production" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>إحصائيات الطلبيات</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>إجمالي الطلبيات</span>
                            <Badge variant="secondary">{generatedReport.metrics.production.totalOrders}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>مكتملة</span>
                            <Badge variant="default" className="bg-green-600">{generatedReport.metrics.production.completedOrders}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>معلقة</span>
                            <Badge variant="default" className="bg-orange-600">{generatedReport.metrics.production.pendingOrders}</Badge>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span>متوسط وقت المعالجة</span>
                            <span className="font-medium">{formatNumber(generatedReport.metrics.production.averageProcessingTime, 1)} ساعة</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>اتجاهات الإنتاج</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={generatedReport.charts.productionTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="production" stroke="#2563eb" strokeWidth={2} />
                            <Line type="monotone" dataKey="completed" stroke="#16a34a" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="quality" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>مؤشرات الجودة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span>نقاط الجودة</span>
                            <span className="font-medium">{formatNumber(generatedReport.metrics.quality.qualityScore, 1)}%</span>
                          </div>
                          <Progress value={generatedReport.metrics.quality.qualityScore} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span>معدل العيوب</span>
                            <span className="font-medium text-red-600">{formatNumber(generatedReport.metrics.quality.defectRate, 2)}%</span>
                          </div>
                          <Progress value={generatedReport.metrics.quality.defectRate} className="h-2" max={10} />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-green-600">{generatedReport.metrics.quality.passedChecks}</div>
                            <div className="text-sm text-gray-600">فحوصات ناجحة</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-red-600">{generatedReport.metrics.quality.failedChecks}</div>
                            <div className="text-sm text-gray-600">فحوصات فاشلة</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>اتجاهات الجودة</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={generatedReport.charts.qualityTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="qualityScore" stroke="#16a34a" strokeWidth={2} />
                            <Line type="monotone" dataKey="defectRate" stroke="#dc2626" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="efficiency" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>مؤشرات الكفاءة</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={generatedReport.charts.efficiencyMetrics}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#2563eb" />
                            <Bar dataKey="target" fill="#e5e7eb" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>الكفاءة العامة</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600 mb-2">
                            {formatNumber(generatedReport.metrics.efficiency.overallEfficiency, 1)}%
                          </div>
                          <p className="text-gray-600">الكفاءة الإجمالية</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>استخدام الآلات</span>
                            <span className="font-medium">{formatNumber(generatedReport.metrics.efficiency.machineUtilization, 1)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>هدر المواد</span>
                            <span className="font-medium text-red-600">{formatNumber(generatedReport.metrics.efficiency.materialWaste, 1)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>استهلاك الطاقة</span>
                            <span className="font-medium">{formatNumber(generatedReport.metrics.efficiency.energyConsumption)} كيلوواط</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-600">النتائج الرئيسية</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {generatedReport.insights.keyFindings.map((finding, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-blue-600">التوصيات</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {generatedReport.insights.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-purple-600">الاتجاهات</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {generatedReport.insights.trends.map((trend, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Activity className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{trend}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-yellow-600">معلومات مالية</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>إجمالي الإيرادات</span>
                          <span className="font-bold text-green-600">{formatCurrency(generatedReport.metrics.financial.totalRevenue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>تكاليف الإنتاج</span>
                          <span className="font-bold text-red-600">{formatCurrency(generatedReport.metrics.financial.productionCosts)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span>هامش الربح</span>
                          <span className="font-bold text-blue-600">{formatNumber(generatedReport.metrics.financial.profitMargin, 1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>تكلفة الوحدة</span>
                          <span className="font-medium">{formatCurrency(generatedReport.metrics.financial.costPerUnit)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report History */}
      {reportHistory && reportHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>سجل التقارير</CardTitle>
            <CardDescription>التقارير المحفوظة سابقاً</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportHistory.slice(0, 5).map((report: PerformanceReport) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{report.reportType === 'daily' ? 'تقرير يومي' : 
                                                report.reportType === 'weekly' ? 'تقرير أسبوعي' : 
                                                report.reportType === 'monthly' ? 'تقرير شهري' : 'تقرير مخصص'}</p>
                    <p className="text-sm text-gray-600">{new Date(report.generatedAt).toLocaleString('ar-SA')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setGeneratedReport(report)}>
                      عرض
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}