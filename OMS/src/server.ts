import express from "express";
import { ordersRouter } from "./routes/order";
import { PORT } from "./config";

// Neue Express-App erstellen
const app = express();
// Parsen der JSON-Bodies aus Requests
app.use(express.json());
// Router einbinden
app.use(ordersRouter);

// Server starten und auf dem konfigurierten Port lauschen
app.listen(PORT, () => {
  console.log(`[OMS] Listening on :${PORT}`);
});
