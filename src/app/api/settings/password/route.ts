import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { LogCategory, LogLevel, Logger } from '@/lib/logger';

const prisma = new PrismaClient();

const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Aktuelles Passwort ist erforderlich'),
  newPassword: z
    .string()
    .min(8, 'Neues Passwort muss mindestens 8 Zeichen lang sein'),
});

export async function PUT(request: NextRequest) {
  const requestId = Logger.generateRequestId();

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      Logger.securityLog({
        level: LogLevel.WARN,
        category: LogCategory.SECURITY,
        message: 'Unauthorized password change attempt',
        eventType: 'UNAUTHORIZED_ACCESS',
        severity: 'HIGH',
        requestId,
        details: {
          reason: 'no_session',
          timestamp: new Date().toISOString(),
        },
      });
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.user.role !== 'ADMIN') {
      Logger.securityLog({
        level: LogLevel.WARN,
        category: LogCategory.SECURITY,
        message: 'Non-admin user attempted password change',
        eventType: 'UNAUTHORIZED_ACCESS',
        severity: 'HIGH',
        requestId,
        userId: session.user.id,
        details: {
          reason: 'insufficient_role',
          role: session.user.role,
          timestamp: new Date().toISOString(),
        },
      });
      return NextResponse.json(
        { error: 'Keine Berechtigung' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = passwordUpdateSchema.parse(body);

    // Get current user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user || !user.passwordHash) {
      Logger.securityLog({
        level: LogLevel.ERROR,
        category: LogCategory.SECURITY,
        message: 'Password change attempted for user without password',
        eventType: 'LOGIN_FAILURE',
        severity: 'HIGH',
        requestId,
        userId: session.user.id,
        details: {
          reason: 'no_password_hash',
          timestamp: new Date().toISOString(),
        },
      });
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden oder kein Passwort gesetzt' },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      Logger.securityLog({
        level: LogLevel.WARN,
        category: LogCategory.SECURITY,
        message: `Invalid current password provided during password change: ${user.email}`,
        eventType: 'LOGIN_FAILURE',
        severity: 'MEDIUM',
        requestId,
        userId: session.user.id,
        details: {
          reason: 'invalid_current_password',
          email: user.email,
          timestamp: new Date().toISOString(),
        },
      });
      return NextResponse.json(
        { error: 'Aktuelles Passwort ist falsch' },
        { status: 400 }
      );
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(
      validatedData.newPassword,
      user.passwordHash
    );

    if (isSamePassword) {
      Logger.warn('User attempted to set same password', {
        requestId,
        userId: session.user.id,
      });
      return NextResponse.json(
        { error: 'Das neue Passwort muss sich vom aktuellen unterscheiden' },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(
      validatedData.newPassword,
      saltRounds
    );

    // Update password in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    Logger.securityLog({
      level: LogLevel.INFO,
      category: LogCategory.SECURITY,
      message: `Password successfully changed for user: ${user.email}`,
      eventType: 'LOGIN_SUCCESS',
      severity: 'LOW',
      requestId,
      userId: session.user.id,
      details: {
        email: user.email,
        passwordChanged: true,
        timestamp: new Date().toISOString(),
      },
    });

    Logger.info('User password updated successfully', {
      requestId,
      userId: session.user.id,
      email: user.email,
    });

    return NextResponse.json({
      message: 'Passwort erfolgreich geändert',
    });
  } catch (error) {
    Logger.error('Password update error', {
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
