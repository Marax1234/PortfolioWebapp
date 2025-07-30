import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { Logger } from '@/lib/logger';

const prisma = new PrismaClient();

const portfolioSettingsSchema = z.object({
  defaultStatus: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED']),
  defaultSortOrder: z.enum(['newest', 'oldest', 'alphabetical', 'views']),
  featuredItemsLimit: z.number().min(1).max(20),
});

// We'll store settings in the user's metadata field as JSON
// In a real production app, you might want a separate Settings table
export async function GET() {
  const requestId = Logger.generateRequestId();

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Keine Berechtigung' },
        { status: 403 }
      );
    }

    // Get user settings from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        portfolioSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    // Parse existing settings or use defaults
    let settings = {
      defaultStatus: 'DRAFT' as const,
      defaultSortOrder: 'newest' as const,
      featuredItemsLimit: 6,
    };

    if (user.portfolioSettings) {
      try {
        const parsed = JSON.parse(user.portfolioSettings);
        settings = { ...settings, ...parsed };
      } catch (error) {
        Logger.warn('Failed to parse portfolio settings JSON', {
          requestId,
          userId: session.user.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    Logger.info('Portfolio settings retrieved', {
      requestId,
      userId: session.user.id,
    });

    return NextResponse.json({
      settings: settings,
    });
  } catch (error) {
    Logger.error('Portfolio settings retrieval error', {
      requestId,
      userId: session?.user?.id,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const requestId = Logger.generateRequestId();

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      Logger.warn('Unauthorized portfolio settings update attempt', {
        requestId,
      });
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.user.role !== 'ADMIN') {
      Logger.warn('Non-admin user attempted portfolio settings update', {
        requestId,
        userId: session.user.id,
      });
      return NextResponse.json(
        { error: 'Keine Berechtigung' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = portfolioSettingsSchema.parse(body);

    // Validate featured items limit against current published items
    const publishedCount = await prisma.portfolioItem.count({
      where: {
        status: 'PUBLISHED',
        featured: true,
      },
    });

    if (validatedData.featuredItemsLimit < publishedCount) {
      Logger.warn(
        'Portfolio settings update attempted with featured limit below current count',
        {
          requestId,
          userId: session.user.id,
          currentFeatured: publishedCount,
          requestedLimit: validatedData.featuredItemsLimit,
        }
      );
      return NextResponse.json(
        {
          error: `Das Limit für hervorgehobene Inhalte kann nicht unter ${publishedCount} gesetzt werden, da bereits ${publishedCount} Inhalte hervorgehoben sind.`,
        },
        { status: 400 }
      );
    }

    // Save settings to database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        portfolioSettings: JSON.stringify(validatedData),
      },
    });

    Logger.info('Portfolio settings updated successfully', {
      requestId,
      userId: session.user.id,
      settings: validatedData,
    });

    return NextResponse.json({
      message: 'Portfolio-Einstellungen erfolgreich gespeichert',
      settings: validatedData,
    });
  } catch (error) {
    Logger.error('Portfolio settings update error', {
      requestId,
      userId: session?.user?.id,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Ungültige Eingabedaten',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
