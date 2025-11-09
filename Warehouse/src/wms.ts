import amqp from "amqplib";

const RABBIT_URL = "amqp://avg:avg@rabbitmq:5672";
const LOG_API = "kommt noch";

(async () => {
  const connection = await amqp.connect(RABBIT_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange("wms.exchange", "topic", { durable: true });
  await channel.assertQueue("wms.commands", { durable: true });
  await channel.assertQueue("wms.status", { durable: true });
  await channel.bindQueue("wms.commands", "wms.exchange", "wms.commands");

  console.log("WMS-Service gestartet und wartet auf Bestellungen...");

  channel.consume("wms.commands", async (msg) => {
    if (!msg) return;

    const order = JSON.parse(msg.content.toString());

    if (!order.orderId) {
      console.warn("Bestellung ohne OrderId empfangen.");
      return;
    }

    console.log(`Bestellung empfangen: ${order.orderId}`);

    const statusList = ["ITEMS_PICKED", "ORDER_PACKED", "ORDER_SHIPPED"];
    const logs: { orderId: string; status: string; source: string }[] = [];

    for (const status of statusList) {
      await new Promise((r) => setTimeout(r, 1000));

      console.log(`Status: ${status} für OrderId: ${order.orderId}`);

      logs.push({
        orderId: order.orderId,
        status,
        source: "WMS"
      });

      channel.sendToQueue(
        "wms.status",
        Buffer.from(JSON.stringify({ orderId: order.orderId, status })),
        { persistent: true }
      );
    }

    const message = {
      Message: `WMS: Order ${order.orderId} wurde bearbeitet`,
      Logs: logs
    };

    await fetch(LOG_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    console.log(`Logs für Order ${order.orderId} gesendet.`);
    channel.ack(msg);
  });

  process.on("SIGINT", () => {
    console.log("WMS-Service wird beendet...");
    connection.close();
    process.exit();
  });
})();
