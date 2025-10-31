import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// 1. Pfad zur .proto-Datei definieren
const PROTO_PATH = path.join(__dirname, '../../shared/inventory.proto');

// 2. Proto-Datei laden
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const inventoryProto: any = grpc.loadPackageDefinition(packageDefinition).inventory;

// 3. Die eigentliche Logik für die "CheckAvailability"-Funktion
const checkAvailability = (call: any, callback: any) => {
    const { productId, quantity } = call.request;
    console.log(`[Inventory Service] Prüfe Verfügbarkeit für ${quantity}x ${productId}...`);

    // --- HIER IST DEINE SIMULATIONS-LOGIK ---
    if (productId === 'P-FAIL') {
        console.log(`[Inventory Service] Produkt ${productId} ist NICHT verfügbar.`);
        callback(null, { isAvailable: false, statusMessage: 'Product not in stock' });
    } else {
        console.log(`[Inventory Service] Produkt ${productId} ist verfügbar.`);
        callback(null, { isAvailable: true, statusMessage: 'Product available and reserved' });
    }
};

// 4. Den gRPC-Server erstellen und starten
const server = new grpc.Server();

// Registriere unseren Service und seine Implementierung
server.addService(inventoryProto.InventoryService.service, { checkAvailability });

// Starte den Server auf Port 50051 (bindAsync startet den Server automatisch)
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`[Inventory Service] gRPC-Server läuft auf Port ${port}`);
});