import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useParams } from "react-router-dom";

interface BudgetItem {
  _id: string;
  category: string;
  description: string;
  budgeted: number;
  spent: number;
  type: "Income" | "Expense";
  date: string;
}

const BudgetManager = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    // {
    //   id: '1',
    //   category: 'Labor',
    //   description: 'Construction workers and contractors',
    //   budgeted: 5000000,
    //   spent: 3250000,
    //   type: 'Expense',
    //   date: '2024-01-15'
    // },
    // {
    //   id: '2',
    //   category: 'Materials',
    //   description: 'Concrete, steel, and building materials',
    //   budgeted: 8000000,
    //   spent: 5200000,
    //   type: 'Expense',
    //   date: '2024-01-20'
    // },
    // {
    //   id: '3',
    //   category: 'Equipment',
    //   description: 'Heavy machinery and tool rentals',
    //   budgeted: 3000000,
    //   spent: 1800000,
    //   type: 'Expense',
    //   date: '2024-02-01'
    // },
    // {
    //   id: '4',
    //   category: 'Project Funding',
    //   description: 'Initial project investment',
    //   budgeted: 25000000,
    //   spent: 25000000,
    //   type: 'Income',
    //   date: '2024-01-01'
    // }
  ]);

  const params = useParams();
  const projectId = String(params?.projectId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [newItem, setNewItem] = useState({
    category: "",
    description: "",
    budgeted: "",
    spent: "",
    type: "Expense" as BudgetItem["type"],
    date: "",
  });

  const handleCreateItem = async () => {
    if (!newItem.category || !newItem.budgeted) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const item: BudgetItem = {
      _id: Date.now().toString(),
      ...newItem,
      budgeted: parseFloat(newItem.budgeted),
      spent: parseFloat(newItem.spent) || 0,
      date: newItem.date || new Date().toISOString().split("T")[0],
    };

    try {
      const res = await axios.post(
        `http://localhost:4000/budget/create/${projectId}`,
        item
      );

      console.log(res.data);

      const createdBudget = res.data;

      setBudgetItems([...budgetItems, createdBudget]);
      setNewItem({
        category: "",
        description: "",
        budgeted: "",
        spent: "",
        type: "Expense",
        date: "",
      });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Budget item added successfully!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const res = await axios.put(
        `http://localhost:4000/budget/update/${editingItem._id}`,
        editingItem
      );

      console.log(res.data.budget);

      const updated = res.data.budget;

      setBudgetItems(
        budgetItems.map((item) => (item._id === updated._id ? updated : item))
      );
      setEditingItem(null);
      toast({
        title: "Success",
        description: "Budget item updated successfully!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteItem = async(itemId: string) => {
    try {
      await axios.delete(`http://localhost:4000/budget/delete/${itemId}`);
      setBudgetItems(budgetItems.filter((item) => item._id !== itemId));
      toast({
        title: "Success",
        description: "Budget item deleted successfully!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const totalBudgeted = budgetItems.reduce(
    (acc, item) =>
      item.type === "Income" ? acc + item.budgeted : acc - item.budgeted,
    0
  );

  const totalSpent = budgetItems.reduce(
    (acc, item) =>
      item.type === "Income" ? acc + item.spent : acc - item.spent,
    0
  );

  const getUsagePercentage = (spent: number, budgeted: number) => {
    return budgeted > 0 ? (spent / budgeted) * 100 : 0;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage > 90) return "text-red-600";
    if (percentage > 75) return "text-yellow-600";
    return "text-green-600";
  };

  const getAllBudget = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/budget/get-all-budgets/${projectId}`
      );
      // console.log(response.data);
      const allEquipment = response.data;
      setBudgetItems(allEquipment);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    getAllBudget();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Budget Management
          </h3>
          <p className="text-gray-600">Track project finances and expenses</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 animate-scale-in">
              <Plus className="w-4 h-4 mr-2" />
              Add Budget Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Budget Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  placeholder="Budget category"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  placeholder="Brief description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newItem.type}
                    onValueChange={(value: BudgetItem["type"]) =>
                      setNewItem({ ...newItem, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Income">Income</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newItem.date}
                    onChange={(e) =>
                      setNewItem({ ...newItem, date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budgeted">Budgeted Amount *</Label>
                  <Input
                    id="budgeted"
                    type="number"
                    value={newItem.budgeted}
                    onChange={(e) =>
                      setNewItem({ ...newItem, budgeted: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="spent">Spent Amount</Label>
                  <Input
                    id="spent"
                    type="number"
                    value={newItem.spent}
                    onChange={(e) =>
                      setNewItem({ ...newItem, spent: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <Button
                onClick={handleCreateItem}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Add Budget Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs {totalBudgeted.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Project allocation</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs {totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Expenses to date</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs {(totalBudgeted - totalSpent).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Available funds</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgetItems.map((item, index) => (
          <Card
            key={item._id}
            className="hover:shadow-lg transition-all duration-300 animate-fade-in hover:scale-105"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-500" />
                    {item.category}
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === "Income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.type}
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {item.description}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingItem(item)}
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
                        <AlertDialogTitle>Delete Budget Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the budget item "
                          {item.category}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteItem(item._id)}
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500">Budgeted</label>
                    <p className="font-semibold">
                      Rs {item.budgeted.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-500">Spent</label>
                    <p className="font-semibold">
                      Rs {item.spent.toLocaleString()}
                    </p>
                  </div>
                </div>

                {item.type === "Expense" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Usage</span>
                      <span
                        className={`text-sm font-medium ${getUsageColor(
                          getUsagePercentage(item.spent, item.budgeted)
                        )}`}
                      >
                        {getUsagePercentage(item.spent, item.budgeted).toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={getUsagePercentage(item.spent, item.budgeted)}
                      className="h-2"
                    />
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  <div>Date: {new Date(item.date).toLocaleDateString()}</div>
                  {item.type === "Expense" && (
                    <div>
                      Remaining: $
                      {(item.budgeted - item.spent).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Budget Item Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Budget Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCategory">Category</Label>
                <Input
                  id="editCategory"
                  value={editingItem.category}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, category: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Input
                  id="editDescription"
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editType">Type</Label>
                  <Select
                    value={editingItem.type}
                    onValueChange={(value: BudgetItem["type"]) =>
                      setEditingItem({ ...editingItem, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Income">Income</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editDate">Date</Label>
                  <Input
                    id="editDate"
                    type="date"
                    value={editingItem.date}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editBudgeted">Budgeted Amount</Label>
                  <Input
                    id="editBudgeted"
                    type="number"
                    value={editingItem.budgeted}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        budgeted: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editSpent">Spent Amount</Label>
                  <Input
                    id="editSpent"
                    type="number"
                    value={editingItem.spent}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        spent: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleUpdateItem}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Update Budget Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {budgetItems.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-12 h-12 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Budget Items Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by adding budget categories to track finances
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;
