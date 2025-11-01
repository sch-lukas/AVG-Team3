// =============================
// src/server.ts — bootstrap
// =============================
import express from "express";
import { ordersRouter } from "./routes/orders";
import { PORT, INVENTORY_URL, PAYMENT_URL } from "./config";


const app = express();
app.use(express.json());
app.use(ordersRouter);


app.get("/health", (_req, res) => res.json({ status: "up" }));


app.listen(PORT, () => {
console.log(`[OMS] Listening on :${PORT}`);
console.log(`[OMS] INVENTORY_URL=${INVENTORY_URL}`);
console.log(`[OMS] PAYMENT_URL=${PAYMENT_URL}`);
});