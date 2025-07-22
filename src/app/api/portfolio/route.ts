/**
 * Portfolio API Endpoints
 * GET /api/portfolio - Fetch portfolio items with filtering and pagination
 */

import { NextRequest, NextResponse } from 'next/server'
import { PortfolioQueries, handlePrismaError } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50) // Max 50 items per page
    const category = searchParams.get('category') || undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined
    const orderBy = (searchParams.get('orderBy') as 'createdAt' | 'publishedAt' | 'viewCount' | 'title') || 'createdAt'
    const orderDirection = (searchParams.get('orderDirection') as 'asc' | 'desc') || 'desc'

    // Validate parameters
    if (page < 1) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      )
    }

    if (limit < 1) {
      return NextResponse.json(
        { error: 'Limit must be greater than 0' },
        { status: 400 }
      )
    }

    // Fetch portfolio items
    const result = await PortfolioQueries.getPublishedItems({
      page,
      limit,
      category,
      featured,
      orderBy,
      orderDirection
    })

    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: result.pagination
    })

  } catch (error) {
    console.error('Error fetching portfolio items:', error)
    const { error: errorMessage, code } = handlePrismaError(error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
      },
      { status: code }
    )
  }
}