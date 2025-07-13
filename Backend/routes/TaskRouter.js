const express = require("express")
const router = express.Router();
const {createTask, getTask, updateTask, deleteTask, getAllTasks} = require("../controller/TaskController")


router.post('/create/:projectId',createTask)
router.get('/get-task/:taskId',getTask)
router.put("/update/:taskId", updateTask);
router.delete("/delete/:taskId", deleteTask);
router.get("/get-all-tasks/:projectId", getAllTasks);

module.exports = router