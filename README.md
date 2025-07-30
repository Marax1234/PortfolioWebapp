# 📸 Kilian Siebert Portfolio

> Eine moderne Next.js Portfolio-Website für Fotograf und Videograf Kilian Siebert

[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.12.0-2D3748?logo=prisma)](https://www.prisma.io/)

## ✨ Features

🖼️ **Dynamische Portfolio-Galerie** mit Infinite Scroll und Masonry-Layout  
🔍 **Vollbild-Lightbox** mit Tastaturnavigation  
🛠️ **Admin-Dashboard** für vollständige Portfolio-Verwaltung  
📧 **Kontaktformular** mit professionellem Anfrage-Management  
🖱️ **Drag & Drop Upload** mit automatischer Bildoptimierung  
🔐 **Sichere Authentifizierung** mit JWT-Tokens  
🌙 **Responsive Design** mit modernem UI  

## 🚀 Quick Start

### Voraussetzungen
- Node.js 18+
- npm oder yarn

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd PortfolioWebapp

# Dependencies installieren
npm install

# Environment-Datei erstellen
cp .env.example .env.local

# Datenbank einrichten
npm run db:migrate
npm run db:seed

# Admin-Benutzer einrichten
npm run setup:admin

# Entwicklungsserver starten
npm run dev
```

🌐 **Öffne:** [http://localhost:3000](http://localhost:3000)

## 📁 Projekt-Struktur

```
src/
├── app/                 # Next.js App Router
│   ├── (admin)/         # Admin-Bereich
│   ├── (auth)/          # Authentifizierung
│   └── api/             # API Routes
├── components/          # React Komponenten
│   ├── gallery/         # Portfolio-Galerie
│   └── ui/              # UI-Komponenten
├── lib/                 # Utilities & Konfiguration
└── store/               # Zustand State Management

prisma/
├── schema.prisma        # Datenbank-Schema
└── seed.ts              # Seed-Daten
```

## 🛠️ Verfügbare Commands

### Entwicklung
```bash
npm run dev          # Entwicklungsserver starten
npm run build        # Production Build
npm run start        # Production Server
npm run lint         # Code-Linting
```

### Datenbank
```bash
npm run db:migrate   # Migrationen ausführen
npm run db:seed      # Datenbank mit Beispieldaten füllen
npm run db:studio    # Prisma Studio öffnen
npm run db:reset     # Datenbank zurücksetzen
```

### Testing
```bash
npm run test         # Tests ausführen
npm run test:watch   # Tests im Watch-Mode
npm run test:coverage # Test-Coverage
```

## 🎯 Tech Stack

- **Framework:** Next.js 15.4.2 mit App Router
- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes, Prisma ORM
- **Datenbank:** SQLite (Dev) / PostgreSQL (Prod)
- **Authentifizierung:** NextAuth.js mit JWT
- **State Management:** Zustand
- **UI Components:** shadcn/ui
- **Validierung:** Zod mit React Hook Form
- **File Upload:** Sharp für Bildverarbeitung

## 🔐 Admin-Zugang

1. **Setup:** `npm run setup:admin`
2. **Login:** `/admin/login`
3. **Dashboard:** `/admin`
4. **Portfolio-Verwaltung:** `/admin/portfolio`
5. **Anfragen:** `/admin/inquiries`

## 📧 Kontakt-System

Das integrierte Kontaktformular bietet:
- ✅ Automatische E-Mail-Benachrichtigungen
- 📊 Admin-Dashboard für Anfragen-Management
- 🛡️ Spam-Schutz und Rate-Limiting
- 📱 Mobile-optimierte Formulare

## 🌐 Deployment

```bash
# Production Build
npm run build

# Umgebungsvariablen für Production setzen
NEXTAUTH_URL=https://deine-domain.com
NEXTAUTH_SECRET=sicher-geheimer-schlüssel
DATABASE_URL=postgresql://...
```

## 📚 Weitere Dokumentation

Detaillierte Informationen findest du in der [Dokumentation](./doku.md):
- Vollständige Setup-Anleitung
- API-Dokumentation
- Konfigurationsoptionen
- Troubleshooting-Guide
- E-Mail-Konfiguration

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/neue-funktion`)
3. Änderungen committen (`git commit -m 'Neue Funktion hinzufügen'`)
4. Branch pushen (`git push origin feature/neue-funktion`)
5. Pull Request erstellen


---

**Erstellt von Max Hiller** | **Powered by Next.js & moderne Web-Technologien**