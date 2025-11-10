import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Die URL des Logging-Servers
const LOGGING_SERVICE_URL = 'http://localhost:7070/log';

// Sendet eine Log-Nachricht an den zentralen Logging-Service.
const logToService = (message: string) => {
  fetch(LOGGING_SERVICE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Message: message }),
  })
  .catch(err => {

    console.error(`[InventoryService] Konnte nicht an LoggingService senden: ${err.message}`);
  });
};

// MOCK-DATENBANK
let inventoryStock: { [key: string]: number } = {
  "P-0001": 10,   // 10 Stück auf Lager
  "P-0002": 20,   // 20 Stück auf Lager
  "P-0003": 30    // 30 Stück auf Lager 
};

// Pfad zur .proto-Datei definieren
const PROTO_PATH = path.join(__dirname, '../../shared/inventory.proto');

// Proto-Datei laden
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const inventoryProto: any = grpc.loadPackageDefinition(packageDefinition).inventory;

// Die eigentliche Logik für die "CheckAvailability"-Funktion
const checkAvailability = (call: any, callback: any) => {
    const { items } = call.request;
    (`[Inventory Service] Prüfe Verfügbarkeit für ${items.length} Artikel...`);

    const responseStatuses: any[] = []; // Array für die ItemStatus-Objekte
    
    // --- Wir gehen die Bestellung EINMAL durch ---
    for (const item of items) {
        const currentStock = inventoryStock[item.productId] || 0; // Hole Bestand

        if (currentStock >= item.quantity) {
            // GENUG AUF LAGER: Wir buchen ab!
            inventoryStock[item.productId] -= item.quantity; // Bestand reduzieren
            const newStock = inventoryStock[item.productId];

            logToService(`[Inventory Service] -> OK: ${item.quantity}x ${item.productId} reserviert. Neuer Bestand: ${newStock}`);
            
            // Füge Erfolgs-Status zur Antwortliste hinzu
            responseStatuses.push({
                productId: item.productId,
                isAvailable: true,
                statusMessage: 'Product reserved',
                remainingStock: newStock
            });

        } else {
            // NICHT GENUG AUF LAGER: Wir buchen NICHTS ab
            logToService(`[Inventory Service] -> FEHLER: ${item.productId} nicht verfügbar. Verfügbar: ${currentStock}, Benötigt: ${item.quantity}`);
            
            // Füge Fehler-Status zur Antwortliste hinzu
            responseStatuses.push({
                productId: item.productId,
                isAvailable: false,
                statusMessage: `Not enough stock. Available: ${currentStock}, Requested: ${item.quantity}`,
                remainingStock: currentStock
            });
        }
    }

    // --- Schicke die komplette Status-Liste als Antwort zurück ---
    logToService('[Inventory Service] Prüfung abgeschlossen, sende Status-Liste.');
    
    // Die Antwort ist jetzt das Objekt, das die Liste enthält
    callback(null, { itemStatuses: responseStatuses });
};

// Den gRPC-Server erstellen und starten
const server = new grpc.Server();

// Registriere unseren Service und seine Implementierung
server.addService(inventoryProto.InventoryService.service, {checkAvailability});

// Starte den Server auf Port 50051
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    logToService(`[Inventory Service] gRPC-Server läuft auf Port ${port}`);
    console.log('[Inventory Service] gRPC-Server läuft auf Port ${port}');
});