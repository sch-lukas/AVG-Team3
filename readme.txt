Inbetriebnahme OMS/Orchestrator service:

Terminal im Projektverzeichnis: 
cd .\OMS\
pnpm i 
pnpm add amqplib
pnpm add -D @types/amqplib
pnpm add @grpc/grpc-js @grpc/proto-loader
pnpm add -D @types/node
pnpm dev

Inbetriebnahme Warehouse service:
## Voraussetzungen

* Docker Desktop starten

Terminal im Projektverzeichnis: 
cd .\Warehouse\

*RabbitMQ starten:

docker compose up rabbitmq 
// bis Server startup complete

*Warehouse Service starten:

docker compose up wms
// WMS wartet auf Bestellungen...


Zahlungsmethoden: 

