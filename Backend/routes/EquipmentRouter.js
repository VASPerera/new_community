const express = require("express")
const router = express.Router();
const {createEquipment, getEquipment, updateEquipment, deleteEquipmentById, getAllEquipmentByProjectId} = require('../controller/EquipmentController')

router.post('/create/:projectId',createEquipment)
router.get('/get/:equipmentId',getEquipment)
router.put('/update/:equipmentId',updateEquipment)
router.delete('/delete/:equipmentId',deleteEquipmentById)
router.get('/get-all-equipment/:projectId',getAllEquipmentByProjectId)

module.exports = router;