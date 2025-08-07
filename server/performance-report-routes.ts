import express from "express";
import { SimplePerformanceReportService } from "./performance-report-service-simple.js";
import { pool } from "./db.js";

const router = express.Router();
const reportService = new SimplePerformanceReportService(pool);

// Generate new performance report
router.post("/generate", async (req, res) => {
  try {
    const { reportType = 'daily', customPeriod } = req.body;

    console.log(`📊 Generating ${reportType} performance report...`);

    const report = await reportService.generatePerformanceReport(reportType, customPeriod);

    res.json({
      success: true,
      report,
      message: `تم إنشاء تقرير الأداء ${reportType} بنجاح`
    });

  } catch (error) {
    console.error("Performance report generation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate performance report",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Get list of stored reports
router.get("/history", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const reports = await reportService.getReportHistory(limit);

    res.json({
      success: true,
      reports,
      count: reports.length
    });

  } catch (error) {
    console.error("Error retrieving report history:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve report history",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Quick performance summary
router.get("/summary", async (req, res) => {
  try {
    console.log("📈 Generating quick performance summary...");

    const report = await reportService.generatePerformanceReport('daily');
    
    // Extract key metrics for quick display
    const summary = {
      completionRate: report.metrics.production.completionRate,
      qualityScore: report.metrics.quality.qualityScore,
      efficiency: report.metrics.efficiency.overallEfficiency,
      machineUtilization: report.metrics.efficiency.machineUtilization,
      pendingOrders: report.metrics.production.pendingOrders,
      defectRate: report.metrics.quality.defectRate,
      insights: {
        summary: report.insights.summary,
        topAlert: report.insights.alerts[0] || "لا توجد تنبيهات",
        topRecommendation: report.insights.recommendations[0] || "استمرار الأداء الحالي"
      }
    };

    res.json({
      success: true,
      summary,
      generatedAt: report.generatedAt
    });

  } catch (error) {
    console.error("Error generating performance summary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate performance summary",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Export report as PDF (placeholder for future implementation)
router.post("/export/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const { format = 'json' } = req.body;

    // For now, just return JSON
    // In the future, this could generate PDF using libraries like jsPDF or Puppeteer
    
    res.json({
      success: true,
      message: `تصدير التقرير ${reportId} بصيغة ${format} - قيد التطوير`,
      exportFormat: format,
      downloadUrl: `/api/reports/download/${reportId}.${format}`
    });

  } catch (error) {
    console.error("Error exporting report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export report",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;