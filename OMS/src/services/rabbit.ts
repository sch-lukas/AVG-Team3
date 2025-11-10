// =============================
// src/services/rabbit.ts — publish full order (we only send; consuming is not our task)
// =============================
import amqp from "amqplib";
import { RABBIT_URL, WMS_EXCHANGE, WMS_ROUTING_KEY } from "../config";


export async function publishOrder(order: object, orderId: string) {
console.log(`[${orderId}] → RabbitMQ publish to ${WMS_EXCHANGE} ${WMS_ROUTING_KEY}`);
const conn = await amqp.connect(RABBIT_URL);
try {
const ch = await conn.createChannel();
await ch.assertExchange(WMS_EXCHANGE, "topic", { durable: true });
ch.publish(
WMS_EXCHANGE,
WMS_ROUTING_KEY,
Buffer.from(JSON.stringify(order)),
{ contentType: "application/json", persistent: true, headers: { "x-order-id": orderId } }
);
await ch.close();
console.log(`[${orderId}] ✓ Published`);
} finally {
await conn.close();
}
}