import express from "express";
import { AnthropicAIAssistantService } from "./anthropic-ai-service.js";
import { pool } from "./db.js";

const router = express.Router();
const aiService = new AnthropicAIAssistantService(pool);

// Main AI Assistant chat endpoint
router.post("/assistant", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required" });
    }

    // Handle order creation actions
    if (message.toLowerCase().includes('create') && message.toLowerCase().includes('order')) {
      try {
        // Extract order details from message
        const orderData = {
          customerName: extractCustomerName(message),
          quantity: extractQuantity(message),
          originalMessage: message,
          userId: context?.userId
        };

        if (orderData.customerName) {
          const orderResult = await aiService.createOrderRecord(orderData);
          return res.json({
            response: `Successfully created order for ${orderResult.customerName}! Order ID: ${orderResult.id}`,
            responseType: 'completed_action',
            actions: [{
              type: 'create_order',
              label: '✅ Created ORDER',
              requiresConfirmation: false,
              data: orderResult
            }],
            confidence: 0.95,
            context: "Order creation completed"
          });
        }
      } catch (orderError) {
        console.error('Order creation error:', orderError);
        // Fall through to general AI response
      }
    }

    // General AI assistant response
    const response = await aiService.processMessage({
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
    const insights = await aiService.analyzeProduction();
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
    
    const recommendations = await aiService.processMessage({
      message: `Provide quality recommendations and analysis for product ID: ${productId}. Include quality control measures, inspection points, and process improvements.`,
      context: { currentPage: 'quality', productId }
    });
    
    res.json(recommendations);
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
    
    const suggestions = await aiService.processMessage({
      message: "Analyze current production workflow and provide optimization suggestions, efficiency improvements, and actionable recommendations.",
      context: { ...context, currentPage: 'workflow' }
    });
    res.json(suggestions);
  } catch (error) {
    console.error("Workflow suggestions error:", error);
    res.status(500).json({ 
      error: "Failed to get workflow suggestions",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Order creation endpoint
router.post("/create-order", async (req, res) => {
  try {
    const orderData = req.body;
    
    const result = await aiService.createOrderRecord(orderData);
    
    res.json({ 
      success: true, 
      message: "Order created successfully",
      data: result 
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ 
      error: "Failed to create order",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Production optimization endpoint
router.get("/optimize-schedule", async (req, res) => {
  try {
    const { orderId } = req.query;
    
    const optimizations = await aiService.processMessage({
      message: `Analyze and optimize production schedule for order ID: ${orderId}. Provide resource allocation suggestions, timing optimizations, and bottleneck resolutions.`,
      context: { currentPage: 'production', action: 'optimize', orderId }
    });
    
    res.json(optimizations);
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
    const suggestions = await aiService.processMessage({
      message: "Analyze machine status, maintenance history, and usage patterns to provide predictive maintenance recommendations. Include priority levels, estimated timelines, and preventive measures.",
      context: { currentPage: 'maintenance', action: 'predict' }
    });
    res.json(suggestions);
  } catch (error) {
    console.error("Predictive maintenance error:", error);
    res.status(500).json({ 
      error: "Failed to get maintenance predictions",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// General analysis endpoint
router.post("/analyze", async (req, res) => {
  try {
    const { analysisType, parameters } = req.body;
    
    if (!analysisType) {
      return res.status(400).json({ error: "Analysis type is required" });
    }
    
    const analysis = await aiService.processMessage({
      message: `Perform ${analysisType} analysis with the following parameters: ${JSON.stringify(parameters)}. Provide detailed insights, findings, and actionable recommendations.`,
      context: { action: 'analyze', analysisType, parameters }
    });
    
    res.json(analysis);
  } catch (error) {
    console.error("AI analysis error:", error);
    res.status(500).json({ 
      error: "Failed to perform analysis",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Utility functions
function extractCustomerName(message: string): string | null {
  // Extract customer name patterns
  const patterns = [
    /for\s+customer\s+([^,\s]+(?:\s+[^,\s]+)*)/i,
    /customer\s+([^,\s]+(?:\s+[^,\s]+)*)/i,
    /for\s+([A-Z][A-Za-z\s]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

function extractQuantity(message: string): number | null {
  const quantityMatch = message.match(/(\d+(?:\.\d+)?)\s*kg/i);
  if (quantityMatch) {
    return parseFloat(quantityMatch[1]);
  }
  
  const numberMatch = message.match(/(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    return parseFloat(numberMatch[1]);
  }
  
  return null;
}

export default router;