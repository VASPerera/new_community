const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "In Use", "Maintenance", "Out of Service"],
    },
    model: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
    },
    location: {
      type: String,
    },
    purchaseDate: {
      type: Date,
    },
    value: {
      type: Number,
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

const EquipmentModel = mongoose.model("equipment", equipmentSchema);

module.exports = EquipmentModel;
