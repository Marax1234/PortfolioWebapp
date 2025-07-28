#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Helper function to generate random dates within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper function to generate random integers
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Helper function to generate weighted random selection
function weightedRandom(items, weights) {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  let random = Math.random() * totalWeight
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i]
    if (random <= 0) {
      return items[i]
    }
  }
  return items[0]
}

async function seedAnalyticsData() {
  console.log('🌱 Seeding analytics data...')

  try {
    // Get existing portfolio items and categories
    const portfolioItems = await prisma.portfolioItem.findMany({
      include: { category: true }
    })
    
    if (portfolioItems.length === 0) {
      console.log('❌ No portfolio items found. Please seed portfolio data first.')
      return
    }

    console.log(`📊 Found ${portfolioItems.length} portfolio items`)

    // Clear existing analytics data
    console.log('🧹 Clearing existing analytics data...')
    await prisma.analyticsEvent.deleteMany()

    // Define time ranges
    const now = new Date()
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Define event types and their weights
    const eventTypes = [
      'page_view',
      'portfolio_view', 
      'portfolio_item_view',
      'contact_form_view',
      'download_attempt'
    ]

    const eventWeights = [30, 25, 35, 8, 2] // Higher weight = more frequent

    // Define traffic sources and their weights
    const trafficSources = [
      'Direct',
      'Google',
      'Instagram', 
      'Facebook',
      'LinkedIn',
      'Twitter',
      'Pinterest',
      'Behance',
      'Referral',
      'Email'
    ]

    const sourceWeights = [25, 30, 15, 10, 8, 5, 3, 2, 1, 1]

    // Define user agents (simplified)
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/111.0 Firefox/120.0'
    ]

    const deviceWeights = [35, 25, 25, 10, 5] // Desktop, Mac, iPhone, iPad, Android

    // Generate IP addresses (mock)
    function generateMockIP() {
      return `${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}.${randomInt(1, 255)}`
    }

    // Generate session IDs
    function generateSessionId() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    const totalEvents = 5000
    const events = []

    console.log(`📈 Generating ${totalEvents} analytics events...`)

    // Generate events with realistic distribution over time
    for (let i = 0; i < totalEvents; i++) {
      // More recent events are more likely
      let eventDate
      const recentWeight = Math.random()
      
      if (recentWeight < 0.4) {
        // 40% in last week
        eventDate = randomDate(oneWeekAgo, now)
      } else if (recentWeight < 0.7) {
        // 30% in last month
        eventDate = randomDate(oneMonthAgo, oneWeekAgo)
      } else if (recentWeight < 0.9) {
        // 20% in last 3 months
        eventDate = randomDate(threeMonthsAgo, oneMonthAgo)
      } else {
        // 10% older than 3 months
        eventDate = randomDate(oneYearAgo, threeMonthsAgo)
      }

      const eventType = weightedRandom(eventTypes, eventWeights)
      const source = weightedRandom(trafficSources, sourceWeights)
      const userAgent = weightedRandom(userAgents, deviceWeights)
      const ipAddress = generateMockIP()
      const sessionId = generateSessionId()

      let portfolioItemId = null
      let metadata = {
        source,
        userAgent,
        ipAddress,
        sessionId,
        timestamp: eventDate.toISOString()
      }

      // Add specific metadata based on event type
      if (eventType === 'portfolio_item_view') {
        // Weight towards more popular items
        const popularItems = portfolioItems.slice(0, Math.ceil(portfolioItems.length * 0.3))
        const regularItems = portfolioItems.slice(Math.ceil(portfolioItems.length * 0.3))
        
        if (Math.random() < 0.7 && popularItems.length > 0) {
          portfolioItemId = popularItems[randomInt(0, popularItems.length - 1)].id
        } else if (regularItems.length > 0) {
          portfolioItemId = regularItems[randomInt(0, regularItems.length - 1)].id
        }

        if (portfolioItemId) {
          const item = portfolioItems.find(p => p.id === portfolioItemId)
          metadata.category = item?.category?.name
          metadata.itemTitle = item?.title
        }
      }

      if (eventType === 'page_view') {
        const pages = [
          '/portfolio',
          '/about',
          '/contact',
          '/portfolio/nature',
          '/portfolio/travel',
          '/portfolio/events',
          '/portfolio/videography'
        ]
        metadata.page = pages[randomInt(0, pages.length - 1)]
      }

      if (eventType === 'contact_form_view') {
        metadata.formType = Math.random() < 0.8 ? 'inquiry' : 'newsletter'
      }

      events.push({
        eventType,
        eventData: JSON.stringify(metadata),
        sessionId: metadata.sessionId,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        referrer: source,
        pageUrl: metadata.page || null,
        timestamp: eventDate
      })

      // Progress indicator
      if (i % 500 === 0) {
        console.log(`📊 Generated ${i}/${totalEvents} events...`)
      }
    }

    // Batch insert events
    console.log('💾 Inserting events into database...')
    
    const batchSize = 100
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize)
      await prisma.analyticsEvent.createMany({
        data: batch
      })
      
      if (i % 1000 === 0) {
        console.log(`💾 Inserted ${Math.min(i + batchSize, events.length)}/${events.length} events...`)
      }
    }

    // Update portfolio item view counts
    console.log('🔄 Updating portfolio item view counts...')
    
    for (const item of portfolioItems) {
      const viewCount = await prisma.analyticsEvent.count({
        where: {
          eventType: 'portfolio_item_view',
          eventData: {
            contains: item.title
          }
        }
      })
      
      await prisma.portfolioItem.update({
        where: { id: item.id },
        data: { viewCount }
      })
    }

    // Generate some newsletter subscriptions
    console.log('📧 Adding newsletter subscriptions...')
    
    const newsletterEmails = [
      'test1@example.com',
      'test2@example.com',
      'test3@example.com',
      'photographer.fan@example.com',
      'nature.lover@example.com'
    ]

    for (const email of newsletterEmails) {
      try {
        await prisma.newsletterSubscriber.upsert({
          where: { email },
          update: {},
          create: {
            email,
            subscribedAt: randomDate(threeMonthsAgo, now),
            isActive: Math.random() < 0.9 // 90% active
          }
        })
      } catch (error) {
        // Skip if already exists
      }
    }

    // Generate some inquiries
    console.log('📝 Adding sample inquiries...')
    
    const sampleInquiries = [
      {
        name: 'Max Mustermann',
        email: 'max@example.com',
        subject: 'Hochzeitsfotografie Anfrage',
        message: 'Hallo, ich interessiere mich für Ihre Hochzeitsfotografie. Könnten Sie mir ein Angebot für Juni 2024 machen?',
        inquiryType: 'WEDDING'
      },
      {
        name: 'Lisa Schmidt',
        email: 'lisa@example.com', 
        subject: 'Portrait Session',
        message: 'Ich würde gerne ein professionelles Portrait shooting buchen.',
        inquiryType: 'PORTRAIT'
      },
      {
        name: 'Business Corp',
        email: 'contact@business.com',
        subject: 'Unternehmensfotos',
        message: 'Wir benötigen professionelle Fotos für unser Team und Büro.',
        inquiryType: 'BUSINESS'
      }
    ]

    for (const inquiry of sampleInquiries) {
      try {
        await prisma.inquiry.create({
          data: {
            ...inquiry,
            status: weightedRandom(['PENDING', 'REPLIED', 'CLOSED'], [50, 30, 20]),
            createdAt: randomDate(oneMonthAgo, now)
          }
        })
      } catch (error) {
        // Skip if already exists
      }
    }

    // Summary
    const eventCounts = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      _count: { eventType: true }
    })

    const sourceCounts = await prisma.analyticsEvent.groupBy({
      by: ['referrer'],
      _count: { referrer: true },
      orderBy: { _count: { referrer: 'desc' } }
    })

    console.log('\n📊 Analytics Data Summary:')
    console.log('========================')
    
    console.log('\n📈 Event Types:')
    eventCounts.forEach(({ eventType, _count }) => {
      console.log(`  ${eventType}: ${_count.eventType}`)
    })

    console.log('\n🌐 Traffic Sources:')
    sourceCounts.slice(0, 5).forEach(({ referrer, _count }) => {
      console.log(`  ${referrer}: ${_count.referrer}`)
    })

    const totalPortfolioViews = await prisma.analyticsEvent.count({
      where: { eventType: 'portfolio_item_view' }
    })

    const totalPageViews = await prisma.analyticsEvent.count({
      where: { eventType: 'page_view' }
    })

    const newsletterCount = await prisma.newsletterSubscriber.count()
    const inquiryCount = await prisma.inquiry.count()

    console.log(`\n📊 Total Portfolio Views: ${totalPortfolioViews}`)
    console.log(`📄 Total Page Views: ${totalPageViews}`)
    console.log(`📧 Newsletter Subscribers: ${newsletterCount}`)
    console.log(`📝 Inquiries: ${inquiryCount}`)

    console.log('\n✅ Analytics data seeding completed successfully!')
    console.log('\n💡 You can now test the analytics dashboard at /admin/analytics')
    
  } catch (error) {
    console.error('❌ Error seeding analytics data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
if (require.main === module) {
  seedAnalyticsData()
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

module.exports = { seedAnalyticsData }