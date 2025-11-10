import { PAYMENT_URL } from "../config";

// =============================
// src/services/payment.ts — { orderId, totalAmount } → boolean
// =============================
export async function charge(orderId: string, totalAmount: number): Promise<boolean> {
console.log(`[${orderId}] → Payment: POST ${PAYMENT_URL}`);
const resp = await fetch(PAYMENT_URL, {
method: "POST",
headers: { "content-type": "application/json", "x-order-id": orderId },
body: JSON.stringify({ orderId, totalAmount }),
});
if (!resp.ok) {
console.log(`[${orderId}] ❌ Payment HTTP ${resp.status}`);
throw new Error(`Payment HTTP ${resp.status}`);
}
const ok: boolean = await resp.json();
console.log(`[${orderId}] ← Payment: ${ok}`);
return ok;
}