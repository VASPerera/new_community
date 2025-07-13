import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, User, Phone, Mail } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  salary: number;
  status: "Active" | "Inactive";
  hireDate: string;
}

const EmployeeManager = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    // {
    //   id: '1',
    //   name: 'Mike Johnson',
    //   role: 'Site Manager',
    //   department: 'Construction',
    //   phone: '+1 (555) 123-4567',
    //   email: 'mike.johnson@vegasconstruction.com',
    //   salary: 85000,
    //   status: 'Active',
    //   hireDate: '2023-01-15'
    // },
    // {
    //   id: '2',
    //   name: 'Sarah Davis',
    //   role: 'Electrical Engineer',
    //   department: 'Engineering',
    //   phone: '+1 (555) 234-5678',
    //   email: 'sarah.davis@vegasconstruction.com',
    //   salary: 95000,
    //   status: 'Active',
    //   hireDate: '2022-08-20'
    // },
    // {
    //   id: '3',
    //   name: 'Robert Smith',
    //   role: 'Project Coordinator',
    //   department: 'Operations',
    //   phone: '+1 (555) 345-6789',
    //   email: 'robert.smith@vegasconstruction.com',
    //   salary: 65000,
    //   status: 'Active',
    //   hireDate: '2023-03-10'
    // }
  ]);
  const params = useParams();
  const projectId = String(params?.projectId);

  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "",
    department: "",
    phone: "",
    email: "",
    salary: "",
    status: "Active" as Employee["status"],
    hireDate: "",
  });

  const handleCreateEmployee = async () => {
    if (
      !newEmployee.name ||
      !newEmployee.role ||
      !newEmployee.department ||
      !newEmployee.email
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      ...newEmployee,
      salary: parseFloat(newEmployee.salary) || 0,
      hireDate: newEmployee.hireDate || new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(
        `http://localhost:4000/employee/create/${projectId}`,
        {
          fullName: newEmployee.name,
          role: newEmployee.role,
          department: newEmployee.department,
          email: newEmployee.email,
          phone: newEmployee.phone,
          annualSalary: newEmployee.salary,
          hireDate: newEmployee.hireDate,
        }
      );

      console.log(response.data);
      const createdEmployee = response.data.employee;

      const transformedEmployee = {
        id: createdEmployee._id,
        name: createdEmployee.fullName,
        role: createdEmployee.role,
        department: createdEmployee.department,
        phone: createdEmployee.phone,
        email: createdEmployee.email,
        salary: createdEmployee.annualSalary,
        status: createdEmployee.status,
        hireDate: createdEmployee.hireDate.split("T")[0], // keep only date
      };

      setEmployees([...employees, transformedEmployee]);
      setNewEmployee({
        name: "",
        role: "",
        department: "",
        phone: "",
        email: "",
        salary: "",
        status: "Active",
        hireDate: "",
      });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Employee added successfully!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const handleUpdateEmployee = () => {
  //   if (!editingEmployee) return;

  //   setEmployees(
  //     employees.map((emp) =>
  //       emp.id === editingEmployee.id ? editingEmployee : emp
  //     )
  //   );
  //   setEditingEmployee(null);
  //   toast({
  //     title: "Success",
  //     description: "Employee updated successfully!",
  //   });
  // };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;

    try {
      const res = await axios.put(
        `http://localhost:4000/employee/update/${editingEmployee.id}`,
        {
          fullName: editingEmployee.name,
          role: editingEmployee.role,
          department: editingEmployee.department,
          email: editingEmployee.email,
          phone: editingEmployee.phone,
          annualSalary: editingEmployee.salary,
          hireDate: editingEmployee.hireDate,
          status: editingEmployee.status,
        }
      );

      const updated = res.data.employee;

      setEmployees(
        employees.map((emp) =>
          emp.id === updated._id
            ? {
                id: updated._id,
                name: updated.fullName,
                role: updated.role,
                department: updated.department,
                phone: updated.phone,
                email: updated.email,
                salary: updated.annualSalary,
                status: updated.status,
                hireDate: updated.hireDate?.split("T")[0] || "",
              }
            : emp
        )
      );

      toast({
        title: "Success",
        description: "Employee updated successfully!",
      });
      setEditingEmployee(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
  try {
    await axios.delete(`http://localhost:4000/employee/delete/${employeeId}`);
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
    toast({
      title: "Success",
      description: "Employee removed successfully!",
    });
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to delete employee.",
      variant: "destructive",
    });
  }
};

  const getStatusColor = (status: Employee["status"]) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getAllEmployees = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/employee/get-all/${projectId}`
      );
      // console.log(response.data.employees);

      const backendEmployees = response?.data?.employees ?? [];

      const transformedEmployees = backendEmployees.map((emp) => ({
        id: emp._id,
        name: emp.fullName,
        role: emp.role,
        department: emp.department,
        phone: emp.phone,
        email: emp.email,
        salary: emp.annualSalary,
        status: emp.status,
        hireDate: emp.hireDate.split("T")[0], // trims the time part
      }));

      setEmployees(transformedEmployees);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }finally {
      setLoading(false); // <-- Mark loading as complete
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Employee Management
          </h3>
          <p className="text-gray-600">Manage project team members and staff</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 animate-scale-in">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={newEmployee.role}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, role: e.target.value })
                    }
                    placeholder="Job title"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={newEmployee.department}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        department: e.target.value,
                      })
                    }
                    placeholder="Department"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  placeholder="email@company.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phone: e.target.value })
                    }
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Annual Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, salary: e.target.value })
                    }
                    placeholder="50000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={newEmployee.hireDate}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, hireDate: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={handleCreateEmployee}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee, index) => (
          <Card
            key={employee.id}
            className="hover:shadow-lg transition-all duration-300 animate-fade-in hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    {employee.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {employee.role} - {employee.department}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingEmployee(employee)}
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
                        <AlertDialogTitle>Remove Employee</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {employee.name} from
                          the project? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(
                      employee.status
                    )}`}
                  >
                    {employee.status}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    ${employee.salary.toLocaleString()}/year
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  <div>
                    Hired: {new Date(employee.hireDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Employee Dialog */}
      {editingEmployee && (
        <Dialog
          open={!!editingEmployee}
          onOpenChange={() => setEditingEmployee(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  value={editingEmployee.name}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editRole">Role</Label>
                  <Input
                    id="editRole"
                    value={editingEmployee.role}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        role: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editDepartment">Department</Label>
                  <Input
                    id="editDepartment"
                    value={editingEmployee.department}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        department: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    id="editPhone"
                    value={editingEmployee.phone}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={editingEmployee.status}
                    onValueChange={(value: Employee["status"]) =>
                      setEditingEmployee({ ...editingEmployee, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="editSalary">Annual Salary</Label>
                <Input
                  id="editSalary"
                  type="number"
                  value={editingEmployee.salary}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      salary: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <Button
                onClick={handleUpdateEmployee}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Update Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {!loading && employees.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Employees Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by adding team members to this project
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;
