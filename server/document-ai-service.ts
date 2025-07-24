import OpenAI from "openai";
import { DocumentStorage } from "./document-storage";
import { Document } from "../shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface DocumentSuggestion {
  templateType: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  tags: string[];
  reasoning: string;
  confidence: number;
}

export class DocumentAIService {
  private documentStorage: DocumentStorage;

  constructor(documentStorage: DocumentStorage) {
    this.documentStorage = documentStorage;
  }

  /**
   * Generate personalized document template suggestions based on user history
   */
  async generatePersonalizedSuggestions(
    userId: string,
    limit: number = 5
  ): Promise<DocumentSuggestion[]> {
    try {
      // Get user's document history
      const userDocuments = await this.documentStorage.getUserDocuments(userId, 50);
      
      // Analyze user patterns
      const userPatterns = this.analyzeUserPatterns(userDocuments);
      
      // Get existing templates for reference
      const existingTemplates = await this.documentStorage.getTemplates();
      
      // Generate AI suggestions
      const suggestions = await this.generateAISuggestions(
        userPatterns,
        existingTemplates,
        limit
      );
      
      return suggestions;
    } catch (error) {
      console.error("Error generating personalized suggestions:", error);
      return [];
    }
  }

  /**
   * Analyze user document patterns to understand preferences
   */
  private analyzeUserPatterns(documents: Document[]) {
    const documentTypes = new Map<string, number>();
    const categories = new Map<string, number>();
    const priorities = new Map<string, number>();
    const tags = new Map<string, number>();
    const timePatterns = new Map<string, number>();
    const contentKeywords = new Map<string, number>();

    documents.forEach(doc => {
      // Document type frequency
      documentTypes.set(doc.documentType, (documentTypes.get(doc.documentType) || 0) + 1);
      
      // Category frequency
      if (doc.category) {
        categories.set(doc.category, (categories.get(doc.category) || 0) + 1);
      }
      
      // Priority frequency
      priorities.set(doc.priority, (priorities.get(doc.priority) || 0) + 1);
      
      // Tag frequency
      if (doc.tags && doc.tags.length > 0) {
        doc.tags.forEach(tag => {
          tags.set(tag, (tags.get(tag) || 0) + 1);
        });
      }
      
      // Time patterns (day of week, time of day)
      const createdAt = new Date(doc.createdAt || new Date());
      const dayOfWeek = createdAt.toLocaleDateString('en-US', { weekday: 'long' });
      const hour = createdAt.getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      
      timePatterns.set(dayOfWeek, (timePatterns.get(dayOfWeek) || 0) + 1);
      timePatterns.set(timeOfDay, (timePatterns.get(timeOfDay) || 0) + 1);
      
      // Content keywords (simple word frequency)
      if (doc.content) {
        const words = doc.content.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 3);
        
        words.forEach(word => {
          contentKeywords.set(word, (contentKeywords.get(word) || 0) + 1);
        });
      }
    });

