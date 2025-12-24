const express = require("express");
const cors = require("cors");
const { json } = require("express");
require("dotenv").config();

const app = express();

/* -------------------- Global Middlewares -------------------- */
app.use(cors());
app.use(json());

/* -------------------- Health Check -------------------- */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully"
  });
});

/* -------------------- Routes -------------------- */
// (Routes will be added step-by-step)
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tenants", require("./routes/tenant.routes"));
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/users", require("./routes/user.routes"));

/* -------------------- 404 Handler -------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* -------------------- Global Error Handler -------------------- */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;
