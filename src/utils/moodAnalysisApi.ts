import { Mistral } from '@mistralai/mistralai';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

export interface MoodAnalysis {
  overallMood: string;
  riskLevel: 'low' | 'medium' | 'high';
  indicators: string[];
  recommendations: string[];
  resources: string[];
  confidence: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class MoodAnalysisService {
  private client: Mistral;
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    if (!apiKey) {
      console.warn('Mistral API key not configured. Using mock responses.');
      this.client = null as any;
    } else {
      this.client = new Mistral({ apiKey });
    }
    
    this.conversationHistory = [{
      role: 'system',
      content: `You are a specialized mental health AI assistant trained in mood analysis and emotional assessment. Your role is to:

1. Analyze facial emotion data collected over time
2. Identify patterns that may indicate mental health concerns
3. Assess risk levels for depression, anxiety, stress, and other conditions
4. Provide appropriate recommendations and resources
5. Determine when professional intervention may be needed

Guidelines:
- Be empathetic and supportive in your analysis
- Focus on observable patterns rather than single emotions
- Consider frequency, intensity, and duration of emotional states
- Provide actionable recommendations
- Always emphasize that this is a screening tool, not a diagnosis
- Recommend professional help when appropriate

When analyzing mood data, provide your assessment in this JSON format:
{
  "overallMood": "description of overall emotional state",
  "riskLevel": "low|medium|high",
  "indicators": ["key emotional patterns observed"],
  "recommendations": ["specific actionable advice"],
  "resources": ["relevant support resources"],
  "confidence": 0.85
}

Risk Level Guidelines:
- Low: Generally positive emotions, occasional negative emotions within normal range
- Medium: Persistent negative emotions, stress indicators, mild anxiety/depression signs
- High: Severe negative emotions, signs of depression/anxiety, concerning patterns`
    }];
  }

  async analyzeMood(emotionData: string): Promise<MoodAnalysis> {
    // Mock response if no API key
    if (!this.client) {
      return this.getMockAnalysis(emotionData);
    }

    try {
      this.conversationHistory.push({
        role: 'user',
        content: `Please analyze this emotional data collected over the past few minutes from facial sentiment analysis: ${emotionData}

Please provide a comprehensive mental health mood assessment based on these detected emotions and their patterns.`
      });

      const chatResponse = await this.client.chat.complete({
        model: 'mistral-large-latest',
        messages: this.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        maxTokens: 800,
        temperature: 0.3
      });

      const assistantMessage = chatResponse.choices[0].message.content || '';

      // Parse JSON response
      try {
        const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          return {
            overallMood: analysis.overallMood || 'Unable to determine',
            riskLevel: analysis.riskLevel || 'medium',
            indicators: analysis.indicators || ['Insufficient data for analysis'],
            recommendations: analysis.recommendations || ['Continue monitoring mood patterns'],
            resources: analysis.resources || ['Speak with a healthcare professional'],
            confidence: analysis.confidence || 0.7
          };
        }
      } catch (e) {
        console.error('Failed to parse mood analysis JSON:', e);
      }

      // Fallback analysis
      return this.getMockAnalysis(emotionData);

    } catch (error) {
      console.error('Mood analysis API error:', error);
      return this.getMockAnalysis(emotionData);
    }
  }

  private getMockAnalysis(emotionData: string): MoodAnalysis {
    // Analyze emotion patterns for mock response
    const emotions = emotionData.toLowerCase();
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let overallMood = 'Stable';
    let indicators: string[] = [];
    let recommendations: string[] = [];
    
    // Determine risk level based on emotion patterns
    if (emotions.includes('sad') || emotions.includes('anxious') || emotions.includes('stressed')) {
      const negativeCount = (emotions.match(/sad|anxious|stressed|frustrated|tired/g) || []).length;
      const positiveCount = (emotions.match(/happy|neutral/g) || []).length;
      
      if (negativeCount > positiveCount * 1.5) {
        riskLevel = 'high';
        overallMood = 'Concerning emotional patterns detected';
        indicators = [
          'Persistent negative emotional states',
          'Limited positive emotional expression',
          'Possible signs of depression or anxiety'
        ];
        recommendations = [
          'Consider speaking with a mental health professional',
          'Practice stress reduction techniques',
          'Maintain regular sleep and exercise routines',
          'Connect with supportive friends and family'
        ];
      } else if (negativeCount > positiveCount) {
        riskLevel = 'medium';
        overallMood = 'Mild emotional distress detected';
        indicators = [
          'Some negative emotional patterns',
          'Stress indicators present',
          'Emotional balance could be improved'
        ];
        recommendations = [
          'Monitor mood patterns over time',
          'Practice mindfulness and relaxation techniques',
          'Ensure adequate sleep and nutrition',
          'Consider talking to someone you trust'
        ];
      }
    } else if (emotions.includes('happy') || emotions.includes('neutral')) {
      overallMood = 'Generally positive emotional state';
      indicators = [
        'Predominantly positive or neutral emotions',
        'Good emotional regulation',
        'Healthy emotional patterns'
      ];
      recommendations = [
        'Continue current wellness practices',
        'Maintain healthy lifestyle habits',
        'Stay connected with support network',
        'Regular self-care and stress management'
      ];
    }

    const resources = [
      'National Suicide Prevention Lifeline: 988',
      'Crisis Text Line: Text HOME to 741741',
      'Psychology Today therapist finder',
      'Mindfulness and meditation apps',
      'Employee Assistance Programs (if available)'
    ];

    return {
      overallMood,
      riskLevel,
      indicators,
      recommendations,
      resources,
      confidence: 0.75
    };
  }

  reset() {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Keep only system message
  }
}