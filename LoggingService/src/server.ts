import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname ersetzen für ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log-Datei Pfad
const logPath = path.join(__dirname, "../LogFile.txt");

const app = express();
app.use(express.json());

// POST /log → schreibt Nachricht in LogFile.txt
app.post("/log", (req: Request, res: Response) => {
  const { Message } = req.body;

  if (!Message) {
    return res.status(400).json({ error: "Message field required" });
  }

  const line = `[${new Date().toISOString()}] ${Message}\n`;

  fs.appendFile(logPath, line, (err) => {
    if (err) {
      console.error("❌ Fehler beim Schreiben in LogFile:", err);
      return res.status(500).json({ error: "Writing log failed" });
    }

    console.log(`[LoggingService] ✔ Log gespeichert: ${Message}`);
    res.json({ status: "ok" });
  });
});

// Server starten
const PORT = 7070;
app.listen(PORT, () => {
  console.log(`[LoggingService] Läuft auf Port ${PORT}`);
});
