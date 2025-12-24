const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://frontend:3000" }));
app.use(express.json());

app.get("/api/health", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
  });
});

module.exports = app;
