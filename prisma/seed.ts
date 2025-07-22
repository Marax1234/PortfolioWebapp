/**
 * Updated Database Seed Script - With working image paths
 * Lösung für 404-Fehler bei Portfolio-Bildern
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'kilian@example.com' },
    update: {},
    create: {
      email: 'kilian@example.com',
      firstName: 'Kilian',
      lastName: 'Siebert',
      role: 'ADMIN',
      emailVerified: true,
      passwordHash: '$2a$10$dummy.hash.for.development'
    }
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'nature' },
      update: {},
      create: {
        name: 'Nature Photography',
        slug: 'nature',
        description: 'Capturing the beauty of natural landscapes and wildlife',
        sortOrder: 1,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { slug: 'travel' },
      update: {},
      create: {
        name: 'Travel Photography',
        slug: 'travel',
        description: 'Adventures and destinations from around the world',
        sortOrder: 2,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { slug: 'events' },
      update: {},
      create: {
        name: 'Event Photography',
        slug: 'events',
        description: 'Memorable moments from special events and celebrations',
        sortOrder: 3,
        isActive: true
      }
    }),
    prisma.category.upsert({
      where: { slug: 'videography' },
      update: {},
      create: {
        name: 'Videography',
        slug: 'videography',
        description: 'Corporate and creative video productions',
        sortOrder: 4,
        isActive: true
      }
    })
  ])

  console.log('✅ Created categories:', categories.map(c => c.name))

  // Create sample portfolio items with WORKING image paths
  // Using placeholder images from Unsplash (configured in next.config.ts)
  const portfolioItems = [
    // Nature Photography
    {
      title: 'Alpenglow in the Bavarian Alps',
      description: 'Golden hour light illuminating the mountain peaks during a winter morning in Bavaria.',
      mediaType: 'IMAGE' as const,
      filePath: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      thumbnailPath: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      tags: '["landscape", "mountains", "golden hour", "bavaria", "winter"]',
      metadata: '{"camera": "Sony A7R IV", "lens": "24-70mm f/2.8", "settings": "f/8, 1/250s, ISO 100", "location": "Garmisch-Partenkirchen"}',
      status: 'PUBLISHED' as const,
      featured: true,
      categoryId: categories[0].id,
      userId: adminUser.id,
      publishedAt: new Date('2024-01-15')
    },
    {
      title: 'Forest Mist at Dawn',
      description: 'Ethereal morning fog rolling through an ancient German forest.',
      mediaType: 'IMAGE' as const,
      filePath: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop',
      thumbnailPath: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      tags: '["forest", "mist", "dawn", "atmospheric", "trees"]',
      metadata: '{"camera": "Sony A7R IV", "lens": "85mm f/1.8", "settings": "f/4, 1/125s, ISO 400", "location": "Black Forest"}',
      status: 'PUBLISHED' as const,
      featured: false,
      categoryId: categories[0].id,
      userId: adminUser.id,
      publishedAt: new Date('2024-01-20')
    },
    {
      title: 'Wildlife: Red Fox in Snow',
      description: 'A majestic red fox captured during snowfall in its natural habitat.',
      mediaType: 'IMAGE' as const,
      filePath: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=1200&h=800&fit=crop',
      thumbnailPath: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&h=300&fit=crop',
      tags: '["wildlife", "fox", "snow", "winter", "animals"]',
      metadata: '{"camera": "Sony A7R IV", "lens": "200-600mm f/5.6-6.3", "settings": "f/6.3, 1/500s, ISO 800", "location": "Nationalpark Berchtesgaden"}',
      status: 'PUBLISHED' as const,
      featured: true,
      categoryId: categories[0].id,
      userId: adminUser.id,
      publishedAt: new Date('2024-02-01')
    },
    // Travel Photography
    {
      title: 'Venice at Blue Hour',
      description: 'The romantic canals of Venice illuminated during the magical blue hour.',
      mediaType: 'IMAGE' as const,
      filePath: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&h=800&fit=crop',
      thumbnailPath: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
      tags: '["venice", "italy", "blue hour", "canals", "architecture"]',
      metadata: '{"camera": "Sony A7R IV", "lens": "24-70mm f/2.8", "settings": "f/5.6, 2s, ISO 100", "location": "Venice, Italy"}',
      status: 'PUBLISHED' as const,
      featured: true,
      categoryId: categories[1].id,
      userId: adminUser.id,
      publishedAt: new Date('2024-03-10')
    },
    {
      title: 'Neuschwanstein Castle',
      description: 'The fairy-tale castle of Neuschwanstein emerging from autumn fog.',
      mediaType: 'IMAGE' as const,
      filePath: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&h=800&fit=crop',
      thumbnailPath: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
      tags: '["castle", "neuschwanstein", "bavaria", "autumn", "fog"]',
      metadata: '{"camera": "Sony A7R IV", "lens": "70-200mm f/2.8", "settings": "f/8, 1/200s, ISO 200", "location": "Schwangau, Bavaria"}',
      status: 'PUBLISHED' as const,
      featured: false,
      categoryId: categories[1].id,
      userId: adminUser.id,
      publishedAt: new Date('2024-03-15')
    },
    // Event Photography
    {
      title: 'Corporate Summit 2024',
      description: 'Key moments from a major corporate technology summit in Munich.',
      mediaType: 'IMAGE' as const,
      filePath: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop',
      thumbnailPath: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
      tags: '["corporate", "summit", "business", "conference", "munich"]',
      metadata: '{"camera": "Sony A7R IV", "lens": "24-70mm f/2.8", "settings": "f/2.8, 1/160s, ISO 1600", "location": "Munich Convention Center"}',
      status: 'PUBLISHED' as const,
      featured: false,
      categoryId: categories[2].id,
      userId: adminUser.id,
      publishedAt: new Date('2024-04-05')
    },
    {
      title: 'Wedding Celebration',
      description: 'Intimate moments from a beautiful countryside wedding celebration.',
      mediaType: 'IMAGE' as const,
      filePath: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
      thumbnailPath: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
      tags: '["wedding", "celebration", "countryside", "romantic", "couple"]',
      metadata: '{"camera": "Sony A7R IV", "lens": "85mm f/1.8", "settings": "f/2.8, 1/200s, ISO 400", "location": "Bavarian Countryside"}',
      status: 'PUBLISHED' as const,
      featured: false,
      categoryId: categories[2].id,
      userId: adminUser.id,
      publishedAt: new Date('2024-04-20')
    },
    // Videography
    {
      title: 'Corporate Brand Film',
      description: 'A compelling brand story showcasing innovation and craftsmanship.',
      mediaType: 'VIDEO' as const,
      filePath: '/videos/portfolio/placeholder-video.mp4', // Placeholder path
      thumbnailPath: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      tags: '["corporate", "brand", "storytelling", "innovation", "craftsmanship"]',
      metadata: '{"camera": "Sony FX3", "lens": "24-70mm f/2.8", "resolution": "4K", "duration": "2:30", "client": "Tech Innovation GmbH"}',
      status: 'PUBLISHED' as const,
      featured: true,
      categoryId: categories[3].id,
      userId: adminUser.id,
      publishedAt: new Date('2024-05-01')
    }
  ]

  for (const item of portfolioItems) {
    const created = await prisma.portfolioItem.create({
      data: item
    })
    console.log(`✅ Created portfolio item: ${created.title}`)
  }

  // Create sample inquiries
  const inquiries = [
    {
      name: 'Maria Schmidt',
      email: 'maria.schmidt@example.com',
      phone: '+49 89 12345678',
      subject: 'Nature Photography Workshop',
      message: 'Hi Kilian, I am interested in joining one of your nature photography workshops. Could you please send me information about upcoming dates and pricing?',
      category: 'NATURE' as const,
      status: 'NEW' as const,
      priority: 'MEDIUM' as const,
      location: 'Munich area'
    },
    {
      name: 'Thomas Weber',
      email: 'thomas.weber@company.de',
      subject: 'Corporate Video Project',
      message: 'We are looking for a videographer for our annual company presentation. The project would involve filming our facilities and interviewing key team members.',
      category: 'VIDEOGRAPHY' as const,
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      budgetRange: '€5000-€10000',
      eventDate: new Date('2024-06-15'),
      location: 'Frankfurt'
    }
  ]

  for (const inquiry of inquiries) {
    const created = await prisma.inquiry.create({
      data: inquiry
    })
    console.log(`✅ Created inquiry from: ${created.name}`)
  }

  // Create newsletter subscribers
  const subscribers = [
    {
      email: 'subscriber1@example.com',
      firstName: 'Anna',
      status: 'ACTIVE' as const
    },
    {
      email: 'subscriber2@example.com',
      firstName: 'Michael',
      status: 'ACTIVE' as const
    },
    {
      email: 'subscriber3@example.com',
      firstName: 'Lisa',
      status: 'PENDING' as const
    }
  ]

  for (const subscriber of subscribers) {
    const created = await prisma.newsletterSubscriber.create({
      data: subscriber
    })
    console.log(`✅ Created newsletter subscriber: ${created.email}`)
  }

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })