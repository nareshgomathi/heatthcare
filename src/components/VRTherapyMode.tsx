import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Settings, 
  Eye, 
  Maximize,
  Target,
  Trophy,
  Star
} from 'lucide-react';

interface VRTherapyModeProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    name: string;
    description: string;
    duration: number;
    reps: number;
  };
}

export default function VRTherapyMode({ isOpen, onClose, exercise }: VRTherapyModeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(5); // Set to 5 seconds
  const [completedReps, setCompletedReps] = useState(0);
  const [currentEnvironment, setCurrentEnvironment] = useState('beach');
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [vrScore, setVrScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const vrContainerRef = useRef<HTMLDivElement>(null);

  const environments = [
    {
      id: 'beach',
      name: 'Tropical Beach',
      description: 'Calm ocean waves and palm trees',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      ambientColor: '#4FC3F7'
    },
    {
      id: 'forest',
      name: 'Peaceful Forest',
      description: 'Sunlight filtering through trees',
      background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
      ambientColor: '#66BB6A'
    },
    {
      id: 'mountain',
      name: 'Mountain Peak',
      description: 'Breathtaking mountain views',
      background: 'linear-gradient(135deg, #E3F2FD 0%, #1976D2 100%)',
      ambientColor: '#42A5F5'
    },
    {
      id: 'space',
      name: 'Space Station',
      description: 'Floating among the stars',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      ambientColor: '#7C4DFF'
    }
  ];

  const currentEnv = environments.find(env => env.id === currentEnvironment) || environments[0];

  // Timer effect - always use 5 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            if (completedReps < exercise.reps - 1) {
              setCompletedReps(prev => prev + 1);
              return 5; // Always reset to 5 seconds
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer, completedReps, exercise.reps]);

  // VR scoring simulation
  useEffect(() => {
    if (isPlaying) {
      const scoreInterval = setInterval(() => {
        setVrScore(prev => prev + Math.floor(Math.random() * 10) + 5);
        setAccuracy(prev => Math.max(85, Math.min(100, prev + (Math.random() * 6 - 3))));
      }, 2000);
      return () => clearInterval(scoreInterval);
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setTimer(5); // Always reset to 5 seconds
    setCompletedReps(0);
    setIsPlaying(false);
    setVrScore(0);
    setAccuracy(100);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && vrContainerRef.current) {
      vrContainerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div 
        ref={vrContainerRef}
        className="relative w-full h-full overflow-hidden"
        style={{ background: currentEnv.background }}
      >
        {/* VR Environment */}
        <div className="absolute inset-0">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            {currentEnvironment === 'beach' && (
              <>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-200 to-transparent"></div>
                <div className="absolute top-1/4 left-1/4 w-16 h-32 bg-green-600 rounded-full transform rotate-12 opacity-60"></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-24 bg-green-600 rounded-full transform -rotate-12 opacity-60"></div>
              </>
            )}
            {currentEnvironment === 'forest' && (
              <>
                <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-green-800 to-transparent"></div>
                <div className="absolute top-0 left-1/6 w-8 h-full bg-green-900 opacity-40"></div>
                <div className="absolute top-0 left-1/3 w-12 h-full bg-green-900 opacity-30"></div>
                <div className="absolute top-0 right-1/4 w-10 h-full bg-green-900 opacity-35"></div>
              </>
            )}
            {currentEnvironment === 'mountain' && (
              <>
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-600 to-transparent"></div>
                <div className="absolute bottom-0 left-1/4 w-32 h-64 bg-gray-700 transform skew-x-12 opacity-60"></div>
                <div className="absolute bottom-0 right-1/3 w-40 h-72 bg-gray-800 transform -skew-x-6 opacity-50"></div>
              </>
            )}
            {currentEnvironment === 'space' && (
              <>
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`
                    }}
                  ></div>
                ))}
              </>
            )}
          </div>

          {/* VR Exercise Guide */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* 3D Exercise Avatar */}
              <div 
                className="w-64 h-64 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white text-6xl font-bold animate-pulse"
                style={{ backgroundColor: currentEnv.ambientColor }}
              >
                {isPlaying ? (
                  <div className="animate-bounce">
                    <Target className="h-24 w-24" />
                  </div>
                ) : (
                  <Play className="h-24 w-24" />
                )}
              </div>

              {/* Exercise Instructions */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center text-white">
                <h3 className="text-2xl font-bold mb-2">{exercise.name}</h3>
                <p className="text-lg opacity-90">{exercise.description}</p>
              </div>

              {/* Progress Ring */}
              <div className="absolute -inset-8">
                <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${(completedReps / exercise.reps) * 283} 283`}
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute top-8 left-8 space-y-4">
            {/* Timer */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-6 py-4 rounded-xl">
              <div className="text-3xl font-bold">{timer}s</div>
              <div className="text-sm opacity-75">Time Remaining</div>
            </div>

            {/* Reps Counter */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-6 py-4 rounded-xl">
              <div className="text-3xl font-bold">{completedReps}/{exercise.reps}</div>
              <div className="text-sm opacity-75">Repetitions</div>
            </div>

            {/* VR Score */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-6 py-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-xl font-bold">{vrScore}</span>
              </div>
              <div className="text-sm opacity-75">VR Score</div>
            </div>

            {/* Accuracy */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-6 py-4 rounded-xl">
              <div className="text-xl font-bold">{accuracy.toFixed(1)}%</div>
              <div className="text-sm opacity-75">Form Accuracy</div>
            </div>
          </div>

          {/* Top Controls */}
          <div className="absolute top-8 right-8 flex items-center space-x-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-black bg-opacity-50 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-opacity-70 transition-colors"
            >
              <Settings className="h-6 w-6" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="bg-black bg-opacity-50 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-opacity-70 transition-colors"
            >
              <Maximize className="h-6 w-6" />
            </button>

            <button
              onClick={onClose}
              className="bg-red-600 bg-opacity-80 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-opacity-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
            <button
              onClick={handleReset}
              className="bg-black bg-opacity-50 backdrop-blur-sm text-white p-4 rounded-xl hover:bg-opacity-70 transition-colors"
            >
              <RotateCcw className="h-6 w-6" />
            </button>

            <button
              onClick={handlePlayPause}
              className={`p-6 rounded-xl text-white font-semibold transition-colors ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="bg-black bg-opacity-50 backdrop-blur-sm text-white p-4 rounded-xl hover:bg-opacity-70 transition-colors"
            >
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="absolute top-20 right-8 bg-black bg-opacity-80 backdrop-blur-sm text-white p-6 rounded-xl w-80">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                VR Environment
              </h3>
              
              <div className="space-y-3">
                {environments.map((env) => (
                  <button
                    key={env.id}
                    onClick={() => setCurrentEnvironment(env.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentEnvironment === env.id
                        ? 'bg-blue-600'
                        : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                    }`}
                  >
                    <div className="font-medium">{env.name}</div>
                    <div className="text-sm opacity-75">{env.description}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white border-opacity-20">
                <h4 className="font-medium mb-3">VR Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Motion Tracking</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Haptic Feedback</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Voice Guidance</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Achievement Notifications */}
          {completedReps > 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-xl animate-bounce">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6" />
                  <span>Rep {completedReps} Complete!</span>
                </div>
              </div>
            </div>
          )}

          {/* Immersive Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {isPlaying && [...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-ping"
                style={{
                  backgroundColor: currentEnv.ambientColor,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}