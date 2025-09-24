import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your Apps Script URL
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbx6iwziHEHSg1pTw1qiMXEYFXBNEG1g2wO5i7XR0QMXY3XoHwn8yxrzAoNgP6nFsgz7/exec";

app.use(cors());
app.use(express.json());

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
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Relay server running on port ${PORT}`);
});
