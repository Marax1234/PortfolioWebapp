# API Routes Unit Test Analysis & Creation Prompt

Du bist der **test-writer-fixer** Agent für die Next.js 15 Portfolio-Webapp von Kilian Siebert.
Deine Aufgabe ist es, eine umfassende Unit Test-Suite für alle API-Routen zu erstellen.

## Phase 1: Test-Setup Analyse

Analysiere zunächst das aktuelle Test-Setup des Projekts:

### 1.1 Bestehende Test-Struktur ermitteln

```bash
# Führe diese Kommandos aus, um das Test-Setup zu verstehen:
find . -name "*.test.*" -o -name "*.spec.*" | grep -E '\.(js|ts|jsx|tsx)$'
find . -name "__tests__" -type d
cat package.json | grep -A 10 -B 5 "test"
cat jest.config.* 2>/dev/null || echo "Keine Jest Config gefunden"
```

### 1.2 Test-Umgebung Konfiguration prüfen

- Analysiere vorhandene Test-Konfiguration (Jest, Vitest, etc.)
- Prüfe Test-Datenbank Setup (Port 5440)
- Identifiziere bestehende Test-Utilities und Mocks
- Dokumentiere aktuelles Mocking-Pattern für NextAuth und Prisma

### 1.3 Bestehende API Tests evaluieren

- Liste alle vorhandenen API Route Tests auf
- Bewerte Test-Coverage der bestehenden Tests
- Identifiziere Lücken in der aktuellen Test-Abdeckung

## Phase 2: Unit Test Strategie

### 2.1 Test-Framework Konfiguration

Stelle sicher, dass folgende Test-Infrastruktur vorhanden ist:

- Jest/Vitest Konfiguration für Next.js API Routes
- Test-spezifische Environment Variables
- Mocking-Setup für:
  - Prisma Client (`@prisma/client`)
  - NextAuth.js (`next-auth`)
  - Nodemailer (Email-Funktionalität)
  - File Upload Handler

### 2.2 Test-Utilities erstellen

Erstelle folgende Test-Helper:

```typescript
// Test-Utilities für API Routes
- `createMockRequest()` - HTTP Request Mocking
- `createMockResponse()` - HTTP Response Mocking
- `mockAuthenticatedUser()` - Authentifizierte User Sessions
- `mockPrismaClient()` - Database Client Mocking
- `setupTestDatabase()` - Test DB Initialisierung
```

## Phase 3: API Routes Unit Tests

Erstelle Unit Tests für jede API Route nach folgendem Schema:

### 3.1 Authentication Routes

#### `/api/auth/[...nextauth]` (NextAuth.js)

- **Test-Fokus**: Konfiguration und Custom Callbacks
- Teste JWT Token Generation
- Teste Session Serialization/Deserialization
- Teste Role-based Authorization Logic
- Teste Password Hashing (bcrypt)

#### `/api/debug`

- Teste Session Information Retrieval
- Teste Environment Variable Masking
- Teste Authorization (nur für Development)

### 3.2 Portfolio Management Routes

#### `/api/portfolio` (GET, POST)

**GET Tests:**

- ✅ Sollte nur PUBLISHED Items für nicht-authentifizierte User zurückgeben
- ✅ Sollte Pagination korrekt handhaben
- ✅ Sollte nach Category filtern können
- ✅ Sollte view_count korrekt incrementieren
- ❌ Sollte 500 bei Database Error zurückgeben

**POST Tests:**

- ✅ Sollte neues Portfolio Item für ADMIN User erstellen
- ❌ Sollte 401 für nicht-authentifizierte User zurückgeben
- ❌ Sollte 403 für non-ADMIN User zurückgeben
- ❌ Sollte 400 bei invalider Eingabe zurückgeben

#### `/api/portfolio/[id]` (GET)

- ✅ Sollte Portfolio Item mit related Items zurückgeben
- ✅ Sollte view_count incrementieren
- ❌ Sollte 404 bei nicht-existierender ID zurückgeben
- ❌ Sollte nur PUBLISHED Items für Public Access zurückgeben

#### `/api/admin/portfolio` (GET)

- ✅ Sollte alle Portfolio Items für ADMIN zurückgeben (inkl. DRAFT)
- ✅ Sollte nach Status filtern können
- ❌ Sollte 401 für nicht-authentifizierte User zurückgeben
- ❌ Sollte 403 für non-ADMIN User zurückgeben

#### `/api/admin/portfolio/[id]` (GET, PUT)

**GET Tests:**

- ✅ Sollte Portfolio Item für ADMIN zurückgeben
- ❌ Sollte 401/403 für unauthorized access zurückgeben

**PUT Tests:**

- ✅ Sollte Portfolio Item Status aktualisieren
- ✅ Sollte Portfolio Item Metadaten aktualisieren
- ❌ Sollte 400 bei invaliden Status-Übergängen zurückgeben

### 3.3 Category Management Routes

#### `/api/categories` (GET, POST)

**GET Tests:**

- ✅ Sollte alle Kategorien für Public zurückgeben
- ✅ Sollte Portfolio Item Counts inkludieren

**POST Tests:**

- ✅ Sollte neue Kategorie für ADMIN erstellen
- ❌ Sollte 401/403 für unauthorized access zurückgeben
- ❌ Sollte 400 bei duplizierten Namen zurückgeben

#### `/api/categories/[id]` (PUT, DELETE)

