import OpenAI from "openai";
import { Pool } from "pg";
import Fuse from "fuse.js";

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
  responseType?: 'confirmation_required' | 'selection_required' | 'completed_action' | 'information_only';
  confirmation?: {
    action: string;
    summary: string;
    details: string;
  };
  selections?: {
    title: string;
    options: Array<{
      id: string;
      title: string;
      description: string;
      data: any;
    }>;
    selectionType: string;
    context?: any;
  };
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

  // Comprehensive database schema knowledge for AI assistant
  private getDatabaseSchema(): string {
    return `
## COMPLETE PRODUCTION MANAGEMENT DATABASE SCHEMA

### CORE SETUP TABLES (12 tables)
1. **categories** - Product categories (Roll Trash Bag, T-Shirt Bag, etc.)
   - id (text), name (text), code (text), nameAr (text)

2. **items** - Product items within categories
   - id (text), categoryId (FK), name (text), fullName (text)

3. **sections** - Factory sections/departments
   - id (text), name (text)

4. **master_batches** - Master batch materials
   - id (text), name (text)

5. **customers** - Customer information
   - id (text), code (text), name (text), nameAr (text), userId (FK), plateDrawerCode (text)

6. **customer_products** - Product specifications for each customer
   - id (serial), customerId (FK), categoryId (FK), itemId (FK), sizeCaption, width, leftF, rightF, thickness, thicknessOne, printingCylinder, lengthCm, cuttingLength, rawMaterial, masterBatchId (FK), printed, cuttingUnit, unitWeight, unitQty, packageKg, packing, punching, cover, volum, knife, notes, clicheFrontDesign, clicheBackDesign

7. **users** - System users and employees
   - id (text), username, password, email, firstName, lastName, bio, profileImageUrl, isAdmin, phone, isActive, sectionId (FK), position, hireDate, contractType, workSchedule (jsonb), emergencyContact (jsonb), bankDetails (jsonb), allowances (jsonb)

8. **machines** - Production machines
   - id (text), name, serialNumber, sectionId (FK), isActive, supplier, dateOfManufacturing, modelNumber

9. **machine_parts** - Machine spare parts
   - id (text), name, description, partNumber, machineId (FK), stockQuantity, minStock, maxStock, unitCost, supplier

10. **machine_machine_parts** - Many-to-many relationship between machines and parts
    - machineId (FK), partId (FK)

11. **spare_parts** - General spare parts inventory
    - id (text), name, description, partNumber, stockQuantity, minStock, maxStock, unitCost, supplier

12. **geofences** - Location-based attendance tracking
    - id (serial), name, latitude, longitude, radius, isActive, createdAt

### PRODUCTION WORKFLOW TABLES (8 tables)
13. **orders** - Customer orders
    - id (serial), date, customerId (FK), note, status (pending/processing/completed), userId (FK)

14. **job_orders** - Manufacturing job orders from orders
    - id (serial), orderId (FK), customerProductId (FK), quantity, finishedQty, receivedQty, status (pending/in_progress/extrusion_completed/completed/cancelled/received/partially_received), customerId (FK), receiveDate, receivedBy (FK)

15. **rolls** - Individual production rolls from job orders
    - id (text), jobOrderId (FK), serialNumber, extrudingQty, printingQty, cuttingQty, currentStage (extrusion/printing/cutting/completed), status (pending/processing/completed), wasteQty, wastePercentage, createdById (FK), printedById (FK), cutById (FK), createdAt, printedAt, cutAt

16. **raw_materials** - Raw material inventory
    - id (text), name, type, currentStock, minStock, maxStock, unitCost, supplier, lastRestockDate, expiryDate

17. **final_products** - Finished products inventory
    - id (text), name, description, category, currentStock, minStock, maxStock, unitCost, productionDate, expiryDate, status

18. **mix_materials** - Material mixing operations
    - id (serial), name, description, totalQuantity, unit, orderId (FK), mixScrew, createdAt, createdById (FK)

19. **mix_items** - Items within material mixes
    - id (serial), mixMaterialId (FK), rawMaterialId (FK), quantity, unit, notes

20. **job_order_updates** - Desktop notifications for job order changes
    - id (serial), jobOrderId (FK), updateType, title, message, priority, metadata (jsonb), createdBy (FK), createdAt, isRead, readAt

### QUALITY CONTROL TABLES (4 tables)
21. **quality_check_types** - Types of quality checks
    - id (text), name, description, category, checklistItems (jsonb), parameterRanges (jsonb), isActive

22. **quality_checks** - Quality inspection records
    - id (text), typeId (FK), rollId (FK), jobOrderId (FK), checkedBy (FK), status (passed/failed/pending), issueType, issueDescription, correctiveAction, checkedAt, notes, checklistResults (jsonb), parameterValues (jsonb), issueSeverity, imageUrls (jsonb)

23. **corrective_actions** - Quality corrective actions
    - id (text), qualityCheckId (FK), actionType, description, assignedTo (FK), dueDate, status (pending/in_progress/completed), completedAt, completedBy (FK), notes

### HR MANAGEMENT TABLES (12 tables)
24. **time_attendance** - Employee attendance tracking
    - id (serial), userId (FK), date, checkInTime, checkOutTime, breakStartTime, breakEndTime, totalHours, overtimeHours, status (present/absent/late/half_day), location (jsonb), notes, approvedBy (FK)

25. **overtime_requests** - Employee overtime requests
    - id (serial), userId (FK), date, startTime, endTime, reason, status (pending/approved/rejected), approvedBy (FK), approvedAt, notes

26. **leave_requests** - Employee leave applications
    - id (serial), userId (FK), leaveType, startDate, endDate, reason, status (pending/approved/rejected), approvedBy (FK), approvedAt, notes

27. **hr_violations** - Employee violations tracking
    - id (serial), userId (FK), violationType, description, severity (low/medium/high), reportedBy (FK), reportedAt, status (pending/reviewed/resolved), actionTaken, notes

28. **hr_complaints** - Employee complaints system
    - id (serial), userId (FK), complaintType, description, priority (low/medium/high), submittedAt, status (pending/investigating/resolved), assignedTo (FK), resolution, notes

29. **employee_of_month** - Employee recognition program
    - id (serial), userId (FK), month, year, nominatedBy (FK), reason, achievements (jsonb), awardDate

30. **payroll_records** - Payroll management
    - id (serial), userId (FK), payPeriod, basicSalary, overtime, allowances (jsonb), deductions (jsonb), netSalary, payDate, status (pending/paid)

31. **performance_reviews** - Employee performance evaluations
    - id (serial), userId (FK), reviewPeriod, reviewerId (FK), goals (jsonb), achievements (jsonb), areasForImprovement (jsonb), overallRating, reviewDate, nextReviewDate

32. **trainings** - Training programs
    - id (serial), title, description, category, duration, instructor, startDate, endDate, status (planned/ongoing/completed), participants (jsonb)

33. **training_certificates** - Training completion certificates
    - id (serial), userId (FK), trainingId (FK), completionDate, certificateNumber, expiryDate, score

34. **training_evaluations** - Training feedback and evaluations
    - id (serial), trainingId (FK), userId (FK), rating, feedback, suggestions, evaluationDate

35. **training_field_evaluations** - Field-based training assessments
    - id (serial), userId (FK), evaluatorId (FK), skillsAssessed (jsonb), performanceRating, comments, evaluationDate

36. **training_points** - Training point system
    - id (serial), userId (FK), points, reason, awardedBy (FK), awardedAt

### MAINTENANCE MANAGEMENT TABLES (4 tables)
37. **maintenance_requests** - Equipment maintenance requests
    - id (serial), machineId (FK), requestedBy (FK), requestDate, description, priority (low/medium/high/urgent), status (pending/approved/in_progress/completed), assignedTo (FK), estimatedCost

38. **maintenance_actions** - Maintenance work performed
    - id (serial), requestId (FK), actionType, description, performedBy (FK), startTime, endTime, status (pending/in_progress/completed), notes, cost

39. **maintenance_schedule** - Preventive maintenance scheduling
    - id (serial), machineId (FK), scheduleType (daily/weekly/monthly/yearly), nextMaintenanceDate, lastMaintenanceDate, assignedTo (FK), notes

40. **operator_tasks** - Machine operator tasks
    - id (serial), userId (FK), machineId (FK), taskType, description, startTime, endTime, status (pending/in_progress/completed), notes

41. **operator_updates** - Operator status updates
    - id (serial), userId (FK), updateType, description, timestamp, metadata (jsonb)

### IOT AND SENSOR TABLES (3 tables)
42. **machine_sensors** - IoT sensors on machines
    - id (text), machineId (FK), sensorType (temperature/pressure/vibration/speed), unit, minValue, maxValue, isActive

43. **sensor_data** - Real-time sensor readings
    - id (serial), sensorId (FK), value, timestamp, status (normal/warning/critical)

44. **iot_alerts** - IoT-based alerts
    - id (serial), sensorId (FK), alertType, message, severity (low/medium/high), triggeredAt, acknowledgedAt, acknowledgedBy (FK), status (active/acknowledged/resolved)

### DOCUMENT MANAGEMENT TABLES (7 tables)
45. **documents** - Document repository
    - id (serial), title, content, type, category, status (draft/review/approved/archived), priority (low/medium/high), version, effectiveDate, expiryDate, approvalRequired, createdBy (FK), createdAt, updatedAt

46. **document_templates** - Document templates
    - id (serial), name, description, category, templateContent, fields (jsonb), isActive, createdBy (FK)

47. **document_approvals** - Document approval workflow
    - id (serial), documentId (FK), approverUserId (FK), status (pending/approved/rejected), approvedAt, comments

48. **document_views** - Document access tracking
    - id (serial), documentId (FK), userId (FK), viewedAt, ipAddress

49. **document_comments** - Document collaboration
    - id (serial), documentId (FK), userId (FK), comment, createdAt

50. **document_subscriptions** - Document notifications
    - id (serial), documentId (FK), userId (FK), subscriptionType (updates/comments/approvals), isActive

### FORMULA AND CALCULATION TABLES (4 tables)
51. **aba_formulas** - ABA material formulas
    - id (text), name, description, layerAPercentage, layerBPercentage, extrusionTemperature, lineSpeed, notes

52. **aba_formula_materials** - Materials in ABA formulas
    - id (serial), formulaId (FK), materialType, percentage, notes

53. **plate_calculations** - Plate/Cliché calculations
    - id (serial), customerProductId (FK), calculatedAt, parameters (jsonb), results (jsonb)

54. **plate_pricing_parameters** - Pricing calculation parameters
    - id (serial), parameterName, value, unit, description, lastUpdated

### JO MIX TABLES (3 tables)
55. **jo_mixes** - Job order material mixes
    - id (serial), jobOrderId (FK), mixName, totalQuantity, unit, status (pending/mixed/completed), createdAt, createdBy (FK)

56. **jo_mix_materials** - Materials in JO mixes
    - id (serial), joMixId (FK), rawMaterialId (FK), quantity, unit, notes

57. **jo_mix_items** - Items in JO mixes
    - id (serial), joMixId (FK), itemType, quantity, unit, specifications (jsonb)

### NOTIFICATION AND SMS TABLES (6 tables)
58. **notification_center** - System notifications
    - id (serial), userId (FK), title, message, type, priority, isRead, readAt, createdAt, actionUrl, metadata (jsonb)

59. **notification_templates** - Notification templates
    - id (serial), name, subject, content, type, isActive, createdBy (FK)

60. **sms_messages** - SMS communication log
    - id (serial), phoneNumber, message, status (pending/sent/delivered/failed), sentAt, deliveredAt, provider, messageId, cost, direction (inbound/outbound), userId (FK), orderId (FK), customerId (FK), jobOrderId (FK), maintenanceId (FK), qualityCheckId (FK), hrRecordId (FK), scheduleId (FK), category (order/maintenance/quality/hr/general), priority (low/medium/high), templateId (FK)

61. **sms_templates** - SMS message templates
    - id (serial), name, content, category, isActive, createdBy (FK), createdAt

62. **sms_provider_settings** - SMS provider configuration
    - id (serial), providerName, apiKey, apiSecret, endpoint, isActive, dailyLimit, monthlyLimit, costPerSms

63. **sms_notification_rules** - SMS notification automation
    - id (serial), eventType, recipientRole, templateId (FK), isActive, conditions (jsonb)

### CUSTOMER AND LOCATION TABLES (2 tables)
64. **customer_information** - Extended customer information
    - id (serial), customerId (FK), contactPerson, phone, email, address, city, country, paymentTerms, creditLimit, notes

65. **mobile_devices** - Mobile device management
    - id (serial), userId (FK), deviceId, deviceType, osVersion, appVersion, fcmToken, isActive, lastSeen

### SYSTEM ADMINISTRATION TABLES (3 tables)
66. **modules** - System modules and permissions
    - id (serial), name, displayName, description, category, isActive, permissions (jsonb)

67. **permissions** - User permissions matrix
    - id (serial), sectionId (FK), moduleId (FK), canView, canCreate, canEdit, canDelete, canApprove

68. **mix_machines** - Machine assignments for mixing operations
    - id (serial), name, description, section, capacity, isActive

### SESSION TABLE (1 table)
69. **sessions** - User session management
    - sid (varchar), sess (jsonb), expire (timestamp)

## TOTAL: 69 DATABASE TABLES covering complete production management system
## Relationships: 150+ foreign key relationships connecting all aspects of manufacturing operations

### KEY PRODUCTION WORKFLOW:
1. Customer → Customer Products → Orders → Job Orders → Rolls (with extrusion → printing → cutting stages)
2. Quality Control integrated at each production stage
3. Real-time IoT monitoring throughout production
4. HR management for all personnel involved
5. Maintenance scheduling for all equipment
6. Document management for procedures and compliance
7. SMS/notifications for real-time communication
    `;
  }

  // Enhanced method to gather real-time database statistics for AI context
  private async getDatabaseContext(): Promise<string> {
    try {
      const queries = [
        { name: 'customers', query: 'SELECT COUNT(*) as count FROM customers' },
        { name: 'orders', query: 'SELECT COUNT(*) as count, COUNT(CASE WHEN status = \'pending\' THEN 1 END) as pending, COUNT(CASE WHEN status = \'completed\' THEN 1 END) as completed FROM orders' },
        { name: 'job_orders', query: 'SELECT COUNT(*) as count, COUNT(CASE WHEN status = \'pending\' THEN 1 END) as pending, COUNT(CASE WHEN status = \'completed\' THEN 1 END) as completed FROM job_orders' },
        { name: 'rolls', query: 'SELECT COUNT(*) as count, COUNT(CASE WHEN current_stage = \'extrusion\' THEN 1 END) as extrusion, COUNT(CASE WHEN current_stage = \'printing\' THEN 1 END) as printing, COUNT(CASE WHEN current_stage = \'cutting\' THEN 1 END) as cutting FROM rolls' },
        { name: 'quality_checks', query: 'SELECT COUNT(*) as count, COUNT(CASE WHEN status = \'passed\' THEN 1 END) as passed, COUNT(CASE WHEN status = \'failed\' THEN 1 END) as failed FROM quality_checks' },
        { name: 'machines', query: 'SELECT COUNT(*) as count, COUNT(CASE WHEN is_active = true THEN 1 END) as active FROM machines' },
        { name: 'users', query: 'SELECT COUNT(*) as count, COUNT(CASE WHEN is_active = true THEN 1 END) as active FROM users' },
        { name: 'maintenance_requests', query: 'SELECT COUNT(*) as count, COUNT(CASE WHEN status = \'pending\' THEN 1 END) as pending FROM maintenance_requests' },
        { name: 'time_attendance', query: 'SELECT COUNT(*) as count FROM time_attendance WHERE date >= CURRENT_DATE - INTERVAL \'7 days\'' },
        { name: 'raw_materials', query: 'SELECT COUNT(*) as count FROM raw_materials' }
      ];

      const results = await Promise.all(
        queries.map(async ({ name, query }) => {
          try {
            const result = await this.db.query(query);
            return { name, data: result.rows[0] };
          } catch (error) {
            console.error(`Error querying ${name}:`, error);
            return { name, data: { count: 0 } };
          }
        })
      );

      let context = "## REAL-TIME DATABASE STATUS:\\n\\n";
      results.forEach(({ name, data }) => {
        context += `**${name.toUpperCase()}**: ${JSON.stringify(data)}\\n`;
      });

      return context;
    } catch (error) {
      console.error('Error gathering database context:', error);
      return "Database context unavailable";
    }
  }

  // Enhanced method to find specific records by intelligent name matching
  private async findCustomerByName(customerName: string): Promise<any> {
    try {
      // First try exact match
      const exactQuery = `
        SELECT * FROM customers 
        WHERE LOWER(name) = LOWER($1) OR LOWER(name_ar) = LOWER($1) OR LOWER(code) = LOWER($1)
        LIMIT 1
      `;
      const exactResult = await this.db.query(exactQuery, [customerName]);
      
      if (exactResult.rows.length > 0) {
        return exactResult.rows[0];
      }

      // Then try fuzzy search
      const fuzzyQuery = `
        SELECT *, 
        CASE 
          WHEN LOWER(name) LIKE LOWER($1) THEN 1
          WHEN LOWER(name_ar) LIKE LOWER($1) THEN 1
          WHEN LOWER(name) LIKE LOWER('%' || $1 || '%') THEN 2
          WHEN LOWER(name_ar) LIKE LOWER('%' || $1 || '%') THEN 2
          ELSE 3
        END as match_score
        FROM customers 
        WHERE LOWER(name) LIKE LOWER('%' || $1 || '%') 
           OR LOWER(name_ar) LIKE LOWER('%' || $1 || '%')
           OR LOWER(code) LIKE LOWER('%' || $1 || '%')
        ORDER BY match_score, name
        LIMIT 5
      `;
      const fuzzyResult = await this.db.query(fuzzyQuery, [customerName]);
      
      return fuzzyResult.rows.length > 0 ? fuzzyResult.rows[0] : null;
    } catch (error) {
      console.error('Error finding customer:', error);
      return null;
    }
  }

  // Enhanced method to get detailed record information
  private async getRecordDetails(tableName: string, recordId: string | number): Promise<any> {
    try {
      const queries: Record<string, string> = {
        'customer': `
          SELECT c.*, COUNT(o.id) as order_count, COUNT(cp.id) as product_count
          FROM customers c
          LEFT JOIN orders o ON c.id = o.customer_id
          LEFT JOIN customer_products cp ON c.id = cp.customer_id
          WHERE c.id = $1
          GROUP BY c.id
        `,
        'order': `
          SELECT o.*, c.name as customer_name, u.username as created_by_name,
                 COUNT(jo.id) as job_order_count
          FROM orders o
          LEFT JOIN customers c ON o.customer_id = c.id
          LEFT JOIN users u ON o.user_id = u.id
          LEFT JOIN job_orders jo ON o.id = jo.order_id
          WHERE o.id = $1
          GROUP BY o.id, c.name, u.username
        `,
        'job_order': `
          SELECT jo.*, o.date as order_date, c.name as customer_name,
                 cp.size_caption, cp.width, cp.thickness,
                 COUNT(r.id) as roll_count
          FROM job_orders jo
          LEFT JOIN orders o ON jo.order_id = o.id
          LEFT JOIN customers c ON jo.customer_id = c.id
          LEFT JOIN customer_products cp ON jo.customer_product_id = cp.id
          LEFT JOIN rolls r ON jo.id = r.job_order_id
          WHERE jo.id = $1
          GROUP BY jo.id, o.date, c.name, cp.size_caption, cp.width, cp.thickness
        `,
        'roll': `
          SELECT r.*, jo.quantity as job_order_quantity, c.name as customer_name,
                 cp.size_caption, u1.username as created_by_name,
                 u2.username as printed_by_name, u3.username as cut_by_name
          FROM rolls r
          LEFT JOIN job_orders jo ON r.job_order_id = jo.id
          LEFT JOIN customers c ON jo.customer_id = c.id
          LEFT JOIN customer_products cp ON jo.customer_product_id = cp.id
          LEFT JOIN users u1 ON r.created_by_id = u1.id
          LEFT JOIN users u2 ON r.printed_by_id = u2.id
          LEFT JOIN users u3 ON r.cut_by_id = u3.id
          WHERE r.id = $1
        `,
        'machine': `
          SELECT m.*, s.name as section_name,
                 COUNT(ms.id) as sensor_count,
                 COUNT(mr.id) as maintenance_requests
          FROM machines m
          LEFT JOIN sections s ON m.section_id = s.id
          LEFT JOIN machine_sensors ms ON m.id = ms.machine_id
          LEFT JOIN maintenance_requests mr ON m.id = mr.machine_id
          WHERE m.id = $1
          GROUP BY m.id, s.name
        `,
        'user': `
          SELECT u.*, s.name as section_name,
                 COUNT(ta.id) as attendance_records,
                 COUNT(o.id) as orders_created
          FROM users u
          LEFT JOIN sections s ON u.section_id = s.id
          LEFT JOIN time_attendance ta ON u.id = ta.user_id
          LEFT JOIN orders o ON u.id = o.user_id
          WHERE u.id = $1
          GROUP BY u.id, s.name
        `
      };

      const query = queries[tableName];
      if (!query) {
        return null;
      }

      const result = await this.db.query(query, [recordId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error(`Error getting ${tableName} details:`, error);
      return null;
    }
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
      
      // Get comprehensive database context for AI
      const databaseSchema = this.getDatabaseSchema();
      const databaseContext = await this.getDatabaseContext();

      // Get relevant data based on context
      let contextData = "";
      if (context?.currentPage) {
        contextData = await this.getPageContext(context.currentPage, context.userId);
      }

      // Get comprehensive module knowledge
      const moduleKnowledge = await this.getModuleKnowledge(context?.userId);
      
      const systemPrompt = `
        You are an Expert Production Management AI Assistant with PERFECT UNDERSTANDING of a comprehensive manufacturing database containing 69+ tables and all production records.

        ## YOUR COMPLETE DATABASE KNOWLEDGE:
        ${databaseSchema}

        ## CURRENT REAL-TIME DATABASE STATUS:
        ${databaseContext}

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
        
        IMPORTANT FOR ORDER CREATION:
        - When users mention customer names, use "customerName" field with exact name provided
        - Support both English and Arabic customer names
        - Handle misspelled customer names gracefully
        - Examples: "Price House", "مركز 2000", "Safi Trading"
        
        When users ask questions or need help:
        1. Provide expert-level guidance specific to their module/context
        2. Suggest related modules or features that might be helpful
        3. Offer specific navigation paths and action items
        4. Create records automatically when requested
        5. Provide optimization recommendations
        
        Always be proactive in suggesting improvements and best practices.
        
        INTERACTION GUIDELINES:
        - ALWAYS ask for confirmation before making any changes (creating, updating, deleting records)
        - If confused or multiple options exist, provide clear choices for the user to select
        - When creating orders, if no exact product match is found, display available customer products for selection
        - After successful actions, confirm what was done and ask if user needs anything else
        - Use responseType: "confirmation_required" for actions that need user confirmation
        - Use responseType: "selection_required" when user needs to choose from multiple options
        - Use responseType: "completed_action" after successful completion
        - Use responseType: "information_only" for informational responses
        
        Please respond with JSON in the following format:
        {
          "response": "Natural language response with expert insights and specific recommendations",
          "responseType": "confirmation_required|selection_required|completed_action|information_only",
          "confirmation": {
            "action": "create_order|create_customer|etc",
            "summary": "What will be created/changed",
            "details": "Specific details of the action"
          },
          "selections": {
            "title": "Choose an option",
            "options": [
              {
                "id": "option1",
                "title": "Option Title",
                "description": "Option description",
                "data": "option_data"
              }
            ],
            "selectionType": "customer_products|categories|actions"
          },
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
              "type": "create_order|create_customer|create_product|schedule_maintenance|quality_check|analytics_report|navigate|optimize|analyze|confirm_action",
              "label": "Clear action description", 
              "requiresConfirmation": true,
              "data": {
                "name": "extracted or generated name",
                "code": "auto-generated code if needed",
                "customerName": "exact customer name from user input (for orders)",
                "customerId": "only use if user specifically provides customer ID",
                "categoryId": "specific category ID",
                "itemId": "specific item ID",
                "quantity": "extracted numeric quantity only without units (e.g., 100, 50, 200)",
                "productType": "extracted product type (e.g., T-shirt bags, trash bags, rolls)",
                "productDescription": "any product details mentioned",
                "originalMessage": "preserve user's original message for context",
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
      
      // Check if this requires confirmation first
      if (result.responseType === 'confirmation_required') {
        return {
          response: result.response,
          responseType: 'confirmation_required',
          confirmation: result.confirmation,
          suggestions: result.suggestions || [],
          actions: result.actions || [],
          confidence: result.confidence || 0.9,
          context: result.context || 'confirmation_pending'
        };
      }
      
      // Execute create actions if any
      const actions: AssistantAction[] = result.actions || [];
      if (actions.length > 0) {
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          if (action.type.startsWith('create_')) {
            try {
              // Add original message context to action data for better processing
              const enhancedAction = {
                ...action,
                data: {
                  ...action.data,
                  originalMessage: message // Pass the original user message for product matching
                }
              };
              const createdRecord = await this.executeCreateAction(enhancedAction);
              actions[i] = {
                ...action,
                label: `✅ Created ${action.type.replace('create_', '').toUpperCase()}`,
                data: createdRecord
              };
            } catch (error) {
              console.error(`Failed to execute ${action.type}:`, error);
              const errorMessage = error instanceof Error ? error.message : String(error);
              
              // Check if this is a product selection required error
              if (errorMessage.startsWith('PRODUCT_SELECTION_REQUIRED:')) {
                const selectionData = JSON.parse(errorMessage.substring(25));
                return {
                  response: `I found ${selectionData.availableProducts.length} products for ${selectionData.customerName}. Please select which product you'd like to use for the order:`,
                  responseType: 'selection_required',
                  selections: {
                    title: `Select Product for ${selectionData.customerName} (${selectionData.quantity}kg)`,
                    options: selectionData.availableProducts,
                    selectionType: 'customer_products',
                    context: {
                      customerName: selectionData.customerName,
                      quantity: selectionData.quantity,
                      requestedProduct: selectionData.requestedProduct
                    }
                  },
                  suggestions: [],
                  actions: [],
                  confidence: 0.9,
                  context: 'product_selection_required'
                };
              }
              
              actions[i] = {
                ...action,
                label: `❌ Failed to create ${action.type.replace('create_', '')}`,
                data: { error: errorMessage }
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
      let customerId = data.customerId;
      
      // Try to resolve customer by name first
      if (data.customerName) {
        const customer = await this.findCustomerByName(data.customerName);
        if (customer) {
          customerId = customer.id;
          console.log(`Resolved customer "${data.customerName}" to ID: ${customerId}`);
        } else {
          throw new Error(`Customer "${data.customerName}" not found. Available customers can be viewed in the customers module.`);
        }
      }
      // If customerId is not provided or looks like a name, try to find customer by name
      else if (!customerId || customerId.length > 10 || /[^\w-]/.test(customerId)) {
        const customerName = data.customerId || data.customer;
        if (customerName) {
          const customer = await this.findCustomerByName(customerName);
          if (customer) {
            customerId = customer.id;
            console.log(`Resolved customer "${customerName}" to ID: ${customerId}`);
          } else {
            throw new Error(`Customer "${customerName}" not found. Available customers can be viewed in the customers module.`);
          }
        }
      }
      
      // Validate required fields
      if (!customerId) {
        throw new Error('Customer ID or customer name is required for order creation');
      }

      const orderData = {
        customerId: customerId,
        note: data.note || data.notes || null,
        status: 'pending',
        userId: data.userId || null
      };

      const result = await this.db.query(
        `INSERT INTO orders (customer_id, note, status, user_id, date) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [orderData.customerId, orderData.note, orderData.status, orderData.userId]
      );

      const orderId = result.rows[0].id;

      // Enhanced job order creation logic
      let jobOrdersCreated = 0;

      // If products are explicitly provided, create job orders
      if (data.products && Array.isArray(data.products)) {
        for (const product of data.products) {
          await this.db.query(
            `INSERT INTO job_orders (order_id, customer_product_id, quantity, status) 
             VALUES ($1, $2, $3, 'pending')`,
            [orderId, product.customerProductId, product.quantity || 100]
          );
          jobOrdersCreated++;
        }
      }
      // Always try to create at least one job order by finding matching products
      else {
        // Get customer products to find matching ones
        const customerProductsResult = await this.db.query(
          `SELECT cp.*, c.name as category_name, i.name as item_name 
           FROM customer_products cp
           LEFT JOIN categories c ON cp.category_id = c.id
           LEFT JOIN items i ON cp.item_id = i.id
           WHERE cp.customer_id = $1
           ORDER BY cp.id
           LIMIT 20`,
          [customerId]
        );
        
        const customerProducts = customerProductsResult.rows;
        let selectedProduct: any = null;

        // Try to match product based on description, type, or any text in the original data
        const searchTerms = [
          data.productType,
          data.productDescription,
          data.description,
          data.product,
          data.item,
          data.note,
          data.notes,
          // Extract product keywords from the original message/request
          ...(typeof data.originalMessage === 'string' ? data.originalMessage.toLowerCase().split(/\s+/) : [])
        ].filter(Boolean);

        if (searchTerms.length > 0 && customerProducts.length > 0) {
          // Try exact or partial matches for common product terms
          for (const term of searchTerms) {
            if (typeof term === 'string') {
              const lowerTerm = term.toLowerCase();
              selectedProduct = customerProducts.find(cp => 
                cp.category_name?.toLowerCase().includes(lowerTerm) ||
                cp.item_name?.toLowerCase().includes(lowerTerm) ||
                cp.size_caption?.toLowerCase().includes(lowerTerm) ||
                (lowerTerm.includes('bag') && (cp.category_name?.toLowerCase().includes('bag') || cp.item_name?.toLowerCase().includes('bag'))) ||
                (lowerTerm.includes('t-shirt') && cp.category_name?.toLowerCase().includes('t-shirt')) ||
                (lowerTerm.includes('trash') && cp.category_name?.toLowerCase().includes('trash'))
              );
              if (selectedProduct) break;
            }
          }
        }

        // If no specific product found, use the first available product
        // If no exact product match found, throw error with available products for selection
        if (!selectedProduct && customerProducts.length > 0) {
          const productOptions = customerProducts.slice(0, 10).map(p => ({
            id: p.id,
            title: `${p.category_name} - ${p.size_caption}`,
            description: `Size: ${p.size_caption} | Width: ${p.width_cm}cm | Length: ${p.length_cm}cm`,
            data: {
              productId: p.id,
              categoryName: p.category_name,
              sizeCaption: p.size_caption
            }
          }));
          
          // Get customer name for the error message
          const customerResult = await this.db.query('SELECT name FROM customers WHERE id = $1', [customerId]);
          const customerName = customerResult.rows[0]?.name || 'Unknown Customer';
          
          // Get default quantity
          const defaultQuantity = data.quantity || data.qty || data.amount || 100;
          
          throw new Error(`PRODUCT_SELECTION_REQUIRED:${JSON.stringify({
            customerName: customerName,
            quantity: defaultQuantity,
            requestedProduct: data.productType || data.productDescription,
            availableProducts: productOptions
          })}`);
        }

        // Handle case where user provides specific product ID (from selection)
        if (data.productId && data.skipProductMatching) {
          const specificProduct = customerProducts.find(p => p.id == data.productId);
          if (specificProduct) {
            selectedProduct = specificProduct;
          }
        }

        // Create job order if we have a product
        if (selectedProduct) {
          // Extract and parse quantity from various possible fields
          let quantity = 100; // Default quantity
          const quantityInput = data.quantity || data.qty || data.amount;
          
          if (quantityInput) {
            // Parse numeric value from string (e.g., "100kg" -> 100, "250" -> 250)
            const numericValue = typeof quantityInput === 'string' 
              ? parseFloat(quantityInput.replace(/[^\d.]/g, ''))
              : quantityInput;
            
            if (!isNaN(numericValue) && numericValue > 0) {
              quantity = numericValue;
            }
          }
          
          await this.db.query(
            `INSERT INTO job_orders (order_id, customer_product_id, quantity, status) 
             VALUES ($1, $2, $3, 'pending')`,
            [orderId, selectedProduct.id, quantity]
          );
          jobOrdersCreated++;
          console.log(`Auto-created job order for customer ${customerId}: ${selectedProduct.category_name || 'Unknown'} - ${selectedProduct.size_caption || 'Unknown'}, Quantity: ${quantity}kg`);
        }
      }

      console.log(`Order created successfully. Job orders created: ${jobOrdersCreated}`);
      
      // Return enhanced result with job order info
      return {
        ...result.rows[0],
        jobOrdersCreated: jobOrdersCreated
      };
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

  // Enhanced customer suggestions with fuzzy search and AI scoring
  async findCustomerSuggestions(query: string, limit: number = 5): Promise<any[]> {
    try {
      console.log(`Finding customer suggestions for query: "${query}"`);
      
      // Get all customers
      const customers = await this.db.query('SELECT id, name, "name_ar" as "nameAr", code FROM customers ORDER BY name');
      const allCustomers = customers.rows;

      if (!allCustomers || allCustomers.length === 0) {
        console.log('No customers found in database');
        return [];
      }

      // Configure Fuse for fuzzy search
      const fuse = new Fuse(allCustomers, {
        keys: [
          { name: 'name', weight: 0.4 },
          { name: 'nameAr', weight: 0.3 },
          { name: 'code', weight: 0.3 }
        ],
        threshold: 0.7, // More lenient threshold for suggestions
        includeScore: true,
        includeMatches: true,
        ignoreLocation: true,
        ignoreFieldNorm: false,
        distance: 100
      });

      // Perform fuzzy search
      const fuseResults = fuse.search(query);
      
      console.log(`Fuse search found ${fuseResults.length} results for "${query}"`);

      // Convert results and add match information
      const suggestions = fuseResults.slice(0, limit).map(result => {
        const customer = result.item;
        const score = 1 - (result.score || 0); // Convert to positive score
        
        // Determine match type based on the best match
        let matchType = 'fuzzy';
        let matchField = 'name';
        
        if (result.matches && result.matches.length > 0) {
          const bestMatch = result.matches[0];
          matchField = bestMatch.key || 'name';
          
          // Check if it's an exact match (case insensitive)
          const fieldValue = customer[matchField as keyof typeof customer] as string;
          if (fieldValue && fieldValue.toLowerCase().includes(query.toLowerCase())) {
            matchType = query.toLowerCase() === fieldValue.toLowerCase() ? 'exact' : 'partial';
          }
        }

        console.log(`Suggestion: ${customer.name} (${customer.id}) - Score: ${score.toFixed(3)} - Match: ${matchType} on ${matchField}`);

        return {
          ...customer,
          score: parseFloat(score.toFixed(3)),
          matchType,
          matchField
        };
      });

      // Sort by score (highest first) and then by name
      suggestions.sort((a, b) => {
        if (Math.abs(a.score - b.score) < 0.01) {
          return a.name.localeCompare(b.name);
        }
        return b.score - a.score;
      });

      console.log(`Returning ${suggestions.length} customer suggestions`);
      return suggestions;

    } catch (error) {
      console.error('Error finding customer suggestions:', error);
      return [];
    }
  }
}