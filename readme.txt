Terminal im Projektverzeichnis:

Inbetriebnahme OMS/Orchestrator service:
cd .\OMS\
pnpm i 
pnpm add amqplib
pnpm add -D @types/amqplib
pnpm add @grpc/grpc-js @grpc/proto-loader
pnpm add -D @types/node
pnpm dev

Inbetriebnahme Logging service:
cd .\LoggingService\
pnpm install
pnpm dev


Inventory Service Installationsanweisung:

## Voraussetzungen

    * [Node.js](https://nodejs.org/)
    * [pnpm](https://pnpm.io/installation) (kann über `npm install -g pnpm` installiert werden)

## Installation & Start

    Alle Befehle werden innerhalb dieses `Inventory`-Ordners ausgeführt.

    * Abhängigkeiten installieren:
        ```
        pnpm install
        ```

    * Service starten:
        ```
        pnpm start
        ```

## Ergebnis

    Wenn alles funktioniert, siehst du die folgende Ausgabe im Terminal: "Der Server läuft nun und wartet auf Anfragen auf Port 50051."


Inbetriebnahme Warehouse service:
## Voraussetzungen

* Docker Desktop starten

Terminal im Projektverzeichnis: 
cd .\Warehouse\

*RabbitMQ starten:

docker compose up rabbitmq 
// bis Server startup complete

*Warehouse Service starten:

docker compose up --build wms
// WMS wartet auf Bestellungen...

Inbetriebnahme PaymentAPI:
## Voraussetungen

*Net 8.0 erforderlich

## Start

verzeichnis im Terminal öffnen

cd .\PaymentAPI\

"dotnet run" eingeben

## Ergebnis

Now Listening on: http://localhost:5167

