# 📚 Kilian Siebert Portfolio - Vollständige Dokumentation

Diese Dokumentation enthält detaillierte Informationen zur Setup, Konfiguration und Verwendung der Portfolio-Website.

## 📋 Inhaltsverzeichnis

- [Vollständige Setup-Anleitung](#-vollständige-setup-anleitung)
- [Environment-Konfiguration](#-environment-konfiguration)
- [Datenbank-Management](#-datenbank-management)
- [Admin-Dashboard](#-admin-dashboard)
- [Kontaktformular & Anfrage-Management](#-kontaktformular--anfrage-management)
- [E-Mail-Konfiguration](#-e-mail-konfiguration)
- [API-Dokumentation](#-api-dokumentation)
- [Projekt-Architektur](#-projekt-architektur)
- [Konfiguration](#-konfiguration)
- [Troubleshooting](#-troubleshooting)
- [Deployment](#-deployment)

## 🏗 Vollständige Setup-Anleitung

### 1. Repository klonen
```bash
git clone <repository-url>
cd PortfolioWebapp
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Environment-Konfiguration
Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Admin Configuration
ADMIN_EMAIL="mhiller2005@gmail.com"
ADMIN_PASSWORD_HASH="bcrypt-hashed-password"

# Email Configuration (Optional - für Kontaktformular-Benachrichtigungen)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

### 4. Datenbank-Setup
```bash
# Prisma Client generieren
npx prisma generate

# Datenbank-Migrationen ausführen
npm run db:migrate

# Datenbank mit Beispieldaten füllen
npm run db:seed
```

### 5. Admin-Benutzer einrichten
```bash
# Admin-Benutzer-Passwort einrichten
npm run setup:admin
```

### 6. Entwicklungsserver starten
```bash
npm run dev
```

Die Anwendung ist verfügbar unter [http://localhost:3000](http://localhost:3000)

## 🛠️ Environment-Konfiguration

### Basis-Konfiguration
```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generiere-einen-sicheren-schlüssel"

# Admin
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="$2b$12$..."  # Wird durch setup:admin gesetzt
```

### E-Mail-Konfiguration (Optional)

#### Option A: Gmail SMTP
```env
ADMIN_EMAIL="mhiller2005@gmail.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"  # App-Passwort verwenden!
EMAIL_FROM="your-email@gmail.com"
```

#### Option B: SendGrid
```env
ADMIN_EMAIL="mhiller2005@gmail.com"
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
EMAIL_FROM="your-verified-sender@domain.com"
```

#### Option C: Custom SMTP
```env
ADMIN_EMAIL="mhiller2005@gmail.com"
SMTP_HOST="mail.your-domain.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
EMAIL_FROM="noreply@your-domain.com"
```

## 🗄️ Datenbank-Management

### Verfügbare Commands
```bash
npm run db:push      # Schema-Änderungen zur Datenbank pushen
npm run db:migrate   # Migrationen erstellen und ausführen
npm run db:seed      # Datenbank mit Beispieldaten füllen
npm run db:studio    # Prisma Studio GUI öffnen
npm run db:reset     # Datenbank komplett zurücksetzen
```

### Datenbank zurücksetzen und neu befüllen
```bash
# Methode 1: Komplett zurücksetzen (empfohlen)
npm run db:reset

# Methode 2: Manuelle Schritte
npx prisma db push --force-reset  # Datenbank zurücksetzen
npm run db:seed                   # Mock-Daten laden
```

Dies wird:
1. Alle existierenden Daten löschen
2. Datenbank-Schema neu erstellen
3. Beispiel-Portfolio-Items, Kategorien und Benutzerdaten laden

### Datenbank-Schema

#### Kern-Modelle
- **User** - Authentifizierung mit Rollen (VISITOR, REGISTERED, ADMIN)
- **PortfolioItem** - Medien-Items mit Metadaten, Kategorien, Tags, View-Counts
- **Category** - Portfolio-Kategorisierung (Nature, Travel, Events, Videography)
- **Inquiry** - Kontaktformular-Einreichungen mit Status-Tracking
- **NewsletterSubscriber** - E-Mail-Abonnements
- **AnalyticsEvent** - Basis-Analytics-Tracking

#### Content-Workflow
Portfolio-Items folgen einem strukturierten Workflow:
- **DRAFT** - Work in Progress
- **REVIEW** - Bereit zur Überprüfung
- **PUBLISHED** - Live auf der Website
- **ARCHIVED** - Vor der Öffentlichkeit verborgen

## 🛠️ Admin-Dashboard

### Zugang zum Dashboard
```
http://localhost:3000/admin/inquiries
```

### Vollständige Portfolio-Verwaltung:
- Portfolio-Items erstellen, bearbeiten, löschen
- Kategorie-Management
- File-Upload mit Vorschau
- Status-Management
- **Anfrage-Management** - Kunden-Kontakt-Anfragen bearbeiten
- Analytics-Übersicht

### Authentifizierung & Autorisierung
- JWT-Tokens mit HTTP-only Cookies (24-Stunden-Ablauf)
- bcrypt für Passwort-Hashing
- Rollenbasierter Zugang: ADMIN-Rolle erforderlich für `/admin/*` Routen
- Geschützt durch Middleware in `src/middleware.ts`
- Umfassendes Sicherheits-Logging via winston

### Schlüssel-Komponenten
- **PortfolioGrid** (`src/components/gallery/`): Infinite Scroll Galerie mit Masonry/Grid-Toggle
- **Lightbox** (`src/components/gallery/`): Vollbild-Bild-Viewer mit Tastatur-Navigation
- **AdminDashboard** (`src/app/(admin)/admin/`): Portfolio-Management-Interface
- **AuthProvider** (`src/components/providers/`): Session-Management-Wrapper

### State-Management
- Zustand Store in `src/store/portfolio-store.ts` für Portfolio-State
- Client-seitiges Caching und Pagination
- Optimistische Updates für View-Counts
- Lightbox State-Management mit Tastatur-Navigation

## 📬 Kontaktformular & Anfrage-Management-System

Das Portfolio beinhaltet ein umfassendes Kontaktformular und Anfrage-Management-System für professionelle Kunden-Kommunikation.

### 🌟 Features-Übersicht

#### **Kunden-seitiges Kontaktformular**
- **Professionelles Form-Design** - Sauberes, responsives Formular mit Validierung
- **Service-Kategorien** - Nature, Travel, Event, Videography Optionen
- **GDPR-Konformität** - Erforderliches Datenschutz-Einverständnis-Checkbox
- **Echtzeit-Validierung** - Client- und serverseitige Validierung mit Zod
- **Benutzer-Feedback** - Erfolg/Fehler-Nachrichten mit professionellem Styling
- **Spam-Schutz** - Eingebaute Spam-Erkennung und Rate-Limiting

#### **Admin Anfrage-Management Dashboard**
- **Zentralisiertes Dashboard** - Alle Anfragen anzeigen unter `/admin/inquiries`
- **Echtzeit-Statistiken** - Anzahl neuer, laufender und gelöster Anfragen
- **Erweiterte Filterung** - Suche nach Name, E-Mail oder Betreff
- **Status-Management** - Anfrage-Status aktualisieren (NEW → IN_PROGRESS → RESOLVED → CLOSED)
- **Schnelles Antwort-System** - Professionelle Antworten direkt vom Dashboard senden
- **Detailansicht** - Vollständige Anfrage-Details mit Kunden-Kontaktinformationen

#### **E-Mail-System**
- **Doppelte Benachrichtigungen** - Admin-Warnungen + Kunden-Bestätigungen
- **Professionelle Templates** - HTML-E-Mail-Templates mit Branding
- **Auto-Antworten** - Sofortige Bestätigungs-E-Mails an Kunden
- **Individuelle Antworten** - Personalisierte Antworten vom Admin-Dashboard
- **Entwicklungsmodus** - E-Mail-Simulation ohne SMTP-Konfiguration

### 🛠 Setup-Anweisungen

#### **1. Basis-Setup (Funktioniert sofort)**
Das Kontaktformular funktioniert out-of-the-box mit E-Mail-Simulation:

```bash
# Keine zusätzliche Einrichtung erforderlich - E-Mails werden in der Konsole protokolliert
npm run dev
# Besuche http://localhost:3000/contact zum Testen
```

#### **2. Produktions-E-Mail-Setup**
Für Live-E-Mail-Benachrichtigungen konfiguriere SMTP in `.env.local` (siehe E-Mail-Konfiguration oben).

### 📧 Gmail App-Passwort Setup

Um Gmail SMTP zu verwenden, benötigst du ein App-Passwort (nicht dein reguläres Passwort):

1. **2-Faktor-Authentifizierung aktivieren** auf deinem Google-Konto
2. **App-Passwort generieren**:
   - Gehe zu Google-Konto-Einstellungen
   - Sicherheit → 2-Schritt-Verifizierung → App-Passwörter
   - App auswählen: "Mail" und Gerät: "Andere (Benutzerdefinierter Name)"
   - Das 16-stellige Passwort kopieren
3. **In .env.local verwenden**:
   ```env
   SMTP_PASSWORD="dein-16-stelliges-app-passwort"
   ```

### 🎯 Kunden-Journey

1. **Kunde** besucht `/contact` Seite
2. **Füllt Formular aus** mit Projekt-Details und Service-Kategorie
3. **Formular-Validierung** stellt sicher, dass alle erforderlichen Felder ausgefüllt sind
4. **Einreichung** speichert Anfrage in Datenbank und löst E-Mails aus:
   - **Admin-Benachrichtigung** gesendet an `ADMIN_EMAIL`
   - **Kunden-Bestätigung** gesendet mit Referenz-ID
5. **Admin** erhält E-Mail-Benachrichtigung und kann:
   - Anfrage im Dashboard unter `/admin/inquiries` anzeigen
   - Status und Priorität aktualisieren
   - Personalisierte Antwort senden
6. **Status-Tracking** während des gesamten Prozesses

### 🔧 Admin Anfrage-Management

#### **Dashboard zugreifen**
```
http://localhost:3000/admin/inquiries
```

#### **Schlüssel-Features**
- **Statistik-Karten** - Übersicht der Anfrage-Anzahl nach Status
- **Suchen & Filtern** - Anfragen nach Name, E-Mail oder Betreff finden
- **Status-Updates** - Klicken um Anfrage-Status zu ändern
- **Detail-Panel** - Anfrage anklicken um vollständige Details anzuzeigen
- **Schnelle Antwort** - Antworten direkt vom Dashboard senden
- **Kontakt-Integration** - Direkte E-Mail- und Telefon-Links

#### **Anfrage-Workflow**
```
NEW → IN_PROGRESS → RESOLVED → CLOSED
```

- **NEW**: Frische Anfrage, benötigt Aufmerksamkeit
- **IN_PROGRESS**: Wird gerade bearbeitet
- **RESOLVED**: Antwort an Kunde gesendet
- **CLOSED**: Anfrage abgeschlossen/archiviert

### 🛡 Sicherheits-Features

- **Rate-Limiting** - Max. 5 Einreichungen pro Stunde pro IP
- **Spam-Erkennung** - Automatische Bewertung basierend auf Inhalts-Mustern
- **Input-Validierung** - Serverseitige Validierung mit Zod-Schemas
- **GDPR-Konformität** - Erforderliches Datenschutz-Einverständnis
- **Umfassendes Logging** - Alle Aktionen mit Winston protokolliert
- **CSRF-Schutz** - Eingebauter Next.js CSRF-Schutz

### 🧪 System testen

#### **Manuelles Testen**
1. Entwicklungsserver starten: `npm run dev`
2. Kontaktformular besuchen: `http://localhost:3000/contact`
3. Formular ausfüllen und absenden
4. Server-Konsole für E-Mail-Logs prüfen
5. Admin-Dashboard besuchen: `http://localhost:3000/admin/inquiries`
6. Antwort-Funktionalität testen

#### **Entwicklung vs. Produktion**
- **Entwicklung**: E-Mails simuliert und in Konsole protokolliert
- **Produktion**: Echte E-Mails über konfiguriertes SMTP gesendet

## 📊 API-Dokumentation

### Öffentliche API-Endpoints
- `GET /api/portfolio` - Veröffentlichte Portfolio-Items abrufen
- `GET /api/portfolio/[id]` - Einzelnes Portfolio-Item abrufen
- `GET /api/categories` - Kategorien abrufen
- `POST /api/contact` - Kontaktformular absenden (mit E-Mail-Benachrichtigungen)

### Admin API-Endpoints

#### Portfolio-Management
- `GET /api/admin/portfolio` - Alle Portfolio-Items abrufen (beliebiger Status)
- `GET /api/admin/portfolio/[id]` - Einzelnes Item zum Bearbeiten abrufen
- `PUT /api/admin/portfolio/[id]` - Portfolio-Item aktualisieren
- `POST /api/portfolio` - Neues Portfolio-Item erstellen
- `POST /api/upload` - Dateien hochladen und verarbeiten

#### Anfrage-Management
- `GET /api/admin/inquiries` - Alle Kunden-Anfragen abrufen
- `PATCH /api/admin/inquiries/[id]` - Anfrage-Status/Priorität aktualisieren
- `POST /api/admin/inquiries/[id]/reply` - Individuelle Antwort an Kunden senden

## 🏗 Projekt-Architektur

### Datei-Struktur
```
src/
├── app/                    # Next.js App Router-Seiten
│   ├── (admin)/           # Admin-geschützte Routen
│   ├── (auth)/            # Authentifizierungs-Seiten
│   ├── api/               # API-Routen
│   └── globals.css        # Globale Styles
├── components/            # Wiederverwendbare Komponenten
│   ├── gallery/          # Portfolio-Galerie-Komponenten
│   ├── ui/               # UI-Komponenten (shadcn/ui)
│   └── providers/        # Context-Provider
├── lib/                  # Utilities und Konfigurationen
│   ├── db.ts            # Datenbank-Client
│   ├── auth.ts          # Authentifizierungs-Konfiguration
│   ├── storage.ts       # Dateispeicher-Utilities
│   └── image-processor.ts # Bildverarbeitung
├── store/               # Zustand State-Management
└── types/              # TypeScript-Typdefinitionen

prisma/
├── schema.prisma       # Datenbank-Schema
├── dev.db             # SQLite-Datenbankdatei
└── seed.ts            # Datenbank-Seeding-Skript

public/
├── uploads/           # Benutzer-hochgeladene Dateien
│   └── portfolio/    # Portfolio-Mediendateien
└── images/           # Statische Bilder
```

### Datenbank-Beziehungen
- Portfolio-Items gehören zu Kategorien
- Portfolio-Items haben Metadaten (Fotograf, Ort, Kamera-Einstellungen)
- Benutzer können mehrere Rollen haben und Inhalte verwalten

## 🔧 Konfiguration

### Bildverarbeitung
Bildverarbeitungsoptionen in `src/lib/image-processor.ts` konfigurieren:
```typescript
export const DEFAULT_PROCESSING_OPTIONS = {
  quality: 85,
  maxWidth: 2400,
  maxHeight: 2400,
  thumbnailSize: 400,
  generateWebP: true,
  generateAVIF: true,
}
```

### Speicher-Konfiguration
Speicher-Einstellungen in `src/lib/storage.ts` ändern:
```typescript
export const DEFAULT_STORAGE_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/quicktime'],
}
```

### File-Upload & Verarbeitung
- Automatische Bildoptimierung mit Sharp
- Generierung mehrerer Formate (WebP, AVIF)
- Thumbnail-Erstellung
- Datei-Validierung und Größenlimits
- Organisierte Speicher-Struktur

## 🐛 Troubleshooting

### Häufige Probleme

#### **Formular wird nicht abgesendet:**
```bash
# Server-Logs für Validierungsfehler prüfen
npm run dev
# Browser Network-Tab für API-Fehler prüfen
```

#### **E-Mails werden nicht gesendet:**
```bash
# SMTP-Konfiguration in .env.local überprüfen
cat .env.local | grep SMTP

# SMTP-Verbindung testen (Server-Logs prüfen)
# E-Mails werden auch bei SMTP-Fehlern protokolliert
```

#### **Admin-Dashboard lädt nicht:**
```bash
# Sicherstellen, dass Admin-Benutzer eingerichtet ist
npm run setup:admin

# Authentifizierung prüfen
# Muss als ADMIN-Rolle angemeldet sein
```

### Datenbank-Probleme
```bash
# Wenn Prisma Client out of sync ist
npx prisma generate

# Bei Datenbank-Schema-Problemen
npx prisma db push --force-reset
npm run db:seed
```

### File-Upload-Probleme
```bash
# Upload-Verzeichnis-Berechtigungen prüfen
ls -la public/uploads/

# Upload-Verzeichnisse neu erstellen
mkdir -p public/uploads/portfolio/{originals,thumbnails,webp,avif,temp}
```

### Admin-Zugriffs-Probleme
```bash
# Admin-Passwort zurücksetzen
npm run setup:admin

# Environment-Variablen prüfen
cat .env.local
```

## 🚀 Deployment

### Production-Build
```bash
npm run build
npm run start
```

### Environment-Variablen für Produktion
Stelle sicher, dass alle Environment-Variablen für Produktion richtig gesetzt sind:
- `NEXTAUTH_URL` - Deine Produktions-Domain
- `NEXTAUTH_SECRET` - Sicherer zufälliger String
- `DATABASE_URL` - Produktions-Datenbank-Verbindung
- SMTP-Einstellungen für Kontaktformulare

### Dateispeicher
Für Produktion erwägen:
- Cloud-Speicher verwenden (AWS S3, Cloudinary) statt lokaler Dateien
- CDN für Bild-Auslieferung
- Regelmäßige Backups des Uploads-Verzeichnisses

### E-Mail-Templates

Das System beinhaltet professionelle HTML-E-Mail-Templates:

- **Admin-Benachrichtigung**: Detaillierte Anfrage-Informationen mit schnellen Aktions-Links
- **Kunden-Bestätigung**: Professionelle Bestätigung mit nächsten Schritten
- **Individuelle Antwort**: Personalisierte Antwort-Template mit ursprünglichem Anfrage-Kontext

Alle Templates sind mobile-responsive und beinhalten:
- Professionelles Branding
- Klare Typografie
- Aktions-Buttons
- Kontakt-Informationen
- Rechtliche Compliance-Texte

## 🧪 Testing

### Verfügbare Test-Commands
```bash
npm run test         # Tests ausführen
npm run test:watch   # Tests im Watch-Mode
npm run test:coverage # Tests mit Coverage-Report
```

### Testing-Framework
- Jest als Testing-Framework mit Coverage-Reporting
- Umfassende Test-Suites für API-Routen und Komponenten

## 📄 Wichtige Entwicklungs-Hinweise

- Datenbankdatei: `prisma/dev.db` (SQLite)
- Admin-Zugangsdaten müssen mit `npm run setup:admin` eingerichtet werden
- Bilder verwenden derzeit Unsplash-Platzhalter via `next.config.ts`
- TypeScript Strict-Mode aktiviert mit konfigurierten Pfad-Aliassen
- Tailwind CSS 4 mit individueller shadcn/ui Komponenten-Konfiguration
- Winston-Logging konfiguriert für Sicherheitsereignisse und Fehler
- Jest Testing-Framework mit Coverage-Reporting
- File-Uploads über `/api/upload` Endpoint verarbeitet

---

**Letzte Aktualisierung:** Juli 2025  
**Version:** 1.0.0