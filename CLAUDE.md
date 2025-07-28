# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 portfolio webapp for photographer/videographer Kilian Siebert, built with:
- **Framework**: Next.js 15.4.2 with App Router and React 19
- **Database**: SQLite with Prisma ORM 6.12.0
- **Authentication**: NextAuth.js with JWT strategy
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State**: Zustand for client-side state management
- **Forms**: React Hook Form with Zod validation

## Development Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Database
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create and run migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio GUI
npm run db:reset     # Reset database completely

# Admin Setup
npm run setup:admin  # Setup admin user password
```

## Architecture

### Database Models (Prisma)
- **User**: Authentication with roles (VISITOR, REGISTERED, ADMIN)
- **PortfolioItem**: Media items with metadata, categories, tags, view counts
- **Category**: Portfolio categorization (Nature, Travel, Events, Videography)
- **Inquiry**: Contact form submissions with status tracking
- **NewsletterSubscriber**: Email subscriptions
- **AnalyticsEvent**: Basic analytics tracking

Content follows DRAFT → REVIEW → PUBLISHED → ARCHIVED workflow.

### API Routes Structure
- `/api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `/api/portfolio` - Portfolio CRUD operations with image upload
- `/api/categories` - Category management
- `/api/contact` - Contact form submission handling
- `/api/upload` - File upload handling for portfolio items

### Authentication & Authorization
- JWT tokens with HTTP-only cookies (24-hour expiry)
- bcrypt for password hashing
- Role-based access: ADMIN role required for `/admin/*` routes
- Protected by middleware in `src/middleware.ts`
- Comprehensive security logging via winston

### Key Components
- **PortfolioGrid** (`src/components/gallery/`): Infinite scroll gallery with masonry/grid toggle
- **Lightbox** (`src/components/gallery/`): Full-screen image viewer with keyboard navigation
- **AdminDashboard** (`src/app/(admin)/admin/`): Portfolio management interface
- **AuthProvider** (`src/components/providers/`): Session management wrapper

### State Management
- Zustand store in `src/store/portfolio-store.ts` for portfolio state
- Client-side caching and pagination
- Optimistic updates for view counts
- Lightbox state management with keyboard navigation

### File Structure
- `src/app/` - Next.js App Router pages with route groups
- `src/app/(admin)/` - Admin-protected routes
- `src/app/(auth)/` - Authentication pages
- `src/components/` - Reusable components organized by feature
- `src/lib/` - Utilities, database client, auth config
- `prisma/` - Database schema and seed data

## Important Development Notes

- Database file: `prisma/dev.db` (SQLite)
- Admin credentials must be set up using `npm run setup:admin`
- Images currently use Unsplash placeholders via `next.config.ts`
- TypeScript strict mode enabled with path aliases configured
- Tailwind CSS 4 with custom shadcn/ui component configuration
- Winston logging configured for security events and errors
- Jest testing framework with coverage reporting
- File uploads handled via `/api/upload` endpoint

## Email Configuration

The contact form and inquiry system supports email notifications:

### Development Mode
- Without SMTP configuration: Emails are simulated and logged only
- Inquiry data is still saved to database
- Check server logs to see email content

### Production Setup
Configure SMTP settings in `.env.local`:
```bash
# Admin email for notifications
ADMIN_EMAIL="mhiller2005@gmail.com"

# SMTP Configuration (choose one provider)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

### Supported Email Features
- **Contact Form Notifications**: Admin receives inquiry notifications
- **Customer Confirmations**: Automatic confirmation emails to customers
- **Admin Replies**: Send custom replies from admin dashboard
- **Professional Templates**: HTML emails with branding