const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const cors = require("cors");
const useragent = require("express-useragent"); // Add user-agent parsing

const app = express();
const PORT = process.env.PORT || 3002; // Changed port to 3002

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(useragent.express()); // Use user-agent middleware
app.use(express.static(path.join(__dirname)));

// Database file paths
const EMAILS_DB_FILE = path.join(__dirname, "emails.json");
const VISITORS_DB_FILE = path.join(__dirname, "visitors.json");

// Initialize database files if they don\'t exist
if (!fs.existsSync(EMAILS_DB_FILE)) {
  fs.writeFileSync(EMAILS_DB_FILE, JSON.stringify({ emails: [] }));
}
if (!fs.existsSync(VISITORS_DB_FILE)) {
  fs.writeFileSync(VISITORS_DB_FILE, JSON.stringify({ visitors: [] }));
}

// Read data from database
function readData(file) {
  const data = fs.readFileSync(file);
  return JSON.parse(data);
}

// Write data to database
function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Email configuration for automated emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-password", // Replace with your password or app password
  },
});

// Middleware to track visitors
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Request received for path: ${req.path}`); // DEBUG
  // Only track visits to the main landing page (or specific routes)
  if (req.path === "/" || req.path === "/index.html") {
    console.log(`[${new Date().toISOString()}] Tracking visitor for path: ${req.path}`); // DEBUG
    try {
      console.log(`[${new Date().toISOString()}] Reading visitors file: ${VISITORS_DB_FILE}`); // DEBUG
      const visitorData = readData(VISITORS_DB_FILE);
      console.log(`[${new Date().toISOString()}] Visitors file read successfully.`); // DEBUG
      
      const newVisitor = {
        ip: req.ip || req.connection.remoteAddress,
        date: new Date().toISOString(),
        country: req.headers["x-forwarded-for"] ? "Unknown (Proxy)" : "Unknown", // Basic, needs GeoIP for accuracy
        device: req.useragent.isMobile
          ? "Mobile"
          : req.useragent.isTablet
          ? "Tablet"
          : "Desktop",
        browser: req.useragent.browser,
        os: req.useragent.os,
        converted: false, // Default to not converted
        userAgent: req.headers["user-agent"],
      };
      console.log(`[${new Date().toISOString()}] New visitor data generated:`, newVisitor); // DEBUG

      visitorData.visitors.unshift(newVisitor); // Add to the beginning of the array
      console.log(`[${new Date().toISOString()}] Writing updated visitor data to file...`); // DEBUG
      writeData(VISITORS_DB_FILE, visitorData);
      console.log(`[${new Date().toISOString()}] Visitor data written successfully.`); // DEBUG
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error tracking visitor:`, error); // DEBUG with timestamp
    }
  }
  next();
});

// API endpoint to save email
app.post("/api/subscribe", (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    const emailData = readData(EMAILS_DB_FILE);

    if (emailData.emails.some((e) => e.email === email)) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    const newEmailEntry = {
      email: email,
      date: new Date().toISOString(),
      status: "Active", // Default status, translated from "Actif"
    };
    emailData.emails.unshift(newEmailEntry);

    writeData(EMAILS_DB_FILE, emailData);

    try {
      const visitorData = readData(VISITORS_DB_FILE);
      const visitorIp = req.ip || req.connection.remoteAddress;
      const visitorIndex = visitorData.visitors.findIndex((v) => v.ip === visitorIp && !v.converted);
      if (visitorIndex !== -1) {
        visitorData.visitors[visitorIndex].converted = true;
        writeData(VISITORS_DB_FILE, visitorData);
      }
    } catch (error) {
      console.error("Error marking visitor as converted:", error);
    }

    return res
      .status(200)
      .json({ success: true, message: "Email registered successfully" });
  } catch (error) {
    console.error("Error saving email:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

function sendWelcomeEmail(email) {
  console.log(`Simulating sending welcome email to ${email}`);
}

function scheduleMarketingEmails(email) {
  console.log(`Simulating scheduling marketing emails for ${email}`);
}

function sendMarketingEmail(email, emailNumber) {
  console.log(`Simulating sending marketing email ${emailNumber} to ${email}`);
}

app.get("/api/emails", (req, res) => {
  try {
    const data = readData(EMAILS_DB_FILE);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error getting emails:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/visitors", (req, res) => {
  console.log(`[${new Date().toISOString()}] Request received for /api/visitors`);
  try {
    console.log(`[${new Date().toISOString()}] Reading visitors file for API: ${VISITORS_DB_FILE}`);
    const data = readData(VISITORS_DB_FILE);
    console.log(`[${new Date().toISOString()}] Visitors data read successfully for API. Count: ${data.visitors ? data.visitors.length : 'N/A'}`);
    return res.status(200).json(data);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error getting visitors for API:`, error);
    return res.status(500).json({ success: false, message: "Server error reading visitors data" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

