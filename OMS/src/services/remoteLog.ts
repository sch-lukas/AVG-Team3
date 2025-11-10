import { LOG_URL } from "../config";

/**
 * Sehr einfache Logging-Funktion.
 * Fire-and-forget: OMS ignoriert Fehler, wartet aber NICHT bewusst.
 */
export function remoteLog(message: string): void {
  fetch(LOG_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ Message: message })
  }).catch(() => {
    // Fehler bewusst ignorieren — Logging darf OMS nie crashen
  });
}
