const express = require("express")
const router = express.Router();
const {createProject, deleteProject, getAllProjects, getProjectById} = require("../controller/ProjectController")

router.post('/create/:agentId',createProject)
router.get('/projects/:agentId', getAllProjects);
router.get('/projectsby/:id', getProjectById);
router.delete('/delete/:id',deleteProject)


module.exports = router;


