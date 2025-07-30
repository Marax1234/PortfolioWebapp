# API Route Testing Documentation

## Übersicht

Dieses Dokument beschreibt die implementierte Test-Infrastructure für die API-Routen der Portfolio
Web-App.

## Test Setup

### Jest Konfiguration

- **Test Framework**: Jest 30.0.5 mit TypeScript-Support
- **Test Environment**: Node.js für API-Route-Tests
- **Mock Framework**: Jest Mocks für Abhängigkeiten

### Test-Struktur

```
src/
├── __tests__/
│   ├── mocks/
│   │   ├── database.ts      # Database Mock-Implementierungen
│   │   └── services.ts      # Service Layer Mocks
│   ├── setup/
│   │   └── mocks.ts         # Globale Mock-Konfiguration
│   └── test-runner.test.ts  # Test Environment Validation
├── app/api/
│   ├── portfolio/__tests__/
│   ├── categories/__tests__/
│   ├── contact/__tests__/
│   └── auth/__tests__/
└── lib/auth/__tests__/
```

## Implementierte Tests

### 1. Portfolio API Routes (`/api/portfolio`)

**Getestete Funktionen:**

- ✅ GET Request mit Standard-Pagination
- ✅ Benutzerdefinierte Pagination (page, limit)
- ✅ Kategorie-Filterung
- ✅ Featured Items Filterung
- ✅ Custom Ordering (orderBy, orderDirection)
- ✅ Input Validation (ungültige Parameter)
- ✅ Error Handling (Database-Fehler)
- ✅ Performance-Tests
- ✅ Response Format Validation

**Getestete HTTP Status Codes:**

- 200 OK - Erfolgreiche Anfragen
- 400 Bad Request - Ungültige Parameter
- 500 Internal Server Error - Database-Fehler

### 2. Portfolio Item by ID (`/api/portfolio/[id]`)

**Getestete Funktionen:**

- ✅ GET Request mit gültiger ID
- ✅ Related Items Abfrage
- ✅ View Count Increment
- ✅ Input Validation (fehlende/ungültige ID)
- ✅ Not Found Handling
- ✅ Error Handling
- ✅ Performance-Tests

**Getestete HTTP Status Codes:**

- 200 OK - Portfolio Item gefunden
- 400 Bad Request - Ungültige ID
- 404 Not Found - Item nicht gefunden
- 500 Internal Server Error - Database-Fehler

### 3. Categories API (`/api/categories`)

**Getestete Funktionen:**

- ✅ GET alle aktiven Kategorien
- ✅ Portfolio Item Counts pro Kategorie
- ✅ Sortierung nach sortOrder
- ✅ Leere Resultate Handling
- ✅ Error Handling
- ✅ Response Format Transformation
- ✅ Performance mit großen Datasets

**Getestete HTTP Status Codes:**

- 200 OK - Kategorien erfolgreich abgerufen
- 500 Internal Server Error - Database-Fehler

### 4. Contact API (`/api/contact`)

**Getestete Funktionen:**

- ✅ POST Request mit gültigen Daten
- ✅ Optionale Felder (phone, company, budget, timeline)
- ✅ Input Validation (Pflichtfelder, Email-Format, Nachrichtenlänge)
- ✅ Rate Limiting Logik
- ✅ Spam Detection (verdächtige Inhalte, URLs, Email-Domains)
- ✅ Error Handling
- ✅ Response Format Validation

**Getestete HTTP Status Codes:**

- 201 Created - Kontaktanfrage erfolgreich erstellt
- 400 Bad Request - Validation-Fehler
- 429 Too Many Requests - Rate Limiting
- 500 Internal Server Error - Server-Fehler

### 5. Authentication API (`/api/auth/[...nextauth]`)

**Getestete Funktionen:**

- ✅ NextAuth Handler Export (GET/POST)
- ✅ Auth Options Integration
- ✅ Request Parameter Weiterleitung
- ✅ Error Handling
- ✅ Content-Type Support (JSON, form-encoded)
- ✅ Security Konfiguration

### 6. Auth Configuration Tests

**Getestete Funktionen:**

- ✅ Session Strategy (JWT)
- ✅ Provider Konfiguration (Credentials)
- ✅ Authorization Logic (Admin-only)
- ✅ JWT/Session Callbacks
- ✅ Event Handlers
- ✅ Security Configuration

## Mock-Strategy

### Database Mocking

- **Prisma Client**: Vollständig gemockt mit realistischen Daten
- **Query Methods**: findMany, findFirst, create, update, count
- **Error Simulation**: Prisma-spezifische Fehler (P2002, P2025, etc.)

### Service Layer Mocking

- **UserService**: Authentication und User Management
- **PortfolioQueries**: Portfolio-spezifische Datenbankabfragen
- **CategoryQueries**: Kategorie-Datenbankabfragen
- **ErrorHandler**: Strukturierte Fehlerbehandlung

### External Dependencies

- **Winston Logger**: Vollständig gemockt für saubere Test-Ausgaben
- **NextAuth**: Mocked für Authentication-Tests
- **Next.js Server**: NextRequest/NextResponse Mocks

## Test Commands

```bash
# Alle Tests ausführen
npm run test

# Tests im Watch-Mode
npm run test:watch

# Coverage Report
npm run test:coverage

# Spezifische Test-Datei
npm run test src/app/api/portfolio/__tests__/route.test.ts
```

## Test-Statistiken

**Implementierte Tests:** 80+ Test Cases **Abgedeckte API Routes:** 6 von 6 (100%) **Test
Categories:**

- Successful Requests
- Input Validation
- Error Handling
- Performance Considerations
- Response Format Validation
- Security Tests

## Qualitätskriterien

**Erfüllt:**

- ✅ 100% aller API Routes haben strukturierte Tests
- ✅ Alle HTTP-Methoden getestet (GET, POST)
- ✅ Alle erwarteten Status Codes getestet (200, 201, 400, 404, 429, 500)
- ✅ Input Validation für alle Parameter
- ✅ Error Response Format Konsistenz
- ✅ Performance-Tests für alle Routes
- ✅ Authentication/Authorization Flow Tests

## Bekannte Limitierungen

1. **Mocking Strategy**: Tests verwenden Mocks anstatt einer echten Test-Database
2. **Integration Tests**: Fehlende End-to-End Tests mit echten HTTP-Requests
3. **NextAuth Integration**: Teilweise gemockt, könnte vollständigere Integration benötigen

## Nächste Schritte

1. **Integration Tests**: Echte HTTP-Requests gegen Test-Server
2. **Database Tests**: SQLite In-Memory für realistischere Database-Tests
3. **E2E Tests**: Vollständige User-Flows testen
4. **Performance Benchmarks**: Reale Performance-Metriken erfassen
