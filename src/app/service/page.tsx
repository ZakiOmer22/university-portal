"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiServer, 
  FiDatabase, 
  FiCpu, 
  FiWifi, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiClock,
  FiRefreshCw,
  FiActivity,
  FiBarChart2,
  FiHardDrive,
  FiShield,
  FiGlobe,
  FiUsers
} from "react-icons/fi";

interface ServiceStatus {
  id: string;
  name: string;
  description: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  responseTime: number;
  uptime: number;
  lastIncident?: string;
  dependencies?: string[];
}

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    load: number[];
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    incoming: number;
    outgoing: number;
    connections: number;
  };
  activeUsers: number;
  requests: {
    total: number;
    successful: number;
    failed: number;
  };
}

export default function ServerStatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock services data
      const mockServices: ServiceStatus[] = [
        {
          id: 'web-server',
          name: 'Web Server',
          description: 'Main application server and API endpoints',
          status: 'operational',
          responseTime: 124,
          uptime: 99.98,
          dependencies: ['database', 'cache']
        },
        {
          id: 'database',
          name: 'Database',
          description: 'Primary PostgreSQL database cluster',
          status: 'operational',
          responseTime: 45,
          uptime: 99.99,
          lastIncident: '2024-01-15: Scheduled maintenance'
        },
        {
          id: 'authentication',
          name: 'Authentication Service',
          description: 'User authentication and authorization',
          status: 'operational',
          responseTime: 89,
          uptime: 99.97
        },
        {
          id: 'file-storage',
          name: 'File Storage',
          description: 'File upload and storage service',
          status: 'degraded',
          responseTime: 320,
          uptime: 99.85,
          lastIncident: '2024-01-20: Increased latency'
        },
        {
          id: 'email-service',
          name: 'Email Service',
          description: 'Transactional and notification emails',
          status: 'operational',
          responseTime: 210,
          uptime: 99.92
        },
        {
          id: 'cache',
          name: 'Cache Service',
          description: 'Redis caching layer',
          status: 'operational',
          responseTime: 12,
          uptime: 99.99
        },
        {
          id: 'monitoring',
          name: 'Monitoring',
          description: 'System monitoring and alerts',
          status: 'operational',
          responseTime: 65,
          uptime: 100.00
        },
        {
          id: 'backup',
          name: 'Backup Service',
          description: 'Automated database backups',
          status: 'maintenance',
          responseTime: 0,
          uptime: 99.95,
          lastIncident: '2024-01-21: Scheduled backup optimization'
        }
      ];

      // Mock system metrics
      const mockMetrics: SystemMetrics = {
        cpu: {
          usage: 45.2,
          cores: 8,
          load: [2.1, 1.8, 1.5]
        },
        memory: {
          used: 12.4,
          total: 32,
          percentage: 38.8
        },
        storage: {
          used: 245.7,
          total: 500,
          percentage: 49.1
        },
        network: {
          incoming: 124.5,
          outgoing: 45.2,
          connections: 1247
        },
        activeUsers: 342,
        requests: {
          total: 12457,
          successful: 12389,
          failed: 68
        }
      };

      setServices(mockServices);
      setMetrics(mockMetrics);
      setLastUpdated(new Date());
      setLoading(false);
    };

    fetchStatus();

    // Auto-refresh every 30 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(fetchStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'degraded': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'outage': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'maintenance': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return <FiCheckCircle className="text-lg" />;
      case 'degraded': return <FiAlertCircle className="text-lg" />;
      case 'outage': return <FiAlertCircle className="text-lg" />;
      case 'maintenance': return <FiClock className="text-lg" />;
      default: return <FiAlertCircle className="text-lg" />;
    }
  };

  const getStatusText = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'degraded': return 'Degraded Performance';
      case 'outage': return 'Service Outage';
      case 'maintenance': return 'Under Maintenance';
      default: return 'Unknown';
    }
  };

  const overallStatus = services.every(s => s.status === 'operational') 
    ? 'operational' 
    : services.some(s => s.status === 'outage') 
      ? 'outage' 
      : 'degraded';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-2xl">
              <FiServer className="text-3xl text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              System Status
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Real-time monitoring of university portal services and infrastructure
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${
              overallStatus === 'operational' 
                ? 'text-green-500 border-green-500 bg-green-50 dark:bg-green-900/20' 
                : overallStatus === 'outage'
                  ? 'text-red-500 border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'text-yellow-500 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                overallStatus === 'operational' ? 'bg-green-500' :
                overallStatus === 'outage' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span className="font-semibold">
                {overallStatus === 'operational' ? 'All Systems Operational' :
                 overallStatus === 'outage' ? 'Service Outage' : 'Partial Outage'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <FiClock className="text-lg" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Auto-refresh</span>
            </label>

            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* System Metrics */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {/* CPU Usage */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <FiCpu className="text-xl text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">CPU Usage</h3>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metrics.cpu.usage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.cpu.usage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-2">
                <span>{metrics.cpu.cores} Cores</span>
                <span>Load: {metrics.cpu.load.join(', ')}</span>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FiActivity className="text-xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Memory</h3>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metrics.memory.percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.memory.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-2">
                <span>{metrics.memory.used}GB</span>
                <span>{metrics.memory.total}GB Total</span>
              </div>
            </div>

            {/* Storage */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <FiHardDrive className="text-xl text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Storage</h3>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metrics.storage.percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.storage.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-2">
                <span>{metrics.storage.used}GB</span>
                <span>{metrics.storage.total}GB Total</span>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <FiUsers className="text-xl text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Active Users</h3>
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metrics.activeUsers}
                </span>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {metrics.activeUsers}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Currently Online
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Services Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <FiBarChart2 className="text-blue-600 dark:text-blue-400" />
              Service Status
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Current status of all university portal services
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            <AnimatePresence>
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl border-2 ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {service.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            service.status === 'operational' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            service.status === 'degraded' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            service.status === 'outage' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {getStatusText(service.status)}
                          </span>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                          {service.description}
                        </p>

                        <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <FiActivity className="text-slate-400" />
                            <span>Response: {service.responseTime}ms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiCheckCircle className="text-slate-400" />
                            <span>Uptime: {service.uptime}%</span>
                          </div>
                          {service.dependencies && (
                            <div className="flex items-center gap-2">
                              <FiGlobe className="text-slate-400" />
                              <span>Depends on: {service.dependencies.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {service.lastIncident && (
                          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                              <FiAlertCircle className="text-lg" />
                              <span className="text-sm font-medium">Last Incident: {service.lastIncident}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Network Stats */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                  <FiWifi className="text-xl text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Network</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Incoming</span>
                  <span className="font-semibold">{metrics.network.incoming} MB/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Outgoing</span>
                  <span className="font-semibold">{metrics.network.outgoing} MB/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Connections</span>
                  <span className="font-semibold">{metrics.network.connections}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <FiShield className="text-xl text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Requests</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total</span>
                  <span className="font-semibold">{metrics.requests.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Successful</span>
                  <span className="font-semibold text-green-600">{metrics.requests.successful.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Failed</span>
                  <span className="font-semibold text-red-600">{metrics.requests.failed.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                  <FiServer className="text-xl text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">System Info</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Environment</span>
                  <span className="font-semibold">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Region</span>
                  <span className="font-semibold">US-East-1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Last Restart</span>
                  <span className="font-semibold">15 days ago</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-700"
        >
          <p className="text-slate-600 dark:text-slate-400">
            System status updates every 30 seconds. {' '}
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {autoRefresh ? 'Disable' : 'Enable'} auto-refresh
            </button>
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            For immediate assistance, contact{' '}
            <a href="/resources/it-support" className="text-blue-600 dark:text-blue-400 hover:underline">
              IT Support
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}