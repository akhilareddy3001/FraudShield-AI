const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "FraudShield AI Backend is running!",
  });
});

// Analyze transaction using Python ML service
app.post("/api/analyze", async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      req.body
    );

    res.json(response.data);
  } catch (error) {
    console.error("ML Service Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to connect to FraudShield AI ML service.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});