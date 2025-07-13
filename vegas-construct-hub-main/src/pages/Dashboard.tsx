import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskManager from "../components/dashboard/TaskManager";
import EmployeeManager from "../components/dashboard/EmployeeManager";
import EquipmentManager from "../components/dashboard/EquipmentManager";
import BudgetManager from "../components/dashboard/BudgetManager";
import axios from "axios";
import { ProjectDashboardContext } from "@/lib/context/projectContext";

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate?: string;
  status: "Active" | "Completed" | "On Hold" | "In Progress";
  progress: number;
}

export interface ProjectStatistics {
  projectProgress: number;
  budgetUsed: number;
  activeTasks: number;
  equipmentCount: number;
}

const Dashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [taskLength, setTaskLength] = useState(0);
  const [agentName, setAgentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [project, setProject] = useState<Project>({
    id: "",
    name: "",
    description: "No description provided.",
    location: "",
    budget: 0,
    spent: 0,
    startDate: "",
    status: "Active",
    progress: 0,
  });

  const [projectStatistics, setProjectStatistics] = useState<ProjectStatistics>(
    {
      projectProgress: 0,
      budgetUsed: 0,
      activeTasks: 0,
      equipmentCount: 0,
    }
  );

  const [activeTab, setActiveTab] = useState("overview");

  const handleBack = () => {
    navigate("/projects");
  };

  const budgetPercentage = (project.spent / project.budget) * 100;
  const remainingBudget = project.budget - project.spent;

  // Fetch project data
  const getProject = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/project/projects/${projectId}`
      );

      const data = response.data.project;

      setProject({
        id: data._id,
        name: data.projectName,
        description: data.description || "No description provided.",
        location: data.location,
        budget: data.budget,
        spent: data.spent || 0,
        startDate: data.startDate?.split("T")[0] || "",
        endDate: data.endDate?.split("T")[0] || "",
        status: data.status || "Active",
        progress: data.progress || 0,
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Failed to fetch project details");
    }
  };

  // Fetch agent data
  const fetchAgentData = async () => {
    try {
      const agentId = localStorage.getItem("agentId");
      if (!agentId) {
        console.error("Agent ID not found in localStorage");
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/agent/get-agent/${agentId}`
      );
      const name = response.data.firstName;
      setAgentName(name);
    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
  };

  // Fetch equipment count
  const fetchEquipmentCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/equipment/get-all-equipment/${projectId}`
      );
      const equipmentData = response.data;

      setProjectStatistics((prevStats) => ({
        ...prevStats,
        equipmentCount: Array.isArray(equipmentData) ? equipmentData.length : 0,
      }));
    } catch (error) {
      console.error("Error fetching equipment count:", error);
      setProjectStatistics((prevStats) => ({
        ...prevStats,
        equipmentCount: 0,
      }));
    }
  };

  // Fetch tasks data (assuming you have a tasks endpoint)
  const fetchTasksData = async () => {
    try {
      // Assuming you have a tasks endpoint similar to equipment
      const response = await axios.get(
        `http://localhost:4000/task/get-all-tasks/${projectId}`
      );
      const tasksData = response.data;

      if (Array.isArray(tasksData)) {
        const activeTasks = tasksData.filter(
          (task) =>
            task.status === "active" ||
            task.status === "In Progress" ||
            task.status === "Pending"
        ).length;

        const completedTasks = tasksData.filter(
          (task) => task.status === "Completed" || task.status === "done"
        ).length;

        const totalTasks = tasksData.length;
        const progress =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        setProjectStatistics((prevStats) => ({
          ...prevStats,
          activeTasks: activeTasks,
          projectProgress: progress,
        }));
      }
    } catch (error) {
      console.error("Error fetching tasks data:", error);
      // Set default values if tasks endpoint doesn't exist
      setProjectStatistics((prevStats) => ({
        ...prevStats,
        activeTasks: 0,
        projectProgress: 0,
      }));
    }
  };

  // Fetch budget details
  const fetchBudgetDetails = async () => {
    try {
      const projectResponse = await axios.get(
        `http://localhost:4000/project/projects/${projectId}`
      );
      const data = projectResponse.data.project;

      const totalBudget = data.budget;
      const budgetResponse = await axios.get(
        `http://localhost:4000/budget/get-all-budgets/${projectId}`
      );
      const budgetData = budgetResponse.data;

      console.log(budgetData);

      if (budgetData && Array.isArray(budgetData) && budgetData.length > 0) {
        // const totalBudget = budgetData.reduce(
        //   (sum: number, budget: any) => sum + (budget.allocatedAmount || 0),
        //   0
        // );

        console.log(totalBudget);
        // const totalSpent = budgetData.reduce((sum: number, budget: any) =>
        //   sum + (budget.spentAmount || 0), 0
        // );

        const totalSpent = budgetData.reduce(
          (acc, item) =>
            item.type === "Expense" ? acc + item.spent : acc - item.spent,
          0
        );
        console.log(totalSpent);
        const budgetUsedPercentage =
          totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

        setProjectStatistics((prevStats) => ({
          ...prevStats,
          budgetUsed: budgetUsedPercentage,
        }));

        // Update project spent amount if available
        setProject((prevProject) => ({
          ...prevProject,
          spent: totalSpent,
          budget: totalBudget > 0 ? totalBudget : prevProject.budget,
        }));
      } else {
        // No budget data available
        setProjectStatistics((prevStats) => ({
          ...prevStats,
          budgetUsed: 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching budget details:", error);
      setProjectStatistics((prevStats) => ({
        ...prevStats,
        budgetUsed: 0,
      }));
    }
  };

  // Fetch employees data (assuming you have an employees endpoint)
  // const fetchEmployeesData = async () => {
  //   try {
  //     // Assuming you have an employees endpoint
  //     const response = await axios.get(
  //       `http://localhost:4000/employees/get-all-employees/${projectId}`
  //     );
  //     const employeesData = response.data;

  //     // You can add employee-related statistics here if needed
  //     console.log("Employees data:", employeesData);
  //   } catch (error) {
  //     console.error("Error fetching employees data:", error);
  //     // Handle case where employees endpoint might not exist
  //   }
  // };

  // Initialize all data
  const initializeData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        getProject(),
        fetchAgentData(),
        fetchEquipmentCount(),
        fetchBudgetDetails(),
        fetchTasksData(),
        // fetchEmployeesData(),
      ]);
    } catch (error) {
      console.error("Error initializing dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      initializeData();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={initializeData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <ProjectDashboardContext.Provider value={projectStatistics}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Projects</span>
                </Button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg"></div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {project.name}
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span>{agentName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Project Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Project Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectStatistics.projectProgress}%
                </div>
                <Progress
                  value={projectStatistics.projectProgress}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Budget Used
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectStatistics.budgetUsed}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Rs {remainingBudget.toLocaleString()} remaining
                </p>
                <Progress
                  value={projectStatistics.budgetUsed}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Tasks
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectStatistics.activeTasks}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks in progress
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equipment</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectStatistics.equipmentCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total equipment items
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Location
                      </label>
                      <p className="text-gray-900">{project.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Description
                      </label>
                      <p className="text-gray-900">{project.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Start Date
                        </label>
                        <p className="text-gray-900">
                          {project.startDate
                            ? new Date(project.startDate).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          End Date
                        </label>
                        <p className="text-gray-900">
                          {project.endDate
                            ? new Date(project.endDate).toLocaleDateString()
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Total Budget
                        </label>
                        <p className="text-gray-900">
                          Rs {project.budget.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Amount Spent
                        </label>
                        <p className="text-gray-900">
                          Rs {project.spent.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Status
                      </label>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {project.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Progress
                        </span>
                        <span className="text-sm font-bold">
                          {projectStatistics.projectProgress}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Budget Usage
                        </span>
                        <span className="text-sm font-bold">
                          {projectStatistics.budgetUsed}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Active Tasks
                        </span>
                        <span className="text-sm font-bold">
                          {projectStatistics.activeTasks}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Equipment Items
                        </span>
                        <span className="text-sm font-bold">
                          {projectStatistics.equipmentCount}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks">
              <TaskManager />
            </TabsContent>

            <TabsContent value="employees">
              <EmployeeManager />
            </TabsContent>

            <TabsContent value="equipment">
              <EquipmentManager />
            </TabsContent>

            <TabsContent value="budget">
              <BudgetManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProjectDashboardContext.Provider>
  );
};

export default Dashboard;
