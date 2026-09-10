require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = Number(process.env.PORT || 3000);

const dataDir = path.join(__dirname, "data");
const messagesFile = path.join(dataDir, "messages.json");

// Create data folder
fs.mkdirSync(dataDir, { recursive: true });

// Create messages file
if (!fs.existsSync(messagesFile)) {
  fs.writeFileSync(messagesFile, "[]", "utf8");
}

function readMessages() {
  try {
    return JSON.parse(fs.readFileSync(messagesFile, "utf8"));
  } catch {
    return [];
  }
}

function saveMessage(message) {
  const messages = readMessages();

  messages.push(message);

  fs.writeFileSync(
    messagesFile,
    JSON.stringify(messages, null, 2),
    "utf8"
  );
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// API: Health Check
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio backend is running"
  });
});

// ===============================
// API: Projects
// ===============================

app.get("/api/projects", (req, res) => {
  res.json([
    {
      id: 1,
      title: "AI-Based Real-Time Road Quality Monitoring System",
      description:
        "AI-powered system for detecting and monitoring road quality using real-time data.",
      technologies: [
        "AI",
        "Machine Learning",
        "Computer Vision"
      ]
    },
    {
      id: 2,
      title: "AI-Powered College Placement Portal",
      description:
        "Placement management platform enhanced with AI-based features.",
      technologies: [
        "AI",
        "Web Development",
        "Database"
      ]
    },
    {
      id: 3,
      title: "Personal Portfolio Website",
      description:
        "Responsive personal portfolio website showcasing skills, projects and achievements.",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript"
      ]
    },
    {
      id: 4,
      title: "Student Registration Form",
      description:
        "Web-based student registration system for collecting and managing student information.",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript"
      ]
    }
  ]);
});

// ===============================
// API: Contact Form
// ===============================

app.post("/api/contact", async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required."
      });
    }

    const newMessage = {
      id: Date.now(),
      name,
      email,
      subject: subject || "",
      message,
      createdAt: new Date().toISOString()
    };

    // Save message to JSON
    saveMessage(newMessage);

    // Optional email notification
   // Email notification
console.log("SMTP configured:", {
  host: !!process.env.SMTP_HOST,
  user: !!process.env.SMTP_USER,
  pass: !!process.env.SMTP_PASS,
  email: !!process.env.CONTACT_EMAIL
});

if (
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          process.env.SMTP_USER,

        to:
          process.env.CONTACT_EMAIL ||
          process.env.SMTP_USER,

        replyTo: email,

        subject:
          subject ||
          `Portfolio message from ${name}`,

        text: `
Name: ${name}
Email: ${email}

Message:
${message}
        `
      });
    }

    res.json({
      success: true,
      message: "Your message has been sent successfully!"
    });

  } catch (error) {
    console.error("Contact form error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
});

// ===============================
// Frontend fallback
// ===============================

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {
  console.log(
    `Portfolio running at http://localhost:${PORT}`
  );
});