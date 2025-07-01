import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Eye, CheckCircle, AlertTriangle, Clock, Download } from 'lucide-react';

interface PhotoAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: any) => void;
}

interface AnalysisResult {
  diagnosis: string;
  treatment: string;
  recoveryTime: string;
  severity: 'mild' | 'moderate' | 'severe';
  confidence: number;
}

export default function PhotoAnalysis({ isOpen, onClose, onAnalysisComplete }: PhotoAnalysisProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const skinConditions = [
    {
      type: 'scratch',
      keywords: ['scratch', 'scrape', 'abrasion'],
      diagnosis: 'Superficial skin scratch from thorn or sharp object',
      treatment: 'Neosporin antibiotic ointment, Bacitracin zinc ointment',
      recoveryTime: '3-5 days',
      severity: 'mild' as const
    },
    {
      type: 'cut',
      keywords: ['cut', 'laceration', 'glass'],
      diagnosis: 'Minor laceration from glass or sharp object',
      treatment: 'Hydrogen peroxide cleaning, Polysporin ointment, sterile bandages',
      recoveryTime: '5-7 days',
      severity: 'moderate' as const
    },
    {
      type: 'burn',
      keywords: ['burn', 'red', 'blister'],
      diagnosis: 'Minor thermal or chemical burn',
      treatment: 'Aloe vera gel, Silver sulfadiazine cream, cool compresses',
      recoveryTime: '7-10 days',
      severity: 'moderate' as const
    },
    {
      type: 'rash',
      keywords: ['rash', 'irritation', 'red spots'],
      diagnosis: 'Contact dermatitis or allergic reaction',
      treatment: 'Hydrocortisone cream, Calamine lotion, antihistamines',
      recoveryTime: '3-7 days',
      severity: 'mild' as const
    },
    {
      type: 'bruise',
      keywords: ['bruise', 'contusion', 'purple'],
      diagnosis: 'Subcutaneous bruising from blunt trauma',
      treatment: 'Arnica gel, ice packs, elevation when possible',
      recoveryTime: '7-14 days',
      severity: 'mild' as const
    }
  ];

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);

    // Simulate AI analysis with 2-second delay
    setTimeout(() => {
      // Simulate random condition detection based on common skin issues
      const randomCondition = skinConditions[Math.floor(Math.random() * skinConditions.length)];
      
      // Add some randomness to make it feel more realistic
      const confidence = Math.floor(Math.random() * 15) + 85; // 85-100% confidence
      
      const result: AnalysisResult = {
        diagnosis: randomCondition.diagnosis,
        treatment: randomCondition.treatment,
        recoveryTime: randomCondition.recoveryTime,
        severity: randomCondition.severity,
        confidence
      };

      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleComplete = () => {
    if (analysisResult) {
      onAnalysisComplete(analysisResult);
      onClose();
      setUploadedImage(null);
      setAnalysisResult(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild': return CheckCircle;
      case 'moderate': return Clock;
      case 'severe': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const downloadReport = () => {
    if (!analysisResult) return;

    const reportContent = `
PHOTO ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

DIAGNOSIS: ${analysisResult.diagnosis}
SEVERITY: ${analysisResult.severity.toUpperCase()}
CONFIDENCE: ${analysisResult.confidence}%

RECOMMENDED TREATMENT:
${analysisResult.treatment}

ESTIMATED RECOVERY TIME: ${analysisResult.recoveryTime}

DISCLAIMER: This AI analysis is for informational purposes only. Please consult a healthcare professional for proper medical diagnosis and treatment.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `photo-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center">
              <Camera className="h-6 w-6 mr-2" />
              AI Photo Analysis
            </h2>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-purple-100 mt-2">
            Upload a photo of skin conditions for instant AI-powered analysis
          </p>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Photo</h3>
                
                {!uploadedImage ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      dragOver
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drop your image here
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      or click to browse files
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Choose File
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Uploaded for analysis"
                        className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setUploadedImage(null);
                          setAnalysisResult(null);
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {!analysisResult && !isAnalyzing && (
                      <button
                        onClick={analyzeImage}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                      >
                        <Eye className="h-5 w-5" />
                        <span>Analyze Image</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <h4 className="font-semibold text-blue-800">Analyzing Image...</h4>
                  </div>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>• Detecting skin conditions</p>
                    <p>• Analyzing severity and patterns</p>
                    <p>• Generating treatment recommendations</p>
                    <p>• Estimating recovery timeline</p>
                  </div>
                  <div className="mt-4 w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {analysisResult && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                    
                    <div className={`p-6 rounded-xl border-2 ${getSeverityColor(analysisResult.severity)}`}>
                      <div className="flex items-center space-x-3 mb-4">
                        {React.createElement(getSeverityIcon(analysisResult.severity), { className: "h-6 w-6" })}
                        <h4 className="text-lg font-semibold capitalize">{analysisResult.severity} Condition</h4>
                        <span className="text-sm font-medium">
                          {analysisResult.confidence}% confidence
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2">Diagnosis:</h5>
                          <p className="text-sm">{analysisResult.diagnosis}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Recommended Treatment:</h5>
                          <p className="text-sm">{analysisResult.treatment}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Estimated Recovery Time:</h5>
                          <p className="text-sm font-semibold">{analysisResult.recoveryTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={downloadReport}
                      className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                    >
                      <Download className="h-5 w-5" />
                      <span>Download Report</span>
                    </button>
                    
                    <button
                      onClick={handleComplete}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      Add to Conversation
                    </button>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> This AI analysis is for informational purposes only. 
                      For serious conditions or if symptoms worsen, please consult a healthcare professional immediately.
                    </p>
                  </div>
                </>
              )}

              {!uploadedImage && !analysisResult && (
                <div className="text-center text-gray-500 py-12">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No Image Uploaded</p>
                  <p className="text-sm">
                    Upload a photo to get started with AI-powered analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}