const AgentSchema = require('../model/AgentSchema')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const agentRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, company,password } = req.body;

    const existingEmail = await AgentSchema.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email Already Exist" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const agent = await AgentSchema.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      company: company,
      password: hashedPassword,
    });
    res.status(200).json({ message: "Agent successfully Registered", agent });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const agentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const agent = await AgentSchema.findOne({ email: email.toLowerCase() });

    if (!agent) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, agent.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ agentId: agent._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "User Login SuceessFully", token , email, password, agentId: agent._id });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const agent = await AgentSchema.findOne({ email });

    if (!agent) {
      return res.status(404).json({ error: "No account found with this email" });
    }

    const token = jwt.sign({ agentId: agent._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "avishka1999perera@gmail.com", // Replace with your email
        pass: "hjba dzmz nhzz rjut",         // App password (not regular password)
      },
    });

    const resetPasswordLink = `http://localhost:8080/changepassword/${agent._id}/${token}`;

    const mailOptions = {
      from: "avishka1999perera@gmail.com",
      to: agent.email,
      subject: "Reset Your Password",
      text: `Click the link to reset your password: ${resetPasswordLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Error sending email" });
      }

      console.log("Email sent:", info.response);
      return res.status(200).json({ message: "Reset link sent successfully" });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const changepassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
      if (error) {
        return res.json({ status: "Error with token" });
      }

      try {
        const hash = await bcrypt.hash(password, 10);

        const updatedUser = await AgentSchema.findByIdAndUpdate(
          id, // Pass only the ID, not an object
          { password: hash }, // Save hashed password
          { new: true } // Return the updated document
        );

        if (!updatedUser) {
          return res.status(404).json({ status: "User not found" });
        }

        return res.json({ status: "Success" });
      } catch (err) {
        return res.status(500).json({ status: "Error updating password", error: err.message });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await AgentSchema.findById(id).select("-password"); // exclude password

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json(agent);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const agentLogout = async (req, res) => {
  try {

    const { agentId } = req.params;

    const agent = await AgentSchema.findById(agentId)

    if (!agent) {
      return res.status(400).json({ message: "agentId is required" });
    }

    // You can log or track the logout if needed here

    res.status(200).json({ message: "User logged out successfully", agentId });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};




module.exports = {agentRegister, agentLogin, forgotPassword, changepassword, getAgentById, agentLogout}