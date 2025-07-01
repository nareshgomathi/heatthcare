import { Mistral } from '@mistralai/mistralai';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SymptomAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  possibleConditions: string[];
  recommendedActions: string[];
  urgency: string;
  followUpQuestions?: string[];
}

export class MixtralService {
  private client: Mistral;
  private conversationHistory: ChatMessage[] = [];
  private questionCount = 0;
  private maxQuestions = 3;

  constructor() {
    if (!apiKey) {
      throw new Error('Mistral API key is not configured. Please add VITE_MISTRAL_API_KEY to your environment variables.');
    }

    this.client = new Mistral({ apiKey });
    
    this.conversationHistory = [{
      role: 'system',
      content: `You are a medical AI assistant specialized in symptom analysis. Your role is to:

1. Ask up to 3 intelligent follow-up questions to better understand the patient's condition
2. Provide preliminary medical guidance based on symptoms
3. Assess risk levels (low/medium/high) 
4. Suggest appropriate next steps

Guidelines:
- Ask specific, relevant follow-up questions about duration, severity, associated symptoms, triggers, etc.
- Be empathetic and professional
- Always recommend consulting healthcare professionals for serious concerns
- Provide clear risk assessments
- Give actionable advice

Format your final assessment as JSON when you have enough information:
{
  "riskLevel": "low|medium|high",
  "possibleConditions": ["condition1", "condition2"],
  "recommendedActions": ["action1", "action2"],
  "urgency": "description of urgency",
  "summary": "brief summary of the assessment"
}`
    }];
  }

  async sendMessage(userMessage: string): Promise<{
    response: string;
    isFollowUpQuestion: boolean;
    analysis?: SymptomAnalysis;
  }> {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      const chatResponse = await this.client.chat.complete({
        model: 'mistral-large-latest',
        messages: this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        maxTokens: 500,
        temperature: 0.7
      });

      const assistantMessage = chatResponse.choices[0].message.content || '';

      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      this.questionCount++;

      // Check if this is a follow-up question or final assessment
      const isFollowUpQuestion = this.questionCount < this.maxQuestions && 
                                !assistantMessage.includes('{') && 
                                assistantMessage.includes('?');

      let analysis: SymptomAnalysis | undefined;

      // Try to parse JSON assessment if present
      if (assistantMessage.includes('{')) {
        try {
          const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedAnalysis = JSON.parse(jsonMatch[0]);
            analysis = {
              riskLevel: parsedAnalysis.riskLevel || 'low',
              possibleConditions: parsedAnalysis.possibleConditions || [],
              recommendedActions: parsedAnalysis.recommendedActions || [],
              urgency: parsedAnalysis.urgency || 'Monitor symptoms'
            };
          }
        } catch (e) {
          console.error('Failed to parse analysis JSON:', e);
        }
      }

      // If we've reached max questions, request final assessment
      if (this.questionCount >= this.maxQuestions && !analysis) {
        return this.getFinalAssessment();
      }

      return {
        response: assistantMessage,
        isFollowUpQuestion,
        analysis
      };

    } catch (error) {
      console.error('Mistral API error:', error);
      return {
        response: error instanceof Error && error.message.includes('API key') 
          ? "Please configure your Mistral API key to use the symptom checker feature."
          : "I'm having trouble connecting to the medical analysis service. Please try again or consult with a healthcare professional directly.",
        isFollowUpQuestion: false
      };
    }
  }

  private async getFinalAssessment(): Promise<{
    response: string;
    isFollowUpQuestion: boolean;
    analysis?: SymptomAnalysis;
  }> {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: 'Please provide your final medical assessment based on all the information I\'ve shared, formatted as JSON.'
      });

      const chatResponse = await this.client.chat.complete({
        model: 'mistral-large-latest',
        messages: this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        maxTokens: 600,
        temperature: 0.5
      });

      const assistantMessage = chatResponse.choices[0].message.content || '';

      let analysis: SymptomAnalysis = {
        riskLevel: 'low',
        possibleConditions: ['General discomfort'],
        recommendedActions: ['Monitor symptoms', 'Rest and hydration'],
        urgency: 'No immediate action required'
      };

      // Parse JSON assessment
      try {
        const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedAnalysis = JSON.parse(jsonMatch[0]);
          analysis = {
            riskLevel: parsedAnalysis.riskLevel || 'low',
            possibleConditions: parsedAnalysis.possibleConditions || ['General discomfort'],
            recommendedActions: parsedAnalysis.recommendedActions || ['Monitor symptoms'],
            urgency: parsedAnalysis.urgency || 'No immediate action required'
          };
        }
      } catch (e) {
        console.error('Failed to parse final assessment:', e);
      }

      return {
        response: assistantMessage.replace(/\{[\s\S]*\}/, '').trim() || 
                 "Based on your symptoms, I've completed my assessment. Please review the analysis below.",
        isFollowUpQuestion: false,
        analysis
      };

    } catch (error) {
      console.error('Final assessment error:', error);
      return {
        response: "I've completed my assessment based on the information provided.",
        isFollowUpQuestion: false,
        analysis: {
          riskLevel: 'medium',
          possibleConditions: ['Unable to determine'],
          recommendedActions: ['Consult healthcare professional'],
          urgency: 'Seek medical advice for proper diagnosis'
        }
      };
    }
  }

  reset() {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Keep only system message
    this.questionCount = 0;
  }
}