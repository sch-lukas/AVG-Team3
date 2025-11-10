import { Router } from "express";
import { Order } from "../types";
import { checkInventory } from "../services/inventory";
import { charge } from "../services/payment";
import { publishOrder } from "../services/rabbit";

export const ordersRouter = Router();

function isOrder(x: any): x is Order {
  return (
    x && typeof x.orderId === "string" &&
    x.items && Array.isArray(x.items) &&
    typeof x.paymentMethod === "string"
  );
}

ordersRouter.post("/process-order", async (req, res) => {
  const order = req.body as Order;
  const orderId = order.orderId;
  const started = Date.now();

  if (!isOrder(order)) return res.status(400).json({ status: "validation_error" });

  console.log(`[${orderId}] → Neue Bestellung empfangen`);

  // 1) INVENTORY
  const availability = await checkInventory(order.items, orderId);
  const allInStock = availability.every(x => x.isAvailable);

  if (!allInStock) {
    console.log(`[${orderId}] ✖ Bestellung abgebrochen (Inventar nicht ausreichend)`);
    return res.status(409).json({ status: "rejected", reason: "inventory", availability });
  }

  // 2) PAYMENT
  const payment = await charge(order.orderId, order.totalAmount, order.paymentMethod);
  if (payment.paymentStatus !== "approved") {
    console.log(`[${orderId}] ✖ Zahlung fehlgeschlagen`);
    return res.status(402).json({ status: "failed", step: "payment", payment });
  }

  // 3) RABBITMQ → gesamte Order
  await publishOrder(order, orderId);

  console.log(`[${orderId}] ✅ Bestellung erfolgreich verarbeitet (${Date.now() - started}ms)`);
  res.json({ status: "ok", orderId });
});
