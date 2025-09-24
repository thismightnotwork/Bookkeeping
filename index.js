import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your Apps Script /exec URL
const SHEET_ENDPOINT_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbxQcaASRCsxcG9KGZpz_OgvRQNUQc9tbl3OBiViSPgvyl8YUgDILq5Y8k7K7Kx0rHZW3w/exec";

app.use(cors());
app.use(express.json());

// POST /upload → forward to Apps Script
app.post("/upload", async (req, res) => {
  try {
    const response = await fetch(SHEET_ENDPOINT_APPS_SCRIPT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ status:"error", message: err.message });
  }
});

// GET /fetch/:sheet → fetch from Apps Script
app.get("/fetch/:sheet", async (req, res) => {
  const sheet = req.params.sheet;
  try {
    const response = await fetch(`${SHEET_ENDPOINT_APPS_SCRIPT}?sheet=${sheet}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ status:"error", message: err.message });
  }
});

// Optional status
app.get("/", (req, res) => res.send("SlopeLedger Relay Server running"));

app.listen(PORT, () => console.log(`Relay server running on port ${PORT}`));
