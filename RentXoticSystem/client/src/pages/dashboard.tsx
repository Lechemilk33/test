import React, { useState } from 'react';
import { 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Fuel, 
  Wrench, 
  MapPin, 
  Calendar,
  Users,
  TrendingUp,
  Filter,
  Search,
  Plus,
  Download,
  Bell,
  Settings,
  Star,
  Zap,
  Shield
} from 'lucide-react';

const FleetDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data with luxury vehicles
  const fleetStats = {
    totalVehicles: 24,
    available: 18,
    rented: 4,
    maintenance: 2,
    utilization: 85,
    activeTasks: 12,
    urgentTasks: 3,
    topPerformer: 'Lamborghini Huracán'
  };

  const vehicles = [
    {
      id: 'RX001',
      name: 'Lamborghini Huracán Evo',
      brand: 'Lamborghini',
      year: '2024',
      status: 'available',
      location: 'La Jolla Showroom',
      fuel: 85,
      mileage: 1250,
      lastService: '2024-06-15',
      condition: 'pristine',
      image: '/api/placeholder/300/200',
      issues: [],
      performance: { topSpeed: '202 mph', acceleration: '2.9s 0-60' }
    },
    {
      id: 'RX002', 
      name: 'Ferrari 488 GTB',
      brand: 'Ferrari',
      year: '2023',
      status: 'rented',
      location: 'Gaslamp Quarter',
      fuel: 45,
      mileage: 2890,
      lastService: '2024-05-20',
      condition: 'excellent',
      issues: ['Low fuel alert'],
      performance: { topSpeed: '205 mph', acceleration: '3.0s 0-60' }
    },
    {
      id: 'RX003',
      name: 'McLaren 720S',
      brand: 'McLaren',
      year: '2022',
      status: 'maintenance',
      location: 'Service Center',
      fuel: 20,
      mileage: 4520,
      lastService: '2024-04-10',
      condition: 'excellent',
      issues: ['Scheduled maintenance', 'Detailing in progress'],
      performance: { topSpeed: '212 mph', acceleration: '2.8s 0-60' }
    },
    {
      id: 'RX004',
      name: 'Rolls-Royce Cullinan',
      brand: 'Rolls-Royce',
      year: '2024',
      status: 'available',
      location: 'Del Mar Collection',
      fuel: 90,
      mileage: 875,
      lastService: '2024-06-01',
      condition: 'pristine',
      issues: [],
      performance: { topSpeed: '155 mph', acceleration: '4.8s 0-60' }
    }
  ];

  const tasks = [
    {
      id: 'T001',
      title: 'Ferrari 488 GTB - Refuel & Detail',
      vehicle: 'RX002',
      priority: 'high',
      type: 'service',
      dueDate: '2024-06-30',
      assignedTo: 'Marcus Rodriguez',
      status: 'pending',
      estimatedTime: '2 hours'
    },
    {
      id: 'T002',
      title: 'McLaren 720S - Performance Check',
      vehicle: 'RX003',
      priority: 'urgent',
      type: 'maintenance',
      dueDate: '2024-06-29',
      assignedTo: 'Elena Vasquez',
      status: 'in-progress',
      estimatedTime: '4 hours'
    },
    {
      id: 'T003',
      title: 'Lamborghini Huracán - Pre-rental Inspection',
      vehicle: 'RX001',
      priority: 'normal',
      type: 'inspection',
      dueDate: '2024-07-02',
      assignedTo: 'James Chen',
      status: 'pending',
      estimatedTime: '1 hour'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rented': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'maintenance': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 text-red-700 border-red-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'normal': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getConditionBadge = (condition) => {
    switch (condition) {
      case 'pristine': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'excellent': return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'good': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient, iconColor = "white" }) => (
    <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className={`h-7 w-7 text-${iconColor}`} />
          </div>
        </div>
      </div>
    </div>
  );

  const VehicleCard = ({ vehicle }) => (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
      {/* Vehicle Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(vehicle.status)}`}>
            {vehicle.status.toUpperCase()}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConditionBadge(vehicle.condition)}`}>
            <Star className="inline h-3 w-3 mr-1" />
            {vehicle.condition.toUpperCase()}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 text-white z-10">
          <p className="text-2xl font-bold">{vehicle.brand}</p>
          <p className="text-sm opacity-90">{vehicle.year}</p>
        </div>
      </div>
      
      {/* Vehicle Details */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{vehicle.name}</h3>
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {vehicle.location}
          </p>
        </div>
        
        {/* Performance Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-gray-600 text-xs mb-1">
              <Zap className="h-3 w-3 mr-1" />
              0-60 MPH
            </div>
            <div className="font-bold text-gray-900">{vehicle.performance.acceleration}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-gray-600 text-xs mb-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Top Speed
            </div>
            <div className="font-bold text-gray-900">{vehicle.performance.topSpeed}</div>
          </div>
        </div>
        
        {/* Fuel Level */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm text-gray-600">
              <Fuel className="h-4 w-4 mr-2" />
              Fuel Level
            </div>
            <span className="text-sm font-semibold">{vehicle.fuel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                vehicle.fuel > 75 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 
                vehicle.fuel > 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                vehicle.fuel > 25 ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${vehicle.fuel}%` }}
            ></div>
          </div>
        </div>
        
        {/* Mileage */}
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Mileage:</span> {vehicle.mileage.toLocaleString()} miles
        </div>
        
        {/* Issues */}
        {vehicle.issues.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center text-amber-800 text-sm font-medium mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Attention Required ({vehicle.issues.length})
            </div>
            <ul className="text-sm text-amber-700 space-y-1">
              {vehicle.issues.map((issue, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl">
            Manage
          </button>
          <button className="px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
            Details
          </button>
        </div>
      </div>
    </div>
  );

  const TaskCard = ({ task }) => (
    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
      <div className="flex items-start justify-between mb-4">
        <h4 className="font-semibold text-gray-900 leading-tight">{task.title}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
          {task.priority.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-3 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Car className="h-4 w-4 mr-3 text-gray-400" />
          <span className="font-medium">Vehicle:</span>
          <span className="ml-1">{task.vehicle}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-3 text-gray-400" />
          <span className="font-medium">Due:</span>
          <span className="ml-1">{task.dueDate}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-3 text-gray-400" />
          <span className="font-medium">Assigned:</span>
          <span className="ml-1">{task.assignedTo}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-3 text-gray-400" />
          <span className="font-medium">Est. Time:</span>
          <span className="ml-1">{task.estimatedTime}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200">
          Complete
        </button>
        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
          Edit
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-xl mr-4">
                <Car className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  RentXotic Fleet
                </h1>
                <p className="text-sm text-gray-500">Luxury Fleet Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 relative group">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  3 alerts
                </span>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Settings className="h-6 w-6" />
              </button>
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
              { id: 'fleet', name: 'Fleet Status', icon: Car },
              { id: 'tasks', name: 'Task Management', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200 flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center py-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Drive the Legend. Manage the Fleet.</h2>
              <p className="text-xl text-gray-600">Premium fleet management for luxury experiences</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Car}
                title="Total Vehicles"
                value={fleetStats.totalVehicles}
                gradient="from-blue-600 to-blue-800"
              />
              <StatCard
                icon={CheckCircle}
                title="Available Now"
                value={fleetStats.available}
                subtitle={`${Math.round((fleetStats.available / fleetStats.totalVehicles) * 100)}% ready to rent`}
                gradient="from-emerald-600 to-emerald-800"
              />
              <StatCard
                icon={TrendingUp}
                title="Fleet Utilization"
                value={`${fleetStats.utilization}%`}
                subtitle="Current efficiency"
                gradient="from-purple-600 to-purple-800"
              />
              <StatCard
                icon={AlertTriangle}
                title="Priority Tasks"
                value={fleetStats.urgentTasks}
                subtitle={`${fleetStats.activeTasks} total active`}
                gradient="from-amber-600 to-amber-800"
              />
            </div>

            {/* Featured Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Fleet Highlights</h3>
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Live Status
                  </span>
                </div>
                <div className="space-y-4">
                  {vehicles.slice(0, 3).map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-gray-800 to-black p-3 rounded-lg mr-4">
                          <Car className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{vehicle.name}</p>
                          <p className="text-sm text-gray-600">{vehicle.location}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Vehicle
                  </button>
                  <button className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Schedule Service
                  </button>
                  <button className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center">
                    <Download className="h-5 w-5 mr-2" />
                    Fleet Report
                  </button>
                </div>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm opacity-90 mb-1">Top Performer</p>
                  <p className="font-bold text-lg">{fleetStats.topPerformer}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fleet' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Luxury Fleet Status</h2>
                <p className="text-gray-600 mt-1">Manage your exotic and luxury vehicle collection</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Service & Task Management</h2>
                <p className="text-gray-600 mt-1">Maintain luxury standards across your fleet</p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Task
              </button>
            </div>

            {/* Task Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center mb-3">
                  <Clock className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="font-semibold text-gray-900">Pending Tasks</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-500 mt-1">Awaiting assignment</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center mb-3">
                  <Wrench className="h-6 w-6 text-orange-600 mr-3" />
                  <span className="font-semibold text-gray-900">In Progress</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">4</p>
                <p className="text-sm text-gray-500 mt-1">Active work orders</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center mb-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
                  <span className="font-semibold text-gray-900">Completed Today</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500 mt-1">Tasks finished</p>
              </div>
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FleetDashboard;
