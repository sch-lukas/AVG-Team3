import { Router } from "express";
import { Order } from "../types";
import { checkInventory } from "../services/inventory";
import { charge } from "../services/payment";
import { publishOrder } from "../services/rabbit";
import { remoteLog } from "../services/remoteLog";

export const ordersRouter = Router();

// Validierung einer Order Anfrage
function isOrder(x: any): x is Order {
  return (
    x && typeof x.orderId === "string" &&
    x.items && Array.isArray(x.items) &&
    typeof x.paymentMethod === "string"
  );
}

//Verarbeitung von Post mit Order an den OMS
ordersRouter.post("/process-order", async (req, res) => {
  const order = req.body as Order;
  const orderId = order?.orderId || "unknown";
  const started = Date.now();

  // Validierung einer Order Anfrage
  if (!isOrder(order)) return res.status(400).json({ status: "validation_error" });

  console.log(`[${orderId}] → Neue Bestellung empfangen`);
  remoteLog(`[OMS] [${orderId}] → Neue Bestellung empfangen`);

  // 1) Anfrage an Inventory mit Hilfe Array, das alle Items der Order enthält
  const availability = await checkInventory(order.items, orderId);
  const allInStock = availability.every(x => x.isAvailable === true);

  // Wenn nicht alles auf Lager ist
  if (!allInStock) {
    console.log(`[${orderId}] ✖ Bestellung abgebrochen (Inventar nicht ausreichend)`);
    remoteLog(`[OMS] [${orderId}] ✖ Bestellung abgebrochen (Inventar nicht ausreichend)`);
    return res.status(409).json({ status: "rejected", reason: "inventory", availability });
  }

  // 2) Anfrage an Payment Service mit OrderID, Gesamtbetrag und Bezahlmethode
  const payment = await charge(order.orderId, order.totalAmount, order.paymentMethod);
  if (payment.paymentStatus !== "approved") {
    console.log(`[${orderId}] ✖ Zahlung fehlgeschlagen`);
    remoteLog(`[OMS] [${orderId}] ✖ Zahlung fehlgeschlagen`);
    return res.status(402).json({ status: "failed", step: "payment", payment });
  }

  // 3) Gesamte Order wird auf RabbitMQ gepublished und dort von Warehouse abgeholt
  await publishOrder(order, orderId);

  console.log(`[${orderId}] ✅ Bestellung erfolgreich verarbeitet (${Date.now() - started}ms)`);
  remoteLog(`[OMS] [${orderId}] ✅ Bestellung erfolgreich verarbeitet (${Date.now() - started}ms)`);
  res.json({ status: "ok", orderId });
});
