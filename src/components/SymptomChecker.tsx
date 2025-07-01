import React, { useState } from 'react';
import { Send, Bot, User, AlertTriangle, CheckCircle, Clock, FileText, RotateCcw, Download, Camera, Upload, X, Eye } from 'lucide-react';
import { MixtralService, SymptomAnalysis } from '../utils/mixtralApi';
import PhotoAnalysis from './PhotoAnalysis';

interface Message {
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export default function SymptomChecker() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "Hello! I'm your AI health assistant powered by advanced medical AI. I'll ask you a few specific questions to better understand your symptoms and provide personalized guidance. Please describe how you're feeling today, or upload a photo for visual analysis.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [mixtralService] = useState(() => new MixtralService());
  const [questionCount, setQuestionCount] = useState(0);
  const [showPhotoAnalysis, setShowPhotoAnalysis] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const result = await mixtralService.sendMessage(inputMessage);
      
      const botMessage: Message = {
        type: 'bot',
        content: result.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (result.analysis) {
        setAnalysis(result.analysis);
      }

      if (result.isFollowUpQuestion) {
        setQuestionCount(prev => prev + 1);
      }

    } catch (error) {
      const errorMessage: Message = {
        type: 'bot',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again or consult with a healthcare professional directly.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const handleReset = () => {
    setMessages([{
      type: 'bot',
      content: "Hello! I'm your AI health assistant. I'll ask you a few specific questions to better understand your symptoms. Please describe how you're feeling today, or upload a photo for visual analysis.",
      timestamp: new Date()
    }]);
    setAnalysis(null);
    setQuestionCount(0);
    mixtralService.reset();
  };

  const handlePhotoAnalysisComplete = (result: any) => {
    const botMessage: Message = {
      type: 'bot',
      content: `Photo Analysis Complete!\n\n${result.diagnosis}\n\nRecommended Treatment: ${result.treatment}\n\nEstimated Recovery: ${result.recoveryTime}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setShowPhotoAnalysis(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return CheckCircle;
      case 'medium': return Clock;
      case 'high': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const generateReport = () => {
    if (!analysis) return;

    const reportContent = `
SYMPTOM ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

RISK LEVEL: ${analysis.riskLevel.toUpperCase()}

POSSIBLE CONDITIONS:
${analysis.possibleConditions.map(condition => `• ${condition}`).join('\n')}

RECOMMENDED ACTIONS:
${analysis.recommendedActions.map(action => `• ${action}`).join('\n')}

URGENCY: ${analysis.urgency}

CONVERSATION SUMMARY:
${messages.filter(m => m.type === 'user').map((m, i) => `Q${i + 1}: ${m.content}`).join('\n')}

DISCLAIMER: This assessment is for informational purposes only and should not replace professional medical advice.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symptom-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Symptom Checker
          </h1>
          <p className="text-xl text-gray-600">
            Advanced medical AI with photo analysis for accurate assessment
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Questions Asked: {questionCount}/3</span>
            <span>•</span>
            <span>Powered by Mixtral AI</span>
            <span>•</span>
            <span>Photo Analysis Available</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Bot className="h-6 w-6 mr-2" />
                    Medical AI Assistant
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowPhotoAnalysis(true)}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      title="Upload Photo for Analysis"
                    >
                      <Camera className="h-4 w-4" />
                      <span className="text-sm">Photo Analysis</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
                      title="Reset Conversation"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && <Bot className="h-4 w-4 mt-1 text-blue-600" />}
                        {message.type === 'user' && <User className="h-4 w-4 mt-1" />}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">AI is analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                    placeholder="Describe your symptoms in detail..."
                    disabled={isTyping}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* AI Analysis */}
            {analysis && (
              <div className={`p-6 rounded-xl border-2 ${getRiskColor(analysis.riskLevel)}`}>
                <div className="flex items-center space-x-3 mb-4">
                  {React.createElement(getRiskIcon(analysis.riskLevel), { className: "h-6 w-6" })}
                  <h3 className="text-lg font-semibold capitalize">{analysis.riskLevel} Risk Level</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Possible Conditions:</h4>
                    <ul className="text-sm space-y-1">
                      {analysis.possibleConditions.map((condition, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Recommended Actions:</h4>
                    <ul className="text-sm space-y-1">
                      {analysis.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t border-current border-opacity-20">
                    <p className="text-sm font-medium">{analysis.urgency}</p>
                  </div>
                </div>
                
                <button 
                  onClick={generateReport}
                  className="w-full mt-4 bg-white text-current border border-current px-4 py-2 rounded-lg hover:bg-current hover:text-white transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </button>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Questions Asked</span>
                  <span>{questionCount}/3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(questionCount / 3) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">
                  {questionCount < 3 ? 
                    `${3 - questionCount} more questions for complete analysis` :
                    'Analysis complete'
                  }
                </div>
              </div>
            </div>

            {/* Photo Analysis Feature */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl shadow-lg text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Photo Analysis
              </h3>
              <p className="text-sm mb-4 text-purple-100">
                Upload a photo of skin conditions, wounds, or rashes for instant AI-powered visual analysis
              </p>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Skin condition detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Treatment recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Recovery time estimation</span>
                </div>
              </div>
              <button 
                onClick={() => setShowPhotoAnalysis(true)}
                className="w-full bg-white text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Photo</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-3">
                  <FileText className="h-5 w-5" />
                  <span>Find Specialists</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center space-x-3">
                  <User className="h-5 w-5" />
                  <span>Book Consultation</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center space-x-3">
                  <Bot className="h-5 w-5" />
                  <span>Health Monitoring</span>
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Medical Disclaimer:</strong> This AI assessment provides general information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Analysis Modal */}
      <PhotoAnalysis
        isOpen={showPhotoAnalysis}
        onClose={() => setShowPhotoAnalysis(false)}
        onAnalysisComplete={handlePhotoAnalysisComplete}
      />
    </div>
  );
}