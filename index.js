import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Your Google Apps Script URL (replace with your /exec URL)
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbyEFQiAP1lK1tlZeqDDc6LIT0J4ujeIVW6hIcrdj7hYgr_H3Ix-KPUX6eZRoQi-fQ9h1g/exec";

// Middleware
app.use(cors());
app.use(express.json());

// POST /upload → send form data to Google Sheet
app.post("/upload", async (req, res) => {
  console.log("Received upload:", req.body);
  try {
    const response = await fetch(SHEET_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error forwarding to Google Sheet:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET /fetch/:sheet → fetch all rows from a specific tab
app.get("/fetch/:sheet", async (req, res) => {
  const sheet = req.params.sheet; // Income / Work / Expenses
  console.log("Fetching sheet:", sheet);

  try {
    const response = await fetch(`${SHEET_ENDPOINT}?sheet=${sheet}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching data from Google Sheet:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Optional: GET / → simple status message
app.get("/", (req, res) => {
  res.send("SlopeLedger Relay Server is running. Use POST /upload and GET /fetch/:sheet");
});

// Start server
app.listen(PORT, () => {
  console.log(`Relay server running on port ${PORT}`);
});
