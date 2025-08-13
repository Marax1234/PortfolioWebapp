# Docker Setup für Portfolio WebApp

Diese Anleitung beschreibt, wie Sie das Portfolio mit PostgreSQL in Docker einrichten.

## Voraussetzungen

- Docker und Docker Compose installiert
- Node.js 18+ installiert
- npm installiert

## Setup

### 1. Repository klonen und Dependencies installieren

```bash
git clone <repository-url>
cd PortfolioWebapp
npm install
```

### 2. Environment Variables konfigurieren

```bash
cp .env.example .env.local
```

Die `.env.local` Datei ist bereits mit den korrekten PostgreSQL-Einstellungen konfiguriert.

### 3. PostgreSQL Container starten

```bash
npm run docker:up
```

Dies startet einen PostgreSQL Container mit folgender Konfiguration:

- **Host:** localhost
- **Port:** 5439
- **Database:** portfolio_db
- **User:** portfolio_user
- **Password:** portfolio_password

### 4. Datenbank initialisieren

```bash
# Prisma Client generieren
npm run postinstall

# Datenbankschema migrieren
npm run db:migrate

# Datenbank mit Beispieldaten seeden
npm run db:seed

# Admin-Benutzer einrichten
npm run setup:admin

# Optional: Analytics-Daten seeden
npm run seed:analytics
```

### 5. Development Server starten

```bash
npm run dev
```

Die Anwendung ist nun unter `http://localhost:3000` verfügbar.

## Verfügbare Docker Commands

```bash
# PostgreSQL Container starten
npm run docker:up

# Container stoppen
npm run docker:down

# Container Logs anzeigen
npm run docker:logs
```

## Verfügbare Database Commands

```bash
# Datenbank Schema pushen (ohne Migration)
npm run db:push

# Migration erstellen und ausführen
npm run db:migrate

# Datenbank seeden
npm run db:seed

# Prisma Studio öffnen
npm run db:studio

# Datenbank zurücksetzen
npm run db:reset

# Admin Setup
npm run setup:admin

# Komplettes Setup (nach Reset)
npm run deploy:seed
```

## Troubleshooting

### Container startet nicht

```bash
# Prüfen ob Port 5439 bereits belegt ist
lsof -i :5439

# Andere PostgreSQL Instanzen stoppen
sudo service postgresql stop
```

### Datenbankverbindung schlägt fehl

```bash
# Container Status prüfen
docker-compose ps

# Container Logs prüfen
npm run docker:logs

# Health Check
docker-compose exec postgres pg_isready -U portfolio_user -d portfolio_db
```

### Datenbank zurücksetzen

```bash
# Container stoppen und Volumes löschen
docker-compose down -v

# Neustart mit frischer Datenbank
npm run docker:up
npm run deploy:seed
```

## Produktionsumgebung

Für die Produktionsumgebung sollten Sie:

1. Sichere Passwörter in der `docker-compose.yml` verwenden
2. Environment Variables aus Dateien oder Secrets laden
3. Persistent Volumes für Datenbackups konfigurieren
4. SSL/TLS für Datenbankverbindungen aktivieren