    return {
      documentTypes: Array.from(documentTypes.entries()).sort((a, b) => b[1] - a[1]),
      categories: Array.from(categories.entries()).sort((a, b) => b[1] - a[1]),
      priorities: Array.from(priorities.entries()).sort((a, b) => b[1] - a[1]),
      tags: Array.from(tags.entries()).sort((a, b) => b[1] - a[1]),
      timePatterns: Array.from(timePatterns.entries()).sort((a, b) => b[1] - a[1]),
      contentKeywords: Array.from(contentKeywords.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20),
      totalDocuments: documents.length
    };
  }

  /**
   * Generate AI-powered document suggestions
   */
  private async generateAISuggestions(
    userPatterns: any,
    existingTemplates: any[],
    limit: number
  ): Promise<DocumentSuggestion[]> {
    const prompt = `
    Based on the following user document patterns, generate ${limit} personalized document template suggestions for a production management system:

    User Patterns:
    - Most used document types: ${userPatterns.documentTypes.slice(0, 3).map(([type, count]) => `${type} (${count} times)`).join(', ')}
    - Most used categories: ${userPatterns.categories.slice(0, 3).map(([cat, count]) => `${cat} (${count} times)`).join(', ')}
    - Most used priorities: ${userPatterns.priorities.slice(0, 2).map(([pri, count]) => `${pri} (${count} times)`).join(', ')}
    - Common tags: ${userPatterns.tags.slice(0, 5).map(([tag, count]) => `${tag} (${count} times)`).join(', ')}
    - Common content keywords: ${userPatterns.contentKeywords.slice(0, 10).map(([word, count]) => `${word} (${count} times)`).join(', ')}
    - Total documents created: ${userPatterns.totalDocuments}

    Available document types: instruction, obligation, announcement, general_letter, agreement, contract, request, disclaimer

    Generate suggestions that:
    1. Are relevant to production management and manufacturing
    2. Build on the user's historical preferences
    3. Include practical, actionable content
    4. Are professional and business-appropriate
    5. Consider the industrial/manufacturing context

    Return a JSON array with this structure:
    [
      {
        "templateType": "document_type",
        "title": "Template Title",
        "content": "Template content with placeholders like [DEPARTMENT], [DATE], [DETAILS]",
        "priority": "medium",
        "category": "category_name",
        "tags": ["tag1", "tag2"],
        "reasoning": "Why this template is suggested based on user patterns",
        "confidence": 0.85
      }
    ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant specialized in document management for production and manufacturing environments. Generate practical, professional document templates based on user patterns."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    try {
      const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
      return result.suggestions || result || [];
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return [];
    }
  }

  /**
   * Generate content suggestions for a specific document type
   */
  async generateContentSuggestions(
    documentType: string,
    userContext: string,
    userId: string
  ): Promise<{ title: string; content: string; tags: string[] }[]> {
    try {
      // Get user's recent documents of this type
      const userDocuments = await this.documentStorage.getUserDocuments(userId, 20);
      const similarDocs = userDocuments.filter(doc => doc.documentType === documentType);

      const prompt = `
      Generate 3 content suggestions for a ${documentType} document in a production management system.
      
      Context: ${userContext}
      
      Recent similar documents by user:
      ${similarDocs.slice(0, 5).map(doc => `- ${doc.title}: ${doc.content.substring(0, 100)}...`).join('\n')}
      
      Generate professional, actionable content suggestions that:
      1. Are relevant to manufacturing/production environment
      2. Build on the user's writing style if available
      3. Include practical details and placeholders
      4. Are ready-to-use with minimal editing
      
      Return JSON with this structure:
      {
        "suggestions": [
          {
            "title": "Document Title",
            "content": "Document content with [PLACEHOLDERS]",
            "tags": ["tag1", "tag2"]
          }
        ]
      }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant specialized in generating professional document content for production management systems."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.6,
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
      return result.suggestions || [];
    } catch (error) {
      console.error("Error generating content suggestions:", error);
      return [];
    }
  }

  /**
   * Analyze document content and suggest improvements
   */
  async analyzeDocumentContent(content: string, documentType: string): Promise<{
    suggestions: string[];
    clarity: number;
    completeness: number;
    professionalism: number;
  }> {
    try {
      const prompt = `
      Analyze the following ${documentType} document content and provide improvement suggestions:
      
      Content: "${content}"
      
      Evaluate the document on:
      1. Clarity (0-100): How clear and understandable is the content?
      2. Completeness (0-100): How complete and comprehensive is the information?
      3. Professionalism (0-100): How professional and appropriate is the tone?
      
      Provide specific, actionable suggestions for improvement.
      
      Return JSON with this structure:
      {
        "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
        "clarity": 85,
        "completeness": 75,
        "professionalism": 90
      }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant specialized in analyzing and improving business document content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{"suggestions": [], "clarity": 0, "completeness": 0, "professionalism": 0}');
      return result;
    } catch (error) {
      console.error("Error analyzing document content:", error);
      return {
        suggestions: [],
        clarity: 0,
        completeness: 0,
        professionalism: 0
      };
    }
  }
}