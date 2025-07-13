const express = require("express")
const router = express.Router();
const {createProject, deleteProject, getAllProjects, getProjectById} = require("../controller/ProjectController")

router.post('/create',createProject)
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);
router.delete('/delete/:id',deleteProject)


module.exports = router;


