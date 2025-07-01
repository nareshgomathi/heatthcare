import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Trophy, Target, Clock, Gamepad2, Camera, Award, TrendingUp } from 'lucide-react';
import VRTherapyMode from './VRTherapyMode';

export default function PhysicalTherapy() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(5);
  const [completedReps, setCompletedReps] = useState(0);
  const [isVRMode, setIsVRMode] = useState(false);

  const exercises = [
    {
      id: 1,
      name: 'Arm Raises',
      description: 'Lift your arms up and down slowly',
      duration: 5,
      reps: 10,
      difficulty: 'Beginner',
      muscleGroup: 'Shoulders',
      points: 50,
      image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Knee Bends',
      description: 'Slowly bend and straighten your knee',
      duration: 5,
      reps: 15,
      difficulty: 'Intermediate',
      muscleGroup: 'Legs',
      points: 75,
      image: 'https://images.pexels.com/photos/866023/pexels-photo-866023.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Neck Rotations',
      description: 'Gently rotate your neck in circles',
      duration: 5,
      reps: 8,
      difficulty: 'Beginner',
      muscleGroup: 'Neck',
      points: 30,
      image: 'https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    }
  ];

  const achievements = [
    { name: 'First Session', icon: Award, earned: true, points: 100 },
    { name: 'Week Warrior', icon: Trophy, earned: true, points: 250 },
    { name: 'Perfect Form', icon: Target, earned: false, points: 500 },
    { name: 'Consistency King', icon: TrendingUp, earned: false, points: 1000 }
  ];

  const currentEx = exercises[currentExercise];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setTimer(currentEx.duration);
    setCompletedReps(0);
    setIsPlaying(false);
  };

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setTimer(exercises[currentExercise + 1].duration);
      setCompletedReps(0);
      setIsPlaying(false);
    }
  };

  const handleLaunchVR = () => {
    setIsVRMode(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const progressPercentage = ((currentEx.reps - (timer / (currentEx.duration / currentEx.reps))) / currentEx.reps) * 100;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              VR/AR Physical Therapy
            </h1>
            <p className="text-xl text-gray-600">
              Gamified rehabilitation that makes recovery engaging and effective
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Exercise Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={currentEx.image}
                    alt={currentEx.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="text-3xl font-bold mb-2">{currentEx.name}</h2>
                      <p className="text-lg">{currentEx.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentEx.difficulty)}`}>
                        {currentEx.difficulty}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {currentEx.muscleGroup}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <Trophy className="h-5 w-5" />
                      <span className="font-semibold">{currentEx.points} pts</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(0, progressPercentage)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Timer and Reps */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{timer}s</div>
                      <div className="text-sm text-gray-600">Time Remaining</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{completedReps}/{currentEx.reps}</div>
                      <div className="text-sm text-gray-600">Repetitions</div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
                        isPlaying
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      <span>{isPlaying ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <RotateCcw className="h-5 w-5" />
                      <span>Reset</span>
                    </button>
                    <button
                      onClick={handleNextExercise}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={currentExercise >= exercises.length - 1}
                    >
                      Next Exercise
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Feedback */}
              <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  AI Pose Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Good Form</h4>
                    <p className="text-sm text-green-700">
                      Your arm positioning is excellent. Keep maintaining this angle for optimal results.
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Improvement Tip</h4>
                    <p className="text-sm text-yellow-700">
                      Try to slow down the movement slightly for better muscle engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Exercise List */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Program</h3>
                <div className="space-y-3">
                  {exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        index === currentExercise
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setCurrentExercise(index);
                        setTimer(exercise.duration);
                        setCompletedReps(0);
                        setIsPlaying(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                          <p className="text-sm text-gray-600">{exercise.reps} reps • {exercise.duration}s</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-yellow-600">{exercise.points} pts</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        achievement.earned
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <achievement.icon className={`h-6 w-6 ${
                          achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                        }`} />
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                          }`}>
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-gray-600">{achievement.points} points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VR Mode */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  VR Experience
                </h3>
                <p className="text-sm mb-4 text-purple-100">
                  Immerse yourself in virtual environments while performing exercises with real-time motion tracking and feedback
                </p>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>360° Virtual Environments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Real-time Form Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Gamified Scoring System</span>
                  </div>
                </div>
                <button 
                  onClick={handleLaunchVR}
                  className="w-full bg-white text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <Gamepad2 className="h-5 w-5" />
                  <span>Launch VR Mode</span>
                </button>
              </div>

              {/* Progress Summary */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sessions Completed</span>
                    <span className="font-semibold">12/14</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Points</span>
                    <span className="font-semibold text-yellow-600">2,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Streak</span>
                    <span className="font-semibold text-green-600">7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VR Mode Component */}
      <VRTherapyMode
        isOpen={isVRMode}
        onClose={() => setIsVRMode(false)}
        exercise={currentEx}
      />
    </>
  );
}