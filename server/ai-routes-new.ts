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

// AI-Powered Customer Matching Suggestions endpoint
router.post("/customer-suggestions", async (req, res) => {
  try {
    const { searchQuery, limit = 5 } = req.body;
    
    if (!searchQuery || typeof searchQuery !== 'string') {
      return res.status(400).json({ 
        error: 'Search query is required',
        suggestions: [],
        searchAnalysis: {
          queryType: 'invalid',
          suggestedCategories: [],
          businessTypeGuess: 'unknown'
        }
      });
    }
    
    console.log(`🔍 Customer suggestions request for: "${searchQuery}"`);
    
    const result = await aiService.getCustomerMatchingSuggestions(searchQuery, limit);
    
    res.json({
      success: true,
      searchQuery,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Customer suggestions error:', error);
    res.status(500).json({ 
      error: 'Customer suggestions service unavailable',
      suggestions: [],
      searchAnalysis: {
        queryType: 'error',
        suggestedCategories: [],
        businessTypeGuess: 'unknown'
      }
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

// Main AI chat endpoint
router.post("/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    console.log(`🤖 AI Chat Request - Message: "${message}", Context:`, context);

    if (!message || typeof message !== 'string') {
      console.error("❌ Invalid message format:", { message, type: typeof message });
      return res.status(400).json({ error: "Message is required and must be a string" });
    }

    if (message.trim().length === 0) {
      console.error("❌ Empty message");
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Check if AI service is available
    if (!aiService) {
      console.error("❌ AI service not initialized");
      return res.status(500).json({ error: "AI service not available" });
    }

    console.log("✅ Processing message with AI service...");
    const startTime = Date.now();
    
    // General AI assistant response
    const response = await aiService.processMessage({
      message: message.trim(),
      context: {
        ...context,
        requestId: `req_${Date.now()}`,
        userAgent: req.headers['user-agent'],
        ip: req.ip
      }
    });

    const processingTime = Date.now() - startTime;
    console.log(`✅ AI Response generated in ${processingTime}ms:`, {
      hasResponse: !!response.response,
      responseLength: response.response?.length || 0,
      confidence: response.confidence,
      responseType: response.responseType
    });

    // Validate response format
    if (!response || typeof response !== 'object') {
      console.error("❌ Invalid response format from AI service:", response);
      return res.status(500).json({ 
        error: "Invalid response format from AI service",
        fallbackResponse: "I apologize, but I'm experiencing a technical issue. Please try again."
      });
    }

    // Ensure response has required fields
    const validatedResponse = {
      response: response.response || "I'm here to help! Please let me know what you'd like to know about the production system.",
      suggestions: response.suggestions || [],
      actions: response.actions || [],
      confidence: response.confidence || 0.9,
      context: response.context || "AI Assistant",
      responseType: response.responseType || 'information_only',
      processingTime
    };

    res.json(validatedResponse);
  } catch (error) {
    console.error("❌ AI chat error:", error);
    
    let errorMessage = "Failed to process chat message";
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific error types
      if (error.message.includes('ANTHROPIC_API_KEY')) {
        errorMessage = "AI service configuration issue. Please check API keys.";
        statusCode = 503;
      } else if (error.message.includes('timeout')) {
        errorMessage = "AI service timeout. Please try again.";
        statusCode = 504;
      } else if (error.message.includes('rate limit')) {
        errorMessage = "AI service rate limit exceeded. Please try again later.";
        statusCode = 429;
      }
    }
    
    res.status(statusCode).json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
      fallbackResponse: "I'm experiencing technical difficulties. Please try asking your question in a different way or contact support if the issue persists."
    });
  }
});

// Quality recommendations endpoint
router.get("/quality-recommendations", async (req, res) => {
  try {
    const { productId } = req.query;
    const productIdStr = Array.isArray(productId) ? String(productId[0]) : String(productId || '');
    
    const recommendations = await aiService.processMessage({
      message: `Provide quality recommendations and analysis for product ID: ${productIdStr}. Include quality control measures, inspection points, and process improvements.`,
      context: { currentPage: 'quality', productId: productIdStr }
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
    const orderIdStr = Array.isArray(orderId) ? String(orderId[0]) : String(orderId || '');
    
    const optimizations = await aiService.processMessage({
      message: `Analyze and optimize production schedule for order ID: ${orderIdStr}. Provide resource allocation suggestions, timing optimizations, and bottleneck resolutions.`,
      context: { currentPage: 'production', action: 'optimize', orderId: orderIdStr }
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