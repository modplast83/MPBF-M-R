import express from "express";
import { AIAssistantService } from "./ai-assistant-service.js";
import { pool } from "./db.js";

const router = express.Router();
const aiService = new AIAssistantService(pool);

// AI Assistant chat endpoint
router.post("/assistant", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await aiService.processAssistantQuery({
      message: message.trim(),
      context
    });

    res.json(response);
  } catch (error) {
    console.error("AI Assistant error:", error);
    res.status(500).json({ 
      error: "Failed to process assistant query",
      details: error.message 
    });
  }
});

// Production insights endpoint
router.get("/production-insights", async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    if (!['7d', '30d'].includes(timeframe as string)) {
      return res.status(400).json({ error: "Invalid timeframe. Use '7d' or '30d'" });
    }

    const insights = await aiService.getProductionInsights(timeframe as string);
    res.json(insights);
  } catch (error) {
    console.error("Production insights error:", error);
    res.status(500).json({ 
      error: "Failed to get production insights",
      details: error.message 
    });
  }
});

// Quality recommendations endpoint
router.get("/quality-recommendations", async (req, res) => {
  try {
    const { productId } = req.query;
    
    const recommendations = await aiService.generateQualityRecommendations(
      productId as string
    );
    
    res.json({ recommendations });
  } catch (error) {
    console.error("Quality recommendations error:", error);
    res.status(500).json({ 
      error: "Failed to get quality recommendations",
      details: error.message 
    });
  }
});

// Production schedule optimization endpoint
router.get("/optimize-schedule", async (req, res) => {
  try {
    const { orderId } = req.query;
    
    const optimizations = await aiService.optimizeProductionSchedule(
      orderId as string
    );
    
    res.json({ optimizations });
  } catch (error) {
    console.error("Schedule optimization error:", error);
    res.status(500).json({ 
      error: "Failed to optimize schedule",
      details: error.message 
    });
  }
});

// Predictive maintenance endpoint
router.get("/predictive-maintenance", async (req, res) => {
  try {
    const suggestions = await aiService.getPredictiveMaintenance();
    res.json({ suggestions });
  } catch (error) {
    console.error("Predictive maintenance error:", error);
    res.status(500).json({ 
      error: "Failed to get maintenance predictions",
      details: error.message 
    });
  }
});

// AI suggestions for specific modules
router.post("/module-suggestions", async (req, res) => {
  try {
    const { module, data, userId } = req.body;
    
    let suggestions = [];
    
    switch (module) {
      case 'quality':
        suggestions = await aiService.generateQualityRecommendations(data.productId);
        break;
      case 'production':
        suggestions = await aiService.optimizeProductionSchedule(data.orderId);
        break;
      case 'maintenance':
        suggestions = await aiService.getPredictiveMaintenance();
        break;
      default:
        return res.status(400).json({ error: "Unsupported module" });
    }
    
    res.json({ suggestions });
  } catch (error) {
    console.error("Module suggestions error:", error);
    res.status(500).json({ 
      error: "Failed to get module suggestions",
      details: error.message 
    });
  }
});

// Health check for AI services
router.get("/health", async (req, res) => {
  try {
    // Test OpenAI API connection
    const testResponse = await aiService.processAssistantQuery({
      message: "test",
      context: { currentPage: 'health-check' }
    });
    
    res.json({ 
      status: 'healthy',
      openai: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("AI health check failed:", error);
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;