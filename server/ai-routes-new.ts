import express from "express";
import { AnthropicAIAssistantService } from "./anthropic-ai-service.js";
import { AIAssistantService } from "./ai-assistant-service.js";
import { pool } from "./db.js";

const router = express.Router();
const anthropicService = new AnthropicAIAssistantService(pool);
const openaiService = new AIAssistantService(pool);

// Main AI Assistant chat endpoint
router.post("/assistant", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required" });
    }

    // Handle order creation actions with enhanced processing
    if (message.toLowerCase().includes('create') && message.toLowerCase().includes('order')) {
      try {
        console.log(`🔄 Processing order creation request: "${message}"`);
        
        // Extract order details from message with improved parsing
        const orderData = {
          customerName: extractCustomerName(message),
          productName: extractProductName(message),
          productType: extractProductType(message),
          quantity: extractQuantity(message),
          originalMessage: message,
          userId: context?.userId
        };

        console.log(`📊 Extracted order data:`, orderData);

        if (orderData.customerName || orderData.quantity) {
          const orderResult = await anthropicService.processMessage({ 
            message: message, 
            context: context 
          });
          
          // Handle different response types from enhanced order creation
          if (orderResult.success === false && orderResult.responseType === 'selection_required') {
            return res.json(orderResult);
          }
          
          if (orderResult.success === false && orderResult.responseType === 'confirmation_required') {
            return res.json(orderResult);
          }
          
          if (orderResult.success === true) {
            return res.json(orderResult);
          }
          
          // Legacy response format for backward compatibility
          if (orderResult.id) {
            return res.json({
              response: `Successfully created order for ${orderResult.customerName}! Order ID: ${orderResult.id}`,
              responseType: 'completed_action',
              actions: [{
                type: 'create_order',
                label: '✅ Order Created',
                data: orderResult
              }],
              confidence: 0.95,
              context: "Order creation completed"
            });
          }
        }
      } catch (orderError) {
        console.error('Order creation error:', orderError);
        
        // Enhanced error handling with customer suggestions
        if (orderError instanceof Error && orderError.message.includes('not found')) {
          return res.json({
            response: orderError.message,
            responseType: 'information_only',
            confidence: 0.8,
            context: "Customer resolution needed"
          });
        }
        
        // Fall through to general AI response
      }
    }

    // General AI assistant response - use Anthropic as default
    const response = await anthropicService.processMessage({
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
    
    const result = await anthropicService.getCustomerMatchingSuggestions(searchQuery, limit);
    
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

// Production insights endpoint using OpenAI
router.get("/production-insights", async (req, res) => {
  try {
    const insights = await openaiService.processMessage({ 
      message: "Analyze current production performance and provide insights",
      context: { type: "production_analysis" }
    });
    res.json(insights);
  } catch (error) {
    console.error("Production insights error:", error);
    res.status(500).json({ 
      error: "Failed to get production insights",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// OpenAI-specific chat endpoint
router.post("/openai-chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    console.log(`🤖 OpenAI GPT-4o Request - Message: "${message}"`);

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Message is required and must be a string" });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    console.log("✅ Processing message with OpenAI GPT-4o...");
    const startTime = Date.now();
    
    const response = await openaiService.processMessage({
      message: message.trim(),
      context: {
        ...context,
        aiModel: "openai-gpt4o",
        requestId: `openai_${Date.now()}`,
        userAgent: req.headers['user-agent'],
        ip: req.ip
      }
    });

    const processingTime = Date.now() - startTime;
    console.log(`✅ OpenAI Response generated in ${processingTime}ms`);

    const validatedResponse = {
      response: response.response || "أنا جاهز لمساعدتك في إدارة الإنتاج باستخدام OpenAI GPT-4o!",
      suggestions: response.suggestions || [],
      actions: response.actions || [],
      confidence: response.confidence || 0.9,
      context: response.context || "OpenAI GPT-4o Assistant",
      responseType: response.responseType || 'information_only',
      aiModel: "OpenAI GPT-4o",
      processingTime
    };

    res.json(validatedResponse);
  } catch (error) {
    console.error("OpenAI Chat error:", error);
    res.status(500).json({ 
      error: "Failed to process OpenAI request",
      details: error instanceof Error ? error.message : String(error),
      aiModel: "OpenAI GPT-4o"
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
    if (!anthropicService) {
      console.error("❌ AI service not initialized");
      return res.status(500).json({ error: "AI service not available" });
    }

    console.log("✅ Processing message with AI service...");
    const startTime = Date.now();
    
    // General AI assistant response
    const response = await anthropicService.processMessage({
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

// Helper function to extract product name from message
function extractProductName(message: string): string | null {
  const patterns = [
    /(?:product|item)\s+([A-Za-z\s\u0600-\u06FF0-9.-]+?)(?:\s+(?:with|and|,|quantity|\d|$))/i,
    /([A-Za-z\s\u0600-\u06FF0-9.-]+?)\s+(?:product|item|bag|roll)/i,
    /(?:bag|roll|sheet)\s+([A-Za-z\s\u0600-\u06FF0-9.-]+?)(?:\s+(?:with|and|,|\d|$))/i
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const productName = match[1].trim();
      const excludeWords = ['order', 'create', 'new', 'with', 'and', 'the', 'a', 'an', 'for', 'customer'];
      if (!excludeWords.includes(productName.toLowerCase()) && productName.length > 1) {
        console.log(`📦 Extracted product name: "${productName}"`);
        return productName;
      }
    }
  }
  
  return null;
}

// Helper function to extract product type from message
function extractProductType(message: string): string | null {
  const typePatterns = [
    /(?:t-?shirt|tshirt)/i,
    /(?:trash|garbage|waste)/i,
    /(?:food|restaurant)/i,
    /(?:medical|hospital)/i,
    /(?:roll|bag|sheet)/i,
    /(?:\d+(?:G|g|cm|mm|inch))/i // Size specifications like 30G, 25cm, etc.
  ];
  
  for (const pattern of typePatterns) {
    const match = message.match(pattern);
    if (match) {
      console.log(`🏷️ Extracted product type: "${match[0]}"`);
      return match[0].toLowerCase();
    }
  }
  
  return null;
}

export default router;