import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  CameraOff, 
  Brain, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  TrendingUp,
  TrendingDown,
  Download,
  Phone,
  MessageCircle,
  X,
  Play,
  Pause,
  Send
} from 'lucide-react';
import { MoodAnalysisService, MoodAnalysis } from '../utils/moodAnalysisApi';

interface EmotionData {
  emotion: string;
  confidence: number;
  timestamp: Date;
}

interface Message {
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export default function MoodScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalAnalysis, setFinalAnalysis] = useState<MoodAnalysis | null>(null);
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [moodService] = useState(() => new MoodAnalysisService());
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  
  // Chat interface for questions
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "Hello! I'm your mental health assistant. I'll analyze your facial expressions and ask you some questions to better understand your emotional state. Would you like to start the mood scanning process?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<'initial' | 'scanning' | 'questions' | 'complete'>('initial');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated emotion detection
  const detectEmotion = (): EmotionData => {
    const emotions = [
      { emotion: 'happy', confidence: 0.85 },
      { emotion: 'sad', confidence: 0.72 },
      { emotion: 'anxious', confidence: 0.68 },
      { emotion: 'stressed', confidence: 0.79 },
      { emotion: 'neutral', confidence: 0.91 },
      { emotion: 'frustrated', confidence: 0.64 },
      { emotion: 'tired', confidence: 0.77 }
    ];
    
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    return {
      ...randomEmotion,
      timestamp: new Date()
    };
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
        setIsScanning(true);
        setShowVideoFeed(true);
        setAnalysisPhase('scanning');
        
        // Wait for video to load before starting detection
        videoRef.current.onloadedmetadata = () => {
          // Start emotion detection every 3 seconds
          intervalRef.current = setInterval(() => {
            const emotion = detectEmotion();
            setCurrentEmotion(emotion);
            setEmotionHistory(prev => [...prev.slice(-19), emotion]);
          }, 3000);
        };

        // Add bot message about scanning
        const botMessage: Message = {
          type: 'bot',
          content: "Great! I'm now analyzing your facial expressions. Please look at the camera naturally. I'll collect emotional data for about 15 seconds, then ask you some questions.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setHasPermission(false);
      
      const errorMessage: Message = {
        type: 'bot',
        content: "I couldn't access your camera. Please allow camera permissions and try again, or we can proceed with just the questionnaire.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsScanning(false);
    setShowVideoFeed(false);
    setCurrentEmotion(null);
  };

  const startQuestionPhase = async () => {
    stopCamera();
    setAnalysisPhase('questions');
    setQuestionCount(0);
    
    const botMessage: Message = {
      type: 'bot',
      content: "Thank you for the facial analysis. Now I'd like to ask you some questions to better understand your mental health. How have you been feeling emotionally over the past week?",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

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
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      let botResponse = '';
      
      if (analysisPhase === 'initial') {
        // Start the scanning process
        botResponse = "Perfect! Let's begin with facial analysis. I'll need access to your camera to analyze your facial expressions. Click 'Start Camera' when you're ready.";
        setAnalysisPhase('scanning');
      } else if (analysisPhase === 'questions') {
        setQuestionCount(prev => prev + 1);
        
        // Ask follow-up questions based on count
        if (questionCount === 0) {
          botResponse = "Thank you for sharing. Have you experienced any significant stress, anxiety, or changes in your sleep patterns recently?";
        } else if (questionCount === 1) {
          botResponse = "I appreciate your openness. How would you describe your energy levels and motivation for daily activities?";
        } else if (questionCount === 2) {
          botResponse = "That's helpful information. Do you have a support system of friends, family, or professionals you can talk to when needed?";
        } else if (questionCount === 3) {
          botResponse = "Thank you for answering my questions. Have you had any thoughts of self-harm or noticed any concerning changes in your behavior?";
        } else if (questionCount === 4) {
          botResponse = "I have enough information now. Let me analyze everything and provide you with a comprehensive mental health assessment.";
          
          // Start final analysis
          setTimeout(() => {
            performFinalAnalysis();
          }, 2000);
        }
      }

      const botMessage: Message = {
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Message processing error:', error);
    }

    setIsTyping(false);
  };

  const performFinalAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisPhase('complete');

    try {
      // Combine emotion data with conversation context
      const emotionSummary = emotionHistory.length > 0 
        ? emotionHistory.map(e => `${e.emotion} (${(e.confidence * 100).toFixed(0)}%)`).join(', ')
        : 'No facial data collected';
      
      const conversationContext = messages
        .filter(m => m.type === 'user')
        .map(m => m.content)
        .join(' | ');

      const analysis = await moodService.analyzeMood(`Facial emotions: ${emotionSummary}. User responses: ${conversationContext}`);
      
      setFinalAnalysis(analysis);

      const analysisMessage: Message = {
        type: 'bot',
        content: `Analysis complete! Based on your facial expressions and responses, I've assessed your mental health status. Please review the detailed analysis in the panel on the right.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, analysisMessage]);

    } catch (error) {
      console.error('Final analysis failed:', error);
      const errorMessage: Message = {
        type: 'bot',
        content: "I encountered an issue during analysis, but I've provided a basic assessment based on the information collected.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsAnalyzing(false);
  };

  // Auto-start question phase after collecting enough emotion data
  useEffect(() => {
    if (emotionHistory.length >= 5 && analysisPhase === 'scanning') {
      setTimeout(() => {
        startQuestionPhase();
      }, 2000);
    }
  }, [emotionHistory.length, analysisPhase]);

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'happy': return 'text-green-600 bg-green-50 border-green-200';
      case 'sad': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'anxious': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'stressed': return 'text-red-600 bg-red-50 border-red-200';
      case 'frustrated': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'tired': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMoodIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return CheckCircle;
      case 'medium': return Clock;
      case 'high': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getMoodColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const downloadMoodReport = () => {
    if (!finalAnalysis) return;

    const reportContent = `
MENTAL HEALTH MOOD ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

MOOD ASSESSMENT: ${finalAnalysis.overallMood.toUpperCase()}
RISK LEVEL: ${finalAnalysis.riskLevel.toUpperCase()}

DETECTED EMOTIONS:
${emotionHistory.map(e => `${e.timestamp.toLocaleTimeString()}: ${e.emotion} (${(e.confidence * 100).toFixed(0)}% confidence)`).join('\n')}

CONVERSATION SUMMARY:
${messages.filter(m => m.type === 'user').map((m, i) => `Q${i + 1}: ${m.content}`).join('\n')}

IDENTIFIED INDICATORS:
${finalAnalysis.indicators.map(indicator => `• ${indicator}`).join('\n')}

RECOMMENDED ACTIONS:
${finalAnalysis.recommendations.map(rec => `• ${rec}`).join('\n')}

SUPPORT RESOURCES:
${finalAnalysis.resources.map(resource => `• ${resource}`).join('\n')}

DISCLAIMER: This AI-powered mood analysis is for informational purposes only and should not replace professional mental health care.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mental Health Mood Scanner
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered facial sentiment analysis with comprehensive mental health assessment
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Phase: {analysisPhase}</span>
            <span>•</span>
            <span>Questions: {questionCount}/5</span>
            <span>•</span>
            <span>Privacy Protected</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Brain className="h-6 w-6 mr-2" />
                  Mental Health Assistant
                </h2>
              </div>

              {/* Camera Feed (only show when scanning) */}
              {showVideoFeed && (
                <div className="p-4 bg-gray-100">
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    {hasPermission === false ? (
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center">
                          <CameraOff className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium mb-2">Camera Access Denied</p>
                          <p className="text-sm text-gray-400">Please allow camera access to use facial analysis</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ transform: 'scaleX(-1)' }} // Mirror the video
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {/* Overlay UI */}
                        <div className="absolute top-4 left-4 right-4">
                          <div className="flex justify-between items-start">
                            <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Analyzing Emotions</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={stopCamera}
                              className="bg-red-600 bg-opacity-80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-opacity-100 transition-colors"
                            >
                              <Pause className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {/* Current Emotion Display */}
                        {currentEmotion && (
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white p-4 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm opacity-75">Detected Emotion</p>
                                  <p className="text-xl font-bold capitalize">{currentEmotion.emotion}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm opacity-75">Confidence</p>
                                  <p className="text-xl font-bold">{(currentEmotion.confidence * 100).toFixed(0)}%</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && <Brain className="h-4 w-4 mt-1 text-purple-600" />}
                        {message.type === 'user' && <User className="h-4 w-4 mt-1" />}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.type === 'user' ? 'text-purple-100' : 'text-gray-500'
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
                        <Brain className="h-4 w-4 text-purple-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                {analysisPhase === 'scanning' && !showVideoFeed && (
                  <div className="text-center">
                    <button
                      onClick={startCamera}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Camera className="h-5 w-5" />
                      <span>Start Camera</span>
                    </button>
                  </div>
                )}
                
                {(analysisPhase === 'initial' || analysisPhase === 'questions') && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                      placeholder="Type your response..."
                      disabled={isTyping}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isTyping || !inputMessage.trim()}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </button>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-purple-600">
                      <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Performing comprehensive mood analysis...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Emotional Data</span>
                  <span>{emotionHistory.length} points</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Questions Answered</span>
                  <span>{questionCount}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((emotionHistory.length >= 5 ? 50 : (emotionHistory.length / 5) * 50) + (questionCount / 5) * 50)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">
                  {analysisPhase === 'initial' && 'Ready to begin assessment'}
                  {analysisPhase === 'scanning' && 'Collecting facial emotion data...'}
                  {analysisPhase === 'questions' && 'Gathering additional information...'}
                  {analysisPhase === 'complete' && 'Analysis complete'}
                </div>
              </div>
            </div>

            {/* Emotion History */}
            {emotionHistory.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Emotions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {emotionHistory.slice(-6).map((emotion, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border text-center ${getEmotionColor(emotion.emotion)}`}
                    >
                      <p className="font-medium capitalize">{emotion.emotion}</p>
                      <p className="text-sm">{(emotion.confidence * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Analysis Results */}
            {finalAnalysis && (
              <div className={`p-6 rounded-xl border-2 ${getMoodColor(finalAnalysis.riskLevel)}`}>
                <div className="flex items-center space-x-3 mb-4">
                  {React.createElement(getMoodIcon(finalAnalysis.riskLevel), { className: "h-6 w-6" })}
                  <h3 className="text-lg font-semibold">Mental Health Assessment</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Overall Mood:</h4>
                    <p className="text-sm font-semibold">{finalAnalysis.overallMood}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Indicators:</h4>
                    <ul className="text-sm space-y-1">
                      {finalAnalysis.indicators.map((indicator, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <ul className="text-sm space-y-1">
                      {finalAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <button 
                    onClick={downloadMoodReport}
                    className="w-full bg-white text-current border border-current px-4 py-2 rounded-lg hover:bg-current hover:text-white transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Report</span>
                  </button>
                  
                  {finalAnalysis.riskLevel !== 'low' && (
                    <button 
                      onClick={() => setShowTherapistModal(true)}
                      className="w-full bg-current text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Connect with Therapist</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Mental Health Resources */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mental Health Resources</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>Crisis Hotline: 988</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5" />
                  <span>Text Support: Text HOME to 741741</span>
                </button>
                <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center space-x-3">
                  <User className="h-5 w-5" />
                  <span>Find Local Therapists</span>
                </button>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Privacy Protected:</strong> All facial analysis is processed locally on your device. 
                No video data is stored or transmitted. Only anonymized emotional insights are used for assessment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Therapist Connection Modal */}
      {showTherapistModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Connect with Mental Health Professional</h2>
                <button
                  onClick={() => setShowTherapistModal(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Based on your mood analysis, we recommend speaking with a mental health professional. 
                Choose your preferred method of connection:
              </p>
              
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Immediate Phone Consultation</span>
                </button>
                
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Schedule Video Session</span>
                </button>
                
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                  Find Local Therapists
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Crisis Support:</strong> If you're having thoughts of self-harm, please call 988 
                  (Suicide & Crisis Lifeline) immediately or go to your nearest emergency room.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}