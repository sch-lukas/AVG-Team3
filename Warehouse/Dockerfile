# ---- Basis-Image ----
FROM node:20-alpine

# ---- Arbeitsverzeichnis im Container ----
WORKDIR /app

# ---- Paketdefinitionen kopieren ----
COPY package*.json ./

# ---- Abhängigkeiten installieren ----
RUN npm install

# ---- Quellcode kopieren ----
COPY . .

# ---- TypeScript zu JavaScript kompilieren ----
RUN npm run build

# ---- Container startet dein Worker-Skript ----
CMD ["node", "dist/wms.js"]
