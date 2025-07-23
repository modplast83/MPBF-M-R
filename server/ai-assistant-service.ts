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
  type: 'create_order' | 'create_customer' | 'create_product' | 'schedule_maintenance' | 'quality_check' | 'analytics_report';
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
        SELECT o.*, jo.*, r.current_stage, r.status as roll_status
        FROM orders o
        LEFT JOIN job_orders jo ON o.id = jo.order_id
        LEFT JOIN rolls r ON jo.id = r.job_order_id
        WHERE o.date >= CURRENT_DATE - INTERVAL '${timeframe === '7d' ? '7 days' : '30 days'}'
        ORDER BY o.date DESC
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
        
        Please provide your analysis in JSON format:
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
        You support both English and Arabic languages. Respond in the same language as the user's message.
        
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
        8. Creating new customers, products, and orders automatically
        
        When users ask to create customers, products, or orders, automatically generate the appropriate actions.
        Extract relevant information from their request and format it for creation.
        
        Respond naturally and professionally in the same language as the user's message. 
        If the user speaks in Arabic, respond in Arabic. If in English, respond in English.
        Provide actionable suggestions. Include relevant navigation suggestions or quick actions when appropriate.
        
        Please respond with JSON in the following format:
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
              "type": "create_order|create_customer|create_product|schedule_maintenance|quality_check|analytics_report",
              "label": "Action label", 
              "data": {
                "name": "extracted name",
                "code": "extracted code",
                "customerId": "if needed",
                "categoryId": "if needed",
                "itemId": "if needed"
              }
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
      
      // Execute create actions if any
      const actions: AssistantAction[] = result.actions || [];
      if (actions.length > 0) {
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          if (action.type.startsWith('create_')) {
            try {
              const createdRecord = await this.executeCreateAction(action);
              actions[i] = {
                ...action,
                label: `✅ Created ${action.type.replace('create_', '').toUpperCase()}`,
                data: createdRecord
              };
            } catch (error) {
              console.error(`Failed to execute ${action.type}:`, error);
              actions[i] = {
                ...action,
                label: `❌ Failed to create ${action.type.replace('create_', '')}`,
                data: { error: error.message }
              };
            }
          }
        }
      }
      
      return {
        response: result.response || "I'm here to help with your production management needs.",
        suggestions: result.suggestions || [],
        actions,
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
        
        Please generate quality improvement recommendations as JSON array:
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
        
        Please generate optimization suggestions as JSON array:
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
            WHERE jo.receive_date >= CURRENT_DATE - INTERVAL '7 days'
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
        
        Please generate predictive maintenance suggestions as JSON array:
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

  // New method to execute create actions
  async executeCreateAction(action: any): Promise<any> {
    try {
      switch (action.type) {
        case 'create_customer':
          return await this.createCustomerRecord(action.data);
        case 'create_product':
          return await this.createProductRecord(action.data);
        case 'create_order':
          return await this.createOrderRecord(action.data);
        default:
          throw new Error(`Unsupported action type: ${action.type}`);
      }
    } catch (error) {
      console.error('Error executing create action:', error);
      throw error;
    }
  }

  async createCustomerRecord(data: any): Promise<any> {
    try {
      // Generate customer ID and code if not provided
      const customerId = data.id || `CUS${Date.now().toString().slice(-6)}`;
      const customerCode = data.code || `C${Date.now().toString().slice(-4)}`;

      const customerData = {
        id: customerId,
        code: customerCode,
        name: data.name || data.customerName || 'New Customer',
        nameAr: data.nameAr || data.arabicName || null,
        userId: data.userId || null,
        plateDrawerCode: data.plateDrawerCode || null
      };

      const result = await this.db.query(
        `INSERT INTO customers (id, code, name, name_ar, user_id, plate_drawer_code) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [customerData.id, customerData.code, customerData.name, customerData.nameAr, customerData.userId, customerData.plateDrawerCode]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  async createProductRecord(data: any): Promise<any> {
    try {
      // Validate required fields
      if (!data.customerId) {
        throw new Error('Customer ID is required for product creation');
      }
      if (!data.categoryId) {
        throw new Error('Category ID is required for product creation');
      }
      if (!data.itemId) {
        throw new Error('Item ID is required for product creation');
      }

      const productData = {
        customerId: data.customerId,
        categoryId: data.categoryId,
        itemId: data.itemId,
        sizeCaption: data.sizeCaption || data.size || 'Standard Size',
        width: data.width || null,
        leftF: data.leftF || null,
        rightF: data.rightF || null,
        thickness: data.thickness || null,
        thicknessOne: data.thicknessOne || null,
        printingCylinder: data.printingCylinder || null,
        lengthCm: data.lengthCm || null,
        cuttingLength: data.cuttingLength || null,
        rawMaterial: data.rawMaterial || null,
        masterBatchId: data.masterBatchId || null,
        printed: data.printed || null,
        cuttingUnit: data.cuttingUnit || null,
        unitWeight: data.unitWeight || null,
        unitQty: data.unitQty || null,
        packageKg: data.packageKg || null,
        packing: data.packing || null,
        punching: data.punching || null,
        cover: data.cover || null,
        volum: data.volum || null,
        knife: data.knife || null,
        notes: data.notes || null
      };

      const result = await this.db.query(
        `INSERT INTO customer_products (
          customer_id, category_id, item_id, size_caption, width, left_f, right_f,
          thickness, thickness_one, printing_cylinder, length_cm, cutting_length_cm,
          raw_material, master_batch_id, printed, cutting_unit, unit_weight_kg,
          unit_qty, package_kg, packing, punching, cover, volum, knife, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
        ) RETURNING *`,
        [
          productData.customerId, productData.categoryId, productData.itemId, productData.sizeCaption,
          productData.width, productData.leftF, productData.rightF, productData.thickness,
          productData.thicknessOne, productData.printingCylinder, productData.lengthCm, productData.cuttingLength,
          productData.rawMaterial, productData.masterBatchId, productData.printed, productData.cuttingUnit,
          productData.unitWeight, productData.unitQty, productData.packageKg, productData.packing,
          productData.punching, productData.cover, productData.volum, productData.knife, productData.notes
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async createOrderRecord(data: any): Promise<any> {
    try {
      // Validate required fields
      if (!data.customerId) {
        throw new Error('Customer ID is required for order creation');
      }

      const orderData = {
        customerId: data.customerId,
        note: data.note || data.notes || null,
        status: 'pending',
        userId: data.userId || null
      };

      const result = await this.db.query(
        `INSERT INTO orders (customer_id, note, status, user_id, date) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [orderData.customerId, orderData.note, orderData.status, orderData.userId]
      );

      // If products are provided, create job orders
      if (data.products && Array.isArray(data.products)) {
        const orderId = result.rows[0].id;
        for (const product of data.products) {
          await this.db.query(
            `INSERT INTO job_orders (order_id, customer_product_id, quantity, status) 
             VALUES ($1, $2, $3, 'pending')`,
            [orderId, product.customerProductId, product.quantity || 100]
          );
        }
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async generateWorkflowSuggestions(context: any): Promise<any[]> {
    try {
      const { currentPage, userId, userRole, timestamp } = context;

      // Get production and system data for context-aware suggestions
      const [orders, qualityChecks, maintenance, rolls] = await Promise.all([
        this.getOrdersOverview(),
        this.getQualityMetrics(),
        this.getMaintenanceStatus(),
        this.getRollsStatus()
      ]);

      const systemData = { orders, qualityChecks, maintenance, rolls };

      // Generate contextual workflow suggestions using OpenAI
      const prompt = `You are an AI production management assistant. Generate 4-6 contextual workflow suggestions based on the current system state and user context.

Current Context:
- Page: ${currentPage}
- User Role: ${userRole}
- Time: ${timestamp}

System Data:
- Orders: ${orders.total} total, ${orders.pending} pending, ${orders.processing} processing
- Quality Issues: ${qualityChecks.recentIssues} recent issues, ${qualityChecks.score}% quality score
- Maintenance: ${maintenance.urgentTasks} urgent tasks, ${maintenance.overdueItems} overdue items
- Production: ${rolls.extrusion} in extrusion, ${rolls.printing} in printing, ${rolls.cutting} in cutting

Generate workflow suggestions as a JSON array with this structure:
[{
  "id": "unique-id",
  "title": "Suggestion Title",
  "description": "Brief description",
  "category": "production|quality|maintenance|efficiency|planning|safety",
  "priority": "low|medium|high|urgent",
  "estimatedTime": "X mins",
  "difficulty": "easy|medium|advanced",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "benefits": ["Benefit 1", "Benefit 2"],
  "contextRelevance": 85,
  "actionUrl": "/optional/navigation/url",
  "isRecommended": true|false
}]

Focus on actionable workflows that address current bottlenecks, improve efficiency, or prevent issues. Prioritize suggestions relevant to the current page context.

Return only the JSON array, no additional text.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an intelligent production management assistant specialized in workflow optimization and process improvement. Generate contextual, actionable workflow suggestions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      let suggestions = [];
      try {
        const responseText = completion.choices[0]?.message?.content?.trim();
        suggestions = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing workflow suggestions:', parseError);
        // Fallback to static suggestions
        suggestions = this.getFallbackWorkflowSuggestions(currentPage, systemData);
      }

      // Sort by context relevance and priority
      return suggestions.sort((a, b) => {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority] || 1;
        const bPriority = priorityWeight[b.priority] || 1;
        
        return (b.contextRelevance + bPriority * 5) - (a.contextRelevance + aPriority * 5);
      });

    } catch (error) {
      console.error('Error generating workflow suggestions:', error);
      // Return fallback suggestions
      return this.getFallbackWorkflowSuggestions(context.currentPage, {});
    }
  }

  private getFallbackWorkflowSuggestions(currentPage: string, systemData: any): any[] {
    const suggestions = [];

    // Page-specific suggestions
    if (currentPage?.includes('/orders')) {
      suggestions.push({
        id: 'optimize-order-processing',
        title: 'Optimize Order Processing Flow',
        description: 'Review and streamline the order processing workflow for better efficiency',
        category: 'efficiency',
        priority: 'medium',
        estimatedTime: '20 mins',
        difficulty: 'medium',
        steps: [
          'Review current order queue and priorities',
          'Identify workflow bottlenecks',
          'Implement process improvements'
        ],
        benefits: ['Reduce order processing time', 'Improve customer satisfaction'],
        contextRelevance: 95,
        actionUrl: '/orders',
        isRecommended: true
      });
    }

    if (currentPage?.includes('/quality')) {
      suggestions.push({
        id: 'quality-improvement-plan',
        title: 'Quality Improvement Action Plan',
        description: 'Implement systematic quality control improvements',
        category: 'quality',
        priority: 'high',
        estimatedTime: '30 mins',
        difficulty: 'medium',
        steps: [
          'Analyze recent quality metrics',
          'Identify root causes of defects',
          'Deploy corrective measures'
        ],
        benefits: ['Improve quality scores', 'Reduce defect rates'],
        contextRelevance: 90,
        actionUrl: '/quality',
        isRecommended: true
      });
    }

    // General suggestions
    suggestions.push(
      {
        id: 'daily-production-review',
        title: 'Daily Production Health Check',
        description: 'Comprehensive review of production metrics and performance',
        category: 'production',
        priority: 'medium',
        estimatedTime: '15 mins',
        difficulty: 'easy',
        steps: [
          'Review production dashboard metrics',
          'Check machine status and efficiency',
          'Identify potential issues'
        ],
        benefits: ['Maintain optimal performance', 'Early issue detection'],
        contextRelevance: 75
      },
      {
        id: 'preventive-maintenance-check',
        title: 'Preventive Maintenance Schedule',
        description: 'Review and schedule preventive maintenance activities',
        category: 'maintenance',
        priority: 'high',
        estimatedTime: '25 mins',
        difficulty: 'advanced',
        steps: [
          'Review equipment maintenance history',
          'Schedule upcoming maintenance tasks',
          'Coordinate with production schedule'
        ],
        benefits: ['Reduce downtime', 'Extend equipment life'],
        contextRelevance: 80,
        actionUrl: '/maintenance'
      }
    );

    return suggestions.slice(0, 6);
  }

  private async getOrdersOverview(): Promise<any> {
    try {
      const result = await this.db.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
        FROM orders
        WHERE date >= CURRENT_DATE - INTERVAL '30 days'
      `);
      return result.rows[0];
    } catch (error) {
      return { total: 0, pending: 0, processing: 0, completed: 0 };
    }
  }

  private async getRollsStatus(): Promise<any> {
    try {
      const result = await this.db.query(`
        SELECT 
          COUNT(CASE WHEN current_stage = 'extrusion' THEN 1 END) as extrusion,
          COUNT(CASE WHEN current_stage = 'printing' THEN 1 END) as printing,
          COUNT(CASE WHEN current_stage = 'cutting' THEN 1 END) as cutting,
          COUNT(CASE WHEN current_stage = 'completed' THEN 1 END) as completed
        FROM rolls
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      `);
      return result.rows[0];
    } catch (error) {
      return { extrusion: 0, printing: 0, cutting: 0, completed: 0 };
    }
  }

  private async getMaintenanceStatus(): Promise<any> {
    try {
      const result = await this.db.query(`
        SELECT 
          COUNT(CASE WHEN priority = 'urgent' AND status != 'completed' THEN 1 END) as urgentTasks,
          COUNT(CASE WHEN requested_date < CURRENT_DATE - INTERVAL '7 days' AND status != 'completed' THEN 1 END) as overdueItems
        FROM maintenance_requests
      `);
      return result.rows[0];
    } catch (error) {
      return { urgentTasks: 0, overdueItems: 0 };
    }
  }
}