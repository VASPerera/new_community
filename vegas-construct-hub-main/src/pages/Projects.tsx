import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface Project {
  _id: string;
  projectName: string;
  description: string;
  location: string;
  budget: number;
  startDate: string;
  status: "Planning" | "In Progress" | "Completed";
  progress: number;
}

const Projects = () => {
  const navigate = useNavigate();
  const [agentName, setAgentName] = useState("")
  const [projects, setProjects] = useState<Project[]>([
    // {
    //   id: '1',
    //   name: 'Vegas Strip Casino Renovation',
    //   description: 'Complete renovation of the main casino floor including new gaming areas and restaurants.',
    //   location: 'Las Vegas Strip',
    //   budget: 25000000,
    //   startDate: '2024-01-15',
    //   status: 'In Progress',
    //   progress: 65
    // },
    // {
    //   id: '2',
    //   name: 'Downtown Office Complex',
    //   description: 'Modern 15-story office building with retail spaces on ground floor.',
    //   location: 'Downtown Las Vegas',
    //   budget: 45000000,
    //   startDate: '2024-03-01',
    //   status: 'Planning',
    //   progress: 15
    // },
    // {
    //   id: '3',
    //   name: 'Residential Community Phase 1',
    //   description: 'Luxury residential development with 200 homes and community amenities.',
    //   location: 'Henderson, NV',
    //   budget: 80000000,
    //   startDate: '2023-09-01',
    //   status: 'In Progress',
    //   progress: 85
    // }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    location: "",
    budget: "",
    startDate: "",
  });

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.location || !newProject.budget) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const project: Project = {
      _id: Date.now().toString(),
      projectName: newProject.name,
      description: newProject.description,
      location: newProject.location,
      budget: parseInt(newProject.budget),
      startDate: newProject.startDate || new Date().toISOString().split("T")[0],
      status: "Planning",
      progress: 0,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/project/create",
        {
          ...newProject,
          projectName: newProject.name,
        }
      );
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }

    setProjects([...projects, project]);
    console.log(projects);
    setNewProject({
      name: "",
      description: "",
      location: "",
      budget: "",
      startDate: "",
    });
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: "Project created successfully!",
    });
  };

  const handleDeleteProject = async(projectId: string) => {
    setProjects(projects.filter((p) => p._id !== projectId));

    try {
      
      const response = await axios.delete(`http://localhost:4000/project/delete/${projectId}`)
    console.log(response.data)
    } catch (error) {
      console.log(error)
    }

    toast({
      title: "Success",
      description: "Project deleted successfully!",
    });
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/dashboard/${projectId}`);
  };

  const handleLogout = async() => {
    // navigate("/");
    try {
      const agentId = localStorage.getItem("agentId");
      const response = await axios.post(`http://localhost:4000/agent/logout/${agentId}`)
      console.log(response.data)

      if(response.data.message == "User logged out successfully"){
        localStorage.removeItem("token"); // or sessionStorage
        navigate("/");
      }
    } catch (error) {
      console.log(error)
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAllProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/project/projects"
      );
      console.log(response.data.data);
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false); // <-- Mark loading as complete
    }
  };

  const fetchAgentData = async() => {
    try {
      const agentId = localStorage.getItem("agentId");
      if (!agentId) {
        console.error("Agent ID not found in localStorage");
        return;
      }

      const response = await axios.get(`http://localhost:4000/agent/get-agent/${agentId}`);
      // console.log(response.data.firstName);

      const name = response.data.firstName

      setAgentName(name)
      // Do something with response.data
    } catch (error) {
      console.error("Error fetching agent data:", error);
    }
  }

  useEffect(() => {
    getAllProjects();
    fetchAgentData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                Vegas Construction
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-5 h-5" />
                <span>{agentName}</span>
              </div>
              {/* <Button 
                variant="outline" 
                onClick={() => navigate('/change-password')}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Change Password</span>
              </Button> */}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Construction Projects
            </h2>
            <p className="text-gray-600 mt-2">
              Manage your construction projects and track progress
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white animate-scale-in">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={newProject.location}
                    onChange={(e) =>
                      setNewProject({ ...newProject, location: e.target.value })
                    }
                    placeholder="Enter project location"
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newProject.budget}
                    onChange={(e) =>
                      setNewProject({ ...newProject, budget: e.target.value })
                    }
                    placeholder="Enter budget amount"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter project description"
                  />
                </div>
                <Button
                  onClick={handleCreateProject}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={project._id}
              className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500 animate-fade-in hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle
                      className="text-lg font-semibold text-gray-900 hover:text-amber-600 cursor-pointer transition-colors"
                      onClick={() => handleProjectClick(project._id)}
                    >
                      {project.projectName}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {project.location}
                    </CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the project "{project.projectName}" and all
                          associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProject(project._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {project.progress}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Budget: Rs {project.budget.toLocaleString()}</span>
                    <span>
                      Start: {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleProjectClick(project._id)}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  >
                    View Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && projects.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-12 h-12 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Projects Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start by creating your first construction project
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Project Name *</Label>
                    <Input
                      id="name"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newProject.location}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          location: e.target.value,
                        })
                      }
                      placeholder="Enter project location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget *</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={newProject.budget}
                      onChange={(e) =>
                        setNewProject({ ...newProject, budget: e.target.value })
                      }
                      placeholder="Enter budget amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter project description"
                    />
                  </div>
                  <Button
                    onClick={handleCreateProject}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    Create Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
