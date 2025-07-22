import OpenAI from "openai";
import { Pool } from "pg";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AssistantRequest {
  message: string;
  context?: {
    currentPage?: string;
    userId?: string;
    userRole?: string;
    recentActivity?: any[];
  };
}

export interface AssistantResponse {
  response: string;
  suggestions?: AssistantSuggestion[];
  actions?: AssistantAction[];
  confidence: number;
  context: string;
}

export interface AssistantSuggestion {
  type: 'navigation' | 'action' | 'insight' | 'optimization';
  title: string;
  description: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AssistantAction {
  type: 'create_order' | 'schedule_maintenance' | 'quality_check' | 'analytics_report';
  label: string;
  data: any;
}

export interface ProductionAnalysis {
  bottlenecks: Array<{
    location: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    suggestion: string;
  }>;
  efficiency: {
    overall: number;
    bySection: Record<string, number>;
  };
  predictions: {
    nextBottleneck: string;
    recommendedAction: string;
    timeframe: string;
  };
}

export class AIAssistantService {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  async getProductionInsights(timeframe: string = '7d'): Promise<ProductionAnalysis> {
    try {
      // Get production data from database
      const ordersQuery = `
        SELECT o.*, jo.*, r.stage, r.status
        FROM orders o
        LEFT JOIN job_orders jo ON o.id = jo.order_id
        LEFT JOIN rolls r ON jo.id = r.job_order_id
        WHERE o.created_at >= NOW() - INTERVAL '${timeframe === '7d' ? '7 days' : '30 days'}'
        ORDER BY o.created_at DESC
      `;

      const machineQuery = `
        SELECT s.name as section_name, m.name as machine_name, m.status
        FROM machines m
        JOIN sections s ON m.section_id = s.id
      `;

      const [ordersResult, machinesResult] = await Promise.all([
        this.db.query(ordersQuery),
        this.db.query(machineQuery)
      ]);

      const analysisPrompt = `
        Analyze this production data and provide insights:
        
        Orders Data: ${JSON.stringify(ordersResult.rows.slice(0, 20))}
        Machines Data: ${JSON.stringify(machinesResult.rows)}
        
        Provide analysis in JSON format:
        {
          "bottlenecks": [
            {
              "location": "section/machine name",
              "severity": "low|medium|high",
              "description": "detailed description",
              "suggestion": "actionable suggestion"
            }
          ],
          "efficiency": {
            "overall": 0-100,
            "bySection": {"section": efficiency}
          },
          "predictions": {
            "nextBottleneck": "prediction",
            "recommendedAction": "action",
            "timeframe": "timeframe"
          }
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a production management AI analyst. Analyze manufacturing data to identify bottlenecks, efficiency metrics, and predictive insights. Always respond with valid JSON."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Production analysis error:', error);
      throw new Error(`Production analysis failed: ${error.message}`);
    }
  }

  async processAssistantQuery(request: AssistantRequest): Promise<AssistantResponse> {
    try {
      const { message, context } = request;

      // Get relevant data based on context
      let contextData = "";
      if (context?.currentPage) {
        contextData = await this.getPageContext(context.currentPage, context.userId);
      }

      const systemPrompt = `
        You are a Production Management AI Assistant for MPBF (a manufacturing company).
        
        Context: ${context?.currentPage || 'dashboard'}
        User Role: ${context?.userRole || 'user'}
        Page Context: ${contextData}
        
        You help with:
        1. Production planning and optimization
        2. Quality management insights
        3. Order management guidance
        4. Maintenance scheduling recommendations
        5. HR and workforce planning
        6. Document management assistance
        7. System navigation and feature discovery
        
        Respond naturally and professionally. Provide actionable suggestions.
        Include relevant navigation suggestions or quick actions when appropriate.
        
        Response format:
        {
          "response": "Natural language response",
          "suggestions": [
            {
              "type": "navigation|action|insight|optimization",
              "title": "Title",
              "description": "Description",
              "actionUrl": "/path (optional)",
              "priority": "low|medium|high"
            }
          ],
          "actions": [
            {
              "type": "create_order|schedule_maintenance|quality_check|analytics_report",
              "label": "Action label",
              "data": {}
            }
          ],
          "confidence": 0.95,
          "context": "Brief context summary"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        response: result.response || "I'm here to help with your production management needs.",
        suggestions: result.suggestions || [],
        actions: result.actions || [],
        confidence: Math.max(0, Math.min(1, result.confidence || 0.9)),
        context: result.context || context?.currentPage || 'general'
      };
      
    } catch (error) {
      console.error('Assistant query error:', error);
      throw new Error(`Assistant query failed: ${error.message}`);
    }
  }

