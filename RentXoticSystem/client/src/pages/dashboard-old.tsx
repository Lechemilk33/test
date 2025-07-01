import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";
import VehicleCard from "@/components/VehicleCard";
import TaskForm from "@/components/TaskForm";
import type { Vehicle, Task } from "@shared/schema";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Queries
  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Mutations
  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Vehicle> }) => {
      await apiRequest("PUT", `/api/vehicles/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
      await apiRequest("PUT", `/api/tasks/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate stats
  const stats = {
    available: vehicles.filter(v => v.status === 'available').length,
    rented: vehicles.filter(v => v.status === 'rented').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    issues: vehicles.reduce((sum, v) => sum + (v.issues?.length || 0), 0),
    washed: vehicles.filter(v => v.washed).length,
    needsWash: vehicles.filter(v => !v.washed).length,
    lowFuel: vehicles.filter(v => v.fuelLevel < 25).length,
  };

  // Generate alerts
  const alerts = [];
  if (stats.lowFuel > 0) {
    alerts.push({
      type: 'warning',
      message: `⚠️ ${stats.lowFuel} vehicle(s) have low fuel levels`
    });
  }

  if (stats.needsWash > 0) {
    alerts.push({
      type: 'warning',
      message: `🧽 ${stats.needsWash} vehicle(s) need washing`
    });
  }

  const urgentTasks = tasks.filter(task => task.priority === 'urgent' && !task.completed).length;
  if (urgentTasks > 0) {
    alerts.push({
      type: 'danger',
      message: `🚨 ${urgentTasks} urgent task(s) need attention`
    });
  }

  // Handle vehicle actions
  const handleUpdateVehicleStatus = (vehicle: Vehicle) => {
    const statuses = ['available', 'rented', 'maintenance'];
    const currentIndex = statuses.indexOf(vehicle.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    updateVehicleMutation.mutate({
      id: vehicle.id,
      updates: { 
        status: nextStatus,
        fuelLevel: Math.max(10, Math.min(100, vehicle.fuelLevel + (Math.random() * 40 - 20)))
      }
    });
  };

  const handleMarkVehicleReady = (vehicle: Vehicle) => {
    updateVehicleMutation.mutate({
      id: vehicle.id,
      updates: { 
        status: 'available',
        fuelLevel: Math.max(80, vehicle.fuelLevel),
        condition: 'excellent',
        issues: []
      }
    });
  };

  const handleCreateFuelTask = (vehicle: Vehicle) => {
    const taskData = {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      type: 'fuel',
      priority: 'high',
      assigned: 'Auto-generated',
      description: `Refuel ${vehicle.name} - Currently at ${vehicle.fuelLevel}%`,
      completed: false
    };

    apiRequest("POST", "/api/tasks", taskData).then(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    });
  };

  const handleMarkWashed = (vehicle: Vehicle) => {
    updateVehicleMutation.mutate({
      id: vehicle.id,
      updates: { 
        washed: true,
        lastWash: new Date(),
        issues: (vehicle.issues || []).filter(issue => issue !== 'Needs Wash')
      }
    });
  };

  const handleCompleteTask = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: { completed: true }
    });
  };

  const handleDeleteTask = (task: Task) => {
    deleteTaskMutation.mutate(task.id);
  };

  const handleExportTasks = () => {
    if (tasks.length === 0) {
      alert('No tasks to export');
      return;
    }

    const headers = ['ID', 'Vehicle', 'Type', 'Priority', 'Assigned', 'Description', 'Created', 'Status'];
    const csvContent = [
      headers.join(','),
      ...tasks.map(task => [
        task.id,
        task.vehicleName,
        task.type,
        task.priority,
        task.assigned,
        `"${task.description}"`,
        new Date(task.createdAt).toISOString(),
        task.completed ? 'Completed' : 'Pending'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rentxotic-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>RentXotic Operations</h1>
          <div className="header-info">{formatDateTime(currentTime)}</div>
        </div>
      </header>

      <div className="container">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="tabs">
            <TabsTrigger value="dashboard" className="tab">Dashboard</TabsTrigger>
            <TabsTrigger value="fleet" className="tab">Fleet Status</TabsTrigger>
            <TabsTrigger value="tasks" className="tab">Task Management</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="rentxotic-card">
            <div className="section-header">
              <h2 className="section-title">Fleet Overview</h2>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] })}
                className="btn-rentxotic"
              >
                🔄 Refresh
              </Button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{stats.available}</span>
                <div className="stat-label">Available</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.rented}</span>
                <div className="stat-label">Rented</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.maintenance}</span>
                <div className="stat-label">Maintenance</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.washed}</span>
                <div className="stat-label">Clean</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.needsWash}</span>
                <div className="stat-label">Needs Wash</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.issues}</span>
                <div className="stat-label">Issues</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{stats.lowFuel}</span>
                <div className="stat-label">Low Fuel</div>
              </div>
            </div>

            {/* Alerts */}
            {alerts.map((alert, index) => (
              <div key={index} className={`alert alert-${alert.type}`}>
                {alert.message}
              </div>
            ))}
          </TabsContent>

          {/* Fleet Status Tab */}
          <TabsContent value="fleet" className="rentxotic-card">
            <div className="section-header">
              <h2 className="section-title">Fleet Status - {vehicles.length} Vehicles</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    vehicles.forEach(vehicle => {
                      updateVehicleMutation.mutate({
                        id: vehicle.id,
                        updates: {
                          fuelLevel: Math.max(10, Math.min(100, vehicle.fuelLevel + (Math.random() * 20 - 10)))
                        }
                      });
                    });
                  }}
                  className="btn-rentxotic"
                >
                  📊 Update All
                </Button>
                <Button 
                  onClick={() => {
                    vehicles.forEach(vehicle => {
                      updateVehicleMutation.mutate({
                        id: vehicle.id,
                        updates: {
                          status: 'available',
                          fuelLevel: Math.max(85, vehicle.fuelLevel),
                          condition: 'excellent',
                          issues: []
                        }
                      });
                    });
                  }}
                  className="btn-rentxotic btn-success"
                >
                  ✅ Mark All Ready
                </Button>
              </div>
            </div>

            {vehiclesLoading ? (
              <div>Loading vehicles...</div>
            ) : (
              <div className="vehicle-grid">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onUpdateStatus={handleUpdateVehicleStatus}
                    onMarkReady={handleMarkVehicleReady}
                    onCreateFuelTask={handleCreateFuelTask}
                    onMarkWashed={handleMarkWashed}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Task Management Tab */}
          <TabsContent value="tasks" className="rentxotic-card">
            <div className="section-header">
              <h2 className="section-title">Task Management</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowTaskForm(true)}
                  className="btn-rentxotic"
                >
                  ➕ Add Task
                </Button>
                <Button 
                  onClick={handleExportTasks}
                  className="btn-rentxotic"
                >
                  📊 Export CSV
                </Button>
              </div>
            </div>

            {showTaskForm && (
              <TaskForm
                vehicles={vehicles}
                onClose={() => setShowTaskForm(false)}
                onSuccess={() => {
                  setShowTaskForm(false);
                  queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
                }}
              />
            )}

            {tasksLoading ? (
              <div>Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="rentxotic-card text-center py-12">
                <h3 className="text-lg font-semibold text-[var(--text-secondary)] mb-4">No Tasks Yet</h3>
                <p className="text-[var(--text-muted)]">Click "Add Task" to create your first task</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className={`rentxotic-card ${task.completed ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{task.description}</h4>
                        <div className="flex gap-4 items-center text-sm text-[var(--text-secondary)]">
                          <span>🚗 {task.vehicleName}</span>
                          <span>📋 {task.type}</span>
                          <span>👤 {task.assigned}</span>
                          <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge badge-${task.priority}`}>{task.priority.toUpperCase()}</span>
                        {task.completed && <span className="badge badge-available">COMPLETED</span>}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {!task.completed && (
                        <Button 
                          onClick={() => handleCompleteTask(task)}
                          className="btn-rentxotic btn-success btn-sm"
                        >
                          ✅ Complete
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleDeleteTask(task)}
                        className="btn-rentxotic btn-danger btn-sm"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
