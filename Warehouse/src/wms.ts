import amqp from "amqplib";

const RABBIT_URL = "amqp://avg:avg@rabbitmq:5672";
const LOG_SERVER_URL = process.env.LOG_SERVER_URL || "http://host.docker.internal:7070/log";

const EXCHANGE = "wms.orders";
const QUEUE = "wms.commands";
const ROUTING_KEY_IN = "order.process";
const ROUTING_KEY_OUT = "order.status";

(async () => {
  try {
    const conn = await amqp.connect(RABBIT_URL);
    const ch = await conn.createChannel();

    await ch.assertExchange(EXCHANGE, "topic", { durable: true });
    await ch.assertQueue(QUEUE, { durable: true });
    await ch.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY_IN);

    console.log("WMS gestartet. Wartet auf Bestellungen...");

    ch.consume(QUEUE, async (msg) => {
      if (!msg) return;
      const start = Date.now();
      const order = JSON.parse(msg.content.toString());
      console.log(`Bestellung empfangen: ${order.orderId}`);

      await fetch(LOG_SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Message: `[WMS] [${order.orderId}] Bestellung empfangen`,
          Logs: [{ orderId: order.orderId, status: "RECEIVED", source: "WMS", timestamp: Date.now() }]
        })
      });

      for (const status of ["ITEMS_PICKED", "ORDER_PACKED", "ORDER_SHIPPED"]) {
        await new Promise((r) => setTimeout(r, 1000));
        console.log(`Status: ${status} (${order.orderId})`);
        await fetch(LOG_SERVER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Message: `[WMS] [${order.orderId}] ${status}`,
            Logs: [{ orderId: order.orderId, status, source: "WMS", timestamp: Date.now() }]
          })
        });
      }

      const end = Date.now();
      console.log(`[${order.orderId}] Bestellung verarbeitet (${end - start}ms)`);

      await fetch(LOG_SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Message: `[WMS] [${order.orderId}] Bestellung abgeschlossen (${end - start}ms)`,
          Logs: [{ orderId: order.orderId, status: "COMPLETED", source: "WMS", timestamp: end }]
        })
      });

      ch.publish(EXCHANGE, ROUTING_KEY_OUT, Buffer.from(JSON.stringify({
        orderId: order.orderId,
        status: "completed",
        timestamp: end
      })), { contentType: "application/json", persistent: true });

      ch.ack(msg);
    });

    process.on("SIGINT", () => {
      conn.close();
      process.exit();
    });
  } catch (err: any) {
    console.error("Fehler beim Starten des WMS:", err.message);
    process.exit(1);
  }
})();
