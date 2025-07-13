const ProjectSchema = require("../model/ProjectSchema");

const createProject = async (req, res) => {
  try {
    const { projectName, location, budget, startDate, description } = req.body;

    if (!projectName || !location || !budget ) {
      return res.status(400).json({ status: "Error", message: "All fields are required." });
    }

    const project = await ProjectSchema.create({
      projectName: projectName,
      location: location,
      budget: budget,
      startDate: startDate,
      description: description
    });

    res.status(201).json({ status: "Success", project: project });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectSchema.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({message:"success",project});
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectSchema.find();
    res.status(200).json({ status: "Success", data: projects });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProjectSchema.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ status: "Error", message: "Project not found" });
    }

    res.status(200).json({ status: "Success", message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};

module.exports = {createProject, deleteProject, getProjectById, getAllProjects}