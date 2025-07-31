// Voice Command Integration System for AI Assistant
export interface VoiceCommand {
  id: string;
  patterns: string[];
  action: string;
  parameters?: Record<string, any>;
  description: string;
  category: 'navigation' | 'data' | 'action' | 'system';
  priority: number;
  requiredPermissions?: string[];
}

export interface VoiceCommandResult {
  command: VoiceCommand;
  confidence: number;
  extractedParams: Record<string, any>;
  intent: string;
}

export class VoiceCommandProcessor {
  private commands: VoiceCommand[] = [];
  private currentLanguage: 'en' | 'ar' = 'en';

  constructor() {
    this.initializeCommands();
  }

  private initializeCommands() {
    // Navigation Commands
    this.commands.push(
      {
        id: 'nav_dashboard',
        patterns: [
          'go to dashboard', 'open dashboard', 'show dashboard', 'navigate to dashboard',
          'اذهب إلى لوحة التحكم', 'افتح لوحة التحكم', 'أظهر لوحة التحكم'
        ],
        action: 'navigate',
        parameters: { url: '/dashboard' },
        description: 'Navigate to main dashboard',
        category: 'navigation',
        priority: 10
      },
      {
        id: 'nav_orders',
        patterns: [
          'go to orders', 'open orders', 'show orders', 'view orders', 'navigate to orders',
          'اذهب إلى الطلبات', 'افتح الطلبات', 'أظهر الطلبات', 'عرض الطلبات'
        ],
        action: 'navigate',
        parameters: { url: '/orders' },
        description: 'Navigate to orders page',
        category: 'navigation',
        priority: 9
      },
      {
        id: 'nav_production',
        patterns: [
          'go to production', 'open production', 'show production workflow', 'production status',
          'اذهب إلى الإنتاج', 'افتح الإنتاج', 'حالة الإنتاج', 'سير عمل الإنتاج'
        ],
        action: 'navigate',
        parameters: { url: '/workflow' },
        description: 'Navigate to production workflow',
        category: 'navigation',
        priority: 9
      },
      {
        id: 'nav_quality',
        patterns: [
          'go to quality', 'open quality control', 'quality dashboard', 'quality checks',
          'اذهب إلى الجودة', 'افتح مراقبة الجودة', 'لوحة الجودة', 'فحوصات الجودة'
        ],
        action: 'navigate',
        parameters: { url: '/quality' },
        description: 'Navigate to quality control',
        category: 'navigation',
        priority: 8
      }
    );

    // Data Query Commands
    this.commands.push(
      {
        id: 'data_production_stats',
        patterns: [
          'show production stats', 'production statistics', 'production performance', 'how is production',
          'أظهر إحصائيات الإنتاج', 'إحصائيات الإنتاج', 'أداء الإنتاج', 'كيف الإنتاج'
        ],
        action: 'query_data',
        parameters: { type: 'production_stats' },
        description: 'Show production statistics and performance metrics',
        category: 'data',
        priority: 8
      },
      {
        id: 'data_orders_today',
        patterns: [
          'show orders today', 'today orders', 'orders for today', 'what orders today',
          'أظهر طلبات اليوم', 'طلبات اليوم', 'ما هي طلبات اليوم'
        ],
        action: 'query_data',
        parameters: { type: 'orders_today' },
        description: 'Show today\'s orders',
        category: 'data',
        priority: 7
      },
      {
        id: 'data_quality_issues',
        patterns: [
          'show quality issues', 'quality problems', 'what quality issues', 'quality alerts',
          'أظهر مشاكل الجودة', 'مشاكل الجودة', 'تنبيهات الجودة', 'ما هي مشاكل الجودة'
        ],
        action: 'query_data',
        parameters: { type: 'quality_issues' },
        description: 'Show current quality issues and alerts',
        category: 'data',
        priority: 7
      },
      {
        id: 'data_customer_info',
        patterns: [
          'show customer info for *', 'customer details for *', 'information about customer *',
          'أظهر معلومات العميل *', 'تفاصيل العميل *', 'معلومات عن العميل *'
        ],
        action: 'query_data',
        parameters: { type: 'customer_info' },
        description: 'Show customer information',
        category: 'data',
        priority: 6
      }
    );

    // Action Commands
    this.commands.push(
      {
        id: 'action_create_order',
        patterns: [
          'create new order', 'add new order', 'new order for *', 'create order for customer *',
          'إنشاء طلب جديد', 'أضف طلب جديد', 'طلب جديد للعميل *', 'إنشاء طلب للعميل *'
        ],
        action: 'create_record',
        parameters: { type: 'order' },
        description: 'Create a new order',
        category: 'action',
        priority: 9
      },
      {
        id: 'action_create_customer',
        patterns: [
          'create new customer', 'add new customer', 'new customer named *', 'add customer *',
          'إنشاء عميل جديد', 'أضف عميل جديد', 'عميل جديد باسم *', 'أضف العميل *'
        ],
        action: 'create_record',
        parameters: { type: 'customer' },
        description: 'Create a new customer',
        category: 'action',
        priority: 8
      },
      {
        id: 'action_complete_order',
        patterns: [
          'complete order *', 'mark order * as complete', 'finish order *',
          'أكمل الطلب *', 'اجعل الطلب * مكتمل', 'أنهي الطلب *'
        ],
        action: 'update_record',
        parameters: { type: 'order', status: 'completed' },
        description: 'Mark an order as completed',
        category: 'action',
        priority: 7
      }
    );

    // System Commands
    this.commands.push(
      {
        id: 'system_help',
        patterns: [
          'help', 'what can you do', 'show commands', 'available commands', 'voice commands',
          'مساعدة', 'ماذا يمكنك أن تفعل', 'أظهر الأوامر', 'الأوامر المتاحة', 'أوامر الصوت'
        ],
        action: 'show_help',
        parameters: {},
        description: 'Show available voice commands',
        category: 'system',
        priority: 5
      },
      {
        id: 'system_language',
        patterns: [
          'switch to arabic', 'change language to arabic', 'speak arabic', 'arabic mode',
          'switch to english', 'change language to english', 'speak english', 'english mode',
          'تحويل إلى العربية', 'غير اللغة إلى العربية', 'تكلم عربي', 'الوضع العربي',
          'تحويل إلى الإنجليزية', 'غير اللغة إلى الإنجليزية', 'تكلم إنجليزي', 'الوضع الإنجليزي'
        ],
        action: 'change_language',
        parameters: {},
        description: 'Change voice language',
        category: 'system',
        priority: 4
      }
    );
  }

