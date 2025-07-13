import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useParams } from "react-router";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  assignerName: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([
    // {
    //   id: '',
    //   title: '',
    //   description: '',
    //   status: 'Completed',
    //   priority: '',
    //   assignee: '',
    //   dueDate: '',
    //   createdAt: '2024-05-15'
    // },
    // {
    //   id: '2',
    //   title: 'Install Electrical Systems',
    //   description: 'Install main electrical panels and wiring for floors 1-5',
    //   status: 'In Progress',
    //   priority: 'High',
    //   assignee: 'Sarah Davis',
    //   dueDate: '2024-06-15',
    //   createdAt: '2024-05-20'
    // },
    // {
    //   id: '3',
    //   title: 'Order Construction Materials',
    //   description: 'Order steel beams and concrete for next construction phase',
    //   status: 'Pending',
    //   priority: 'Medium',
    //   assignee: 'Robert Smith',
    //   dueDate: '2024-06-10',
    //   createdAt: '2024-05-25'
    // }
  ]);

  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Pending" as Task["status"],
    priority: "Medium" as Task["priority"],
    assignerName: "",
    dueDate: "",
  });

  const { status, ...taskData } = newTask;

  const params = useParams();
  const projectId = String(params?.projectId);

  const handleCreateTask = async () => {
    console.log(projectId);

    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID is missing.",
        variant: "destructive",
      });
      return;
    }
    if (!newTask.title || !newTask.assignerName || !newTask.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:4000/task/create/${projectId}`,
        taskData
      );
      const createdTask = res.data.task;
      console.log(res.data.task);

      setTasks([...tasks, createdTask]);
      setNewTask({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        assignerName: "",
        dueDate: "",
      });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async() => {
    if (!editingTask) return;
    try {
      const res = await axios.put(
        `http://localhost:4000/task/update/${editingTask._id}`,
        editingTask
      );
      // console.log(res.data)
      const updated = res.data.task;
      setTasks(
        tasks.map((task) => (task._id === updated._id ? updated : task))
      );
      toast({ title: "Success", description: "Task updated successfully!" });
      setEditingTask(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
    // if (!editingTask) return;

    // setTasks(
    //   tasks.map((task) => (task._id === editingTask._id ? editingTask : task))
    // );
    // setEditingTask(null);
    // toast({
    //   title: "Success",
    //   description: "Task updated successfully!",
    // });
  };

  const handleDeleteTask = async(taskId: string) => {

    try {
    await axios.delete(`http://localhost:4000/task/delete/${taskId}`);
    setTasks(tasks.filter((task) => task._id !== taskId));
    toast({
      title: "Success",
      description: "Task deleted successfully!",
    });
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to delete task.",
      variant: "destructive",
    });
  }
    // setTasks(tasks.filter((task) => task._id !== taskId));
    // toast({
    //   title: "Success",
    //   description: "Task deleted successfully!",
    // });
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "Pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
    }
  };

  const getAllTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/task/get-all-tasks/${projectId}`
      );
      // console.log(response.data);
      const allTask = response.data;
      const lenthOfTask = response.data.length
      // localStorage.setItem("taskCount", lenthOfTask.toString());
      setTasks(allTask);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false); // <-- Mark loading as complete
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Task Management</h3>
          <p className="text-gray-600">Manage and track project tasks</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 animate-scale-in">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="assignee">Assignee *</Label>
                <Input
                  id="assignee"
                  value={newTask.assignerName}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignerName: e.target.value })
                  }
                  placeholder="Enter assignee name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: Task["priority"]) =>
                      setNewTask({ ...newTask, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Enter task description"
                />
              </div>
              <Button
                onClick={handleCreateTask}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
          <Card
            key={task._id}
            className="hover:shadow-lg transition-all duration-300 animate-fade-in hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    {task.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Assigned to {task.assignerName}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTask(task);
                    }}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
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
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the task "{task.title}
                          "? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTask(task._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{task.description}</p>

                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority} Priority
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                  <div>
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Task Dialog */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTitle">Task Title</Label>
                <Input
                  id="editTitle"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editAssignee">Assignee</Label>
                <Input
                  id="editAssignee"
                  value={editingTask.assignerName}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      assignerName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={editingTask.status}
                    onValueChange={(value: Task["status"]) =>
                      setEditingTask({ ...editingTask, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editPriority">Priority</Label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value: Task["priority"]) =>
                      setEditingTask({ ...editingTask, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="editDueDate">Due Date</Label>
                <Input
                  id="editDueDate"
                  type="date"
                  value={editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : ""}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, dueDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                onClick={handleUpdateTask}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Update Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {!loading && tasks.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Tasks Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by creating your first task for this project
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
