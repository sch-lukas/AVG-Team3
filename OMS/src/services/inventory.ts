import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { OrderItem, InventoryAvailability } from "../types";
import { remoteLog } from "../services/remoteLog";

// __dirname Ersatz für ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Pfad zur proto
const PROTO_PATH = join(__dirname, "../../../shared/inventory.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const inventoryProto: any =
  grpc.loadPackageDefinition(packageDefinition).inventory;

const client = new inventoryProto.InventoryService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

export async function checkInventory(
  items: OrderItem[],
  orderId: string
): Promise<InventoryAvailability[]> {
  console.log(
    `[${orderId}] → Inventory (gRPC) Anfrage: ${items.length} Artikel`
  );
  remoteLog(`[OMS] [${orderId}] → Inventory (gRPC) Anfrage: ${items.length} Artikel`);

  return new Promise((resolve, reject) => {
    client.checkAvailability({ items }, (err: any, response: any) => {
      if (err) {
        const msg = `[OMS] [${orderId}] ❌ gRPC Error: ${err.message}`;

        console.log(msg);
        remoteLog(msg); 

        return reject(err);
      }

      const list: InventoryAvailability[] = response.itemStatuses;
      console.log(`[${orderId}] ← Inventory Antwort:`);
      remoteLog(`[OMS] [${orderId}] ← Inventory Antwort:`);
      list.forEach((x) => {
        const message = `Item ${x.productId}: ${
          x.isAvailable ? "✔ verfügbar" : "❌ nicht verfügbar"
        } (${x.statusMessage})`;

        console.log("  " + message);
        remoteLog(`[OMS] ${message}`); 
      });

      resolve(list);
    });
  });
}
