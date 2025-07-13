const express = require("express")
const router = express.Router();
const {createBudget, getBudget, updateBudget, deleteBudget, getAllBudgets} = require('../controller/BudgetController')

router.post('/create/:projectId',createBudget)
router.get('/get/:budgetId',getBudget)
router.put('/update/:budgetId',updateBudget)
router.delete('/delete/:budgetId',deleteBudget)
router.get('/get-all-budgets/:projectId',getAllBudgets)

module.exports = router