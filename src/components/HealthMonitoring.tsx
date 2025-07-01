import React, { useState, useEffect } from 'react';
import { Heart, Thermometer, Activity, Droplets, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Wifi, WifiOff, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { HealthDataExporter } from '../utils/healthDataExport';

export default function HealthMonitoring() {
  const [isConnected, setIsConnected] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [vitals, setVitals] = useState({
    heartRate: 72,
    temperature: 98.6,
    oxygenSaturation: 98,
    bloodPressure: { systolic: 120, diastolic: 80 }
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        heartRate: prev.heartRate + Math.floor(Math.random() * 6) - 3,
        temperature: prev.temperature + (Math.random() * 0.4) - 0.2,
        oxygenSaturation: Math.max(95, Math.min(100, prev.oxygenSaturation + Math.floor(Math.random() * 3) - 1)),
        bloodPressure: {
          systolic: prev.bloodPressure.systolic + Math.floor(Math.random() * 6) - 3,
          diastolic: prev.bloodPressure.diastolic + Math.floor(Math.random() * 4) - 2
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleExportData = async (format: 'csv' | 'excel') => {
    setIsExporting(true);
    
    // Simulate export processing time
    setTimeout(() => {
      const healthData = HealthDataExporter.generateSampleData(50);
      
      if (format === 'csv') {
        HealthDataExporter.exportToCSV(healthData, 'smartcare-health-monitoring');
      } else {
        HealthDataExporter.exportToExcel(healthData, 'smartcare-health-monitoring');
      }
      
      setIsExporting(false);
      setExportSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    }, 1500);
  };

  const getVitalStatus = (vital: string, value: number) => {
    switch (vital) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'warning';
        return 'normal';
      case 'temperature':
        if (value < 97 || value > 99.5) return 'warning';
        return 'normal';
      case 'oxygenSaturation':
        if (value < 95) return 'critical';
        if (value < 98) return 'warning';
        return 'normal';
      case 'bloodPressure':
        if (value > 140 || value < 90) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'normal': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const vitalCards = [
    {
      title: 'Heart Rate',
      value: `${vitals.heartRate}`,
      unit: 'BPM',
      icon: Heart,
      normal: '60-100 BPM',
      status: getVitalStatus('heartRate', vitals.heartRate),
      trend: vitals.heartRate > 75 ? 'up' : 'down'
    },
    {
      title: 'Body Temperature',
      value: `${vitals.temperature.toFixed(1)}`,
      unit: '°F',
      icon: Thermometer,
      normal: '97.0-99.5°F',
      status: getVitalStatus('temperature', vitals.temperature),
      trend: vitals.temperature > 98.6 ? 'up' : 'down'
    },
    {
      title: 'Oxygen Saturation',
      value: `${vitals.oxygenSaturation}`,
      unit: '%',
      icon: Droplets,
      normal: '95-100%',
      status: getVitalStatus('oxygenSaturation', vitals.oxygenSaturation),
      trend: vitals.oxygenSaturation > 97 ? 'up' : 'down'
    },
    {
      title: 'Blood Pressure',
      value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`,
      unit: 'mmHg',
      icon: Activity,
      normal: '120/80 mmHg',
      status: getVitalStatus('bloodPressure', vitals.bloodPressure.systolic),
      trend: vitals.bloodPressure.systolic > 120 ? 'up' : 'down'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'info',
      message: 'Your heart rate has been elevated for the past 10 minutes.',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'success',
      message: 'All vitals are within normal range.',
      time: '15 minutes ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real-Time Health Monitoring
          </h1>
          <p className="text-xl text-gray-600">
            Monitor your vital signs with AI-powered health insights
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-8">
          <div className={`flex items-center justify-center space-x-2 p-4 rounded-lg ${
            isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isConnected ? (
              <>
                <Wifi className="h-5 w-5" />
                <span className="font-medium">Connected to Health Monitoring Device</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5" />
                <span className="font-medium">Disconnected from Health Monitoring Device</span>
              </>
            )}
            <button
              onClick={() => setIsConnected(!isConnected)}
              className="ml-4 px-3 py-1 bg-white text-current border border-current rounded text-sm hover:bg-current hover:text-white transition-colors"
            >
              {isConnected ? 'Disconnect' : 'Reconnect'}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Vital Signs */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {vitalCards.map((vital, index) => {
                const StatusIcon = getStatusIcon(vital.status);
                const TrendIcon = vital.trend === 'up' ? TrendingUp : TrendingDown;
                
                return (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-lg">
                          <vital.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{vital.title}</h3>
                          <p className="text-sm text-gray-600">Normal: {vital.normal}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendIcon className={`h-4 w-4 ${
                          vital.trend === 'up' ? 'text-red-500' : 'text-green-500'
                        }`} />
                        <StatusIcon className={`h-5 w-5 ${
                          vital.status === 'normal' ? 'text-green-500' : 
                          vital.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                      </div>
                    </div>
                    
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900">{vital.value}</span>
                      <span className="text-lg text-gray-600">{vital.unit}</span>
                    </div>
                    
                    <div className={`mt-4 p-3 rounded-lg border ${getStatusColor(vital.status)}`}>
                      <p className="text-sm font-medium capitalize">{vital.status} Range</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">24-Hour Trends</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Heart Rate</h4>
                  <div className="h-32 bg-gradient-to-r from-red-100 to-red-200 rounded flex items-end justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{vitals.heartRate}</div>
                      <div className="text-sm text-red-600">BPM</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Oxygen Saturation</h4>
                  <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-end justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{vitals.oxygenSaturation}%</div>
                      <div className="text-sm text-blue-600">SpO₂</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Alerts */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${
                    alert.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                    alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                    'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Data Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Health Data</h3>
              
              {exportSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Export completed successfully!</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    50 rows of health data downloaded
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleExportData('excel')}
                  disabled={isExporting}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Export Excel</span>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => handleExportData('csv')}
                  disabled={isExporting}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Export CSV</span>
                    </>
                  )}
                </button>
                
                <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                  <p className="font-medium mb-1">Export includes:</p>
                  <ul className="space-y-0.5">
                    <li>• 50 rows of historical data</li>
                    <li>• Heart rate, BP, O₂, temperature</li>
                    <li>• Timestamps and status indicators</li>
                    <li>• Clinical notes and observations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Call Doctor
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Settings
                </button>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency</h3>
              <p className="text-sm text-red-700 mb-4">
                If you're experiencing a medical emergency, call 911 immediately.
              </p>
              <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                Call 911
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}