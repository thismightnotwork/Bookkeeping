import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Your Google Apps Script URL
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbyEFQiAP1lK1tlZeqDDc6LIT0J4ujeIVW6hIcrdj7hYgr_H3Ix-KPUX6eZRoQi-fQ9h1g/exec";

app.use(cors());
app.use(express.json());

// Upload
app.post("/upload", async (req, res) => {
  try {
    const response = await fetch(SHEET_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Fetch
app.get("/fetch/:sheet", async (req, res) => {
  const sheet = req.params.sheet;
  try {
    const response = await fetch(`${SHEET_ENDPOINT}?sheet=${sheet}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("SlopeLedger Relay Server is running. Use POST /upload and GET /fetch/:sheet");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
