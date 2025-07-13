const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true 
  }
);

const ProjectModel = mongoose.model("project", ProjectSchema);

module.exports = ProjectModel;