/**
 * Database Seed Script - Automatic Image Loading
 * Lädt automatisch alle Bilder aus public/images/portfolio/ in die Datenbank
 */

import { PrismaClient } from '@prisma/client'
import { readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const prisma = new PrismaClient()

// Funktion zum Laden aller Bilder aus dem Portfolio-Ordner
function loadPortfolioImages() {
  const portfolioDir = join(process.cwd(), 'public', 'images', 'portfolio')
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  
  try {
    const files = readdirSync(portfolioDir)
    return files
      .filter(file => {
        const ext = extname(file).toLowerCase()
        return supportedExtensions.includes(ext)
      })
      .map(file => ({
        filename: file,
        path: `/images/portfolio/${file}`,
        name: file.replace(extname(file), '').replace(/[-_]/g, ' ')
      }))
  } catch (error) {
    console.error('Fehler beim Laden der Portfolio-Bilder:', error)
    return []
  }
}

// Kategorisierung der Bilder basierend auf Dateinamen oder Index
function categorizeImage(index: number, filename: string) {
  const categories = ['nature', 'travel', 'events', 'videography']
  return categories[index % categories.length]
}

// Generierung von realistischen Metadaten für Bilder
function generateImageMetadata(category: string, index: number) {
  const cameras = ['Sony A7R IV', 'Canon EOS R5', 'Nikon D850', 'Fujifilm X-T4']
  const lenses = ['24-70mm f/2.8', '85mm f/1.8', '70-200mm f/2.8', '16-35mm f/2.8', '50mm f/1.4']
  const locations = {
    nature: ['Bayerischer Wald', 'Berchtesgaden', 'Schwarzwald', 'Allgäuer Alpen'],
    travel: ['Venedig, Italien', 'Prag, Tschechien', 'Salzburg, Österreich', 'Amsterdam, Niederlande'],
    events: ['München Convention Center', 'Schloss Nymphenburg', 'Hotel Vier Jahreszeiten', 'Deutsches Museum'],
    videography: ['München Studio', 'Corporate Headquarters', 'Event Location', 'Outdoor Set']
  }
  
  return {
    camera: cameras[index % cameras.length],
    lens: lenses[index % lenses.length],
    settings: `f/${2.8 + (index % 3)}, 1/${125 + (index * 25)}s, ISO ${100 + (index * 100)}`,
    location: locations[category as keyof typeof locations][index % locations[category as keyof typeof locations].length]
  }
}

// Generierung von Beschreibungen basierend auf Kategorie
function generateDescription(category: string, title: string, index: number) {
  const descriptions = {
    nature: [
      'Atemberaubende Landschaftsaufnahme, die die natürliche Schönheit der Region einfängt.',
      'Faszinierende Naturszene mit perfektem Licht und beeindruckender Atmosphäre.',
      'Ein Moment der Ruhe und Harmonie in der unberührten Natur.',
      'Spektakuläre Landschaft, die die Kraft und Schönheit der Natur zeigt.'
    ],
    travel: [
      'Eindrucksvolle Reisefotografie, die die Essenz dieses besonderen Ortes vermittelt.',
      'Kulturelle Vielfalt und architektonische Schönheit in perfekter Komposition.',
      'Ein visuelles Tagebuch einer unvergesslichen Reiseerfahrung.',
      'Authentische Momentaufnahme, die die Seele der Destination einfängt.'
    ],
    events: [
      'Professionelle Event-Fotografie, die die wichtigsten Momente festhält.',
      'Emotionale Höhepunkte und besondere Augenblicke einer unvergesslichen Veranstaltung.',
      'Hochwertige Dokumentation wichtiger gesellschaftlicher und geschäftlicher Ereignisse.',
      'Stilvolle Inszenierung und perfekte Timing für bleibende Erinnerungen.'
    ],
    videography: [
      'Cineastische Qualität und professionelle Videoproduktion für anspruchsvolle Projekte.',
      'Kreative Videoarbeit, die Geschichten erzählt und Emotionen weckt.',
      'Hochauflösende Videodokumentation mit künstlerischem Anspruch.',
      'Innovative Videotechnik für beeindruckende visuelle Erlebnisse.'
    ]
  }
  
  return descriptions[category as keyof typeof descriptions][index % descriptions[category as keyof typeof descriptions].length]
}

// Tags basierend auf Kategorie generieren
function generateTags(category: string, index: number) {
  const tagSets = {
    nature: [
      ['landschaft', 'natur', 'berge', 'wälder', 'sonnenaufgang'],
      ['wildlife', 'tiere', 'naturfotografie', 'outdoor', 'abenteuer'],
      ['wasser', 'seen', 'flüsse', 'reflexion', 'ruhe'],
      ['jahreszeiten', 'herbst', 'winter', 'frühling', 'sommer']
    ],
    travel: [
      ['reise', 'architektur', 'kultur', 'städte', 'europa'],
      ['sehenswürdigkeiten', 'historie', 'kunst', 'museen', 'plätze'],
      ['straßenfotografie', 'menschen', 'alltag', 'authentisch'],
      ['nachtaufnahmen', 'beleuchtung', 'atmosphäre', 'urban']
    ],
    events: [
      ['hochzeit', 'feier', 'romantik', 'liebe', 'emotionen'],
      ['corporate', 'business', 'konferenz', 'networking', 'professionell'],
      ['konzert', 'musik', 'bühne', 'performance', 'unterhaltung'],
      ['family', 'kinder', 'geburtstag', 'fest', 'freude']
    ],
    videography: [
      ['video', 'film', 'produktion', 'cinematic', '4k'],
      ['dokumentation', 'interview', 'storytelling', 'narrative'],
      ['werbung', 'marketing', 'brand', 'commercial', 'promotion'],
      ['musik', 'clip', 'künstlerisch', 'kreativ', 'visual']
    ]
  }
  
  return JSON.stringify(tagSets[category as keyof typeof tagSets][index % tagSets[category as keyof typeof tagSets].length])
}

async function main() {
  console.log('🌱 Starting database seed...')
  
  // Lade alle verfügbaren Portfolio-Bilder
  const portfolioImages = loadPortfolioImages()
  console.log(`📸 Found ${portfolioImages.length} portfolio images`)

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

  // Create portfolio items from actual images in public/images/portfolio/
  if (portfolioImages.length === 0) {
    console.log('⚠️  No images found in public/images/portfolio/ - skipping portfolio item creation')
  } else {
    console.log(`📸 Creating portfolio items from ${portfolioImages.length} images...`)
    
    for (let i = 0; i < portfolioImages.length; i++) {
      const image = portfolioImages[i]
      const categorySlug = categorizeImage(i, image.filename)
      const category = categories.find(c => c.slug === categorySlug)
      
      if (!category) {
        console.error(`Category not found for slug: ${categorySlug}`)
        continue
      }
      
      const metadata = generateImageMetadata(categorySlug, i)
      const title = `${image.name.charAt(0).toUpperCase() + image.name.slice(1)} - ${category.name}`
      const description = generateDescription(categorySlug, title, i)
      const tags = generateTags(categorySlug, i)
      
      // Bestimme ob das Bild featured sein soll (jedes 3. Bild)
      const isFeatured = (i + 1) % 3 === 0
      
      // Generiere realistische Datum (letzte 6 Monate)
      const publishDate = new Date()
      publishDate.setMonth(publishDate.getMonth() - Math.floor(Math.random() * 6))
      publishDate.setDate(Math.floor(Math.random() * 28) + 1)
      
      const portfolioItem = {
        title,
        description,
        mediaType: 'IMAGE' as const,
        filePath: image.path,
        thumbnailPath: image.path, // Verwende dasselbe Bild als Thumbnail
        tags,
        metadata: JSON.stringify(metadata),
        status: 'PUBLISHED' as const,
        featured: isFeatured,
        sortOrder: i,
        categoryId: category.id,
        userId: adminUser.id,
        publishedAt: publishDate
      }
      
      const created = await prisma.portfolioItem.create({
        data: portfolioItem
      })
      
      console.log(`✅ Created portfolio item: ${created.title} (${categorySlug})`)
    }
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
    const created = await prisma.newsletterSubscriber.upsert({
      where: { email: subscriber.email },
      update: {},
      create: subscriber
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