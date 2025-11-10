import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import { INVENTORY_ADDR } from "../config";
import { OrderItem } from "../types";

// ESM-kompatibles __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Proto liegt bei AVG-Team3/shared/inventory.proto
const PROTO_PATH = path.resolve(__dirname, "../../../shared/inventory.proto");

type ItemStatus = {
  productId: string;
  isAvailable: boolean;
  statusMessage: string;
  remainingStock: number;
};



// Proto laden
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const inventoryPkg: any = grpc.loadPackageDefinition(packageDefinition).inventory;

// gRPC Client
const client = new inventoryPkg.InventoryService(
  INVENTORY_ADDR, // z.B. "localhost:50051"
  grpc.credentials.createInsecure()
);

// Jetzt: items[] -> Promise<ItemStatus[]>
export async function checkInventory(items: OrderItem[], orderId: string): Promise<ItemStatus[]> {
  console.log(`[${orderId}] → Inventory (gRPC) Anfrage: ${items.length} Artikel`);

  return new Promise((resolve, reject) => {
    client.CheckAvailability({ items }, (err: any, resp: any) => {
      if (err) {
        console.log(`[${orderId}] ❌ gRPC Error: ${err.message}`);
        return reject(err);
      }

      const list: ItemStatus[] = resp?.itemStatuses ?? [];

      console.log(`[${orderId}] ← Inventory Antwort:`);
      list.forEach(x =>
        console.log(`  ${x.productId}: ${x.isAvailable ? "✔ verfügbar" : "❌ nicht verfügbar"} (${x.statusMessage})`)
      );

      resolve(list);
    });
  });
}
