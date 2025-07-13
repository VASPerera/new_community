const EmployeeModel = require('../model/EmployeeSchema');

const createEmployee = async (req, res) => {
  try {

    const { projectId } = req.params;
    const {
      fullName,
      role,
      department,
      email,
      phone,
      annualSalary,
      hireDate,
      status
    } = req.body;

    // Check for required fields
    if (
      !fullName || !role || !department ||
      !email || !phone || !annualSalary || !hireDate
    ) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const employee = new EmployeeModel({
      fullName,
      role,
      department,
      email,
      phone,
      annualSalary,
      hireDate,
      status: status || 'Active',
      projectId
    });

    const savedEmployee = await employee.save();

    // 201 Created
    return res.status(201).json({
      message: "Employee created successfully.",
      employee: savedEmployee
    });

  } catch (err) {
    console.error("Create Employee Error:", err);

    // 500 Server Error
    return res.status(500).json({
      message: "Internal server error while creating employee."
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await EmployeeModel.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      fullName,
      role,
      department,
      email,
      phone,
      annualSalary,
      hireDate,
      status,
    } = req.body;

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update employee fields
    employee.fullName = fullName;
    employee.role = role;
    employee.department = department;
    employee.email = email;
    employee.phone = phone;
    employee.annualSalary = annualSalary;
    employee.hireDate = hireDate;
    employee.status = status || 'Active';

    await employee.save();

    res.json({ message: "Employee updated successfully", employee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const deletedEmployee = await EmployeeModel.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const getEmployeesByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const employees = await EmployeeModel.find({ projectId });

    res.status(200).json({ employees });
  } catch (error) {
    console.error("Error fetching employees by projectId:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = { createEmployee, getEmployeeById, updateEmployee, deleteEmployee, getEmployeesByProjectId };
