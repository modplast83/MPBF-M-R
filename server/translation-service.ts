import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  context?: string;
}

export interface TranslationResponse {
  translatedText: string;
  confidence: number;
  sourceLanguage: string;
  targetLanguage: string;
}

export class TranslationService {
  
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const { text, fromLanguage, toLanguage, context } = request;
      
      // Create a contextual prompt for business/customer name translation
      const prompt = `You are a professional Arabic-English translator specializing in business and company names. 
      
      Translate the following ${fromLanguage} text to ${toLanguage}:
      "${text}"
      
      ${context ? `Context: ${context}` : ''}
      
      Guidelines:
      - Maintain proper business terminology and formality
      - Keep company names, brand names, and proper nouns intact where appropriate
      - Provide natural, professional translations suitable for business documentation
      - For Arabic to English: Use appropriate transliteration for company names when needed
      - For English to Arabic: Use proper Arabic business terminology
      
      Respond with JSON in this exact format:
      {
        "translatedText": "your translation here",
        "confidence": 0.95,
        "sourceLanguage": "${fromLanguage}",
        "targetLanguage": "${toLanguage}"
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a professional translator specializing in business and company names. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1, // Low temperature for consistent translations
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        translatedText: result.translatedText || text,
        confidence: Math.max(0, Math.min(1, result.confidence || 0.9)),
        sourceLanguage: result.sourceLanguage || fromLanguage,
        targetLanguage: result.targetLanguage || toLanguage
      };
      
    } catch (error) {
      console.error('Translation service error:', error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  async translateCustomerName(name: string, fromLanguage: string, toLanguage: string): Promise<string> {
    try {
      const result = await this.translateText({
        text: name,
        fromLanguage,
        toLanguage,
        context: "Customer/Company name for business management system"
      });
      
      return result.translatedText;
    } catch (error) {
      console.error('Customer name translation error:', error);
      // Return original name if translation fails
      return name;
    }
  }

  async batchTranslateCustomerNames(customers: Array<{ id: string; name: string; nameAr?: string | null }>): Promise<Array<{ id: string; translatedName: string }>> {
    const results = [];
    
    for (const customer of customers) {
      try {
        // Only translate if Arabic name is missing or empty
        if (!customer.nameAr || customer.nameAr.trim() === '') {
          const translatedName = await this.translateCustomerName(
            customer.name, 
            'English', 
            'Arabic'
          );
          
          results.push({
            id: customer.id,
            translatedName
          });
        }
      } catch (error) {
        console.error(`Failed to translate customer ${customer.id}:`, error);
        // Skip this customer if translation fails
      }
    }
    
    return results;
  }
}

export const translationService = new TranslationService();