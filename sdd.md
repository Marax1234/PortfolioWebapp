# Software Design Documentation (SDD)
## Portfolio Website für Foto- und Videograf

**Version:** 1.0  
**Datum:** 18. Juli 2025  
**Autor:** Software Design Team  
**Status:** Draft  
**Basiert auf:** Software Requirements Specification v1.0

---

## Inhaltsverzeichnis

1. [Einführung und Kontext](#1-einführung-und-kontext)
2. [Nicht-funktionale Anforderungen](#2-nicht-funktionale-anforderungen)
3. [System Design Architektur](#3-system-design-architektur)
4. [Benutzeroberflächen Design](#4-benutzeroberflächen-design)
5. [Datenfluss-Diagramme](#5-datenfluss-diagramme)
6. [Klassendiagramme](#6-klassendiagramme)
7. [Objektdiagramme](#7-objektdiagramme)
8. [Design-Begründung](#8-design-begründung)
9. [Implementierungsrichtlinien](#9-implementierungsrichtlinien)

---

## 1. Einführung und Kontext

### 1.1 Projektüberblick

Dieses Software Design Document (SDD) transformiert die funktionalen und nicht-funktionalen Anforderungen aus der Software Requirements Specification (SRS v1.0) in eine konkrete technische Architektur für die Portfolio-Website eines Foto- und Videografen.

### 1.2 Beziehung zur SRS

Das SDD implementiert alle 15 funktionalen Anforderungen (FR1-FR15) aus der SRS und übersetzt die 5 definierten Use Cases in konkrete Systemkomponenten. Besonderer Fokus liegt auf:

- **Performance-First Architecture** für optimale Bilddarstellung
- **Mobile-First Design System** mit progressiver Verbesserung
- **Skalierbare Content-Management-Architektur**
- **SEO-optimierte Datenstrukturen**

### 1.3 Architekturelle Prinzipien

**Leitprinzipien der Systemarchitektur:**

1. **JAMstack Architecture**: Static Site Generation mit dynamischen API-Routen
2. **Component-Driven Development**: Atomic Design Methodology
3. **Progressive Enhancement**: Kern-Funktionalität ohne JavaScript
4. **Performance by Design**: Sub-3-Sekunden Ladezeiten
5. **Security by Default**: HTTPS-only, sichere Authentifizierung
6. **Accessibility First**: WCAG 2.1 AA Compliance

### 1.4 Änderungen zur SRS

**Technische Präzisierungen:**
- Spezifizierung der Next.js App Router Architektur
- Detaillierung der TypeScript Interface-Strukturen
- Konkretisierung der Tailwind CSS Design System Implementierung
- Verfeinerung der shadcn/ui Komponenten-Integration

---

## 2. Nicht-funktionale Anforderungen

### 2.1 Performance-Spezifikationen

#### 2.1.1 Core Web Vitals Targets
```typescript
interface PerformanceTargets {
  LCP: number; // Largest Contentful Paint < 2.5s
  FID: number; // First Input Delay < 100ms
  CLS: number; // Cumulative Layout Shift < 0.1
  FCP: number; // First Contentful Paint < 1.5s
  TTI: number; // Time to Interactive < 3.5s
}

const PERFORMANCE_BUDGET: PerformanceTargets = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  FCP: 1500,
  TTI: 3500
}
```

#### 2.1.2 Durchsatz-Anforderungen
- **Concurrent Users**: 100+ gleichzeitige Benutzer
- **Image Optimization**: < 2s für optimierte Bildauslieferung
- **Database Response**: < 200ms für 95% der Anfragen
- **API Response Time**: < 500ms für REST-Endpunkte

### 2.2 Sicherheitsanforderungen

#### 2.2.1 Authentifizierung und Autorisierung
```typescript
interface SecurityConfig {
  authentication: {
    sessionDuration: number; // 24 hours
    passwordMinLength: number; // 8 characters
    requireMFA: boolean; // false for v1.0
    maxLoginAttempts: number; // 5 attempts
  };
  authorization: {
    roles: ['visitor', 'registered', 'admin'];
    permissions: RolePermissions;
  };
  encryption: {
    algorithm: 'AES-256-GCM';
    keyRotation: number; // 90 days
  };
}
```

#### 2.2.2 Datenschutz und GDPR
- **Data Minimization**: Nur notwendige Daten sammeln
- **Consent Management**: Explizite Einwilligung für Cookies
- **Right to be Forgotten**: Automatisierte Datenlöschung
- **Data Portability**: Export-Funktionalität für Benutzerdaten

### 2.3 Wartbarkeits-Anforderungen

#### 2.3.1 Code-Qualität
```typescript
interface CodeQualityMetrics {
  testCoverage: number; // > 80%
  codeComplexity: number; // Cyclomatic < 10
  typeSafety: number; // 100% TypeScript
  documentationCoverage: number; // > 90%
}
```

#### 2.3.2 Monitoring und Logging
- **Error Tracking**: Automatische Fehlererfassung
- **Performance Monitoring**: Real-time Metriken
- **Audit Logging**: Alle Admin-Aktionen protokollieren
- **Health Checks**: Automatisierte System-Überwachung

### 2.4 Skalierbarkeits-Anforderungen

#### 2.4.1 Horizontale Skalierung
- **Load Balancing**: NGINX mit mehreren App-Instanzen
- **CDN Integration**: Globale Content-Auslieferung
- **Database Scaling**: Connection Pooling und Read Replicas
- **Caching Strategy**: Multi-Level Caching (Browser, CDN, Server)

---

## 3. System Design Architektur

### 3.1 Überblick der Systemarchitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Next.js Frontend (SSG/ISR) + Tailwind CSS + shadcn/ui    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Visitor   │ │ Registered  │ │    Admin    │          │
│  │ Components  │ │   User UI   │ │  Dashboard  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│              Next.js API Routes + Business Logic           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │     Auth    │ │   Content   │ │   Contact   │          │
│  │   Service   │ │  Management │ │   Service   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                              │                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │    Image    │ │     SEO     │ │ Analytics   │          │
│  │ Optimization│ │   Service   │ │   Service   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                             │
├─────────────────────────────────────────────────────────────┤
│                PostgreSQL Database                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │    Users    │ │  Portfolio  │ │  Inquiries  │          │
│  │    Table    │ │    Items    │ │    Table    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                              │                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Newsletter  │ │  Analytics  │ │   System    │          │
│  │Subscribers  │ │    Data     │ │    Logs     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                       │
├─────────────────────────────────────────────────────────────┤
│        NGINX + PM2 + VPS (Hetzner Cloud)                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │    CDN      │ │    SSL/     │ │  Backup &   │          │
│  │(Cloudflare) │ │   TLS       │ │  Monitoring │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Technologie-Stack Architektur

#### 3.2.1 Frontend-Architektur
```typescript
// Frontend Architecture Structure
src/
├── app/                     // Next.js 15 App Router
│   ├── (auth)/             // Route Groups
│   ├── (dashboard)/        // Admin Dashboard
│   ├── portfolio/          // Portfolio Pages
│   ├── contact/            // Contact Page
│   ├── api/                // API Routes
│   ├── globals.css         // Global Styles
│   ├── layout.tsx          // Root Layout
│   └── page.tsx            // Homepage
├── components/             // React Components
│   ├── ui/                 // shadcn/ui Components
│   ├── forms/              // Form Components
│   ├── gallery/            // Gallery Components
│   └── layout/             // Layout Components
├── lib/                    // Utility Functions
│   ├── auth.ts             // Authentication Utils
│   ├── db.ts               // Database Utils
│   ├── validation.ts       // Zod Schemas
│   └── utils.ts            // General Utils
├── stores/                 // Zustand Stores
│   ├── authStore.ts        // Authentication State
│   ├── portfolioStore.ts   // Portfolio State
│   └── uiStore.ts          // UI State
└── types/                  // TypeScript Definitions
    ├── auth.ts             // Auth Types
    ├── portfolio.ts        // Portfolio Types
    └── api.ts              // API Types
```

#### 3.2.2 Backend-Service-Architektur
```typescript
// Backend Services Structure
api/
├── auth/                   // Authentication Services
│   ├── login/              // Login Endpoint
│   ├── register/           // Registration
│   ├── logout/             // Logout
│   └── verify/             // Email Verification
├── portfolio/              // Portfolio Management
│   ├── items/              // CRUD Operations
│   ├── upload/             // File Upload
│   ├── optimize/           // Image Optimization
│   └── categories/         // Category Management
├── contact/                // Contact Management
│   ├── submit/             // Form Submission
│   ├── inquiries/          // Inquiry Management
│   └── notifications/      // Email Notifications
├── admin/                  // Admin Functions
│   ├── dashboard/          // Dashboard Data
│   ├── analytics/          // Analytics Data
│   ├── users/              // User Management
│   └── settings/           // System Settings
└── utils/                  // Utility Services
    ├── seo/                // SEO Generation
    ├── backup/             // Backup Services
    └── health/             // Health Checks
```

### 3.3 Datenbank-Design

#### 3.3.1 Entity Relationship Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Users      │    │ Portfolio_Items │    │   Inquiries     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (UUID) PK    │    │ id (UUID) PK    │    │ id (UUID) PK    │
│ email           │    │ title           │    │ name            │
│ password_hash   │    │ description     │    │ email           │
│ role            │    │ media_type      │    │ subject         │
│ created_at      │    │ file_path       │    │ message         │
│ updated_at      │    │ category        │    │ category        │
│ last_login      │    │ tags (JSON)     │    │ status          │
│ email_verified  │    │ metadata (JSON) │    │ created_at      │
└─────────────────┘    │ status          │    │ updated_at      │
         │              │ user_id FK      │    │ user_id FK      │
         │              │ created_at      │    └─────────────────┘
         │              │ updated_at      │             │
         │              └─────────────────┘             │
         │                       │                      │
         └───────────────────────┼──────────────────────┘
                                 │
         ┌─────────────────┐    ┌─────────────────┐
         │   Categories    │    │   Analytics     │
         ├─────────────────┤    ├─────────────────┤
         │ id (UUID) PK    │    │ id (UUID) PK    │
         │ name            │    │ event_type      │
         │ slug            │    │ event_data      │
         │ description     │    │ user_id FK      │
         │ sort_order      │    │ session_id      │
         │ created_at      │    │ timestamp       │
         └─────────────────┘    │ ip_address      │
                                └─────────────────┘
```

#### 3.3.2 Datenbank-Schema Implementation
```sql
-- Users Table (Enhanced)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'visitor',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP WITH TIME ZONE
);

-- Portfolio Items Table (Enhanced)
CREATE TABLE portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    media_type media_type_enum NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    thumbnail_path VARCHAR(500),
    category_id UUID REFERENCES categories(id),
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    status content_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    cover_image VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inquiries Table (Enhanced)
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    category inquiry_category,
    status inquiry_status DEFAULT 'new',
    priority priority_level DEFAULT 'medium',
    budget_range VARCHAR(50),
    event_date DATE,
    location VARCHAR(255),
    assigned_to UUID REFERENCES users(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    status subscription_status DEFAULT 'pending',
    subscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verification_token VARCHAR(255),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    user_id UUID REFERENCES users(id)
);

-- Analytics Table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    page_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enums
CREATE TYPE user_role AS ENUM ('visitor', 'registered', 'admin');
CREATE TYPE media_type_enum AS ENUM ('image', 'video');
CREATE TYPE content_status AS ENUM ('draft', 'review', 'published', 'archived');
CREATE TYPE inquiry_status AS ENUM ('new', 'in_progress', 'resolved', 'closed');
CREATE TYPE inquiry_category AS ENUM ('wedding', 'portrait', 'event', 'commercial', 'other');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE subscription_status AS ENUM ('pending', 'active', 'unsubscribed');

-- Indexes for Performance
CREATE INDEX idx_portfolio_items_status ON portfolio_items(status);
CREATE INDEX idx_portfolio_items_category ON portfolio_items(category_id);
CREATE INDEX idx_portfolio_items_featured ON portfolio_items(featured);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_analytics_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_users_email ON users(email);
```

---

## 4. Benutzeroberflächen Design

### 4.1 Design System Spezifikation

#### 4.1.1 Atomic Design Components

```typescript
// Design System Hierarchy
interface DesignSystem {
  atoms: {
    buttons: ButtonVariants;
    inputs: InputVariants;
    icons: IconLibrary;
    typography: TypographyScale;
  };
  molecules: {
    forms: FormComponents;
    cards: CardComponents;
    navigation: NavigationComponents;
  };
  organisms: {
    header: HeaderComponent;
    gallery: GalleryComponent;
    footer: FooterComponent;
  };
  templates: {
    pageLayouts: LayoutTemplates;
    dashboardLayouts: DashboardTemplates;
  };
}
```

#### 4.1.2 Component Architecture
```typescript
// shadcn/ui Component Integration
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

// Custom Component Extensions
interface PortfolioComponents {
  Gallery: {
    MasonryGrid: React.ComponentType<MasonryProps>;
    Lightbox: React.ComponentType<LightboxProps>;
    FilterBar: React.ComponentType<FilterProps>;
    ImageCard: React.ComponentType<ImageCardProps>;
  };
  Forms: {
    ContactForm: React.ComponentType<ContactFormProps>;
    UploadForm: React.ComponentType<UploadFormProps>;
    LoginForm: React.ComponentType<LoginFormProps>;
  };
  Layout: {
    AdminLayout: React.ComponentType<AdminLayoutProps>;
    PublicLayout: React.ComponentType<PublicLayoutProps>;
    DashboardSidebar: React.ComponentType<SidebarProps>;
  };
}
```

### 4.2 Responsive Design Framework

#### 4.2.1 Breakpoint System
```css
/* Tailwind CSS Custom Breakpoints */
module.exports = {
  theme: {
    screens: {
      'xs': '475px',    /* Small mobile */
      'sm': '640px',    /* Mobile landscape */
      'md': '768px',    /* Tablet portrait */
      'lg': '1024px',   /* Tablet landscape */
      'xl': '1280px',   /* Desktop */
      '2xl': '1536px',  /* Large desktop */
      '3xl': '1920px'   /* Ultra-wide */
    }
  }
}
```

#### 4.2.2 Layout Grid System
```typescript
// Responsive Grid Implementation
interface GridSystem {
  mobile: {
    columns: 1;
    gap: '16px';
    padding: '16px';
  };
  tablet: {
    columns: 2;
    gap: '24px';
    padding: '24px';
  };
  desktop: {
    columns: 3;
    gap: '32px';
    padding: '48px';
  };
  ultrawide: {
    columns: 4;
    gap: '48px';
    padding: '64px';
  };
}
```

### 4.3 Benutzeroberflächen-Mockups

#### 4.3.1 Homepage Layout
```
┌─────────────────────────────────────────────────────────────┐
│                      NAVIGATION BAR                        │
│  [Logo]              [Portfolio] [About] [Contact] [⚙️]     │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      HERO SECTION                          │
│              [Featured Portfolio Image]                    │
│                "Professional Photography"                  │
│                [CTA: View Portfolio]                       │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                  PORTFOLIO PREVIEW                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Image 1 │ │ Image 2 │ │ Image 3 │ │ Image 4 │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Image 5 │ │ Image 6 │ │ Image 7 │ │ Image 8 │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                [View Full Portfolio]                       │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    SERVICES SECTION                        │
│   [Wedding Photography] [Portrait Sessions] [Events]      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      FOOTER                                │
│     [Contact Info] [Social Links] [Newsletter Signup]     │
└─────────────────────────────────────────────────────────────┘
```

#### 4.3.2 Portfolio Gallery Layout
```
┌─────────────────────────────────────────────────────────────┐
│                    FILTER NAVIGATION                       │
│  [All] [Wedding] [Portrait] [Events] [Commercial] [Search] │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                   MASONRY GALLERY                          │
│  ┌─────┐ ┌─────────┐ ┌─────┐                              │
│  │     │ │         │ │     │ ┌─────────┐                  │
│  │ Img │ │  Img    │ │ Img │ │         │                  │
│  │  1  │ │   2     │ │  3  │ │  Img 4  │                  │
│  └─────┘ │         │ └─────┘ │         │                  │
│  ┌─────────┐ └─────────┘ ┌─────┐ └─────────┘                  │
│  │         │ ┌─────┐ │     │ ┌─────┐                      │
│  │  Img 5  │ │ Img │ │ Img │ │     │                      │
│  │         │ │  6  │ │  7  │ │ Img │                      │
│  └─────────┘ └─────┘ └─────┘ │  8  │                      │
│                              └─────┘                      │
│                   [Load More Images]                       │
└─────────────────────────────────────────────────────────────┘
```

#### 4.3.3 Admin Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│                      ADMIN HEADER                          │
│  [Portfolio Admin] [👤 User] [📊 Analytics] [⚙️ Settings]  │
└─────────────────────────────────────────────────────────────┘
┌─────────────┬───────────────────────────────────────────────┐
│   SIDEBAR   │                MAIN CONTENT                  │
│             │  ┌─────────────────────────────────────────┐ │
│ [Dashboard] │  │          OVERVIEW STATS                 │ │
│ [Portfolio] │  │  📷 156 Images  📹 23 Videos  📧 12 Msg │ │
│ [Messages]  │  └─────────────────────────────────────────┘ │
│ [Analytics] │  ┌─────────────────────────────────────────┐ │
│ [Settings]  │  │         RECENT ACTIVITIES               │ │
│ [Users]     │  │  • New contact message from...         │ │
│             │  │  • Portfolio image uploaded...         │ │
│             │  │  • User registered...                  │ │
│             │  └─────────────────────────────────────────┘ │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │        QUICK ACTIONS                    │ │
│             │  │  [Upload Images] [Reply to Messages]   │ │
│             │  └─────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────┘
```

### 4.4 Interaction Design Spezifikationen

#### 4.4.1 Animation Framework (Framer Motion)
```typescript
// Animation Variants Definition
const pageTransitions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

const galleryAnimations = {
  item: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  },
  lightbox: {
    backdrop: { opacity: 0 },
    visible: { opacity: 1 },
    modal: {
      hidden: { scale: 0.9, opacity: 0 },
      visible: { scale: 1, opacity: 1 }
    }
  }
};

const loadingAnimations = {
  skeleton: {
    animate: {
      opacity: [0.4, 0.8, 0.4],
      transition: { duration: 1.5, repeat: Infinity }
    }
  },
  progressBar: {
    initial: { width: "0%" },
    animate: { width: "100%" }
  }
};
```

#### 4.4.2 Touch and Gesture Support
```typescript
// Touch Gesture Handling
interface GestureHandlers {
  swipe: {
    left: () => void;  // Next image
    right: () => void; // Previous image
    up: () => void;    // Close lightbox
    down: () => void;  // Image info
  };
  pinch: {
    zoom: (scale: number) => void;
    reset: () => void;
  };
  doubleTap: {
    action: () => void; // Toggle zoom
  };
}
```

---

## 5. Datenfluss-Diagramme

### 5.1 User Authentication Flow

```
[User] → [Login Form] → [Client Validation] → [API Route]
                             ↓                     ↓
                    [Show Errors] ← [Server Validation]
                                          ↓
                                   [Database Query]
                                          ↓
                              [Password Verification]
                                          ↓
                               [Generate JWT Token]
                                          ↓
                                [Set HTTP-Only Cookie]
                                          ↓
                                 [Return User Data]
                                          ↓
                              [Update Client State] → [Redirect]
                                          ↓
                                 [Dashboard/Profile]
```

### 5.2 Portfolio Upload and Processing Flow

```
[Admin] → [Upload Interface] → [File Selection] → [Client Validation]
                                      ↓                   ↓
                                [Progress Bar] ← [File Upload API]
                                      ↓                   ↓
                               [Server Receives] → [MIME Type Check]
                                      ↓                   ↓
                                [Save Original] → [Generate Thumbnails]
                                      ↓                   ↓
                               [Image Optimization] → [WebP/AVIF Creation]
                                      ↓                   ↓
                                [Extract Metadata] → [Database Storage]
                                      ↓                   ↓
                                [CDN Upload] → [Generate URLs]
                                      ↓                   ↓
                              [Update Gallery] → [Notify Client]
                                      ↓                   ↓
                               [Refresh UI] → [Show Success]
```

### 5.3 Contact Form Processing Flow

```
[Visitor] → [Contact Form] → [Form Validation] → [CAPTCHA Check]
                                   ↓                    ↓
                            [Show Validation] ← [Client-side Error]
                              Errors                     ↓
                                   ↓              [Submit to API]
                              [Form Valid] →            ↓
                                   ↓              [Server Validation]
                              [GDPR Consent] →          ↓
                                   ↓              [Save to Database]
                               [Submit] →               ↓
                                   ↓              [Send Auto-Reply]
                           [Loading State] →           ↓
                                   ↓              [Notify Admin]
                            [Success Message] ←       ↓
                                   ↓              [Email Service]
                              [Form Reset] →          ↓
                                                [Log Activity]
```

### 5.4 SEO Optimization Data Flow

```
[Content Published] → [Extract Content] → [Keyword Analysis]
                           ↓                     ↓
                    [Generate Meta Tags] → [Create Schema.org]
                           ↓                     ↓
                    [Update Sitemap] → [Generate OpenGraph]
                           ↓                     ↓
                    [Submit to Search] → [Twitter Cards]
                      Console                   ↓
                           ↓              [Validate Markup]
                    [Monitor Rankings] →       ↓
                           ↓              [Store SEO Data]
                    [Performance Report] →     ↓
                           ↓              [Update Analytics]
                    [Optimization] →          ↓
                     Suggestions         [Dashboard Update]
```

### 5.5 Real-time Analytics Flow

```
[User Action] → [Event Capture] → [Client-side Tracking]
                      ↓                    ↓
               [Filter PII Data] → [Batch Events]
                      ↓                    ↓
               [Send to Analytics] → [Server Processing]
                   API                     ↓
                      ↓              [Data Validation]
               [Store in Database] →      ↓
                      ↓              [Real-time Aggregation]
               [Update Dashboards] →      ↓
                      ↓              [Performance Metrics]
               [Alert Thresholds] →       ↓
                      ↓              [Generate Reports]
               [Notification Service] →   ↓
                                    [Admin Dashboard]
```

---

## 6. Klassendiagramme

### 6.1 Authentication System Classes

```typescript
// Authentication Domain Classes
class User {
  private id: string;
  private email: string;
  private passwordHash: string;
  private role: UserRole;
  private profile: UserProfile;
  private createdAt: Date;
  private lastLogin?: Date;

  constructor(userData: CreateUserData) {
    this.id = generateUUID();
    this.email = userData.email;
    this.passwordHash = hashPassword(userData.password);
    this.role = userData.role || UserRole.VISITOR;
    this.createdAt = new Date();
  }

  public authenticate(password: string): boolean {
    return verifyPassword(password, this.passwordHash);
  }

  public updateLastLogin(): void {
    this.lastLogin = new Date();
  }

  public hasPermission(permission: Permission): boolean {
    return RolePermissions[this.role].includes(permission);
  }

  // Getters and Setters
  public getId(): string { return this.id; }
  public getEmail(): string { return this.email; }
  public getRole(): UserRole { return this.role; }
}

class AuthenticationService {
  private userRepository: UserRepository;
  private tokenService: TokenService;
  private emailService: EmailService;

  constructor(
    userRepo: UserRepository,
    tokenSvc: TokenService,
    emailSvc: EmailService
  ) {
    this.userRepository = userRepo;
    this.tokenService = tokenSvc;
    this.emailService = emailSvc;
  }

  public async login(
    email: string, 
    password: string
  ): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.authenticate(password)) {
      throw new AuthenticationError('Invalid credentials');
    }

    user.updateLastLogin();
    await this.userRepository.save(user);

    const token = this.tokenService.generateToken(user);
    return { user, token };
  }

  public async register(userData: CreateUserData): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    const user = new User(userData);
    await this.userRepository.save(user);
    await this.emailService.sendVerificationEmail(user);
    
    return user;
  }

  public async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findByVerificationToken(token);
    if (!user) {
      throw new ValidationError('Invalid verification token');
    }

    user.markEmailAsVerified();
    await this.userRepository.save(user);
  }
}

enum UserRole {
  VISITOR = 'visitor',
  REGISTERED = 'registered',
  ADMIN = 'admin'
}

enum Permission {
  READ_PORTFOLIO = 'read_portfolio',
  WRITE_PORTFOLIO = 'write_portfolio',
  MANAGE_USERS = 'manage_users',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_SETTINGS = 'manage_settings'
}

interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

interface AuthResult {
  user: User;
  token: string;
}
```

### 6.2 Portfolio Management Classes

```typescript
// Portfolio Domain Classes
class PortfolioItem {
  private id: string;
  private title: string;
  private description?: string;
  private mediaType: MediaType;
  private filePath: string;
  private thumbnailPath?: string;
  private category: Category;
  private tags: string[];
  private metadata: ImageMetadata;
  private status: ContentStatus;
  private featured: boolean;
  private viewCount: number;
  private createdAt: Date;
  private publishedAt?: Date;

  constructor(itemData: CreatePortfolioItemData) {
    this.id = generateUUID();
    this.title = itemData.title;
    this.description = itemData.description;
    this.mediaType = itemData.mediaType;
    this.filePath = itemData.filePath;
    this.category = itemData.category;
    this.tags = itemData.tags || [];
    this.metadata = itemData.metadata;
    this.status = ContentStatus.DRAFT;
    this.featured = false;
    this.viewCount = 0;
    this.createdAt = new Date();
  }

  public publish(): void {
    if (this.status !== ContentStatus.REVIEW) {
      throw new ValidationError('Item must be reviewed before publishing');
    }
    this.status = ContentStatus.PUBLISHED;
    this.publishedAt = new Date();
  }

  public incrementViewCount(): void {
    this.viewCount++;
  }

  public setFeatured(featured: boolean): void {
    this.featured = featured;
  }

  public updateMetadata(metadata: Partial<ImageMetadata>): void {
    this.metadata = { ...this.metadata, ...metadata };
  }

  // Getters
  public getId(): string { return this.id; }
  public getTitle(): string { return this.title; }
  public getStatus(): ContentStatus { return this.status; }
  public isFeatured(): boolean { return this.featured; }
  public isPublished(): boolean { return this.status === ContentStatus.PUBLISHED; }
}

class PortfolioService {
  private itemRepository: PortfolioItemRepository;
  private imageService: ImageOptimizationService;
  private seoService: SEOService;
  private cacheService: CacheService;

  constructor(
    itemRepo: PortfolioItemRepository,
    imageSvc: ImageOptimizationService,
    seoSvc: SEOService,
    cacheSvc: CacheService
  ) {
    this.itemRepository = itemRepo;
    this.imageService = imageSvc;
    this.seoService = seoSvc;
    this.cacheService = cacheSvc;
  }

  public async createItem(
    itemData: CreatePortfolioItemData,
    file: File
  ): Promise<PortfolioItem> {
    // Validate file
    await this.validateFile(file);

    // Process and optimize images
    const processedFiles = await this.imageService.processImage(file);
    
    // Create portfolio item
    const item = new PortfolioItem({
      ...itemData,
      filePath: processedFiles.original,
      metadata: processedFiles.metadata
    });

    // Save to database
    await this.itemRepository.save(item);

    // Generate SEO data
    await this.seoService.generateMetadata(item);

    // Clear cache
    await this.cacheService.invalidate(['portfolio', 'gallery']);

    return item;
  }

  public async getPublishedItems(
    filters?: PortfolioFilters
  ): Promise<PortfolioItem[]> {
    const cacheKey = `portfolio:published:${JSON.stringify(filters)}`;
    let items = await this.cacheService.get(cacheKey);

    if (!items) {
      items = await this.itemRepository.findPublished(filters);
      await this.cacheService.set(cacheKey, items, 3600); // 1 hour
    }

    return items;
  }

  public async publishItem(itemId: string): Promise<void> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError('Portfolio item not found');
    }

    item.publish();
    await this.itemRepository.save(item);

    // Update SEO
    await this.seoService.updateSitemap();
    
    // Clear cache
    await this.cacheService.invalidate(['portfolio']);
  }

  private async validateFile(file: File): Promise<void> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    if (!allowedTypes.includes(file.type)) {
      throw new ValidationError('Unsupported file type');
    }

    const maxSize = file.type.startsWith('image/') ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new ValidationError('File too large');
    }
  }
}

enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video'
}

enum ContentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

interface ImageMetadata {
  width: number;
  height: number;
  fileSize: number;
  format: string;
  camera?: string;
  lens?: string;
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  focalLength?: number;
  dateTaken?: Date;
}

interface PortfolioFilters {
  category?: string;
  tags?: string[];
  mediaType?: MediaType;
  featured?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'published_at' | 'view_count';
  sortOrder?: 'asc' | 'desc';
}
```

### 6.3 Contact Management Classes

```typescript
// Contact Management Domain Classes
class Inquiry {
  private id: string;
  private name: string;
  private email: string;
  private phone?: string;
  private subject: string;
  private message: string;
  private category: InquiryCategory;
  private status: InquiryStatus;
  private priority: Priority;
  private assignedTo?: string;
  private createdAt: Date;
  private resolvedAt?: Date;

  constructor(inquiryData: CreateInquiryData) {
    this.id = generateUUID();
    this.name = inquiryData.name;
    this.email = inquiryData.email;
    this.phone = inquiryData.phone;
    this.subject = inquiryData.subject;
    this.message = inquiryData.message;
    this.category = inquiryData.category;
    this.status = InquiryStatus.NEW;
    this.priority = this.calculatePriority(inquiryData);
    this.createdAt = new Date();
  }

  public assignTo(userId: string): void {
    this.assignedTo = userId;
    if (this.status === InquiryStatus.NEW) {
      this.status = InquiryStatus.IN_PROGRESS;
    }
  }

  public resolve(): void {
    this.status = InquiryStatus.RESOLVED;
    this.resolvedAt = new Date();
  }

  public escalate(): void {
    if (this.priority === Priority.HIGH) {
      this.priority = Priority.URGENT;
    } else if (this.priority === Priority.MEDIUM) {
      this.priority = Priority.HIGH;
    }
  }

  private calculatePriority(data: CreateInquiryData): Priority {
    // Wedding inquiries with near dates get high priority
    if (data.category === InquiryCategory.WEDDING && data.eventDate) {
      const daysUntilEvent = Math.floor(
        (data.eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilEvent < 30) return Priority.HIGH;
      if (daysUntilEvent < 90) return Priority.MEDIUM;
    }

    // Commercial inquiries get medium priority
    if (data.category === InquiryCategory.COMMERCIAL) {
      return Priority.MEDIUM;
    }

    return Priority.LOW;
  }

  // Getters
  public getId(): string { return this.id; }
  public getStatus(): InquiryStatus { return this.status; }
  public getPriority(): Priority { return this.priority; }
  public isResolved(): boolean { return this.status === InquiryStatus.RESOLVED; }
}

class ContactService {
  private inquiryRepository: InquiryRepository;
  private emailService: EmailService;
  private notificationService: NotificationService;
  private analyticsService: AnalyticsService;

  constructor(
    inquiryRepo: InquiryRepository,
    emailSvc: EmailService,
    notificationSvc: NotificationService,
    analyticsSvc: AnalyticsService
  ) {
    this.inquiryRepository = inquiryRepo;
    this.emailService = emailSvc;
    this.notificationService = notificationSvc;
    this.analyticsService = analyticsSvc;
  }

  public async submitInquiry(
    inquiryData: CreateInquiryData
  ): Promise<Inquiry> {
    // Validate inquiry data
    await this.validateInquiryData(inquiryData);

    // Create inquiry
    const inquiry = new Inquiry(inquiryData);
    await this.inquiryRepository.save(inquiry);

    // Send auto-reply to customer
    await this.emailService.sendAutoReply(inquiry);

    // Notify admin based on priority
    if (inquiry.getPriority() >= Priority.HIGH) {
      await this.notificationService.sendUrgentNotification(inquiry);
    } else {
      await this.notificationService.sendStandardNotification(inquiry);
    }

    // Track analytics
    await this.analyticsService.trackEvent('inquiry_submitted', {
      category: inquiry.getCategory(),
      priority: inquiry.getPriority()
    });

    return inquiry;
  }

  public async getInquiries(
    filters?: InquiryFilters
  ): Promise<Inquiry[]> {
    return await this.inquiryRepository.findWithFilters(filters);
  }

  public async assignInquiry(
    inquiryId: string,
    userId: string
  ): Promise<void> {
    const inquiry = await this.inquiryRepository.findById(inquiryId);
    if (!inquiry) {
      throw new NotFoundError('Inquiry not found');
    }

    inquiry.assignTo(userId);
    await this.inquiryRepository.save(inquiry);

    await this.notificationService.sendAssignmentNotification(inquiry, userId);
  }

  public async resolveInquiry(
    inquiryId: string,
    resolution: string
  ): Promise<void> {
    const inquiry = await this.inquiryRepository.findById(inquiryId);
    if (!inquiry) {
      throw new NotFoundError('Inquiry not found');
    }

    inquiry.resolve();
    await this.inquiryRepository.save(inquiry);

    await this.emailService.sendResolutionEmail(inquiry, resolution);
    await this.analyticsService.trackEvent('inquiry_resolved', {
      id: inquiryId,
      resolutionTime: inquiry.getResolutionTime()
    });
  }

  private async validateInquiryData(data: CreateInquiryData): Promise<void> {
    if (!data.email || !isValidEmail(data.email)) {
      throw new ValidationError('Valid email is required');
    }
    if (!data.message || data.message.length < 10) {
      throw new ValidationError('Message must be at least 10 characters');
    }
  }
}

enum InquiryCategory {
  WEDDING = 'wedding',
  PORTRAIT = 'portrait',
  EVENT = 'event',
  COMMERCIAL = 'commercial',
  OTHER = 'other'
}

enum InquiryStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4
}

interface CreateInquiryData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: InquiryCategory;
  eventDate?: Date;
  budgetRange?: string;
  location?: string;
}

interface InquiryFilters {
  status?: InquiryStatus;
  category?: InquiryCategory;
  priority?: Priority;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
```

---

## 7. Objektdiagramme

### 7.1 Laufzeit-Instanzen der Authentifizierung

```typescript
// Konkrete Objektinstanzen zur Laufzeit
const adminUser: User = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "admin@photographer-portfolio.com",
  passwordHash: "$2b$12$LQv3c1yqBWVHxkd0LQ4YCOdyF...",
  role: UserRole.ADMIN,
  profile: {
    firstName: "Max",
    lastName: "Mustermann",
    avatar: "/uploads/avatars/admin.jpg"
  },
  createdAt: new Date("2025-01-15T10:30:00Z"),
  lastLogin: new Date("2025-07-18T09:15:00Z"),
  emailVerified: true
};

const registeredUser: User = {
  id: "456e7890-e89b-12d3-a456-426614174001",
  email: "kunde@example.com",
  passwordHash: "$2b$12$XYZ3c1yqBWVHxkd0LQ4YCOdyF...",
  role: UserRole.REGISTERED,
  profile: {
    firstName: "Anna",
    lastName: "Schmidt",
    avatar: null
  },
  createdAt: new Date("2025-07-10T14:20:00Z"),
  lastLogin: new Date("2025-07-17T16:45:00Z"),
  emailVerified: true
};

const visitorSession: GuestSession = {
  sessionId: "sess_789abc123def456",
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)...",
  createdAt: new Date("2025-07-18T11:30:00Z"),
  lastActivity: new Date("2025-07-18T11:45:00Z"),
  permissions: [Permission.READ_PORTFOLIO]
};

// Authentication Service Instanz
const authService: AuthenticationService = new AuthenticationService(
  new PostgreSQLUserRepository(databaseConnection),
  new JWTTokenService("secret_key_here"),
  new SMTPEmailService(emailConfig)
);

// Aktive Session
const activeSession: UserSession = {
  user: adminUser,
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  createdAt: new Date("2025-07-18T09:15:00Z"),
  expiresAt: new Date("2025-07-19T09:15:00Z"),
  permissions: [
    Permission.READ_PORTFOLIO,
    Permission.WRITE_PORTFOLIO,
    Permission.MANAGE_USERS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SETTINGS
  ]
};
```

### 7.2 Portfolio Content Objektinstanzen

```typescript
// Konkrete Portfolio Items zur Laufzeit
const weddingPhoto: PortfolioItem = {
  id: "portfolio_001",
  title: "Romantische Hochzeit im Schloss",
  description: "Eine zauberhafte Hochzeitszeremonie im historischen Schloss Neuschwanstein",
  mediaType: MediaType.IMAGE,
  filePath: "/uploads/portfolio/2025/07/wedding-schloss-001.jpg",
  thumbnailPath: "/uploads/portfolio/2025/07/thumbs/wedding-schloss-001-thumb.webp",
  category: {
    id: "cat_wedding",
    name: "Hochzeitsfotografie",
    slug: "hochzeit"
  },
  tags: ["hochzeit", "schloss", "romantisch", "outdoor", "vintage"],
  metadata: {
    width: 3840,
    height: 2560,
    fileSize: 2458624,
    format: "JPEG",
    camera: "Canon EOS R5",
    lens: "RF 50mm f/1.2L USM",
    iso: 200,
    aperture: "f/2.8",
    shutterSpeed: "1/250",
    focalLength: 50,
    dateTaken: new Date("2025-06-15T15:30:00Z")
  },
  status: ContentStatus.PUBLISHED,
  featured: true,
  viewCount: 247,
  createdAt: new Date("2025-06-16T10:00:00Z"),
  publishedAt: new Date("2025-06-16T14:30:00Z")
};

const portraitVideo: PortfolioItem = {
  id: "portfolio_002",
  title: "Business Portrait Session",
  description: "Professionelle Businessportraits für Unternehmensprofile",
  mediaType: MediaType.VIDEO,
  filePath: "/uploads/portfolio/2025/07/business-portrait-session.mp4",
  thumbnailPath: "/uploads/portfolio/2025/07/thumbs/business-portrait-thumb.webp",
  category: {
    id: "cat_portrait",
    name: "Portraitfotografie",
    slug: "portrait"
  },
  tags: ["business", "portrait", "professionell", "studio"],
  metadata: {
    width: 1920,
    height: 1080,
    fileSize: 45678912,
    format: "MP4",
    duration: 45,
    bitrate: "8 Mbps",
    codec: "H.264"
  },
  status: ContentStatus.PUBLISHED,
  featured: false,
  viewCount: 89,
  createdAt: new Date("2025-07-10T11:15:00Z"),
  publishedAt: new Date("2025-07-11T09:00:00Z")
};

// Portfolio Service mit Dependencies
const portfolioService: PortfolioService = new PortfolioService(
  new PostgreSQLPortfolioRepository(databaseConnection),
  new SharpImageOptimizationService({
    formats: ['webp', 'avif'],
    qualities: [80, 60, 40],
    sizes: [400, 800, 1200, 1920]
  }),
  new NextSEOService(siteConfig),
  new RedisaCacheService(redisConnection)
);

// Gallery State zur Laufzeit
const galleryState: GalleryState = {
  items: [weddingPhoto, portraitVideo],
  filters: {
    category: "all",
    tags: [],
    mediaType: null,
    featured: false
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 156,
    totalPages: 13
  },
  loading: false,
  error: null,
  selectedItem: null,
  lightboxOpen: false
};
```

### 7.3 Contact System Objektinstanzen

```typescript
// Konkrete Inquiry Instanzen
const weddingInquiry: Inquiry = {
  id: "inquiry_001",
  name: "Sarah und Thomas Meyer",
  email: "sarah.meyer@example.com",
  phone: "+49 151 23456789",
  subject: "Hochzeitsfotografie September 2025",
  message: "Hallo, wir planen unsere Hochzeit für den 15. September 2025 im Schloss Linderhof. Könnten Sie uns ein Angebot für die fotografische Begleitung unseres besonderen Tages erstellen?",
  category: InquiryCategory.WEDDING,
  status: InquiryStatus.IN_PROGRESS,
  priority: Priority.HIGH,
  budgetRange: "2000-3000 EUR",
  eventDate: new Date("2025-09-15T14:00:00Z"),
  location: "Schloss Linderhof, Bayern",
  assignedTo: "123e4567-e89b-12d3-a456-426614174000", // Admin User ID
  createdAt: new Date("2025-07-18T10:15:00Z"),
  resolvedAt: null,
  customFields: {
    guestCount: "80 Personen",
    weddingStyle: "Vintage/Romantisch",
    previouslyWorkedWith: false
  }
};

const portraitInquiry: Inquiry = {
  id: "inquiry_002",
  name: "Dr. Michael Weber",
  email: "m.weber@business-consulting.de",
  phone: "+49 89 12345678",
  subject: "Business Portraits für Team",
  message: "Wir benötigen professionelle Businessportraits für unser 15-köpfiges Consulting-Team. Die Fotos sollen für unsere neue Website und LinkedIn-Profile verwendet werden.",
  category: InquiryCategory.COMMERCIAL,
  status: InquiryStatus.NEW,
  priority: Priority.MEDIUM,
  budgetRange: "1500-2500 EUR",
  eventDate: null,
  location: "München Innenstadt (flexibel)",
  assignedTo: null,
  createdAt: new Date("2025-07-18T14:30:00Z"),
  resolvedAt: null,
  customFields: {
    teamSize: "15 Personen",
    deliveryFormat: "Digital + Print",
    rushOrder: false
  }
};

// Contact Service mit aktueller Konfiguration
const contactService: ContactService = new ContactService(
  new PostgreSQLInquiryRepository(databaseConnection),
  new SMTPEmailService({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "admin@photographer-portfolio.com",
      pass: process.env.EMAIL_PASSWORD
    }
  }),
  new SlackNotificationService(process.env.SLACK_WEBHOOK),
  new GoogleAnalyticsService(process.env.GA_TRACKING_ID)
);

// Admin Dashboard Inquiry Overview
const inquiryDashboard: InquiryDashboardState = {
  inquiries: [weddingInquiry, portraitInquiry],
  stats: {
    total: 47,
    new: 12,
    inProgress: 18,
    resolved: 17,
    avgResponseTime: "4.2 hours",
    conversionRate: 0.73
  },
  filters: {
    status: InquiryStatus.NEW,
    priority: null,
    dateRange: {
      from: new Date("2025-07-01"),
      to: new Date("2025-07-31")
    }
  },
  sorting: {
    field: "createdAt",
    direction: "desc"
  },
  loading: false,
  selectedInquiry: weddingInquiry
};
```

### 7.4 System Performance Objektinstanzen

```typescript
// Performance Monitoring zur Laufzeit
const performanceMetrics: PerformanceMetrics = {
  timestamp: new Date("2025-07-18T12:00:00Z"),
  coreWebVitals: {
    LCP: 1847, // Largest Contentful Paint (ms)
    FID: 67,   // First Input Delay (ms)
    CLS: 0.08, // Cumulative Layout Shift
    FCP: 1243, // First Contentful Paint (ms)
    TTI: 2891  // Time to Interactive (ms)
  },
  serverMetrics: {
    responseTime: 156,     // Average API response time (ms)
    throughput: 47,        // Requests per second
    errorRate: 0.002,      // Error rate (2 errors per 1000 requests)
    cpuUsage: 0.34,        // CPU usage (34%)
    memoryUsage: 0.67,     // Memory usage (67%)
    diskUsage: 0.45        // Disk usage (45%)
  },
  userMetrics: {
    activeUsers: 23,
    bounceRate: 0.31,
    avgSessionDuration: 185, // seconds
    pageViews: 1247,
    uniqueVisitors: 543
  }
};

// Cache System Status
const cacheStatus: CacheSystemStatus = {
  redis: {
    connected: true,
    memory: "2.3 GB",
    hitRate: 0.89,
    keys: 15623,
    lastBackup: new Date("2025-07-18T03:00:00Z")
  },
  browser: {
    serviceWorkerActive: true,
    cacheSize: "45 MB",
    offlinePages: ["/", "/portfolio", "/contact"],
    lastUpdate: new Date("2025-07-18T11:30:00Z")
  },
  cdn: {
    provider: "Cloudflare",
    hitRate: 0.94,
    bandwidth: "127 GB",
    cacheNodes: 15,
    lastPurge: new Date("2025-07-17T22:15:00Z")
  }
};

// SEO Performance Status
const seoStatus: SEOStatus = {
  sitemap: {
    lastGenerated: new Date("2025-07-18T06:00:00Z"),
    urls: 89,
    submitted: true,
    indexed: 76
  },
  schemaMarkup: {
    validated: true,
    errors: 0,
    warnings: 2,
    types: ["Person", "ImageObject", "Organization"]
  },
  metaTags: {
    coverage: 0.96,
    uniqueTitles: 89,
    uniqueDescriptions: 87,
    avgTitleLength: 52,
    avgDescriptionLength: 148
  },
  pageSpeed: {
    mobile: 89,
    desktop: 94,
    lastCheck: new Date("2025-07-18T08:30:00Z")
  }
};
```

---

## 8. Design-Begründung

### 8.1 Architekturelle Entscheidungen

#### 8.1.1 Next.js 15 App Router Wahl

**Entscheidung:** Verwendung von Next.js 15 mit App Router anstelle von Pages Router

**Begründung:**
- **Performance**: App Router bietet bessere Performance durch Streaming und Partial Prerendering
- **Developer Experience**: Vereinfachte Routing-Logik und bessere TypeScript-Integration
- **SEO-Vorteile**: Integrierte Meta-Tag-Verwaltung und automatische Sitemap-Generierung
- **Skalierbarkeit**: Layout-Systeme und Nested Routing für komplexere Anwendungen
- **Zukunftssicherheit**: App Router ist die empfohlene Architektur für neue Next.js Projekte

**Alternativen betrachtet:**
- Pages Router: Weniger performant, ältere API
- Astro: Zu statisch für Content-Management-Anforderungen
- SvelteKit: Kleineres Ökosystem, weniger TypeScript-Support

#### 8.1.2 TypeScript über JavaScript

**Entscheidung:** 100% TypeScript-Implementation

**Begründung:**
- **Typsicherheit**: Reduziert Laufzeitfehler um ca. 80%
- **Entwicklerproduktivität**: IntelliSense und Autocomplete
- **Refactoring-Sicherheit**: Sichere Code-Änderungen bei Systemerweiterungen
- **API-Dokumentation**: Automatische Typendokumentation
- **Team-Kollaboration**: Eindeutige Schnittstellen-Definitionen

**Trade-offs:**
- Höhere initiale Lernkurve
- Längere Compile-Zeiten (akzeptabel bei modernen Build-Tools)

#### 8.1.3 Tailwind CSS + shadcn/ui Kombination

**Entscheidung:** Tailwind CSS als Styling-Foundation mit shadcn/ui Komponenten

**Begründung:**
- **Konsistenz**: Einheitliches Design-System durch Utility-Classes
- **Performance**: Keine ungenutzten CSS-Regeln durch Purging
- **Wartbarkeit**: Komponenten-basierte Architektur
- **Customization**: Vollständige Kontrolle über Design-Tokens
- **Community**: Große Community und Ecosystem-Support

**shadcn/ui Vorteile:**
- Hochwertige, barrierefreie Komponenten
- Radix UI Foundation für Accessibility
- Copy-Paste Ansatz für volle Kontrolle
- TypeScript-first Design

#### 8.1.4 PostgreSQL über NoSQL

**Entscheidung:** PostgreSQL als primäre Datenbank

**Begründung:**
- **ACID-Compliance**: Wichtig für kritische Geschäftsdaten
- **Relationaler Ansatz**: Portfolio-Items, Benutzer und Anfragen haben klare Beziehungen
- **JSON-Support**: Flexible Metadaten-Speicherung mit JSONB
- **Performance**: Bewährte Performance für Read-Heavy Workloads
- **Ecosystem**: Ausgereifte Tools und ORM-Support

**Alternativen:**
- MongoDB: Weniger strukturiert, potentielle Datenkonsistenz-Probleme
- SQLite: Nicht skalierbar für Produktionsumgebung
- MySQL: Weniger fortgeschrittene JSON-Features

### 8.2 Design Pattern Rechtfertigungen

#### 8.2.1 Repository Pattern Implementation

**Entscheidung:** Repository Pattern für Datenzugriff

**Begründung:**
```typescript
// Abstraktion ermöglicht einfache Testbarkeit
interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

// Produktionsimplementierung
class PostgreSQLUserRepository implements UserRepository {
  // PostgreSQL-spezifische Implementierung
}

// Test-Implementierung
class InMemoryUserRepository implements UserRepository {
  // In-Memory Implementierung für Tests
}
```

**Vorteile:**
- **Testbarkeit**: Mock-Repositories für Unit Tests
- **Flexibilität**: Einfacher Wechsel der Datenbank-Technologie
- **Separation of Concerns**: Business Logic getrennt von Persistierung
- **Code-Qualität**: Klare Schnittstellen und Abhängigkeiten

#### 8.2.2 Service Layer Architecture

**Entscheidung:** Service Layer zwischen API Routes und Repositories

**Begründung:**
- **Business Logic Kapselung**: Alle Geschäftsregeln in Services
- **Wiederverwertbarkeit**: Services können von verschiedenen Endpunkten genutzt werden
- **Transaktionsmanagement**: Koordination mehrerer Repository-Operationen
- **Validation**: Zentrale Validierungslogik
- **Error Handling**: Einheitliche Fehlerbehandlung

```typescript
// Service orchestriert Business Logic
class PortfolioService {
  async createItem(data: CreateItemData, file: File): Promise<PortfolioItem> {
    // 1. Validierung
    await this.validateFile(file);
    
    // 2. Bildverarbeitung
    const processed = await this.imageService.optimize(file);
    
    // 3. Persistierung
    const item = await this.repository.save(new PortfolioItem(data));
    
    // 4. SEO-Update
    await this.seoService.updateSitemap();
    
    // 5. Cache-Invalidierung
    await this.cacheService.invalidate(['portfolio']);
    
    return item;
  }
}
```

#### 8.2.3 State Management mit Zustand

**Entscheidung:** Zustand für Client-Side State Management

**Begründung:**
- **Einfachheit**: Minimaler Boilerplate im Vergleich zu Redux
- **Performance**: Optimierte Re-Renders durch Selector-Pattern
- **TypeScript**: Native TypeScript-Unterstützung
- **DevTools**: Integrierte Debugging-Tools
- **Bundle Size**: Kleiner als Redux + Toolkit

```typescript
// Lean State Store Definition
interface PortfolioState {
  items: PortfolioItem[];
  filters: FilterState;
  loading: boolean;
}

const usePortfolioStore = create<PortfolioState>((set, get) => ({
  items: [],
  filters: { category: 'all' },
  loading: false,
  
  // Actions
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
  updateFilters: (filters) => set({ filters: { ...get().filters, ...filters } })
}));
```

### 8.3 Security Design Entscheidungen

#### 8.3.1 JWT + HTTP-Only Cookies

**Entscheidung:** JWT Tokens in HTTP-Only Cookies

**Begründung:**
- **XSS Protection**: HTTP-Only Cookies nicht von JavaScript zugänglich
- **CSRF Protection**: SameSite Cookie-Attribut
- **Stateless**: Server muss keine Session-State speichern
- **Scalability**: Token enthalten alle notwendigen Informationen

```typescript
// Sichere Token-Implementierung
const tokenOptions: CookieOptions = {
  httpOnly: true,        // XSS Protection
  secure: true,          // Nur über HTTPS
  sameSite: 'strict',    // CSRF Protection
  maxAge: 24 * 60 * 60 * 1000, // 24 Stunden
  path: '/'
};

response.setHeader('Set-Cookie', `auth-token=${jwt}; ${serializeOptions(tokenOptions)}`);
```

#### 8.3.2 Input Validation mit Zod

**Entscheidung:** Zod für Schema-Validation

**Begründung:**
- **Type Safety**: Automatische TypeScript-Typ-Generierung
- **Runtime Validation**: Schutz vor ungültigen Daten
- **DRY Principle**: Ein Schema für Frontend und Backend
- **Error Messages**: Detaillierte, benutzerfreundliche Fehlermeldungen

```typescript
// Shared Validation Schema
const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben'),
  category: z.enum(['wedding', 'portrait', 'event', 'commercial'])
});

type ContactFormData = z.infer<typeof ContactFormSchema>;
```

### 8.4 Performance Design Entscheidungen

#### 8.4.1 Image Optimization Pipeline

**Entscheidung:** Multi-Format Image Optimization

**Begründung:**
- **Modern Formats**: AVIF (50% kleinere Dateien) und WebP (25% kleiner)
- **Responsive Images**: Verschiedene Größen für verschiedene Viewports
- **Lazy Loading**: Bilder werden nur bei Bedarf geladen
- **CDN Integration**: Globale Verfügbarkeit und Caching

```typescript
// Image Optimization Strategy
const imageOptimization = {
  formats: ['avif', 'webp', 'jpeg'],
  sizes: [400, 800, 1200, 1920, 2560],
  qualities: {
    avif: 60,
    webp: 80,
    jpeg: 85
  },
  lazyLoading: true,
  placeholder: 'blur'
};
```

#### 8.4.2 Caching-Strategie

**Entscheidung:** Multi-Level Caching

**Begründung:**
- **Browser Cache**: Statische Assets langzeit-gecacht
- **CDN Cache**: Globale Edge-Caches für Medieninhalte
- **Server Cache**: Redis für dynamische Daten
- **Application Cache**: In-Memory Caching für häufige Abfragen

```typescript
// Caching Strategy Implementation
const cachingStrategy = {
  static: {
    images: '365d',
    css: '30d',
    js: '30d'
  },
  dynamic: {
    portfolio: '1h',
    analytics: '5m',
    user: '15m'
  },
  revalidation: {
    ISR: 3600, // 1 hour
    API: 300   // 5 minutes
  }
};
```

### 8.5 Accessibility Design Begründung

#### 8.5.1 WCAG 2.1 AA Compliance

**Entscheidung:** Vollständige WCAG 2.1 AA Implementierung

**Begründung:**
- **Rechtliche Anforderungen**: Gesetzliche Verpflichtungen in Deutschland
- **Marktvergrößerung**: Zugänglich für Benutzer mit Beeinträchtigungen
- **SEO-Vorteile**: Bessere Suchmaschinen-Rankings
- **Code-Qualität**: Semantisches HTML verbessert Wartbarkeit

```typescript
// Accessibility Features Implementation
const accessibilityFeatures = {
  semanticHTML: true,
  ariaLabels: true,
  keyboardNavigation: true,
  screenReaderSupport: true,
  color