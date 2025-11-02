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
    const { items } = call.request;
    console.log(`[Inventory Service] Prüfe Verfügbarkeit für ${items.length} Artikel...`);

    let allGood = true; // Wir starten optimistisch

    // Gehe jeden Artikel in der Anfrage durch
    for (const item of items) {
        console.log(`[Inventory Service] -> Prüfe ${item.quantity}x ${item.productId}...`);

        // --- HIER IST DEINE SIMULATIONS-LOGIK PRO ARTIKEL ---
        if (item.productId === 'P-FAIL') {
            allGood = false; // Einer ist nicht verfügbar!
            console.log(`[Inventory Service] -> FEHLER: Produkt ${item.productId} ist NICHT verfügbar.`);
            // Wir brechen die Schleife ab, da wir schon wissen, dass es fehlschlägt
            break;
        }
    }

    // Sende die Gesamt-Antwort basierend auf dem "allGood"-Flag
    if (allGood) {
        console.log('[Inventory Service] Alle Produkte sind verfügbar.');
        callback(null, { allAvailable: true, statusMessage: 'All products available and reserved' });
    } else {
        console.log('[Inventory Service] Mindestens ein Produkt ist nicht verfügbar.');
        callback(null, { allAvailable: false, statusMessage: 'At least one product is not in stock' });
    }
};

// 4. Den gRPC-Server erstellen und starten
const server = new grpc.Server();

// Registriere unseren Service und seine Implementierung
server.addService(inventoryProto.InventoryService.service, {checkAvailability});

// Starte den Server auf Port 50051 (bindAsync startet den Server automatisch)
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`[Inventory Service] gRPC-Server läuft auf Port ${port}`);
});