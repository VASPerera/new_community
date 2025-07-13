const express = require("express")
const router = express.Router();
const {createEmployee, getEmployeeById, updateEmployee, deleteEmployee, getEmployeesByProjectId} = require("../controller/EmployeeController")

router.post('/create/:projectId',createEmployee)
router.get('/get-employee/:id',getEmployeeById)
router.put('/update/:employeeId',updateEmployee)
router.delete('/delete/:employeeId',deleteEmployee)
router.get('/get-all/:projectId',getEmployeesByProjectId)

module.exports = router