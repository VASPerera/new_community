const BudgetModel = require('../model/BudgetSchema');


const createBudget = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { category, description, budgeted, spent, type, date } = req.body;

    // Basic validation
    if (!category || !description || !date) {
      return res.status(400).json({ message: "Category, description, and date are required." });
    }

    const newBudget = new BudgetModel({
      category,
      description,
      budgeted,
      spent,
      type,
      date,
      projectId
    });

    const savedBudget = await newBudget.save();

    res.status(201).json(savedBudget);
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;

    // Find budget by ID
    const budget = await BudgetModel.findById(budgetId);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error("Error fetching budget:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { category, description, budgeted, spent, type, date } = req.body;

    const budget = await BudgetModel.findById(budgetId);
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    // Update budget fields
    budget.category = category;
    budget.description = description;
    budget.budgeted = budgeted;
    budget.spent = spent;
    budget.type = type;
    budget.date = date;

    await budget.save();

    res.json({ message: "Budget updated successfully", budget });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { budgetId } = req.params;

    const deletedBudget = await BudgetModel.findByIdAndDelete(budgetId);

    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getAllBudgets = async (req, res) => {
  try {
    const { projectId } = req.params;

    const budgets = await BudgetModel.find({ projectId });

    res.status(200).json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createBudget, getBudget, updateBudget, deleteBudget, getAllBudgets };
