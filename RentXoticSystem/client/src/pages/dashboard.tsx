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

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("PUT", `/api/tasks/${taskId}`, { completed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Event handlers
  const handleUpdateVehicleStatus = (vehicle: Vehicle) => {
    const nextStatus = vehicle.status === 'available' ? 'rented' : 
                      vehicle.status === 'rented' ? 'maintenance' : 'available';
    updateVehicleMutation.mutate({
      id: vehicle.id,
      updates: { status: nextStatus }
    });
  };

  const handleMarkVehicleReady = (vehicle: Vehicle) => {
    const updates: Partial<Vehicle> = {
      status: 'available',
      condition: 'excellent',
      issues: (vehicle.issues || []).filter(issue => 
        !['Service Due', 'Minor Cosmetic', 'Low Fuel'].includes(issue)
      )
    };
    updateVehicleMutation.mutate({ id: vehicle.id, updates });
  };

  const handleCreateFuelTask = (vehicle: Vehicle) => {
    const fuelTask = {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      type: 'fuel',
      priority: vehicle.fuelLevel < 15 ? 'urgent' : 'high',
      assigned: 'Fuel Team',
      description: `Refuel ${vehicle.name} - Current level: ${vehicle.fuelLevel}%`,
      completed: false
    };
    
    apiRequest("POST", "/api/tasks", fuelTask).then(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    });
  };

  const handleMarkWashed = (vehicle: Vehicle) => {
    const updates: Partial<Vehicle> = {
      washed: true,
      lastWash: new Date(),
      issues: (vehicle.issues || []).filter(issue => issue !== 'Needs Wash')
    };
    updateVehicleMutation.mutate({ id: vehicle.id, updates });
  };

  const handleCompleteTask = (task: Task) => {
    completeTaskMutation.mutate(task.id);
  };

  const handleDeleteTask = (task: Task) => {
    deleteTaskMutation.mutate(task.id);
  };

  // Calculate statistics
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const rentedVehicles = vehicles.filter(v => v.status === 'rented').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const lowFuelVehicles = vehicles.filter(v => v.fuelLevel < 25).length;
  const cleanVehicles = vehicles.filter(v => v.washed).length;
  const needsWashVehicles = vehicles.filter(v => !v.washed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const urgentTasks = tasks.filter(t => !t.completed && t.priority === 'urgent').length;

  return (
    <div className="min-h-screen bg-rentxotic-dark text-white">
      {/* Header */}
      <div className="bg-rentxotic-navy border-b border-rentxotic-gold/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-rentxotic-gold">RentXotic Fleet Management</h1>
              <p className="text-rentxotic-gold/80">La Jolla Luxury Car Rentals</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-rentxotic-gold">
                {formatDateTime(currentTime)}
              </div>
              <div className="text-sm text-rentxotic-gold/80">Live Dashboard</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-rentxotic-navy border border-rentxotic-gold/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-rentxotic-gold data-[state=active]:text-rentxotic-navy">
              📊 Overview
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-rentxotic-gold data-[state=active]:text-rentxotic-navy">
              🚗 Fleet ({vehicles.length})
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-rentxotic-gold data-[state=active]:text-rentxotic-navy">
              📋 Tasks ({pendingTasks})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{vehicles.length}</span>
                <div className="stat-label">Total Fleet</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{availableVehicles}</span>
                <div className="stat-label">Available</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{rentedVehicles}</span>
                <div className="stat-label">Rented</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{maintenanceVehicles}</span>
                <div className="stat-label">Maintenance</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{lowFuelVehicles}</span>
                <div className="stat-label">Low Fuel</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{cleanVehicles}</span>
                <div className="stat-label">Clean</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{needsWashVehicles}</span>
                <div className="stat-label">Needs Wash</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">{urgentTasks}</span>
                <div className="stat-label">Urgent Tasks</div>
              </div>
            </div>

            {/* Alerts */}
            {vehicles.filter(v => v.fuelLevel < 15).map((vehicle) => (
              <div key={vehicle.id} className="alert alert-danger">
                🚨 {vehicle.name} has critically low fuel ({vehicle.fuelLevel}%)
              </div>
            ))}
            {vehicles.filter(v => v.fuelLevel >= 15 && v.fuelLevel < 25).map((vehicle) => (
              <div key={vehicle.id} className="alert alert-warning">
                ⚠️ {vehicle.name} has low fuel ({vehicle.fuelLevel}%)
              </div>
            ))}
            {vehicles.filter(v => !v.washed).map((vehicle) => (
              <div key={vehicle.id} className="alert alert-info">
                🧽 {vehicle.name} needs washing
              </div>
            ))}
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6">
            {vehiclesLoading ? (
              <div className="text-center py-8">Loading vehicles...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-rentxotic-gold">Task Management</h2>
              <Button 
                onClick={() => setShowTaskForm(true)}
                className="btn-rentxotic"
              >
                ➕ Add Task
              </Button>
            </div>

            {tasksLoading ? (
              <div className="text-center py-8">Loading tasks...</div>
            ) : (
              <div className="space-y-4">
                {tasks.filter(t => !t.completed).map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`priority-badge priority-${task.priority}`}>
                            {task.priority === 'urgent' ? '🚨' : 
                             task.priority === 'high' ? '⚠️' : '📌'} 
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="task-type">{task.type}</span>
                        </div>
                        <h3 className="font-semibold text-white">{task.vehicleName}</h3>
                        <p className="text-gray-300 mt-1">{task.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-400">
                          <span>Assigned: {task.assigned}</span>
                          <span>Created: {formatDateTime(task.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => handleCompleteTask(task)}
                          size="sm"
                          className="btn-rentxotic-sm"
                        >
                          ✓ Complete
                        </Button>
                        <Button
                          onClick={() => handleDeleteTask(task)}
                          size="sm"
                          variant="destructive"
                        >
                          ✗ Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {tasks.filter(t => !t.completed).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No pending tasks
                  </div>
                )}

                {/* Completed Tasks */}
                {tasks.filter(t => t.completed).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-rentxotic-gold mb-4">Completed Tasks</h3>
                    <div className="space-y-2">
                      {tasks.filter(t => t.completed).slice(0, 5).map((task) => (
                        <div key={task.id} className="task-card opacity-60">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-green-400">✓</span>
                              <span className="ml-2 text-white">{task.vehicleName}</span>
                              <span className="ml-2 text-gray-400">- {task.description}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {task.completedAt && formatDateTime(task.completedAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}