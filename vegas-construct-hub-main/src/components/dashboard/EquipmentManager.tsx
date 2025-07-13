import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Wrench, Truck, Settings } from "lucide-react";
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

interface Equipment {
  _id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: "Available" | "In Use" | "Maintenance" | "Out of Service";
  location: string;
  purchaseDate: string;
  value: number;
}

const EquipmentManager = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([
    // {
    //   id: '1',
    //   name: 'Excavator CAT 320',
    //   type: 'Heavy Machinery',
    //   model: 'CAT 320D',
    //   serialNumber: 'EXC001',
    //   status: 'In Use',
    //   location: 'Site A - Foundation',
    //   purchaseDate: '2022-05-15',
    //   value: 350000
    // },
    // {
    //   id: '2',
    //   name: 'Tower Crane',
    //   type: 'Lifting Equipment',
    //   model: 'Liebherr 280HC',
    //   serialNumber: 'TC001',
    //   status: 'Available',
    //   location: 'Equipment Yard',
    //   purchaseDate: '2021-08-20',
    //   value: 1200000
    // },
    // {
    //   id: '3',
    //   name: 'Concrete Mixer',
    //   type: 'Construction Vehicle',
    //   model: 'Volvo FM460',
    //   serialNumber: 'CM001',
    //   status: 'Maintenance',
    //   location: 'Maintenance Shop',
    //   purchaseDate: '2023-02-10',
    //   value: 180000
    // }
  ]);

  const params = useParams();
  const projectId = String(params?.projectId);

  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null
  );
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "",
    model: "",
    serialNumber: "",
    status: "Available" as Equipment["status"],
    location: "",
    purchaseDate: "",
    value: "",
  });

  const handleCreateEquipment = async () => {
    if (
      !newEquipment.name ||
      !newEquipment.type ||
      !newEquipment.serialNumber
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const equipmentItem: Equipment = {
      _id: Date.now().toString(),
      ...newEquipment,
      value: parseFloat(newEquipment.value) || 0,
      purchaseDate:
        newEquipment.purchaseDate || new Date().toISOString().split("T")[0],
    };

    try {
      const res = await axios.post(
        `http://localhost:4000/equipment/create/${projectId}`,
        equipmentItem
      );
      const createdEquipment = res.data.equipment;
      // console.log(res.data);

      setEquipment([...equipment, createdEquipment]);
      setNewEquipment({
        name: "",
        type: "",
        model: "",
        serialNumber: "",
        status: "Available",
        location: "",
        purchaseDate: "",
        value: "",
      });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Equipment added successfully!",
      });
    } catch (error) {}
  };

  const handleUpdateEquipment = async() => {
    if (!editingEquipment) return;

    try {
      const res = await axios.put(
        `http://localhost:4000/equipment/update/${editingEquipment._id}`,
        editingEquipment
      );
      // console.log(res.data)
      const updated = res.data.equipment;
      setEquipment(
      equipment.map((eq) =>
        eq._id === updated._id ? updated : eq
      )
    );
    setEditingEquipment(null);
    toast({
      title: "Success",
      description: "Equipment updated successfully!",
    });
    } catch (error) {
      console.log(error)
    }
  };

  const handleDeleteEquipment = async(equipmentId: string) => {
    try {
      await axios.delete(`http://localhost:4000/equipment/delete/${equipmentId}`);
      setEquipment(equipment.filter((eq) => eq._id !== equipmentId));
    toast({
      title: "Success",
      description: "Equipment removed successfully!",
    });
    } catch (error) {
      console.log(error)
    }
  };

  const getStatusColor = (status: Equipment["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "In Use":
        return "bg-blue-100 text-blue-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Service":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEquipmentIcon = (type: string) => {
    if (
      type.toLowerCase().includes("machinery") ||
      type.toLowerCase().includes("heavy")
    ) {
      return <Wrench className="w-5 h-5 text-orange-500" />;
    } else if (
      type.toLowerCase().includes("vehicle") ||
      type.toLowerCase().includes("truck")
    ) {
      return <Truck className="w-5 h-5 text-blue-500" />;
    } else {
      return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAllEquipment = async() => {
    try {
      const response = await axios.get(
        `http://localhost:4000/equipment/get-all-equipment/${projectId}`
      );
      // console.log(response.data);
      const allEquipment = response.data;
      setEquipment(allEquipment);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false); // <-- Mark loading as complete
    }
  }

  useEffect (() => {
    getAllEquipment()
  },[])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Equipment Management
          </h3>
          <p className="text-gray-600">
            Track and manage construction equipment
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 animate-scale-in">
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Equipment Name *</Label>
                <Input
                  id="name"
                  value={newEquipment.name}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, name: e.target.value })
                  }
                  placeholder="Equipment name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Input
                    id="type"
                    value={newEquipment.type}
                    onChange={(e) =>
                      setNewEquipment({ ...newEquipment, type: e.target.value })
                    }
                    placeholder="Equipment type"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={newEquipment.model}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        model: e.target.value,
                      })
                    }
                    placeholder="Model number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  value={newEquipment.serialNumber}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      serialNumber: e.target.value,
                    })
                  }
                  placeholder="Serial/ID number"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newEquipment.status}
                    onValueChange={(value: Equipment["status"]) =>
                      setNewEquipment({ ...newEquipment, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="In Use">In Use</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Out of Service">
                        Out of Service
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newEquipment.value}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        value: e.target.value,
                      })
                    }
                    placeholder="Equipment value"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  value={newEquipment.location}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      location: e.target.value,
                    })
                  }
                  placeholder="Where is this equipment located?"
                />
              </div>
              <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={newEquipment.purchaseDate}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      purchaseDate: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                onClick={handleCreateEquipment}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                Add Equipment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((eq, index) => (
          <Card
            key={eq._id}
            className="hover:shadow-lg transition-all duration-300 animate-fade-in hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {getEquipmentIcon(eq.type)}
                    {eq.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {eq.type} - {eq.model}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingEquipment(eq)}
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
                        <AlertDialogTitle>Remove Equipment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove "{eq.name}" from the
                          equipment list? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEquipment(eq._id)}
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
                <div className="text-sm text-gray-600">
                  <div>
                    <strong>Serial:</strong> {eq.serialNumber}
                  </div>
                  <div>
                    <strong>Location:</strong> {eq.location}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(
                      eq.status
                    )}`}
                  >
                    {eq.status}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    ${eq.value.toLocaleString()}
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  <div>
                    Purchased: {new Date(eq.purchaseDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Equipment Dialog */}
      {editingEquipment && (
        <Dialog
          open={!!editingEquipment}
          onOpenChange={() => setEditingEquipment(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Equipment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Equipment Name</Label>
                <Input
                  id="editName"
                  value={editingEquipment.name}
                  onChange={(e) =>
                    setEditingEquipment({
                      ...editingEquipment,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editType">Type</Label>
                  <Input
                    id="editType"
                    value={editingEquipment.type}
                    onChange={(e) =>
                      setEditingEquipment({
                        ...editingEquipment,
                        type: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editModel">Model</Label>
                  <Input
                    id="editModel"
                    value={editingEquipment.model}
                    onChange={(e) =>
                      setEditingEquipment({
                        ...editingEquipment,
                        model: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editSerialNumber">Serial Number</Label>
                <Input
                  id="editSerialNumber"
                  value={editingEquipment.serialNumber}
                  onChange={(e) =>
                    setEditingEquipment({
                      ...editingEquipment,
                      serialNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={editingEquipment.status}
                    onValueChange={(value: Equipment["status"]) =>
                      setEditingEquipment({
                        ...editingEquipment,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="In Use">In Use</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Out of Service">
                        Out of Service
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editValue">Value ($)</Label>
                  <Input
                    id="editValue"
                    type="number"
                    value={editingEquipment.value}
                    onChange={(e) =>
                      setEditingEquipment({
                        ...editingEquipment,
                        value: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editLocation">Current Location</Label>
                <Input
                  id="editLocation"
                  value={editingEquipment.location}
                  onChange={(e) =>
                    setEditingEquipment({
                      ...editingEquipment,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                onClick={handleUpdateEquipment}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                Update Equipment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {!loading && equipment.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-12 h-12 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Equipment Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by adding equipment to this project
          </p>
        </div>
      )}
    </div>
  );
};

export default EquipmentManager;
