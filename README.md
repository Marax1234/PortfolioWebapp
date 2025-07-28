# Kilian Siebert Portfolio Website

A modern, responsive portfolio website built for photographer/videographer Kilian Siebert. This Next.js application features a dynamic gallery, admin panel, and content management system.

## 🚀 Features

- **Dynamic Portfolio Gallery** - Infinite scroll with masonry/grid layout toggle
- **Full-screen Lightbox** - Image viewer with keyboard navigation
- **Admin Dashboard** - Complete portfolio management interface
- **File Upload & Processing** - Automatic image optimization (WebP, AVIF, thumbnails)
- **Content Management** - DRAFT → REVIEW → PUBLISHED → ARCHIVED workflow
- **Authentication** - Secure admin access with JWT tokens
- **Contact System** - Contact form with inquiry management
- **Newsletter** - Email subscription system
- **Analytics** - Basic event tracking
- **Responsive Design** - Mobile-first design with Tailwind CSS

## 🛠 Tech Stack

- **Framework**: Next.js 15.4.2 with App Router and React 19
- **Database**: SQLite with Prisma ORM 6.12.0
- **Authentication**: NextAuth.js with JWT strategy
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: Zustand for client-side state
- **Forms**: React Hook Form with Zod validation
- **Image Processing**: Sharp for optimization
- **Logging**: Winston for comprehensive logging

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🏗 Setup & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PortfolioWebapp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Admin Configuration
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="bcrypt-hashed-password"

# Optional: External Services
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 5. Admin User Setup
```bash
# Set up admin user password
npm run setup:admin
```

### 6. Start Development Server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📚 Available Scripts

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Database Management
```bash
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create and run migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio GUI
npm run db:reset     # Reset database completely and reseed
```

### Admin Setup
```bash
npm run setup:admin  # Setup admin user password
```

## 🗄 Database Reset & Reseeding

To completely reset the database and reload with fresh mock data:

```bash
# Method 1: Complete reset (recommended)
npm run db:reset

# Method 2: Manual steps
npx prisma db push --force-reset  # Reset database
npm run db:seed                   # Load mock data
```

This will:
1. Delete all existing data
2. Recreate database schema
3. Load sample portfolio items, categories, and user data

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Admin-protected routes
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── gallery/          # Portfolio gallery components
│   ├── ui/               # UI components (shadcn/ui)
│   └── providers/        # Context providers
├── lib/                  # Utilities and configurations
│   ├── db.ts            # Database client
│   ├── auth.ts          # Authentication config
│   ├── storage.ts       # File storage utilities
│   └── image-processor.ts # Image processing
├── store/               # Zustand state management
└── types/              # TypeScript type definitions

prisma/
├── schema.prisma       # Database schema
├── dev.db             # SQLite database file
└── seed.ts            # Database seeding script

public/
├── uploads/           # User-uploaded files
│   └── portfolio/    # Portfolio media files
└── images/           # Static images
```

## 🎯 Key Features Explained

### Authentication & Authorization
- JWT tokens with HTTP-only cookies (24-hour expiry)
- bcrypt password hashing
- Role-based access: ADMIN role required for `/admin/*` routes
- Protected by middleware in `src/middleware.ts`

### File Upload & Processing
- Automatic image optimization with Sharp
- Multiple format generation (WebP, AVIF)
- Thumbnail creation
- File validation and size limits
- Organized storage structure

### Content Workflow
Portfolio items follow a structured workflow:
- **DRAFT** - Work in progress
- **REVIEW** - Ready for review
- **PUBLISHED** - Live on website
- **ARCHIVED** - Hidden from public

### Admin Dashboard
Complete portfolio management:
- Create, edit, delete portfolio items
- Category management
- File upload with preview
- Status management
- Analytics overview

## 🔧 Configuration

### Image Processing
Configure image processing options in `src/lib/image-processor.ts`:
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

### Storage Configuration
Modify storage settings in `src/lib/storage.ts`:
```typescript
export const DEFAULT_STORAGE_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/quicktime'],
}
```

## 🐛 Troubleshooting

### Database Issues
```bash
# If Prisma client is out of sync
npx prisma generate

# If database schema issues
npx prisma db push --force-reset
npm run db:seed
```

### File Upload Issues
```bash
# Check upload directory permissions
ls -la public/uploads/

# Recreate upload directories
mkdir -p public/uploads/portfolio/{originals,thumbnails,webp,avif,temp}
```

### Admin Access Issues
```bash
# Reset admin password
npm run setup:admin

# Check environment variables
cat .env.local
```

## 📊 Database Schema

### Core Models
- **User** - Authentication with roles (VISITOR, REGISTERED, ADMIN)
- **PortfolioItem** - Media items with metadata, categories, tags, view counts
- **Category** - Portfolio categorization (Nature, Travel, Events, Videography)
- **Inquiry** - Contact form submissions with status tracking
- **NewsletterSubscriber** - Email subscriptions
- **AnalyticsEvent** - Basic analytics tracking

### Relationships
- Portfolio items belong to categories
- Portfolio items have metadata (photographer, location, camera settings)
- Users can have multiple roles and manage content

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
Ensure all environment variables are properly set for production:
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Secure random string
- `DATABASE_URL` - Production database connection
- SMTP settings for contact forms

### File Storage
For production, consider:
- Using cloud storage (AWS S3, Cloudinary) instead of local files
- CDN for image delivery
- Regular backups of uploads directory

## 📝 API Documentation

### Public API Endpoints
- `GET /api/portfolio` - Fetch published portfolio items
- `GET /api/portfolio/[id]` - Fetch single portfolio item
- `GET /api/categories` - Fetch categories
- `POST /api/contact` - Submit contact form

### Admin API Endpoints
- `GET /api/admin/portfolio` - Fetch all portfolio items (any status)
- `GET /api/admin/portfolio/[id]` - Fetch single item for editing
- `PUT /api/admin/portfolio/[id]` - Update portfolio item
- `POST /api/portfolio` - Create new portfolio item
- `POST /api/upload` - Upload and process files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support, email [support@example.com] or create an issue in the repository.

---

Built with ❤️ using Next.js and modern web technologies.