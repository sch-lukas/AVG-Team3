import amqp from "amqplib";

// Verbindung zu RabbitMQ herstellen
const RABBIT_URL = "amqp://avg:avg@rabbitmq:5672";
const LOG_SERVER_URL = process.env.LOG_SERVER_URL || "http://host.docker.internal:7070/log";

//Anbindungen des WMS an RabbitMQ
const EXCHANGE = "wms.orders";
const QUEUE = "wms.commands";
const ROUTING_KEY_IN = "order.process";
const ROUTING_KEY_OUT = "order.status";

// Anonyme Async-Funktion
(async () => {
  try {
    const conn = await amqp.connect(RABBIT_URL);
    const ch = await conn.createChannel();

    // Exchange und Queue einrichten und verbinden
    await ch.assertExchange(EXCHANGE, "topic", { durable: true });
    await ch.assertQueue(QUEUE, { durable: true });
    await ch.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY_IN);

    console.log("WMS gestartet. Wartet auf Bestellungen...");


    // Nachrichten aus der Queue empfangen und Daten auslesen
    ch.consume(QUEUE, async (msg) => {
      if (!msg) return;
      const start = Date.now();
      const order = JSON.parse(msg.content.toString());
      console.log(`Bestellung empfangen: ${order.orderId}`);

      // Sendet per fetch (HTTP-Request) den Status der Bestellung an den Log-Service
      await fetch(LOG_SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Message: `[WMS] [${order.orderId}] Bestellung empfangen`,
          Logs: [{ orderId: order.orderId, status: "RECEIVED", source: "WMS", timestamp: Date.now() }]
        })
      });

      // Simuliert die einzelnen Schritte: Promise = kurze Verzögerung | dann Status an den Log-Service senden
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

      // Sendet den finalen Abschluss-Status der Bestellung an den Log-Service
      await fetch(LOG_SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Message: `[WMS] [${order.orderId}] Bestellung abgeschlossen (${end - start}ms)`,
          Logs: [{ orderId: order.orderId, status: "COMPLETED", source: "WMS", timestamp: end }]
        })
      });

      // Sendet den Abschluss-Status zurück über RabbitMQ (order.status)
      ch.publish(EXCHANGE, ROUTING_KEY_OUT, Buffer.from(JSON.stringify({
        orderId: order.orderId,
        status: "completed",
        timestamp: end
      })), { contentType: "application/json", persistent: true });

      ch.ack(msg);
    });

    // SIGINT (STRG+C) -> schließt die RabbitMQ-Verbindung sauber und beendet den Prozess; im Fehlerfall ebenfalls Abbruch
    process.on("SIGINT", () => {
      conn.close();
      process.exit();
    });
  } catch (err: any) {
    console.error("Fehler beim Starten des WMS:", err.message);
    process.exit(1);
  }
})();
