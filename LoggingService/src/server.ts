import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 5200; // fest eingestellter Port

// Pfad zur Log-Datei
const logPath = path.join(__dirname, "../Messenger/LogFile.txt");

// Logging Endpoint
app.post("/log", (req, res) => {
  const message = req.body?.Message;

  if (!message) {
    return res.status(400).json({ error: "Missing field: Message" });
  }

  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;

  fs.appendFileSync(logPath, entry, { encoding: "utf8" });

  console.log(`[LoggingService] ✔ Log gespeichert: "${message}"`);
  res.json({ status: "logged" });
});

app.listen(PORT, () => {
  console.log(`[LoggingService] läuft auf Port ${PORT}`);
  console.log(`[LoggingService] Schreibpfad: ${logPath}`);
});