  setLanguage(language: 'en' | 'ar') {
    this.currentLanguage = language;
  }

  processVoiceInput(input: string): VoiceCommandResult | null {
    const normalizedInput = input.toLowerCase().trim();
    
    for (const command of this.commands) {
      for (const pattern of command.patterns) {
        const result = this.matchPattern(normalizedInput, pattern.toLowerCase());
        if (result.match) {
          return {
            command,
            confidence: result.confidence,
            extractedParams: result.params,
            intent: this.generateIntent(command, result.params)
          };
        }
      }
    }
    
    return null;
  }

  private matchPattern(input: string, pattern: string): { match: boolean; confidence: number; params: Record<string, any> } {
    // Handle wildcard patterns
    if (pattern.includes('*')) {
      const regexPattern = pattern
        .replace(/\*/g, '(.+?)')
        .replace(/\s+/g, '\\s+');
      
      const regex = new RegExp(`^${regexPattern}$`, 'i');
      const match = input.match(regex);
      
      if (match) {
        const params: Record<string, any> = {};
        if (match[1]) {
          params.extracted = match[1].trim();
        }
        return { match: true, confidence: 0.9, params };
      }
    }
    
    // Exact match
    if (input === pattern) {
      return { match: true, confidence: 1.0, params: {} };
    }
    
    // Partial match with similarity scoring
    const similarity = this.calculateSimilarity(input, pattern);
    if (similarity > 0.8) {
      return { match: true, confidence: similarity, params: {} };
    }
    
    // Check if input contains key words from pattern
    const patternWords = pattern.split(' ');
    const inputWords = input.split(' ');
    const matchedWords = patternWords.filter(word => 
      inputWords.some(inputWord => inputWord.includes(word) || word.includes(inputWord))
    );
    
    if (matchedWords.length >= Math.ceil(patternWords.length * 0.7)) {
      return { match: true, confidence: 0.7, params: {} };
    }
    
    return { match: false, confidence: 0, params: {} };
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private generateIntent(command: VoiceCommand, params: Record<string, any>): string {
    switch (command.action) {
      case 'navigate':
        return `Navigate to ${command.parameters?.url}`;
      case 'query_data':
        return `Query ${command.parameters?.type} data`;
      case 'create_record':
        return `Create new ${command.parameters?.type}${params.extracted ? ` for ${params.extracted}` : ''}`;
      case 'update_record':
        return `Update ${command.parameters?.type}${params.extracted ? ` ${params.extracted}` : ''} to ${command.parameters?.status}`;
      case 'show_help':
        return 'Show voice command help';
      case 'change_language':
        return 'Change voice language';
      default:
        return command.description;
    }
  }

  getAvailableCommands(category?: string): VoiceCommand[] {
    if (category) {
      return this.commands.filter(cmd => cmd.category === category);
    }
    return this.commands;
  }

  getCommandHelp(): string {
    const categories = {
      navigation: 'Navigation Commands',
      data: 'Data Query Commands', 
      action: 'Action Commands',
      system: 'System Commands'
    };

    let help = 'Available Voice Commands:\n\n';
    
    Object.entries(categories).forEach(([category, title]) => {
      const categoryCommands = this.getAvailableCommands(category);
      if (categoryCommands.length > 0) {
        help += `${title}:\n`;
        categoryCommands.forEach(cmd => {
          const examplePattern = cmd.patterns[0];
          help += `• "${examplePattern}" - ${cmd.description}\n`;
        });
        help += '\n';
      }
    });

    return help;
  }
}

export const voiceCommandProcessor = new VoiceCommandProcessor();