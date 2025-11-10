import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import { INVENTORY_ADDR } from "../config";
import { OrderItem } from "../types";

// ✅ ESM __dirname Fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pfad zur .proto Datei
const PROTO_PATH = path.join(__dirname, "../../../shared/inventory.proto");

// Proto laden
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const inventoryPkg: any = grpc.loadPackageDefinition(packageDefinition).inventory;

// gRPC Client erzeugen
const client = new inventoryPkg.InventoryService(
  INVENTORY_ADDR,
  grpc.credentials.createInsecure()
);

// =============================
// checkInventory(items[], orderId) → boolean
// =============================
export async function checkInventory(items: OrderItem[], orderId: string): Promise<boolean> {
  console.log(`[${orderId}] → Inventory (gRPC) Anfrage: ${items.length} Artikel`);

  return new Promise((resolve, reject) => {
    client.CheckAvailability({ items }, (err: any, resp: any) => {
      if (err) {
        console.log(`[${orderId}] ❌ gRPC Error: ${err.message}`);
        return reject(err);
      }

      const list = resp.itemStatuses ?? [];

      console.log(`[${orderId}] ← Inventory Antwort:`);
      list.forEach((x: any) =>
        console.log(`  ${x.productId}: ${x.isAvailable ? "✔ verfügbar" : "❌ nicht verfügbar"} (${x.statusMessage})`)
      );

      const allAvailable = list.every((x: any) => x.isAvailable === true);
      console.log(`[${orderId}] → Inventory Ergebnis: ${allAvailable ? "OK ✅" : "NICHT OK ❌"}`);

      resolve(allAvailable);
    });
  });
}
