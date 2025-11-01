// =============================
// src/routes/orders.ts — tiny router for /process-order
// =============================
import { Router } from "express";
import { Order } from "../types";
import { checkInventory } from "../services/inventory";
import { charge } from "../services/payment";
import { publishOrder } from "../services/rabbit";


function isOrder(x: any): x is Order {
return (
x && typeof x === "object" &&
typeof x.orderId === "string" &&
x.customer && typeof x.customer.customerId === "string" &&
Array.isArray(x.items) && x.items.length > 0 &&
typeof x.totalAmount === "number" &&
x.shippingAddress && typeof x.shippingAddress.street === "string"
);
}


export const ordersRouter = Router();


ordersRouter.post("/process-order", async (req, res) => {
const order = req.body as Order;
const orderId = order?.orderId ?? "unknown";
const started = Date.now();
try {
if (!isOrder(order)) {
console.log(`[${orderId}] ❌ Invalid order payload`);
return res.status(400).json({ status: "validation_error", message: "Invalid order shape" });
}


console.log(`[${orderId}] → New order received`);


// 1) Inventory check (items only)
const invOk = await checkInventory(order.items, orderId);
if (!invOk) {
console.log(`[${orderId}] ✖ Abort: inventory-not-available`);
return res.status(409).json({ status: "rejected", reason: "inventory-not-available" });
}


// 2) Payment (orderId, totalAmount only)
const payOk = await charge(order.orderId, order.totalAmount);
if (!payOk) {
console.log(`[${orderId}] ✖ Abort: payment-declined`);
return res.status(402).json({ status: "failed", step: "payment", reason: "payment-declined" });
}


// 3) Publish full order to RabbitMQ
await publishOrder(order, orderId);


const ms = Date.now() - started;
console.log(`[${orderId}] ✅ Done in ${ms}ms`);
return res.status(200).json({ status: "ok", orderId, durationMs: ms });
} catch (err) {
console.log(`[${orderId}] 💥 Error`, err);
return res.status(500).json({ status: "error", message: (err as Error).message });
}
});