import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { Logger } from '@/lib/logger'

const prisma = new PrismaClient()

const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "Vorname ist erforderlich"),
  lastName: z.string().min(1, "Nachname ist erforderlich"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
})

export async function PUT(request: NextRequest) {
  const requestId = Logger.generateRequestId()
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      Logger.warn('Unauthorized profile update attempt', { requestId })
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    // Check admin role
    if (session.user.role !== 'ADMIN') {
      Logger.warn('Non-admin user attempted profile update', { 
        requestId,
        userId: session.user.id 
      })
      return NextResponse.json(
        { error: 'Keine Berechtigung' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Check if email is already taken by another user
    if (validatedData.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (existingUser && existingUser.id !== session.user.id) {
        Logger.warn('Profile update attempted with existing email', { 
          requestId,
          userId: session.user.id,
          attemptedEmail: validatedData.email
        })
        return NextResponse.json(
          { error: 'E-Mail-Adresse wird bereits verwendet' },
          { status: 400 }
        )
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        // Reset email verification if email changed
        emailVerified: validatedData.email !== session.user.email ? false : undefined,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        role: true,
      }
    })

    Logger.info('User profile updated successfully', {
      requestId,
      userId: session.user.id,
      updatedFields: Object.keys(validatedData),
      emailChanged: validatedData.email !== session.user.email
    })

    return NextResponse.json({
      message: 'Profil erfolgreich aktualisiert',
      user: updatedUser
    })

  } catch (error) {
    Logger.error('Profile update error', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Ungültige Eingabedaten',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}