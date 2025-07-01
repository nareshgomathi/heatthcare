import React from 'react';
import { Brain, Video, Activity, Gamepad2, ArrowRight, Shield, Clock, Users, Heart } from 'lucide-react';

interface HeroProps {
  onSectionChange: (section: string) => void;
}

export default function Hero({ onSectionChange }: HeroProps) {
  const features = [
    {
      icon: Brain,
      title: 'AI Symptom Checker',
      description: 'Conversational AI that understands your symptoms in natural language',
      action: () => onSectionChange('symptom-checker')
    },
    {
      icon: Video,
      title: 'Telemedicine Portal',
      description: 'Connect with certified doctors through secure video consultations',
      action: () => onSectionChange('telemedicine')
    },
    {
      icon: Activity,
      title: 'Health Monitoring',
      description: 'Real-time vital signs tracking with AI-powered health insights',
      action: () => onSectionChange('monitoring')
    },
    {
      icon: Gamepad2,
      title: 'VR/AR Therapy',
      description: 'Gamified physical therapy and rehabilitation programs',
      action: () => onSectionChange('therapy')
    },
    {
      icon: Heart,
      title: 'Mood Scanner',
      description: 'AI-powered facial sentiment analysis for mental health assessment',
      action: () => onSectionChange('mood-scanner')
    }
  ];

  const stats = [
    { icon: Users, number: '50K+', label: 'Patients Served' },
    { icon: Shield, number: '99.9%', label: 'Data Security' },
    { icon: Clock, number: '24/7', label: 'Available Support' }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Healthcare
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {' '}Reimagined
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            An integrated AI-powered platform that combines symptom checking, telemedicine, 
            health monitoring, mental health assessment, and rehabilitation into one seamless experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onSectionChange('symptom-checker')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <span>Start Health Check</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => onSectionChange('mood-scanner')}
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300"
            >
              Scan Your Mood
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for modern healthcare, powered by AI and designed for accessibility
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={feature.action}
            >
              <div className="bg-gradient-to-r from-blue-600 to-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                <span>Learn more</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}