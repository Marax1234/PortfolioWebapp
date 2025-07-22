/**
 * Single Portfolio Item API Endpoint
 * GET /api/portfolio/[id] - Fetch single portfolio item by ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { PortfolioQueries, handlePrismaError } from '@/lib/db-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Valid portfolio item ID is required' 
        },
        { status: 400 }
      )
    }

    // Fetch portfolio item by ID
    const portfolioItem = await PortfolioQueries.getById(id)

    if (!portfolioItem) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Portfolio item not found' 
        },
        { status: 404 }
      )
    }

    // Get related items if category exists
    const relatedItems = portfolioItem.categoryId 
      ? await PortfolioQueries.getRelatedItems(
          portfolioItem.id, 
          portfolioItem.categoryId, 
          4
        )
      : []

    return NextResponse.json({
      success: true,
      data: {
        item: portfolioItem,
        relatedItems
      }
    })

  } catch (error) {
    const { id } = await params
    console.error(`Error fetching portfolio item ${id}:`, error)
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