# Kilian Siebert Portfolio Website

A modern, responsive portfolio website built for photographer/videographer Kilian Siebert. This Next.js application features a dynamic gallery, admin panel, and content management system.

## 🚀 Features

- **Dynamic Portfolio Gallery** - Infinite scroll with masonry/grid layout toggle
- **Full-screen Lightbox** - Image viewer with keyboard navigation
- **Admin Dashboard** - Complete portfolio management interface
- **File Upload & Processing** - Automatic image optimization (WebP, AVIF, thumbnails)
- **Content Management** - DRAFT → REVIEW → PUBLISHED → ARCHIVED workflow
- **Authentication** - Secure admin access with JWT tokens
- **Contact System** - Professional contact form with complete inquiry management
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
- **Email**: Nodemailer with HTML templates
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
ADMIN_EMAIL="mhiller2005@gmail.com"
ADMIN_PASSWORD_HASH="bcrypt-hashed-password"

# Email Configuration (Optional - for contact form notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"
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
- **Inquiry Management** - Handle customer contact requests
- Analytics overview

## 📬 Contact Form & Inquiry Management System

The portfolio includes a comprehensive contact form and inquiry management system designed for professional client communication.

### 🌟 Features Overview

#### **Customer-Facing Contact Form**
- **Professional Form Design** - Clean, responsive form with validation
- **Service Categories** - Nature, Travel, Event, Videography options
- **GDPR Compliance** - Required privacy consent checkbox
- **Real-time Validation** - Client and server-side validation with Zod
- **User Feedback** - Success/error messages with professional styling
- **Spam Protection** - Built-in spam detection and rate limiting

#### **Admin Inquiry Management Dashboard**
- **Centralized Dashboard** - View all inquiries at `/admin/inquiries`
- **Real-time Statistics** - Count of new, in-progress, and resolved inquiries
- **Advanced Filtering** - Search by name, email, or subject
- **Status Management** - Update inquiry status (NEW → IN_PROGRESS → RESOLVED → CLOSED)
- **Quick Reply System** - Send professional responses directly from dashboard
- **Detailed View** - Full inquiry details with customer contact information

#### **Email System**
- **Dual Notifications** - Admin alerts + customer confirmations
- **Professional Templates** - Branded HTML email templates
- **Auto-Replies** - Immediate confirmation emails to customers
- **Custom Responses** - Personalized replies from admin dashboard
- **Development Mode** - Email simulation without SMTP configuration

### 🛠 Setup Instructions

#### **1. Basic Setup (Works Immediately)**
The contact form works out-of-the-box with email simulation:

```bash
# No additional setup required - emails are logged to console
npm run dev
# Visit http://localhost:3000/contact to test
```

#### **2. Production Email Setup**

For live email notifications, configure SMTP in `.env.local`:

**Option A: Gmail Setup**
```env
# Gmail SMTP Configuration
ADMIN_EMAIL="mhiller2005@gmail.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"  # Use App Password, not regular password
EMAIL_FROM="your-email@gmail.com"
```

**Option B: SendGrid Setup**
```env
# SendGrid SMTP Configuration
ADMIN_EMAIL="mhiller2005@gmail.com"
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
EMAIL_FROM="your-verified-sender@domain.com"
```

**Option C: Custom SMTP**
```env
# Custom SMTP Provider
ADMIN_EMAIL="mhiller2005@gmail.com"
SMTP_HOST="mail.your-domain.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-smtp-user"
SMTP_PASSWORD="your-smtp-password"
EMAIL_FROM="noreply@your-domain.com"
```

### 📧 Gmail App Password Setup

To use Gmail SMTP, you need an App Password (not your regular password):

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select app: "Mail" and device: "Other (Custom name)"
   - Copy the 16-character password
3. **Use in .env.local**:
   ```env
   SMTP_PASSWORD="your-16-character-app-password"
   ```

### 🎯 Customer Journey

1. **Customer** visits `/contact` page
2. **Fills out form** with project details and service category
3. **Form validation** ensures all required fields are complete
4. **Submission** saves inquiry to database and triggers emails:
   - **Admin notification** sent to `ADMIN_EMAIL`
   - **Customer confirmation** sent with reference ID
