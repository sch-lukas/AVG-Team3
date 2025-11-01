export const PORT = Number(process.env.PORT ?? 3000);
export const INVENTORY_URL = process.env.INVENTORY_URL ?? "http://localhost:4001/inventory/check"; // expects boolean JSON
export const PAYMENT_URL = process.env.PAYMENT_URL ?? "http://localhost:5000/pay"; // expects boolean JSON
export const RABBIT_URL = process.env.RABBIT_URL ?? "amqp://localhost:5672";
export const WMS_EXCHANGE = process.env.WMS_EXCHANGE ?? "wms.orders";
export const WMS_ROUTING_KEY = process.env.WMS_ROUTING_KEY ?? "order.process";