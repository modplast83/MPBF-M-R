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
  type: 'create_order' | 'create_customer' | 'create_product' | 'schedule_maintenance' | 'quality_check' | 'analytics_report' | 'navigate' | 'optimize' | 'analyze';
  label: string;
  data: any;
  executionStatus?: 'pending' | 'success' | 'failed';
  resultMessage?: string;
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
        SELECT s.name as section_name, m.name as machine_name, m.is_active
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Production analysis failed: ${errorMessage}`);
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

      // Get comprehensive module knowledge
      const moduleKnowledge = await this.getModuleKnowledge(context?.userId);
      
      const systemPrompt = `
        You are an Expert Production Management AI Assistant for MPBF Manufacturing Company.
        You are highly knowledgeable about ALL application modules and can provide expert guidance on any aspect of the system.
        You support both English and Arabic languages. Respond in the same language as the user's message.
        
        CURRENT CONTEXT:
        - Page: ${context?.currentPage || 'dashboard'}
        - User Role: ${context?.userRole || 'user'}
        - Page Data: ${contextData}
        
        COMPREHENSIVE MODULE KNOWLEDGE:
        ${moduleKnowledge}
        
        YOU ARE AN EXPERT IN ALL THESE AREAS:
        
        🏭 PRODUCTION MANAGEMENT:
        - Production planning, scheduling, and optimization
        - Job order management and tracking
        - Workflow management and bottleneck analysis
        - Roll production tracking (extrusion, printing, cutting)
        - Material mixing (ABA formulas, JO Mix)
        - Production metrics and efficiency analysis
        
        📊 QUALITY ASSURANCE:
        - Quality check types and procedures
        - Quality control recommendations
        - Corrective action planning
        - Defect analysis and prevention
        - Quality metrics interpretation
        
        📋 ORDER & INVENTORY MANAGEMENT:
        - Order creation, tracking, and fulfillment
        - Customer management and relationships
        - Product catalog management
        - Raw materials and final products tracking
        - Warehouse operations
        
        👥 HUMAN RESOURCES:
        - Time and attendance tracking
        - Employee performance management
        - Training and development
        - Violation and complaint handling
        - Overtime and leave management
        
        🔧 MAINTENANCE MANAGEMENT:
        - Preventive maintenance scheduling
        - Maintenance request handling
        - Equipment monitoring and alerts
        - Predictive maintenance recommendations
        
        🛠️ UTILITY TOOLS:
        - Bag weight calculations
        - Ink consumption analysis
        - Color mixing assistance
        - Cost calculations and analysis
        
        ⚙️ SYSTEM ADMINISTRATION:
        - User management and permissions
        - Database operations
        - Import/Export operations
        - SMS management and notifications
        - Server monitoring
        
        📈 ANALYTICS & REPORTING:
        - Dashboard creation and customization
        - Production reports and KPIs
        - Performance analytics
        - Trend analysis and forecasting
        
        ADVANCED CAPABILITIES:
        - Automatic record creation (customers, products, orders)
        - Intelligent workflow suggestions
        - Cross-module data analysis
        - Predictive insights and recommendations
        - Real-time problem solving
        
        When users ask questions or need help:
        1. Provide expert-level guidance specific to their module/context
        2. Suggest related modules or features that might be helpful
        3. Offer specific navigation paths and action items
        4. Create records automatically when requested
        5. Provide optimization recommendations
        
        Always be proactive in suggesting improvements and best practices.
        
        Please respond with JSON in the following format:
        {
          "response": "Natural language response with expert insights and specific recommendations",
          "suggestions": [
            {
              "type": "navigation|action|insight|optimization",
              "title": "Specific actionable title",
              "description": "Detailed description with clear value proposition",
              "actionUrl": "/exact/path (when applicable)",
              "priority": "low|medium|high"
            }
          ],
          "actions": [
            {
              "type": "create_order|create_customer|create_product|schedule_maintenance|quality_check|analytics_report|navigate|optimize|analyze",
              "label": "Clear action description", 
              "data": {
                "name": "extracted or generated name",
                "code": "auto-generated code if needed",
                "customerId": "specific customer ID",
                "categoryId": "specific category ID",
                "itemId": "specific item ID",
                "actionPath": "navigation path",
                "analysisType": "type of analysis to perform",
                "parameters": "additional parameters"
              }
            }
          ],
          "confidence": 0.95,
          "context": "Comprehensive context analysis with module relationships"
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
                data: { error: error instanceof Error ? error.message : String(error) }
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Assistant query failed: ${errorMessage}`);
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
        WHERE m.is_active = true
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

  private async getModuleKnowledge(userId?: string): Promise<string> {
    try {
      // Get comprehensive system data for module knowledge
      const [
        modules,
        ordersStats,
        customersCount,
        productsCount,
        sectionsData,
        machinesData,
        qualityMetrics,
        maintenanceStatus,
        rollsStatus,
        hrMetrics
      ] = await Promise.all([
        this.getSystemModules(),
        this.getOrdersOverview(),
        this.getCustomersCount(),
        this.getProductsCount(),
        this.getSectionsData(),
        this.getMachinesData(),
        this.getQualityMetricsOverview(),
        this.getMaintenanceStatus(),
        this.getRollsStatus(),
        this.getHRMetrics()
      ]);

      const moduleKnowledge = `
SYSTEM MODULES AVAILABLE:
${modules.map(module => `- ${module.name}: ${module.description || 'Module for ' + module.name.toLowerCase()}`).join('\n')}

CURRENT SYSTEM STATUS:
📊 Orders: ${ordersStats.total} total (${ordersStats.pending} pending, ${ordersStats.processing} processing, ${ordersStats.completed} completed)
👥 Customers: ${customersCount} active customers
📦 Products: ${productsCount} products in catalog
🏭 Sections: ${sectionsData.map(s => s.name).join(', ')}
⚙️ Machines: ${machinesData.active}/${machinesData.total} machines active
✅ Quality Score: ${qualityMetrics.score}% (${qualityMetrics.recentIssues} recent issues)
🔧 Maintenance: ${maintenanceStatus.urgentTasks} urgent, ${maintenanceStatus.overdueItems} overdue
🎯 Production: ${rollsStatus.extrusion} extrusion, ${rollsStatus.printing} printing, ${rollsStatus.cutting} cutting
👤 HR: ${hrMetrics.totalEmployees} employees, ${hrMetrics.todayAttendance}% attendance today

MODULE CAPABILITIES BY CATEGORY:

SETUP & CONFIGURATION:
- Categories: Product categorization system
- Items: Product item definitions and specifications
- Customers: Customer relationship management
- Products: Product catalog and specifications
- Sections: Manufacturing section organization
- Machines: Equipment management and monitoring
- Users: User management and access control

PRODUCTION MANAGEMENT:
- Orders: Order creation, tracking, and fulfillment
- Job Orders: Production job scheduling and tracking
- Workflow: Production workflow visualization and management
- Rolls Production: Roll manufacturing process tracking
- Mix Materials: Material mixing and formula management
- JO Mix: ABA formula mixing for job orders
- Production Metrics: Real-time production analytics

QUALITY ASSURANCE:
- Quality Check Types: Define quality control procedures
- Quality Checks: Perform and track quality inspections
- Corrective Actions: Manage quality improvement actions
- Quality Dashboard: Comprehensive quality metrics view

WAREHOUSE & INVENTORY:
- Raw Materials: Raw material inventory management
- Final Products: Finished goods tracking
- Inventory Control: Stock level monitoring and alerts

HR & WORKFORCE:
- Time Attendance: Employee attendance tracking
- Employee Management: Staff records and profiles
- Training: Employee development programs
- Violations & Complaints: HR issue management
- Overtime & Leave: Time-off and overtime tracking

MAINTENANCE:
- Maintenance Requests: Equipment service requests
- Maintenance Actions: Maintenance task execution
- Maintenance Schedule: Preventive maintenance planning
- Equipment Monitoring: Real-time equipment status

UTILITY TOOLS:
- Bag Weight Calculator: Product weight calculations
- Ink Consumption: Printing ink usage analysis
- Mix Colors: Color mixing formulations
- Cost Calculator: Production cost analysis

ANALYTICS & REPORTING:
- Dashboard: Customizable analytics dashboards
- Reports: Comprehensive production reports
- KPI Monitoring: Key performance indicators tracking
- Trend Analysis: Historical data analysis

SYSTEM ADMINISTRATION:
- Database: Database management and maintenance
- Permissions: Role-based access control
- Import/Export: Data import and export operations
- SMS Management: Notification and messaging system
- Server Management: System monitoring and administration

DOCUMENT MANAGEMENT:
- Templates: Document template management
- Procedures: Standard operating procedures
- Forms: Digital form management
- Archive: Document archival system
`;

      return moduleKnowledge;
    } catch (error) {
      console.error('Error getting module knowledge:', error);
      return 'Basic production management system with orders, quality, maintenance, and HR modules.';
    }
  }

  private async getSystemModules(): Promise<any[]> {
    try {
      const result = await this.db.query('SELECT id, name, display_name, category FROM modules ORDER BY category, name');
      return result.rows.map(row => ({
        id: row.id,
        name: row.display_name || row.name,
        description: `${row.category} module for ${row.name.toLowerCase()} management`
      }));
    } catch (error) {
      return [
        { name: 'Dashboard', description: 'Main dashboard and analytics' },
        { name: 'Orders', description: 'Order management and tracking' },
        { name: 'Production', description: 'Production planning and execution' },
        { name: 'Quality', description: 'Quality assurance and control' },
        { name: 'Maintenance', description: 'Equipment maintenance management' },
        { name: 'HR', description: 'Human resources management' }
      ];
    }
  }

  private async getCustomersCount(): Promise<number> {
    try {
      const result = await this.db.query('SELECT COUNT(*) as count FROM customers');
      return parseInt(result.rows[0].count);
    } catch (error) {
      return 0;
    }
  }

  private async getProductsCount(): Promise<number> {
    try {
      const result = await this.db.query('SELECT COUNT(*) as count FROM customer_products');
      return parseInt(result.rows[0].count);
    } catch (error) {
      return 0;
    }
  }

  private async getSectionsData(): Promise<any[]> {
    try {
      const result = await this.db.query('SELECT id, name FROM sections ORDER BY name');
      return result.rows;
    } catch (error) {
      return [{ name: 'Production' }, { name: 'Quality' }, { name: 'Warehouse' }];
    }
  }

  private async getMachinesData(): Promise<any> {
    try {
      const result = await this.db.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active
        FROM machines
      `);
      return result.rows[0];
    } catch (error) {
      return { total: 8, active: 6 };
    }
  }

  private async getHRMetrics(): Promise<any> {
    try {
      const result = await this.db.query(`
        SELECT 
          COUNT(*) as total_employees,
          COALESCE(AVG(CASE WHEN DATE(ta.date) = CURRENT_DATE THEN 1 ELSE 0 END) * 100, 85) as today_attendance
        FROM users u
        LEFT JOIN time_attendance ta ON u.id = ta.user_id
        WHERE u.is_active = true
      `);
      return {
        totalEmployees: parseInt(result.rows[0].total_employees),
        todayAttendance: Math.round(parseFloat(result.rows[0].today_attendance))
      };
    } catch (error) {
      return { totalEmployees: 25, todayAttendance: 85 };
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
              (SELECT COUNT(*) FROM machines WHERE is_active = true) as active_machines
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
        SELECT m.name, m.is_active, m.date_of_manufacturing,
               COUNT(mr.id) as recent_requests
        FROM machines m
        LEFT JOIN maintenance_requests mr ON m.id = mr.machine_id
        AND mr.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY m.id, m.name, m.is_active, m.date_of_manufacturing
        ORDER BY recent_requests DESC, m.date_of_manufacturing ASC
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
        case 'analyze':
          return await this.performAnalysis(action.data);
        case 'optimize':
          return await this.performOptimization(action.data);
        case 'navigate':
          return { navigationPath: action.data.actionPath, success: true };
        default:
          throw new Error(`Unsupported action type: ${action.type}`);
      }
    } catch (error) {
      console.error('Error executing action:', error);
      throw error;
    }
  }

  async performAnalysis(analysisData: any): Promise<any> {
    try {
      const { analysisType, parameters } = analysisData;
      
      switch (analysisType) {
        case 'production_efficiency':
          return await this.analyzeProductionEfficiency(parameters);
        case 'quality_trends':
          return await this.analyzeQualityTrends(parameters);
        case 'machine_performance':
          return await this.analyzeMachinePerformance(parameters);
        case 'cost_analysis':
          return await this.analyzeCostPerformance(parameters);
        case 'bottleneck_detection':
          return await this.detectBottlenecks(parameters);
        default:
          throw new Error(`Unsupported analysis type: ${analysisType}`);
      }
    } catch (error) {
      console.error('Error performing analysis:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: 'Analysis failed', details: errorMessage };
    }
  }

  async performOptimization(optimizationData: any): Promise<any> {
    try {
      const { optimizationType, parameters } = optimizationData;
      
      switch (optimizationType) {
        case 'production_schedule':
          return await this.optimizeProductionSchedule(parameters?.orderId);
        case 'resource_allocation':
          return await this.optimizeResourceAllocation(parameters);
        case 'quality_processes':
          return await this.optimizeQualityProcesses(parameters);
        case 'maintenance_schedule':
          return await this.optimizeMaintenanceSchedule(parameters);
        default:
          throw new Error(`Unsupported optimization type: ${optimizationType}`);
      }
    } catch (error) {
      console.error('Error performing optimization:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: 'Optimization failed', details: errorMessage };
    }
  }

  async analyzeProductionEfficiency(parameters?: any): Promise<any> {
    try {
      const timeframe = parameters?.timeframe || '7d';
      const sectionId = parameters?.sectionId;
      
      let efficiencyQuery = `
        SELECT 
          s.name as section_name,
          COUNT(jo.id) as total_jobs,
          COUNT(CASE WHEN jo.status = 'completed' THEN 1 END) as completed_jobs,
          AVG(CASE WHEN jo.status = 'completed' THEN 
            EXTRACT(EPOCH FROM (jo.updated_at - jo.created_at)) / 3600 
          END) as avg_completion_hours,
          COUNT(CASE WHEN r.status = 'quality_failed' THEN 1 END) as quality_failures
        FROM job_orders jo
        JOIN orders o ON jo.order_id = o.id
        JOIN customer_products cp ON jo.customer_product_id = cp.id
        JOIN customers c ON cp.customer_id = c.id
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN sections s ON u.section_id = s.id
        LEFT JOIN rolls r ON jo.id = r.job_order_id
        WHERE jo.created_at >= NOW() - INTERVAL '${timeframe === '7d' ? '7 days' : '30 days'}'
      `;
      
      if (sectionId) {
        efficiencyQuery += ` AND s.id = '${sectionId}'`;
      }
      
      efficiencyQuery += ` GROUP BY s.id, s.name ORDER BY s.name`;
      
      const result = await this.db.query(efficiencyQuery);
      
      const efficiency = result.rows.map(row => ({
        section: row.section_name,
        efficiency: Math.round((row.completed_jobs / row.total_jobs) * 100),
        avgCompletionTime: Math.round(row.avg_completion_hours * 10) / 10,
        qualityIssues: parseInt(row.quality_failures),
        totalJobs: parseInt(row.total_jobs)
      }));
      
      return {
        analysis: 'Production Efficiency Analysis',
        timeframe,
        efficiency,
        insights: efficiency.length > 0 ? [
          `Average efficiency: ${Math.round(efficiency.reduce((sum, e) => sum + e.efficiency, 0) / efficiency.length)}%`,
          efficiency.filter(e => e.efficiency < 60).length > 0 ? 
            `${efficiency.filter(e => e.efficiency < 60).length} sections need attention` : 
            'All sections performing adequately'
        ] : ['No efficiency data available']
      };
    } catch (error) {
      console.error('Production efficiency analysis error:', error);
      return { error: 'Failed to analyze production efficiency' };
    }
  }

  async analyzeQualityTrends(parameters?: any): Promise<any> {
    try {
      const timeframe = parameters?.timeframe || '30d';
      
      const qualityQuery = `
        SELECT 
          DATE(qc.check_date) as check_date,
          qct.name as check_type,
          COUNT(*) as total_checks,
          COUNT(CASE WHEN qc.result = 'passed' THEN 1 END) as passed_checks,
          COUNT(CASE WHEN qc.result = 'failed' THEN 1 END) as failed_checks
        FROM quality_checks qc
        JOIN quality_check_types qct ON qc.check_type_id = qct.id
        WHERE qc.check_date >= CURRENT_DATE - INTERVAL '${timeframe === '7d' ? '7 days' : '30 days'}'
        GROUP BY DATE(qc.check_date), qct.name
        ORDER BY check_date DESC, qct.name
      `;
      
      const result = await this.db.query(qualityQuery);
      
      const trends = result.rows.map(row => ({
        date: row.check_date,
        checkType: row.check_type,
        passRate: Math.round((row.passed_checks / row.total_checks) * 100),
        totalChecks: parseInt(row.total_checks),
        failedChecks: parseInt(row.failed_checks)
      }));
      
      return {
        analysis: 'Quality Trends Analysis',
        timeframe,
        trends,
        insights: trends.length > 0 ? [
          `Average pass rate: ${Math.round(trends.reduce((sum, t) => sum + t.passRate, 0) / trends.length)}%`,
          trends.filter(t => t.passRate < 80).length > 0 ? 
            'Some quality check types need improvement' : 
            'Quality performance is satisfactory'
        ] : ['No quality trend data available']
      };
    } catch (error) {
      console.error('Quality trends analysis error:', error);
      return { error: 'Failed to analyze quality trends' };
    }
  }

  async detectBottlenecks(parameters?: any): Promise<any> {
    try {
      // Analyze production stages to identify bottlenecks
      const stageQuery = `
        SELECT 
          r.current_stage,
          COUNT(*) as roll_count,
          AVG(EXTRACT(EPOCH FROM (NOW() - r.created_at)) / 3600) as avg_hours_in_stage
        FROM rolls r
        WHERE r.current_stage != 'completed'
        AND r.created_at >= NOW() - INTERVAL '7 days'
        GROUP BY r.current_stage
        ORDER BY avg_hours_in_stage DESC
      `;
      
      const machineQuery = `
        SELECT 
          m.name as machine_name,
          s.name as section_name,
          m.is_active,
          COUNT(mr.id) as maintenance_requests
        FROM machines m
        JOIN sections s ON m.section_id = s.id
        LEFT JOIN maintenance_requests mr ON m.id = mr.machine_id
        AND mr.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY m.id, m.name, s.name, m.is_active
        ORDER BY maintenance_requests DESC
      `;
      
      const [stageResult, machineResult] = await Promise.all([
        this.db.query(stageQuery),
        this.db.query(machineQuery)
      ]);
      
      const bottlenecks = {
        stageBottlenecks: stageResult.rows.map(row => ({
          stage: row.current_stage,
          rollCount: parseInt(row.roll_count),
          avgHours: Math.round(row.avg_hours_in_stage * 10) / 10,
          severity: row.avg_hours_in_stage > 24 ? 'high' : row.avg_hours_in_stage > 12 ? 'medium' : 'low'
        })),
        machineBottlenecks: machineResult.rows.map(row => ({
          machine: row.machine_name,
          section: row.section_name,
          active: row.is_active,
          maintenanceRequests: parseInt(row.maintenance_requests),
          severity: row.maintenance_requests > 5 ? 'high' : row.maintenance_requests > 2 ? 'medium' : 'low'
        }))
      };
      
      return {
        analysis: 'Bottleneck Detection',
        bottlenecks,
        recommendations: this.generateBottleneckRecommendations(bottlenecks)
      };
    } catch (error) {
      console.error('Bottleneck detection error:', error);
      return { error: 'Failed to detect bottlenecks' };
    }
  }



  private generateBottleneckRecommendations(bottlenecks: any): string[] {
    const recommendations: string[] = [];
    
    bottlenecks.stageBottlenecks.forEach((bottleneck: any) => {
      if (bottleneck.severity === 'high') {
        recommendations.push(`Urgent: Address ${bottleneck.stage} stage delays (${bottleneck.avgHours}h average)`);
      }
    });
    
    bottlenecks.machineBottlenecks.forEach((machine: any) => {
      if (machine.severity === 'high' && !machine.active) {
        recommendations.push(`Critical: Restore ${machine.machine} in ${machine.section} section`);
      }
    });
    
    return recommendations;
  }

  async analyzeMachinePerformance(parameters?: any): Promise<any> {
    try {
      const machineId = parameters?.machineId;
      const timeframe = parameters?.timeframe || '30d';
      
      let machineQuery = `
        SELECT 
          m.id,
          m.name,
          s.name as section_name,
          m.is_active,
          m.date_of_manufacturing,
          COUNT(mr.id) as maintenance_count,
          COUNT(CASE WHEN mr.priority = 'urgent' THEN 1 END) as urgent_requests,
          AVG(CASE WHEN mr.status = 'completed' THEN 
            EXTRACT(EPOCH FROM (mr.updated_at - mr.created_at)) / 3600 
          END) as avg_repair_time
        FROM machines m
        JOIN sections s ON m.section_id = s.id
        LEFT JOIN maintenance_requests mr ON m.id = mr.machine_id
        AND mr.created_at >= NOW() - INTERVAL '${timeframe === '7d' ? '7 days' : '30 days'}'
      `;
      
      if (machineId) {
        machineQuery += ` WHERE m.id = '${machineId}'`;
      }
      
      machineQuery += ` GROUP BY m.id, m.name, s.name, m.is_active, m.date_of_manufacturing ORDER BY maintenance_count DESC`;
      
      const result = await this.db.query(machineQuery);
      
      const performance = result.rows.map(row => ({
        machine: row.name,
        section: row.section_name,
        active: row.is_active,
        maintenanceCount: parseInt(row.maintenance_count) || 0,
        urgentRequests: parseInt(row.urgent_requests) || 0,
        avgRepairTime: row.avg_repair_time ? Math.round(parseFloat(row.avg_repair_time) * 10) / 10 : 0,
        reliability: this.calculateMachineReliability(row)
      }));
      
      return {
        analysis: 'Machine Performance Analysis',
        timeframe,
        performance,
        insights: this.generateMachineInsights(performance)
      };
    } catch (error) {
      console.error('Machine performance analysis error:', error);
      return { error: 'Failed to analyze machine performance' };
    }
  }

  async analyzeCostPerformance(parameters?: any): Promise<any> {
    try {
      const timeframe = parameters?.timeframe || '30d';
      const orderId = parameters?.orderId;
      
      let costQuery = `
        SELECT 
          o.id,
          o.date,
          c.name as customer_name,
          COUNT(jo.id) as job_count,
          SUM(jo.quantity) as total_quantity,
          SUM(CASE WHEN jo.status = 'completed' THEN jo.quantity ELSE 0 END) as completed_quantity
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        LEFT JOIN job_orders jo ON o.id = jo.order_id
        WHERE o.date >= CURRENT_DATE - INTERVAL '${timeframe === '7d' ? '7 days' : '30 days'}'
      `;
      
      if (orderId) {
        costQuery += ` AND o.id = ${orderId}`;
      }
      
      costQuery += ` GROUP BY o.id, o.date, c.name ORDER BY o.date DESC`;
      
      const result = await this.db.query(costQuery);
      
      const costAnalysis = result.rows.map(row => ({
        orderId: row.id,
        customer: row.customer_name,
        jobCount: parseInt(row.job_count) || 0,
        totalQuantity: parseInt(row.total_quantity) || 0,
        completedQuantity: parseInt(row.completed_quantity) || 0,
        efficiency: row.total_quantity > 0 ? Math.round((row.completed_quantity / row.total_quantity) * 100) : 0
      }));
      
      return {
        analysis: 'Cost Performance Analysis',
        timeframe,
        costAnalysis,
        insights: this.generateCostInsights(costAnalysis)
      };
    } catch (error) {
      console.error('Cost analysis error:', error);
      return { error: 'Failed to analyze cost performance' };
    }
  }

  async optimizeResourceAllocation(parameters?: any): Promise<any> {
    try {
      const resourceQuery = `
        SELECT 
          s.id,
          s.name,
          COUNT(m.id) as machine_count,
          COUNT(CASE WHEN m.is_active = true THEN 1 END) as active_machines,
          COUNT(u.id) as employee_count,
          COUNT(jo.id) as current_jobs
        FROM sections s
        LEFT JOIN machines m ON s.id = m.section_id
        LEFT JOIN users u ON s.id = u.section_id
        LEFT JOIN job_orders jo ON jo.status IN ('pending', 'processing')
        GROUP BY s.id, s.name
        ORDER BY s.name
      `;
      
      const result = await this.db.query(resourceQuery);
      
      const optimization = result.rows.map(row => ({
        section: row.name,
        machineUtilization: row.machine_count > 0 ? Math.round((row.active_machines / row.machine_count) * 100) : 0,
        workload: parseInt(row.current_jobs) || 0,
        staffing: parseInt(row.employee_count) || 0,
        recommendations: this.generateResourceRecommendations(row)
      }));
      
      return {
        optimization: 'Resource Allocation Analysis',
        sections: optimization,
        overallRecommendations: this.generateOverallResourceRecommendations(optimization)
      };
    } catch (error) {
      console.error('Resource allocation error:', error);
      return { error: 'Failed to optimize resource allocation' };
    }
  }

  async optimizeQualityProcesses(parameters?: any): Promise<any> {
    try {
      const qualityOptimizationQuery = `
        SELECT 
          qct.name as check_type,
          COUNT(qc.id) as total_checks,
          COUNT(CASE WHEN qc.result = 'passed' THEN 1 END) as passed_checks,
          COUNT(CASE WHEN qc.result = 'failed' THEN 1 END) as failed_checks,
          AVG(EXTRACT(EPOCH FROM (qc.updated_at - qc.created_at)) / 60) as avg_check_time
        FROM quality_check_types qct
        LEFT JOIN quality_checks qc ON qct.id = qc.check_type_id
        AND qc.check_date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY qct.id, qct.name
        ORDER BY qct.name
      `;
      
      const result = await this.db.query(qualityOptimizationQuery);
      
      const qualityOptimization = result.rows.map(row => ({
        checkType: row.check_type,
        passRate: row.total_checks > 0 ? Math.round((row.passed_checks / row.total_checks) * 100) : 100,
        totalChecks: parseInt(row.total_checks) || 0,
        avgCheckTime: row.avg_check_time ? Math.round(parseFloat(row.avg_check_time)) : 0,
        optimizationPotential: this.calculateQualityOptimization(row)
      }));
      
      return {
        optimization: 'Quality Process Optimization',
        processes: qualityOptimization,
        recommendations: this.generateQualityOptimizationRecommendations(qualityOptimization)
      };
    } catch (error) {
      console.error('Quality optimization error:', error);
      return { error: 'Failed to optimize quality processes' };
    }
  }

  async optimizeMaintenanceSchedule(parameters?: any): Promise<any> {
    try {
      const maintenanceOptimizationQuery = `
        SELECT 
          m.id,
          m.name,
          s.name as section_name,
          m.date_of_manufacturing,
          COUNT(mr.id) as maintenance_history,
          MAX(mr.requested_date) as last_maintenance,
          COUNT(CASE WHEN mr.status = 'pending' THEN 1 END) as pending_requests
        FROM machines m
        JOIN sections s ON m.section_id = s.id
        LEFT JOIN maintenance_requests mr ON m.id = mr.machine_id
        GROUP BY m.id, m.name, s.name, m.date_of_manufacturing
        ORDER BY last_maintenance ASC NULLS FIRST
      `;
      
      const result = await this.db.query(maintenanceOptimizationQuery);
      
      const maintenanceOptimization = result.rows.map(row => ({
        machine: row.name,
        section: row.section_name,
        age: this.calculateMachineAge(row.date_of_manufacturing),
        maintenanceHistory: parseInt(row.maintenance_history) || 0,
        daysSinceLastMaintenance: this.calculateDaysSince(row.last_maintenance),
        pendingRequests: parseInt(row.pending_requests) || 0,
        priority: this.calculateMaintenancePriority(row),
        recommendedAction: this.getMaintenanceRecommendation(row)
      }));
      
      return {
        optimization: 'Maintenance Schedule Optimization',
        machines: maintenanceOptimization,
        schedule: this.generateOptimalMaintenanceSchedule(maintenanceOptimization)
      };
    } catch (error) {
      console.error('Maintenance optimization error:', error);
      return { error: 'Failed to optimize maintenance schedule' };
    }
  }



  private calculateMachineReliability(machineData: any): number {
    const maintenanceCount = parseInt(machineData.maintenance_count) || 0;
    const urgentRequests = parseInt(machineData.urgent_requests) || 0;
    
    // Simple reliability calculation based on maintenance frequency
    const baseReliability = 100;
    const maintenancePenalty = maintenanceCount * 5;
    const urgentPenalty = urgentRequests * 15;
    
    return Math.max(0, Math.min(100, baseReliability - maintenancePenalty - urgentPenalty));
  }

  private generateMachineInsights(performance: any[]): string[] {
    const insights: string[] = [];
    const avgReliability = performance.reduce((sum, p) => sum + p.reliability, 0) / performance.length;
    
    if (avgReliability < 80) {
      insights.push("Machine reliability is below acceptable threshold (80%+)");
    }
    
    const highMaintenanceMachines = performance.filter(p => p.maintenanceCount > 10);
    if (highMaintenanceMachines.length > 0) {
      insights.push(`${highMaintenanceMachines.length} machines require frequent maintenance`);
    }
    
    return insights;
  }

  private generateCostInsights(costAnalysis: any[]): string[] {
    const insights: string[] = [];
    const avgEfficiency = costAnalysis.reduce((sum, c) => sum + c.efficiency, 0) / costAnalysis.length;
    
    if (avgEfficiency < 80) {
      insights.push("Order completion efficiency is below target (80%+)");
    }
    
    return insights;
  }

  private generateResourceRecommendations(sectionData: any): string[] {
    const recommendations: string[] = [];
    const utilizationRate = sectionData.machine_count > 0 ? (sectionData.active_machines / sectionData.machine_count) * 100 : 0;
    
    if (utilizationRate < 80) {
      recommendations.push("Consider activating idle machines or redistributing workload");
    }
    
    if (sectionData.current_jobs > sectionData.employee_count * 5) {
      recommendations.push("Section may be overloaded, consider additional staffing");
    }
    
    return recommendations;
  }

  private generateOverallResourceRecommendations(optimization: any[]): string[] {
    const recommendations: string[] = [];
    const overloadedSections = optimization.filter(s => s.workload > s.staffing * 5);
    
    if (overloadedSections.length > 0) {
      recommendations.push("Redistribute workload from overloaded sections");
    }
    
    return recommendations;
  }

  private calculateQualityOptimization(qualityData: any): string {
    const passRate = qualityData.total_checks > 0 ? (qualityData.passed_checks / qualityData.total_checks) * 100 : 100;
    
    if (passRate < 70) return "High optimization potential";
    if (passRate < 90) return "Medium optimization potential";
    return "Low optimization potential";
  }

  private generateQualityOptimizationRecommendations(processes: any[]): string[] {
    const recommendations: string[] = [];
    const problematicProcesses = processes.filter(p => p.passRate < 85);
    
    if (problematicProcesses.length > 0) {
      recommendations.push(`Review and improve ${problematicProcesses.length} quality check processes`);
    }
    
    return recommendations;
  }

  private calculateMachineAge(manufacturingDate: string): number {
    if (!manufacturingDate) return 0;
    const ageMs = Date.now() - new Date(manufacturingDate).getTime();
    return Math.floor(ageMs / (1000 * 60 * 60 * 24 * 365)); // Age in years
  }

  private calculateDaysSince(date: string): number {
    if (!date) return 999; // Large number for no maintenance
    const dayMs = Date.now() - new Date(date).getTime();
    return Math.floor(dayMs / (1000 * 60 * 60 * 24));
  }

  private calculateMaintenancePriority(machineData: any): string {
    const daysSince = this.calculateDaysSince(machineData.last_maintenance);
    const age = this.calculateMachineAge(machineData.date_of_manufacturing);
    
    if (daysSince > 90 || age > 10) return "urgent";
    if (daysSince > 60 || age > 5) return "high";
    if (daysSince > 30) return "medium";
    return "low";
  }

  private getMaintenanceRecommendation(machineData: any): string {
    const priority = this.calculateMaintenancePriority(machineData);
    
    switch (priority) {
      case "urgent": return "Schedule immediate maintenance inspection";
      case "high": return "Plan maintenance within 1 week";
      case "medium": return "Schedule maintenance within 2 weeks";
      default: return "Regular maintenance schedule adequate";
    }
  }

  private generateOptimalMaintenanceSchedule(machines: any[]): any[] {
    return machines
      .filter(m => m.priority === "urgent" || m.priority === "high")
      .sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 10); // Top 10 priority machines
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to create customer: ${errorMessage}`);
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to create product: ${errorMessage}`);
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to create order: ${errorMessage}`);
    }
  }

  async generateWorkflowSuggestions(context: any): Promise<any[]> {
    try {
      const { currentPage, userId, userRole, timestamp } = context;

      // Get production and system data for context-aware suggestions
      const [orders, qualityChecks, maintenance, rolls] = await Promise.all([
        this.getOrdersOverview(),
        this.getQualityMetricsOverview(),
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

      const completion = await openai.chat.completions.create({
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

      let suggestions: any[] = [];
      try {
        const responseText = completion.choices[0]?.message?.content?.trim();
        suggestions = JSON.parse(responseText || '[]');
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
    const suggestions: any[] = [];

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

  private async getQualityMetricsOverview(): Promise<any> {
    try {
      const result = await this.db.query(`
        SELECT 
          COUNT(CASE WHEN result = 'failed' THEN 1 END) as recentIssues,
          ROUND(AVG(CASE WHEN result = 'passed' THEN 100 ELSE 0 END)::numeric, 0) as score
        FROM quality_checks 
        WHERE check_date >= CURRENT_DATE - INTERVAL '30 days'
      `);
      return result.rows[0] || { recentIssues: 0, score: 95 };
    } catch (error) {
      return { recentIssues: 0, score: 95 };
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