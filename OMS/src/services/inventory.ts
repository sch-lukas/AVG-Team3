import { OrderItem } from "../types";
import { INVENTORY_URL } from "../config";
// =============================
// src/services/inventory.ts — only items[] → boolean
// =============================

export async function checkInventory(items: OrderItem[], orderId: string): Promise<boolean> {
console.log(`[${orderId}] → Inventory: POST ${INVENTORY_URL}`);
const resp = await fetch(INVENTORY_URL, {
method: "POST",
headers: { "content-type": "application/json", "x-order-id": orderId },
body: JSON.stringify({ items }),
});
if (!resp.ok) {
console.log(`[${orderId}] ❌ Inventory HTTP ${resp.status}`);
throw new Error(`Inventory HTTP ${resp.status}`);
}
const ok: boolean = await resp.json();
console.log(`[${orderId}] ← Inventory: ${ok}`);
return ok;
}