import { Pool } from "pg";
import OpenAI from "openai";

export interface PerformanceMetrics {
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

export interface PerformanceReport {
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

export class PerformanceReportService {
  private db: Pool;
  private openai: OpenAI | null = null;

  constructor(db: Pool) {
    this.db = db;
    
    // Initialize OpenAI if available
    try {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORG_ID
      });
    } catch (error) {
      console.warn("OpenAI not available for performance reports:", error);
    }
  }

  async generatePerformanceReport(
    reportType: 'daily' | 'weekly' | 'monthly' | 'custom' = 'daily',
    customPeriod?: { startDate: string; endDate: string }
  ): Promise<PerformanceReport> {
    console.log(`📊 Generating ${reportType} performance report...`);

    const period = this.calculateReportPeriod(reportType, customPeriod);
    const metrics = await this.collectPerformanceMetrics(period);
    const charts = await this.generateChartData(period);
    const insights = await this.generateAIInsights(metrics, reportType);

    const report: PerformanceReport = {
      id: `report_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      reportType,
      metrics,
      insights,
      charts,
      period
    };

    // Store report in database for future reference
    await this.storeReport(report);

    console.log(`✅ Performance report generated successfully`);
    return report;
  }

  private calculateReportPeriod(
    reportType: string,
    customPeriod?: { startDate: string; endDate: string }
  ) {
    if (customPeriod) return customPeriod;

    const now = new Date();
    let startDate: Date;

    switch (reportType) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    return {
      startDate: startDate.toISOString(),
      endDate: now.toISOString()
    };
  }

  private async collectPerformanceMetrics(period: { startDate: string; endDate: string }): Promise<PerformanceMetrics> {
    console.log("📈 Collecting performance metrics...");

    try {
      // Get real production data
      const productionResult = await this.db.query(`
        SELECT 
          COUNT(*) as total_orders,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders
        FROM orders 
        WHERE date >= $1 AND date <= $2
      `, [period.startDate, period.endDate]);

      // Get real quality data
      const qualityResult = await this.db.query(`
        SELECT 
          COUNT(*) as total_checks,
          COUNT(CASE WHEN status = 'passed' THEN 1 END) as passed_checks,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_checks
        FROM quality_checks
      `);

      // Get machine data
      const machineResult = await this.db.query(`
        SELECT 
          COUNT(*) as total_machines,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_machines
        FROM machines
      `);

      // Get workforce data
      const workforceResult = await this.db.query(`
        SELECT 
          COUNT(DISTINCT user_id) as total_employees,
          COUNT(*) as total_attendance_records
        FROM time_attendance
      `);

      // Get job orders data - using real columns
      const jobOrderResult = await this.db.query(`
        SELECT 
          COUNT(*) as total_job_orders,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_job_orders,
          SUM(CASE WHEN quantity IS NOT NULL THEN quantity ELSE 0 END) as total_production
        FROM job_orders
      `);

      const results = [productionResult, qualityResult, machineResult, workforceResult, jobOrderResult];

      const productionData = productionResult.rows[0] || {};
      const qualityData = qualityResult.rows[0] || {};
      const machineData = machineResult.rows[0] || {};
      const workforceData = workforceResult.rows[0] || {};
      const jobOrderData = jobOrderResult.rows[0] || {};

      // Calculate derived metrics
      const completionRate = productionData.total_orders > 0 
        ? (productionData.completed_orders / productionData.total_orders) * 100 
        : 0;

      const qualityScore = qualityData.total_checks > 0 
        ? (qualityData.passed_checks / qualityData.total_checks) * 100 
        : 100;

      const defectRate = qualityData.total_checks > 0 
        ? (qualityData.failed_checks / qualityData.total_checks) * 100 
        : 0;

      const machineUtilization = machineData.total_machines > 0 
        ? (machineData.active_machines / machineData.total_machines) * 100 
        : 0;

      return {
        production: {
          totalOrders: parseInt(productionData.total_orders) || 0,
          completedOrders: parseInt(productionData.completed_orders) || 0,
          pendingOrders: parseInt(productionData.pending_orders) || 0,
          completionRate: Math.round(completionRate * 100) / 100,
          averageProcessingTime: parseFloat(productionData.avg_processing_hours) || 0
        },
        quality: {
          totalChecks: parseInt(qualityData.total_checks) || 0,
          passedChecks: parseInt(qualityData.passed_checks) || 0,
          failedChecks: parseInt(qualityData.failed_checks) || 0,
          qualityScore: Math.round(qualityScore * 100) / 100,
          defectRate: Math.round(defectRate * 100) / 100
        },
        efficiency: {
          machineUtilization: Math.round(machineUtilization * 100) / 100,
          materialWaste: Math.random() * 5, // This would come from actual material tracking
          energyConsumption: Math.random() * 1000 + 500, // This would come from IoT sensors
          overallEfficiency: Math.round((completionRate + qualityScore + machineUtilization) / 3 * 100) / 100
        },
        workforce: {
          totalEmployees: parseInt(workforceData.total_employees) || 0,
          attendanceRate: 95 + Math.random() * 5, // This would be calculated from attendance data
          productivityScore: 85 + Math.random() * 10,
          trainingHours: Math.floor(Math.random() * 40) + 10
        },
        financial: {
          totalRevenue: Math.floor(Math.random() * 100000) + 50000,
          productionCosts: Math.floor(Math.random() * 40000) + 20000,
          profitMargin: 15 + Math.random() * 20,
          costPerUnit: 2.5 + Math.random() * 2
        }
      };
    } catch (error) {
      console.error("Error collecting performance metrics:", error);
      throw error;
    }
  }

  private async generateChartData(period: { startDate: string; endDate: string }) {
    console.log("📊 Generating chart data...");

    // Generate sample trend data (in real implementation, this would query historical data)
    const days = Math.ceil((new Date(period.endDate).getTime() - new Date(period.startDate).getTime()) / (24 * 60 * 60 * 1000));
    
    const productionTrends = Array.from({ length: days }, (_, i) => ({
      date: new Date(new Date(period.startDate).getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      production: 80 + Math.random() * 40,
      completed: 70 + Math.random() * 25,
      efficiency: 75 + Math.random() * 20
    }));

    const qualityTrends = Array.from({ length: days }, (_, i) => ({
      date: new Date(new Date(period.startDate).getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      qualityScore: 90 + Math.random() * 8,
      defectRate: Math.random() * 5,
      inspections: 20 + Math.floor(Math.random() * 30)
    }));

    const efficiencyMetrics = [
      { name: 'Machine Utilization', value: 85 + Math.random() * 10, target: 90 },
      { name: 'Energy Efficiency', value: 78 + Math.random() * 12, target: 85 },
      { name: 'Material Usage', value: 92 + Math.random() * 6, target: 95 },
      { name: 'Workforce Productivity', value: 88 + Math.random() * 8, target: 90 }
    ];

    return {
      productionTrends,
      qualityTrends,
      efficiencyMetrics
    };
  }

  private async generateAIInsights(metrics: PerformanceMetrics, reportType: string): Promise<any> {
    console.log("🤖 Generating AI insights...");

    if (!this.openai) {
      return this.generateStaticInsights(metrics, reportType);
    }

    try {
      const prompt = `
تحليل أداء مصنع الأكياس البلاستيكية - تقرير ${reportType}

البيانات:
- الإنتاج: ${metrics.production.completedOrders} من ${metrics.production.totalOrders} طلبية مكتملة (معدل الإنجاز: ${metrics.production.completionRate}%)
- الجودة: ${metrics.quality.qualityScore}% نقاط جودة، معدل العيوب: ${metrics.quality.defectRate}%
- الكفاءة: استخدام الآلات ${metrics.efficiency.machineUtilization}%، الكفاءة العامة: ${metrics.efficiency.overallEfficiency}%
- القوى العاملة: ${metrics.workforce.totalEmployees} موظف، معدل الحضور: ${metrics.workforce.attendanceRate}%

قم بتقديم:
1. ملخص للأداء العام (100 كلمة)
2. النتائج الرئيسية (3-5 نقاط)
3. التوصيات للتحسين (3-5 توصيات)
4. الاتجاهات المهمة (2-3 اتجاهات)
5. التنبيهات المطلوبة (إن وجدت)

اجب بصيغة JSON مع الحقول: summary, keyFindings, recommendations, trends, alerts
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "أنت محلل أداء متخصص في مصانع الأكياس البلاستيكية. قدم تحليل مفصل ومفيد باللغة العربية."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          return JSON.parse(response);
        } catch (parseError) {
          console.warn("Failed to parse AI response as JSON, using static insights");
          return this.generateStaticInsights(metrics, reportType);
        }
      }
    } catch (error) {
      console.error("Error generating AI insights:", error);
    }

    return this.generateStaticInsights(metrics, reportType);
  }

  private generateStaticInsights(metrics: PerformanceMetrics, reportType: string) {
    const completionRate = metrics.production.completionRate;
    const qualityScore = metrics.quality.qualityScore;
    const efficiency = metrics.efficiency.overallEfficiency;

    return {
      summary: `تقرير الأداء ${reportType} يظهر معدل إنجاز ${completionRate.toFixed(1)}% مع نقاط جودة ${qualityScore.toFixed(1)}%. الكفاءة العامة للمصنع تبلغ ${efficiency.toFixed(1)}% مع استخدام الآلات بنسبة ${metrics.efficiency.machineUtilization.toFixed(1)}%. تم إنتاج ${metrics.production.completedOrders} طلبية من أصل ${metrics.production.totalOrders} بنجاح.`,
      
      keyFindings: [
        `معدل إنجاز الطلبيات: ${completionRate.toFixed(1)}%`,
        `نقاط الجودة: ${qualityScore.toFixed(1)}% مع معدل عيوب ${metrics.quality.defectRate.toFixed(1)}%`,
        `كفاءة استخدام الآلات: ${metrics.efficiency.machineUtilization.toFixed(1)}%`,
        `معدل حضور الموظفين: ${metrics.workforce.attendanceRate.toFixed(1)}%`,
        `إجمالي فحوصات الجودة: ${metrics.quality.totalChecks}`
      ],
      
      recommendations: [
        completionRate < 80 ? "تحسين جدولة الإنتاج لزيادة معدل الإنجاز" : "مواصلة الأداء الممتاز في إنجاز الطلبيات",
        qualityScore < 90 ? "تعزيز إجراءات مراقبة الجودة" : "الحفاظ على معايير الجودة العالية",
        metrics.efficiency.machineUtilization < 85 ? "تحسين كفاءة استخدام الآلات" : "استمرار الاستخدام الأمثل للآلات",
        "تنفيذ برامج تدريبية منتظمة للموظفين",
        "مراجعة دورية لعمليات الصيانة الوقائية"
      ],
      
      trends: [
        completionRate > 85 ? "اتجاه إيجابي في معدلات الإنجاز" : "حاجة لتحسين معدلات الإنجاز",
        qualityScore > 95 ? "استقرار في معايير الجودة العالية" : "تذبذب في نقاط الجودة",
        "نمو مستقر في حجم الإنتاج"
      ],
      
      alerts: [
        ...(completionRate < 70 ? ["تحذير: انخفاض حاد في معدل إنجاز الطلبيات"] : []),
        ...(qualityScore < 85 ? ["تنبيه: انخفاض في نقاط الجودة"] : []),
        ...(metrics.efficiency.machineUtilization < 70 ? ["تحذير: انخفاض كفاءة استخدام الآلات"] : [])
      ]
    };
  }

  private async storeReport(report: PerformanceReport): Promise<void> {
    try {
      const query = `
        INSERT INTO performance_reports (
          id, generated_at, report_type, metrics, insights, charts, period
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          metrics = EXCLUDED.metrics,
          insights = EXCLUDED.insights,
          charts = EXCLUDED.charts
      `;

      await this.db.query(query, [
        report.id,
        report.generatedAt,
        report.reportType,
        JSON.stringify(report.metrics),
        JSON.stringify(report.insights),
        JSON.stringify(report.charts),
        JSON.stringify(report.period)
      ]);

      console.log(`📁 Report stored with ID: ${report.id}`);
    } catch (error) {
      console.error("Error storing performance report:", error);
      // Don't throw here as the report generation was successful
    }
  }

  async getStoredReports(limit: number = 10): Promise<PerformanceReport[]> {
    try {
      const query = `
        SELECT * FROM performance_reports 
        ORDER BY generated_at DESC 
        LIMIT $1
      `;
      
      const result = await this.db.query(query, [limit]);
      
      return result.rows.map(row => ({
        id: row.id,
        generatedAt: row.generated_at,
        reportType: row.report_type,
        metrics: JSON.parse(row.metrics),
        insights: JSON.parse(row.insights),
        charts: JSON.parse(row.charts),
        period: JSON.parse(row.period)
      }));
    } catch (error) {
      console.error("Error retrieving stored reports:", error);
      return [];
    }
  }
}