- ✅ Sollte Kategorie aktualisieren/löschen für ADMIN
- ❌ Sollte 409 bei Löschung mit verknüpften Items zurückgeben
- ❌ Sollte 401/403 für unauthorized access zurückgeben

### 3.4 Contact & Inquiry System

#### `/api/contact` (POST)

- ✅ Sollte Contact Form Submission verarbeiten
- ✅ Sollte Zod Validation anwenden
- ✅ Sollte Email Notification senden (gemockt)
- ✅ Sollte Inquiry in Database speichern
- ❌ Sollte 400 bei invalider Eingabe zurückgeben
- ❌ Sollte graceful Email failure handling haben

#### `/api/admin/inquiries` (GET)

- ✅ Sollte alle Inquiries für ADMIN zurückgeben
- ✅ Sollte nach Status filtern können
- ✅ Sollte Pagination unterstützen
- ❌ Sollte 401/403 für unauthorized access zurückgeben

#### `/api/admin/inquiries/[id]` (PATCH)

- ✅ Sollte Inquiry Status aktualisieren
- ❌ Sollte 404 bei nicht-existierender Inquiry zurückgeben
- ❌ Sollte 400 bei invalidem Status zurückgeben

#### `/api/admin/inquiries/[id]/reply` (POST)

- ✅ Sollte Reply Email senden
- ✅ Sollte Inquiry Status auf RESPONDED setzen
- ❌ Sollte 400 bei leerem Reply zurückgeben

### 3.5 File & Media Management

#### `/api/upload` (POST)

- ✅ Sollte Image Upload verarbeiten
- ✅ Sollte Video Upload verarbeiten
- ✅ Sollte File Validation durchführen
- ❌ Sollte 400 bei nicht-unterstützten Formaten zurückgeben
- ❌ Sollte 413 bei zu großen Files zurückgeben
- ❌ Sollte 401 für nicht-authentifizierte User zurückgeben

### 3.6 Analytics & Settings

#### `/api/analytics` (GET)

- ✅ Sollte Dashboard Analytics für ADMIN zurückgeben
- ✅ Sollte Date Range Filtering unterstützen
- ❌ Sollte 401/403 für unauthorized access zurückgeben

#### `/api/settings/password` (PUT)

- ✅ Sollte Admin Password aktualisieren
- ✅ Sollte bcrypt Hashing verwenden
- ❌ Sollte 400 bei schwachen Passwörtern zurückgeben

#### `/api/settings/profile` (PUT)

- ✅ Sollte Admin Profile aktualisieren
- ❌ Sollte 400 bei invaliden Daten zurückgeben

### 3.7 Development & Testing Routes

#### `/api/test` (GET, POST)

- ✅ Sollte Basic API Connectivity testen
- ✅ Sollte Request/Response Format validieren

#### `/api/contact-debug` (POST)

- ✅ Sollte Contact Form Validation testen
- ✅ Sollte Debug Information zurückgeben

## Phase 4: Test Implementation Standards

### 4.1 Test-Struktur (AAA Pattern)

```typescript
describe('API Route: /api/example', () => {
  describe('GET /api/example', () => {
    it('should return successful response for valid request', async () => {
      // Arrange
      const mockData = {
        /* test data */
      };
      prismaMock.model.findMany.mockResolvedValue(mockData);

      const { req, res } = createMocks({ method: 'GET' });

      // Act
      await handler(req, res);

      // Assert
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockData);
    });
  });
});
```

### 4.2 Mocking Patterns

```typescript
// Prisma Client Mocking
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
}));

// NextAuth Session Mocking
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));
```

### 4.3 Test Data Factories

Erstelle Factory Functions für konsistente Test-Daten:

```typescript
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  role: 'ADMIN',
  ...overrides,
});

export const createMockPortfolioItem = (overrides = {}) => ({
  id: '1',
  title: 'Test Item',
  status: 'PUBLISHED',
  ...overrides,
});
```

## Phase 5: Ausführung & Validierung

### 5.1 Test Execution

```bash
# Führe Tests systematisch aus
npm run test:setup          # Test-DB vorbereiten
npm run test -- --coverage # Tests mit Coverage ausführen
npm run test:watch         # Watch mode für Development
```

### 5.2 Coverage Goals

- **API Routes**: 100% Coverage für alle Routen
- **Error Handling**: Alle Error Paths getestet
- **Authorization**: Alle Permission Checks getestet
- **Data Validation**: Alle Input Validations getestet

### 5.3 Test Quality Metrics

- Jeder Test sollte < 100ms dauern
- Keine flaky tests (Tests müssen 100% konsistent sein)
- Descriptive test names die Behavior dokumentieren
- Ein Assert pro Test für maximale Klarheit

## Expected Output

Erstelle eine vollständige Unit Test-Suite mit:

1. **Test Configuration** - Jest/Vitest Setup für API Testing
2. **Mock Setup** - Comprehensive Mocking für alle Dependencies
3. **Test Utilities** - Reusable Helper Functions
4. **API Route Tests** - Unit Tests für alle 20+ API Endpoints
5. **Test Documentation** - README für Test Execution
6. **Coverage Report** - Validation der 100% Coverage für API Routes

Beginne mit der Analyse des aktuellen Test-Setups und arbeite dich systematisch durch alle
API-Routen. Priorisiere kritische Routen (Auth, Portfolio Management) und stelle sicher, dass alle
Edge Cases und Error Conditions abgedeckt sind.
