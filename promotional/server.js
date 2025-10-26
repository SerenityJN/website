const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000; // pick any free port

// ✅ Serve all static assets from /frontend
app.use(express.static(path.join(__dirname, "frontend")));

// ✅ Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/html/index.html"));
});

// ✅ Route for About Us page
app.get("/aboutus", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/html/aboutus.html"));
});

// ✅ Route for Assessment page
app.get("/assessment", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/html/assessment.html"));
});

// ✅ Route for About Us page
app.get("/admission", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/html/admission.html"));
});

// ✅ Route for About Us page
app.get("/principal", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/html/principal.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Promotional website running at http://localhost:${PORT}`);
});
