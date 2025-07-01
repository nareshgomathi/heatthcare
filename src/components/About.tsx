import React from 'react';
import { Shield, Users, Award, Globe, Heart, Brain, Zap, CheckCircle } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning algorithms provide personalized health recommendations and early warning systems.'
    },
    {
      icon: Shield,
      title: 'Privacy-First Security',
      description: 'End-to-end encryption and local data processing ensure your health information remains completely private.'
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Available in multiple languages with offline capabilities for underserved communities worldwide.'
    },
    {
      icon: Heart,
      title: 'Holistic Care',
      description: 'Integrated approach covering physical, mental, and preventive health through a single platform.'
    }
  ];

  const stats = [
    { number: '500K+', label: 'Patients Served', icon: Users },
    { number: '99.9%', label: 'Uptime Reliability', icon: Zap },
    { number: '50+', label: 'Countries', icon: Globe },
    { number: '95%', label: 'Satisfaction Rate', icon: Award }
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: '15+ years in digital health innovation'
    },
    {
      name: 'Michael Chen',
      role: 'AI Research Director',
      image: 'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'Former Google Health AI researcher'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Clinical Integration Lead',
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'Telemedicine pioneer and policy expert'
    },
    {
      name: 'James Wilson',
      role: 'Technology Architect',
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'Healthcare infrastructure specialist'
    }
  ];

  const values = [
    {
      title: 'Patient-Centered Care',
      description: 'Every decision we make prioritizes patient outcomes and experience above all else.'
    },
    {
      title: 'Innovation with Purpose',
      description: 'We leverage cutting-edge technology to solve real healthcare challenges, not just for novelty.'
    },
    {
      title: 'Ethical AI',
      description: 'Our AI systems are transparent, unbiased, and designed to augment human expertise, not replace it.'
    },
    {
      title: 'Global Impact',
      description: 'We believe quality healthcare should be accessible to everyone, regardless of location or economic status.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionizing Healthcare Through
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {' '}Technology
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            SmartCare+ is an integrated healthcare platform that combines AI-powered symptom checking, 
            telemedicine, real-time health monitoring, and gamified physical therapy to make healthcare 
            more accessible, engaging, and effective for everyone.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To democratize access to quality healthcare by creating an integrated platform that combines 
              the power of artificial intelligence, telemedicine, IoT monitoring, and immersive therapy 
              to deliver personalized, accessible, and effective care to patients worldwide.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              A world where every person has access to intelligent, compassionate healthcare that adapts 
              to their unique needs, empowers them to take control of their health, and connects them 
              with the right care at the right time, regardless of their location or circumstances.
            </p>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Makes SmartCare+ Different
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 rounded-xl shadow-xl text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Healthcare Experience?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of patients and healthcare providers who trust SmartCare+ for their health journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Start Your Health Check
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}