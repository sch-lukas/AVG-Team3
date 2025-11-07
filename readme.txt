Inbetriebnahme OMS/Orchestrator service:

Terminal im Projektverzeichnis: 
cd .\OMS\
pnpm i 
pnpm add amqplib
pnpm add -D @types/amqplib
pnpm dev

Inbetriebnahme Warehouse service:
Terminal im Projektverzeichnis: 
cd .\Warehouse\
docker compose up rabbitmq
docker compose up wms



