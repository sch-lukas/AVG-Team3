import amqp from "amqplib";
import { RABBIT_URL, WMS_EXCHANGE, WMS_ROUTING_KEY } from "../config";

export async function publishOrder(order: object, orderId: string) {
  console.log(`[${orderId}] → RabbitMQ publish`);

  const conn = await amqp.connect(RABBIT_URL);
  const ch = await conn.createChannel();

  await ch.assertExchange(WMS_EXCHANGE, "topic", { durable: true });
  ch.publish(WMS_EXCHANGE, WMS_ROUTING_KEY, Buffer.from(JSON.stringify(order)), {
    contentType: "application/json",
    persistent: true
  });

  await ch.close();
  await conn.close();
  console.log(`[${orderId}] ✓ Published`);
}
