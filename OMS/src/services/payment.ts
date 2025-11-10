import { PAYMENT_URL } from "../config";
import { remoteLog } from "../services/remoteLog";
import { PaymentResponse } from "../types";

export async function charge(
  orderId: string,
  totalAmount: number,
  paymentMethod: string
): Promise<PaymentResponse> {
  console.log(`[${orderId}] → Payment: POST ${PAYMENT_URL}`);
  remoteLog(`[OMS] [${orderId}] → Payment: POST ${PAYMENT_URL}`);

  const resp = await fetch(PAYMENT_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ orderId, totalAmount, paymentMethod }),
  });

  if (!resp.ok) {
    console.log(`[${orderId}] ❌ Payment HTTP ${resp.status}`);
    remoteLog(`[OMS] [${orderId}] ❌ Payment HTTP ${resp.status}`);
    throw new Error(`Payment HTTP ${resp.status}`);
  }

  const data: PaymentResponse = await resp.json();
  console.log(`[${orderId}] ← Payment:`, data);

  remoteLog(`[OMS] [${orderId}] ← Payment: ${JSON.stringify(data)}`);

  return data;
}
