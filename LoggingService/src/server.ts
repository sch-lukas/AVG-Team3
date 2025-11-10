import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname-Ersatz für ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fester Port
const PORT = 7070;

// Log-Datei liegt im Projektordner (neben package.json / LogFile.txt)
const logPath = path.join(__dirname, "..", "LogFile.txt");

// Sicherstellen, dass die Datei existiert
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, "", { encoding: "utf-8" });
}

const app = express();
app.use(express.json());

// Minimaler Health-Check
app.get("/", (_req: Request, res: Response) => {
  res.json({ service: "LoggingService", status: "ok" });
});

// POST /log  – Body: { "Message": "text" }
app.post("/log", (req: Request, res: Response) => {
  const msg = typeof req.body?.Message === "string" ? req.body.Message : "";
  if (!msg.trim()) {
    return res.status(400).json({ error: "Body must be { \"Message\": \"...\" }" });
  }

  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFile(logPath, line, (err) => {
    if (err) {
      console.error("Append error:", err);
      return res.status(500).json({ error: "failed to write log" });
    }
    return res.status(201).json({ ok: true });
  });
});

app.listen(PORT, () => {
  console.log(`[LoggingService] Listening on :${PORT}`);
  console.log(`[LoggingService] Writing to ${logPath}`);
});
