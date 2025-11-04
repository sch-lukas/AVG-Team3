import amqp from "amqplib";

const url = "amqp://avg:avg@rabbitmq:5672";

(async () => {
  const net = await amqp.connect(url);
  const channel = await net.createChannel();

  await channel.assertExchange("wms.exchange", "topic", { durable: true });
  await channel.assertQueue("wms.commands", { durable: true });
  await channel.assertQueue("wms.status", { durable: true });
  await channel.bindQueue("wms.commands", "wms.exchange", "wms.commands");

  console.log("WMS wartet auf Bestellungen...");

  channel.consume("wms.commands", async (msg) => {
    if (!msg) return;

const order = JSON.parse(msg.content.toString());
console.log("Neue Bestellung:", order.orderId);

const statusList = ["ITEMS_PICKED", "ORDER_PACKED", "ORDER_SHIPPED"];

for (let s of statusList) {
  await new Promise(r => setTimeout(r, 1000));
  channel.sendToQueue("wms.status", Buffer.from(JSON.stringify({ orderId: order.orderId, status: s })));
  console.log(s);
}

 channel.ack(msg);
  });

  process.on("SIGINT", () => {
  console.log("Stoppe WMS...");
  net.close();
  process.exit();
  });
})();
