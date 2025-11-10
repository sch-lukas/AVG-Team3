// =============================
// src/server.ts — bootstrap
// =============================
import express from "express";
import { ordersRouter } from "./routes/order";
import { PORT, INVENTORY_ADDR, PAYMENT_URL } from "./config";

const app = express();
app.use(express.json());

// Register routes
app.use(ordersRouter);

// Health endpoint
app.get("/health", (_req, res) => res.json({ status: "up" }));

// Start server
app.listen(PORT, () => {
  console.log(`[OMS] Listening on :${PORT}`);
  console.log(`[OMS] INVENTORY_ADDR=${INVENTORY_ADDR}`); // ✅ gRPC host:port
  console.log(`[OMS] PAYMENT_URL=${PAYMENT_URL}`);
});
