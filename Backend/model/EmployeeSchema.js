const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    annualSalary: {
      type: Number,
      required: true,
    },
    hireDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmployeeModel = mongoose.model("employee", EmployeeSchema);

module.exports = EmployeeModel;
