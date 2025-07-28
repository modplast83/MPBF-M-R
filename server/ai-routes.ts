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
      details: error instanceof Error ? error.message : String(error)
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
      details: error instanceof Error ? error.message : String(error)
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
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Workflow suggestions endpoint
router.post("/workflow-suggestions", async (req, res) => {
  try {
    const { context } = req.body;
    
    const suggestions = await aiService.generateWorkflowSuggestions(context);
    res.json({ suggestions });
  } catch (error) {
    console.error("Workflow suggestions error:", error);
    res.status(500).json({ 
      error: "Failed to get workflow suggestions",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Create records endpoint
router.post("/create-records", async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!type || !data) {
      return res.status(400).json({ error: "Type and data are required" });
    }
    
    const action = { type: `create_${type}`, data };
    const result = await aiService.executeCreateAction(action);
    
    res.json({ 
      success: true, 
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully`,
      data: result 
    });
  } catch (error) {
    console.error("Create records error:", error);
    res.status(500).json({ 
      error: "Failed to create record",
      details: error instanceof Error ? error.message : String(error)
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
      details: error instanceof Error ? error.message : String(error)
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
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// AI suggestions for specific modules
router.post("/module-suggestions", async (req, res) => {
  try {
    const { module, data, userId } = req.body;
    
    let suggestions: any[] = [];
    
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
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Advanced AI Analysis endpoints
router.post("/analyze", async (req, res) => {
  try {
    const { analysisType, parameters } = req.body;
    
    if (!analysisType) {
      return res.status(400).json({ error: "Analysis type is required" });
    }
    
    const analysis = await aiService.performAnalysis({ analysisType, parameters });
    res.json(analysis);
  } catch (error) {
    console.error("AI analysis error:", error);
    res.status(500).json({ 
      error: "Failed to perform analysis",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

router.post("/optimize", async (req, res) => {
  try {
    const { optimizationType, parameters } = req.body;
    
    if (!optimizationType) {
      return res.status(400).json({ error: "Optimization type is required" });
    }
    
    const optimization = await aiService.performOptimization({ optimizationType, parameters });
    res.json(optimization);
  } catch (error) {
    console.error("AI optimization error:", error);
    res.status(500).json({ 
      error: "Failed to perform optimization",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Enhanced workflow suggestions
router.post("/workflow-suggestions", async (req, res) => {
  try {
    const { currentPage, userId, userRole, timestamp } = req.body;
    
    const context = {
      currentPage: currentPage || 'dashboard',
      userId,
      userRole: userRole || 'user',
      timestamp: timestamp || new Date().toISOString()
    };
    
    const suggestions = await aiService.generateWorkflowSuggestions(context);
    res.json({ suggestions });
  } catch (error) {
    console.error("Workflow suggestions error:", error);
    res.status(500).json({ 
      error: "Failed to generate workflow suggestions",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Smart troubleshooting endpoint
router.post("/troubleshoot", async (req, res) => {
  try {
    const { issue, context, systemData } = req.body;
    
    if (!issue) {
      return res.status(400).json({ error: "Issue description is required" });
    }
    
    const troubleshootingPrompt = `
      You are an expert production management troubleshooter. Analyze this issue and provide step-by-step solutions.
      
      Issue: ${issue}
      Context: ${JSON.stringify(context)}
      System Data: ${JSON.stringify(systemData)}
      
      Provide detailed troubleshooting steps with priority levels and expected outcomes.
      Format as JSON with: {"steps": [], "priority": "low|medium|high|urgent", "estimatedTime": "X minutes", "preventiveMeasures": []}
    `;
    
    const response = await aiService.processAssistantQuery({
      message: troubleshootingPrompt,
      context
    });
    
    res.json(response);
  } catch (error) {
    console.error("Troubleshooting error:", error);
    res.status(500).json({ 
      error: "Failed to provide troubleshooting guidance",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Confirm action endpoint
router.post("/confirm-action", async (req, res) => {
  try {
    const { actionType, actionData, confirmed } = req.body;
    
    if (!confirmed) {
      res.json({ success: false, message: 'Action cancelled by user' });
      return;
    }
    
    const result = await aiService.executeCreateAction({
      type: actionType,
      label: 'Confirmed Action',
      data: actionData
    });
    
    res.json({
      success: true,
      result,
      message: `Successfully completed ${actionType.replace('create_', '').toUpperCase()}`
    });
  } catch (error) {
    console.error('Confirm action error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Select option endpoint
router.post("/select-option", async (req, res) => {
  try {
    const { selectionType, selectedOption, context } = req.body;
    
    if (selectionType === 'customer_products') {
      // Create order with selected product
      const result = await aiService.executeCreateAction({
        type: 'create_order',
        label: 'Create Order with Selected Product',
        data: {
          customerName: context.customerName,
          quantity: context.quantity,
          productId: selectedOption.data.productId,
          skipProductMatching: true
        }
      });
      
      res.json({
        success: true,
        result,
        message: `Successfully created order with ${selectedOption.title}`
      });
    } else {
      res.status(400).json({ 
        success: false,
        error: 'Unsupported selection type'
      });
    }
  } catch (error) {
    console.error('Select option error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : String(error)
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
      capabilities: [
        'Natural language processing',
        'Production analysis',
        'Quality optimization',
        'Predictive maintenance',
        'Cost analysis',
        'Resource optimization',
        'Workflow suggestions',
        'Troubleshooting assistance'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("AI health check failed:", error);
    res.status(500).json({ 
      status: 'unhealthy',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
});

export default router;