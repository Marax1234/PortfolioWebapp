/**
 * Categories API Endpoint
 * GET /api/categories - Fetch all active categories with portfolio item counts
 */

import { NextRequest, NextResponse } from 'next/server'
import { CategoryQueries, handlePrismaError } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    // Fetch all active categories with portfolio item counts
    const categories = await CategoryQueries.getActiveWithCounts()

    return NextResponse.json({
      success: true,
      data: categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        coverImage: category.coverImage,
        sortOrder: category.sortOrder,
        portfolioItemCount: category._count.portfolioItems,
        createdAt: category.createdAt
      }))
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
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