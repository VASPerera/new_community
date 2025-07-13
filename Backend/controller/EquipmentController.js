const EquipmentModel = require('../model/EquipmentSchema')


const createEquipment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      name,
      type,
      status,
      model,
      serialNumber,
      location,
      purchaseDate,
      value,
    } = req.body;

    const newEquipment = new EquipmentModel({
      name,
      type,
      status,
      model,
      serialNumber,
      location,
      purchaseDate,
      value,
      projectId,
    });

    const savedEquipment = await newEquipment.save();

    res.status(201).json({
      message: "Equipment created successfully",
      equipment: savedEquipment,
    });
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ message: "Failed to create equipment" });
  }
};

const getEquipment = async (req, res) => {
  try {
    const { equipmentId } = req.params;

    if (!equipmentId) {
      return res.status(400).json({ message: "Equipment ID is required" });
    }

    const equipment = await EquipmentModel.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.status(200).json({ equipment });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ message: "Failed to fetch equipment" });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const {
      name,
      type,
      status,
      model,
      serialNumber,
      location,
      purchaseDate,
      value,
    } = req.body;

    const equipment = await EquipmentModel.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    // Update fields
    equipment.name = name;
    equipment.type = type;
    equipment.status = status;
    equipment.model = model;
    equipment.serialNumber = serialNumber;
    equipment.location = location;
    equipment.purchaseDate = purchaseDate;
    equipment.value = value;

    await equipment.save();

    res.json({ message: "Equipment updated successfully", equipment });
  } catch (error) {
    console.error("Error updating equipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteEquipmentById = async (req, res) => {
  try {
    const { equipmentId } = req.params;

    const deletedEquipment = await EquipmentModel.findByIdAndDelete(equipmentId);

    if (!deletedEquipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting equipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getAllEquipmentByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const equipment = await EquipmentModel.find({ projectId });

    res.status(200).json(equipment);
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createEquipment, getEquipment, updateEquipment, deleteEquipmentById, getAllEquipmentByProjectId };
