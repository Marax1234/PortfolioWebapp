# Test Setup Documentation

## Überblick

Dieses Test-Setup bietet eine vollständig isolierte Test-Umgebung mit einer separaten
PostgreSQL-Datenbank, die die normale Entwicklungsumgebung nicht beeinträchtigt.

## Architektur

### Test-Datenbank

- **Container**: `portfolio-postgres-test`
- **Port**: `5440` (um Konflikte mit der Entwicklungs-DB auf Port 5439 zu vermeiden)
- **Datenbank**: `portfolio_test_db`
- **Docker-Compose**: `docker-compose.test.yml`

### Environment-Konfiguration

- **Test-Environment**: `.env.test`
- **Environment-Loader**: `scripts/load-env-test.js`
- **Automatisches Setup**: Test-DB wird vor jedem Test-Lauf zurückgesetzt

## Verfügbare Scripts

### Test-Ausführung

```bash
npm run test              # Vollständiger Test-Lauf mit Setup
npm run test:watch        # Test-Watch-Modus
npm run test:coverage     # Test mit Coverage-Report
```

### Test-Datenbank Management

```bash
npm run test:db:up        # Test-Container starten
npm run test:db:down      # Test-Container stoppen
npm run test:db:reset     # Test-Datenbank zurücksetzen
npm run test:db:seed      # Test-Datenbank mit Daten füllen
npm run test:db:migrate   # Test-Migrations ausführen
npm run test:db:logs      # Container-Logs anzeigen
```

### Manuelles Setup

```bash
npm run test:setup        # Komplett-Setup: Container starten + DB zurücksetzen + Seeden
```

## Jest-Konfiguration

### Global Setup/Teardown

- **Global Setup**: Startet Test-Container und führt Migrations aus
- **Global Teardown**: Stoppt Test-Container nach allen Tests
- **Database Utils**: Hilfsfunktionen für DB-Operations in Tests

### Test-Isolation

- **Serielle Ausführung**: Tests laufen nacheinander (maxWorkers: 1)
- **Database Reset**: Jeder Test-Lauf beginnt mit sauberer DB
- **Timeout**: 30 Sekunden für DB-intensive Operations

## Database Utilities

Das `tests/database-utils.js` Modul stellt folgende Funktionen bereit:

```javascript
const {
  getTestPrismaClient, // Prisma Client für Tests
  resetTestDatabase, // DB komplett zurücksetzen
  seedTestDatabase, // DB mit Test-Daten füllen
  cleanupTestDatabase, // Alle Test-Daten löschen
  disconnectTestDatabase, // Prisma Client trennen
} = require('./tests/database-utils');
```

## Beispiel Test-File

```javascript
const { getTestPrismaClient, cleanupTestDatabase } = require('../tests/database-utils');

describe('User API Tests', () => {
  let prisma;

  beforeAll(() => {
    prisma = getTestPrismaClient();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
  });

  test('should create user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        role: 'VISITOR',
      },
    });

    expect(user.email).toBe('test@example.com');
  });
});
```

## Vorteile

✅ **Vollständige Isolation**: Test-DB läuft auf separatem Port  
✅ **Keine Interferenz**: Entwicklung kann parallel weiterlaufen  
✅ **Reproduzierbare Tests**: Jeder Test-Lauf startet mit sauberer DB  
✅ **Einfache Verwaltung**: Alle Scripts automatisiert  
✅ **Docker-Integration**: Nutzt bestehende Docker-Infrastruktur

## Wichtige Hinweise

- Die Test-Datenbank wird vor jedem Test-Lauf komplett zurückgesetzt
- Tests laufen seriell, um DB-Konflikte zu vermeiden
- Der Test-Container läuft auf Port 5440 (nicht 5439 wie die Entwicklungs-DB)
- Environment-Variablen werden automatisch aus `.env.test` geladen
