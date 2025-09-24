import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbyEFQiAP1lK1tlZeqDDc6LIT0J4ujeIVW6hIcrdj7hYgr_H3Ix-KPUX6eZRoQi-fQ9h1g/exec";
const PASSWORD = "Welcome200827"; // set your password here

app.use(cors());
app.use(express.json());

// Middleware to check password
function checkPassword(req, res, next) {
  const pass = req.body.password || req.query.password; // POST or GET
  if (pass !== PASSWORD) {
    return res.status(401).json({ status: "error", message: "Invalid password" });
  }
  next();
}

// POST /upload → send form data to Google Sheet
app.post("/upload", checkPassword, async (req, res) => {
  console.log("Received upload:", req.body);
  const { password, ...data } = req.body; // remove password before sending
  try {
    const response = await fetch(SHEET_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await response.json();
    res.json(json);
  } catch (err) {
    console.error("Error forwarding to Google Sheet:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET /fetch/:sheet → fetch all rows from a specific tab
app.get("/fetch/:sheet", checkPassword, async (req, res) => {
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
  res.send("SlopeLedger Relay Server is running. Use password to POST /upload and GET /fetch/:sheet");
});

// Start server
app.listen(PORT, () => {
  console.log(`Relay server running on port ${PORT}`);
});
