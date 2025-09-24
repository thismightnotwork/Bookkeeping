# Bookkeeping

![GitHub Repo stars](https://img.shields.io/github/stars/yourusername/bookkeeping?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/bookkeeping?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/bookkeeping)

**Bookkeeping** is a lightweight **Progressive Web App (PWA)** for tracking income, work hours, and expenses. Data is stored in **your own Google Sheets** via a relay server. The app is installable on mobile or desktop with offline support for the app shell.

> ⚠️ **Important:** You must **host your own version** of Bookkeeping. You cannot use someone else’s sheet or relay. Follow this guide to set it up fully.

---

## 🔹 Features

- Log **Income**, **Work**, and **Expenses** in separate tabs.  
- Automatic **date-stamping** for all entries.  
- Calculates total pay for work hours (`Hours × Rate`).  
- Fetch and display Google Sheet data in tables.  
- **Offline-ready** PWA with service worker.  
- Installable on mobile/desktop with `logo.png` as app icon.  

---

## 🔹 Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/bookkeeping.git
cd bookkeeping
```

> ⚠️ **Important:** Cloning only gives you the front-end code. You **must configure your own Google Sheet, Apps Script, and optionally relay server** to use the app.

---

### 2️⃣ Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new sheet.  
2. Rename **three tabs** exactly:

```
Income → headers: Date | Source of income | Amount (£)
Work   → headers: Date | Workplace | Hours worked | Rate (£) | Total Pay (£)
Expenses → headers: Date | Category | Amount (£) | Notes
```

3. Share the sheet with your **Google account email**.

---

### 3️⃣ Deploy Google Apps Script

1. Open **Extensions → Apps Script** in your Google Sheet.  
2. Replace the default `Code.gs` with:

```javascript
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = e.parameter.sheet;
    if (!sheetName) return sendJSON({status: "error", message: "Missing sheet parameter"});
    const sheet = ss.getSheetByName(sheetName);
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const rows = values.slice(1).map(r => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
    return sendJSON({status: "ok", data: rows});
  } catch(err) {
    return sendJSON({status: "error", message: err.message});
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const type = data.type;
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(type);
    const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const mapping = {
      "Income": {"Date": data.date, "Source of income": data.source, "Amount (£)": data.amount},
      "Work": {"Date": data.date, "Workplace": data.workplace, "Hours worked": data.hours, "Rate (£)": data.rate, "Total Pay (£)": data.total},
      "Expenses": {"Date": data.date, "Category": data.category, "Amount (£)": data.amount, "Notes": data.note}
    };
    const row = headers.map(h => mapping[type][h] || "");
    sheet.appendRow(row);
    return sendJSON({status:"ok"});
  } catch(err) {
    return sendJSON({status:"error", message: err.message});
  }
}

function sendJSON(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy → New deployment → Web app**:  
   - **Execute as:** Me  
   - **Who has access:** Anyone  

4. Copy the **/exec URL** — this is your Apps Script endpoint.

---

### 4️⃣ Optional: Deploy Relay Server

```js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const SHEET_ENDPOINT = "YOUR_APPS_SCRIPT_EXEC_URL";

app.use(cors());
app.use(express.json());

app.post("/upload", async (req,res)=>{
  const response = await fetch(SHEET_ENDPOINT,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
});

app.get("/fetch/:sheet", async (req,res)=>{
  const sheet = req.params.sheet;
  const response = await fetch(`${SHEET_ENDPOINT}?sheet=${sheet}`);
  const data = await response.json();
  res.json(data);
});

app.listen(PORT, ()=>console.log(`Relay server running on port ${PORT}`));
```

- Deploy to **Render**, **Heroku**, or any Node host.  
- Copy the relay URL (e.g., `https://bookkeeping-relay.onrender.com`) — used in `index.html`.

---

### 5️⃣ Configure Front-End

1. Open `index.html`.  
2. Update the `SHEET_ENDPOINT` variable:

```js
const SHEET_ENDPOINT = "YOUR_RELAY_URL_OR_APPS_SCRIPT_URL";
```

3. Place `logo.png` in the root folder for favicon and PWA icon.  
4. Ensure `manifest.json` and `service-worker.js` are included.

---

### 6️⃣ Run & Host

1. Open `index.html` in a browser.  
2. Use the tabs to **Upload** or **View** data.  
3. Click **Install Bookkeeping** to install the PWA (optional).  

---

### 7️⃣ Deploy to GitHub Pages

```bash
# Make sure you are in the repository root
git add .
git commit -m "Initial commit"
git push origin main
```

1. Go to your GitHub repository → **Settings → Pages**  
2. Source: `main` branch, root folder (`/`)  
3. Wait a few minutes. Your app will be available at:

```
https://yourusername.github.io/bookkeeping
```

> ⚠️ Remember: Your Google Sheet and Apps Script (or relay) must be live for the app to function. GitHub Pages only hosts the front-end.

---

## 🔹 Notes

- You **cannot use a shared sheet**; you must host your own.  
- The PWA works offline for the app shell, but internet is required to upload/fetch data.  
- Customize the app by editing React components in `index.html`.

---

## 🔹 License

MIT License © 2025 Your Name
