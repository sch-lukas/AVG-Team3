Inbetriebnahme OMS/Orchestrator service:

Terminal im Projektverzeichnis: 
cd .\OMS\
pnpm i 
pnpm add amqplib
pnpm add -D @types/amqplib
pnpm dev

Inbetriebnahme WMS service:
Terminal im Projektverzeichnis: 
cd .\WMS\
docker compose up rabbitmq
docker compose up wms