  async generateQualityRecommendations(productId?: string): Promise<AssistantSuggestion[]> {
    try {
      let qualityData = "";
      
      if (productId) {
        const qualityQuery = `
          SELECT qc.*, qct.name as check_type_name
          FROM quality_checks qc
          JOIN quality_check_types qct ON qc.check_type_id = qct.id
          WHERE qc.product_id = $1
          ORDER BY qc.created_at DESC
          LIMIT 10
        `;
        const result = await this.db.query(qualityQuery, [productId]);
        qualityData = JSON.stringify(result.rows);
      }

      const prompt = `
        Based on this quality data: ${qualityData}
        
        Generate quality improvement recommendations as JSON array:
        [
          {
            "type": "optimization",
            "title": "recommendation title",
            "description": "detailed description",
            "priority": "low|medium|high"
          }
        ]
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a quality management specialist. Provide actionable quality improvement recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const result = JSON.parse(response.choices[0].message.content || '[]');
      return Array.isArray(result) ? result : result.recommendations || [];
      
    } catch (error) {
      console.error('Quality recommendations error:', error);
      return [];
    }
  }

  async optimizeProductionSchedule(orderId?: string): Promise<AssistantSuggestion[]> {
    try {
      const ordersQuery = orderId 
        ? `SELECT * FROM orders WHERE id = $1`
        : `SELECT * FROM orders WHERE status IN ('pending', 'processing') ORDER BY priority DESC, created_at ASC LIMIT 20`;
      
      const params = orderId ? [orderId] : [];
      const ordersResult = await this.db.query(ordersQuery, params);
      
      const machinesResult = await this.db.query(`
        SELECT m.*, s.name as section_name 
        FROM machines m 
        JOIN sections s ON m.section_id = s.id 
        WHERE m.status = 'active'
      `);

      const optimizationPrompt = `
        Optimize production schedule based on:
        Orders: ${JSON.stringify(ordersResult.rows)}
        Available Machines: ${JSON.stringify(machinesResult.rows)}
        
        Generate optimization suggestions as JSON array:
        [
          {
            "type": "optimization",
            "title": "suggestion title",
            "description": "detailed optimization description",
            "priority": "low|medium|high"
          }
        ]
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a production scheduling optimizer. Analyze orders and machine capacity to suggest optimal scheduling."
          },
          {
            role: "user",
            content: optimizationPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const result = JSON.parse(response.choices[0].message.content || '[]');
      return Array.isArray(result) ? result : result.suggestions || [];
      
    } catch (error) {
      console.error('Schedule optimization error:', error);
      return [];
    }
  }

  private async getPageContext(page: string, userId?: string): Promise<string> {
    try {
      switch (page) {
        case 'dashboard':
          const dashboardQuery = `
            SELECT 
              (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
              (SELECT COUNT(*) FROM orders WHERE status = 'processing') as active_orders,
              (SELECT COUNT(*) FROM quality_checks WHERE DATE(created_at) = CURRENT_DATE) as todays_checks,
              (SELECT COUNT(*) FROM machines WHERE status = 'active') as active_machines
          `;
          const dashboardResult = await this.db.query(dashboardQuery);
          return `Dashboard metrics: ${JSON.stringify(dashboardResult.rows[0])}`;
          
        case 'orders':
          const ordersResult = await this.db.query(`
            SELECT status, COUNT(*) as count 
            FROM orders 
            GROUP BY status
          `);
          return `Orders summary: ${JSON.stringify(ordersResult.rows)}`;
          
        case 'production':
          const productionResult = await this.db.query(`
            SELECT jo.status, COUNT(*) as count 
            FROM job_orders jo 
            WHERE DATE(jo.created_at) >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY jo.status
          `);
          return `Recent production: ${JSON.stringify(productionResult.rows)}`;
          
        default:
          return `Current page: ${page}`;
      }
    } catch (error) {
      console.error('Page context error:', error);
      return `Current page: ${page}`;
    }
  }

  async getPredictiveMaintenance(): Promise<AssistantSuggestion[]> {
    try {
      const maintenanceQuery = `
        SELECT m.name, m.status, m.last_maintenance_date,
               COUNT(mr.id) as recent_requests
        FROM machines m
        LEFT JOIN maintenance_requests mr ON m.id = mr.machine_id
        AND mr.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY m.id, m.name, m.status, m.last_maintenance_date
        ORDER BY recent_requests DESC, last_maintenance_date ASC
      `;
      
      const result = await this.db.query(maintenanceQuery);
      
      const prompt = `
        Analyze machine maintenance data and predict maintenance needs:
        ${JSON.stringify(result.rows)}
        
        Generate predictive maintenance suggestions as JSON array:
        [
          {
            "type": "action",
            "title": "maintenance suggestion",
            "description": "detailed maintenance recommendation",
            "priority": "low|medium|high"
          }
        ]
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a predictive maintenance specialist. Analyze machine data to predict maintenance needs."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const analysisResult = JSON.parse(response.choices[0].message.content || '[]');
      return Array.isArray(analysisResult) ? analysisResult : analysisResult.suggestions || [];
      
    } catch (error) {
      console.error('Predictive maintenance error:', error);
      return [];
    }
  }
}