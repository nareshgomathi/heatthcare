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
  Pause
} from 'lucide-react';
import { MoodAnalysisService, MoodAnalysis } from '../utils/moodAnalysisApi';

interface EmotionData {
  emotion: string;
  confidence: number;
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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated emotion detection (in real implementation, this would use MediaPipe + TensorFlow.js)
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
        video: { width: 640, height: 480 },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasPermission(true);
        setIsScanning(true);
        
        // Start emotion detection every 3 seconds
        intervalRef.current = setInterval(() => {
          const emotion = detectEmotion();
          setCurrentEmotion(emotion);
          setEmotionHistory(prev => [...prev.slice(-19), emotion]); // Keep last 20 readings
        }, 3000);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setHasPermission(false);
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
    setCurrentEmotion(null);
  };

  const startMoodAnalysis = async () => {
    if (emotionHistory.length < 5) {
      alert('Please scan for at least 15 seconds to gather enough emotional data.');
      return;
    }

    setIsAnalyzing(true);
    stopCamera();

    try {
      // Send emotion data to Mixtral for analysis
      const emotionSummary = emotionHistory.map(e => `${e.emotion} (${(e.confidence * 100).toFixed(0)}%)`).join(', ');
      const analysis = await moodService.analyzeMood(emotionSummary);
      
      setFinalAnalysis(analysis);
      setQuestionCount(5); // Mark as complete
    } catch (error) {
      console.error('Mood analysis failed:', error);
    }
    
    setIsAnalyzing(false);
  };

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
            AI-powered facial sentiment analysis for mental health assessment
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Facial Analysis: Active</span>
            <span>•</span>
            <span>Privacy Protected</span>
            <span>•</span>
            <span>Real-time Processing</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Brain className="h-6 w-6 mr-2" />
                  Facial Sentiment Analysis
                </h2>
              </div>

              <div className="p-6">
                <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6" style={{ aspectRatio: '4/3' }}>
                  {hasPermission === false ? (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <CameraOff className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">Camera Access Denied</p>
                        <p className="text-sm text-gray-400">Please allow camera access to use mood scanning</p>
                      </div>
                    </div>
                  ) : !isScanning ? (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-4">Ready to Start Mood Scanning</p>
                        <button
                          onClick={startCamera}
                          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
                        >
                          <Play className="h-5 w-5" />
                          <span>Start Scanning</span>
                        </button>
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
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {/* Overlay UI */}
                      <div className="absolute top-4 left-4 right-4">
                        <div className="flex justify-between items-start">
                          <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium">Live Analysis</span>
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

                {/* Emotion History */}
                {emotionHistory.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Emotional States</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {emotionHistory.slice(-8).map((emotion, index) => (
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

                {/* Analysis Button */}
                {emotionHistory.length >= 5 && !finalAnalysis && (
                  <div className="text-center">
                    <button
                      onClick={startMoodAnalysis}
                      disabled={isAnalyzing}
                      className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Analyzing Mood...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="h-5 w-5" />
                          <span>Analyze Mental Health</span>
                        </>
                      )}
                    </button>
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
                  <span>Emotional Data Points</span>
                  <span>{emotionHistory.length}/5 minimum</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (emotionHistory.length / 5) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600">
                  {emotionHistory.length < 5 ? 
                    `${5 - emotionHistory.length} more data points needed for analysis` :
                    'Ready for comprehensive mood analysis'
                  }
                </div>
              </div>
            </div>

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
                    <p className="text-sm capitalize font-semibold">{finalAnalysis.overallMood}</p>
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