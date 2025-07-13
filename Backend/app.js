const express = require('express');
require("dotenv").config();
const cors = require('cors')
const mongoose = require('mongoose')
const agentRoute = require('./routes/AgentRouter');
const projectRoute = require('./routes/ProjectRouter')
const taskRoute = require('./routes/TaskRouter')
const employeeRoute = require('./routes/EmployeeRouter')
const equipmentRoute = require('./routes/EquipmentRouter')
const budgetRoute = require('./routes/BudgetRouter')
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT
const dbURL = process.env.MONGO_URL;

app.get("/", (req, res) => {
  res.send("Hellow World");
});

app.use("/agent",agentRoute)
app.use("/project",projectRoute)
app.use("/task",taskRoute)
app.use("/employee",employeeRoute)
app.use("/equipment",equipmentRoute)
app.use("/budget",budgetRoute)

mongoose.connect(dbURL);

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);