5. **Admin** receives email notification and can:
   - View inquiry in dashboard at `/admin/inquiries`
   - Update status and priority
   - Send personalized reply
6. **Status tracking** throughout the process

### 🔧 Admin Inquiry Management

#### **Access Dashboard**
```
http://localhost:3000/admin/inquiries
```

#### **Key Features**
- **Statistics Cards** - Overview of inquiry counts by status
- **Search & Filter** - Find inquiries by name, email, or subject
- **Status Updates** - Click to change inquiry status
- **Detail Panel** - Click inquiry to view full details
- **Quick Reply** - Send responses directly from dashboard
- **Contact Integration** - Direct email and phone links

#### **Inquiry Workflow**
```
NEW → IN_PROGRESS → RESOLVED → CLOSED
```

- **NEW**: Fresh inquiry, needs attention
- **IN_PROGRESS**: Currently being handled
- **RESOLVED**: Response sent to customer
- **CLOSED**: Inquiry completed/archived

### 🛡 Security Features

- **Rate Limiting** - Max 5 submissions per hour per IP
- **Spam Detection** - Automatic scoring based on content patterns
- **Input Validation** - Server-side validation with Zod schemas
- **GDPR Compliance** - Required privacy consent
- **Comprehensive Logging** - All actions logged with Winston
- **CSRF Protection** - Built-in Next.js CSRF protection

### 📊 Database Schema

The inquiry system uses the following database structure:

```sql
-- Inquiry table stores all contact form submissions
model Inquiry {
  id           String          @id @default(cuid())
  name         String          -- Customer name
  email        String          -- Contact email
  phone        String?         -- Optional phone
  subject      String?         -- Inquiry subject
  message      String          -- Main message
  category     InquiryCategory -- Service category
  status       InquiryStatus   -- Workflow status
  priority     Priority        -- Priority level
  budgetRange  String?         -- Optional budget info
  eventDate    DateTime?       -- Optional event date
  location     String?         -- Optional location
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  resolvedAt   DateTime?       -- When resolved
}
```

### 🧪 Testing the System

#### **Manual Testing**
1. Start development server: `npm run dev`
2. Visit contact form: `http://localhost:3000/contact`
3. Fill out and submit form
4. Check server console for email logs
5. Visit admin dashboard: `http://localhost:3000/admin/inquiries`
6. Test reply functionality

#### **Development vs Production**
- **Development**: Emails simulated and logged to console
- **Production**: Real emails sent via configured SMTP

### 🚨 Troubleshooting

#### **Common Issues**

**Form not submitting:**
```bash
# Check server logs for validation errors
npm run dev
# Check browser Network tab for API errors
```

**Emails not sending:**
```bash
# Verify SMTP configuration in .env.local
cat .env.local | grep SMTP

# Test SMTP connection (check server logs)
# Emails will be logged even if SMTP fails
```

**Admin dashboard not loading:**
```bash
# Ensure admin user is set up
npm run setup:admin

# Check authentication
# Must be logged in as ADMIN role
```

**Database errors:**
```bash
# Reset database if needed
npm run db:reset

# Regenerate Prisma client
npx prisma generate
```

### 📈 Email Templates

The system includes professional HTML email templates:

- **Admin Notification**: Detailed inquiry information with quick action links
- **Customer Confirmation**: Professional acknowledgment with next steps
- **Custom Reply**: Personalized response template with original inquiry context

All templates are mobile-responsive and include:
- Professional branding
- Clear typography
- Action buttons
- Contact information
- Legal compliance text

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
- `POST /api/contact` - Submit contact form (with email notifications)

### Admin API Endpoints

#### Portfolio Management
- `GET /api/admin/portfolio` - Fetch all portfolio items (any status)
- `GET /api/admin/portfolio/[id]` - Fetch single item for editing
- `PUT /api/admin/portfolio/[id]` - Update portfolio item
- `POST /api/portfolio` - Create new portfolio item
- `POST /api/upload` - Upload and process files

#### Inquiry Management
- `GET /api/admin/inquiries` - Fetch all customer inquiries
- `PATCH /api/admin/inquiries/[id]` - Update inquiry status/priority
- `POST /api/admin/inquiries/[id]/reply` - Send custom reply to customer

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