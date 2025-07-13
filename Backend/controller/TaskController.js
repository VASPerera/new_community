const TaskSchema = require("../model/TaskSchema")


const createTask = async (req, res) => {
  try {

    const { projectId } = req.params;
    const { title, assignerName, priority, dueDate, description } = req.body;

    if (!title || !assignerName || !priority || !dueDate) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const newTask = new TaskSchema({
      title,
      assignerName,
      priority,
      dueDate,
      description,
      projectId,
    });

    await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await TaskSchema.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const {taskId} = req.params;
    const { title, assignerName, status, priority, dueDate, description } = req.body;

    const task = await TaskSchema.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update task fields
    task.title = title;
    task.assignerName = assignerName;
    task.status = status;
    task.priority = priority;
    task.dueDate = dueDate;
    task.description = description;

    await task.save();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await TaskSchema.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await TaskSchema.find({ projectId });

    res.status(200).json(tasks,{count: tasks.length});
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {createTask, getTask, updateTask, deleteTask, getAllTasks}
