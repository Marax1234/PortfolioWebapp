/**
 * Contact API Endpoint
 * POST /api/contact - Handle contact form submissions
 */
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { prisma } from '@/lib/db';

// Contact form validation schema - matching frontend
const contactSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100, 'Name zu lang'),
  email: z.string().email('Gültige Email ist erforderlich'),
  subject: z
    .string()
    .min(1, 'Betreff ist erforderlich')
    .max(200, 'Betreff zu lang'),
  message: z
    .string()
    .min(10, 'Nachricht muss mindestens 10 Zeichen haben')
    .max(2000, 'Nachricht zu lang'),
  category: z
    .enum(['NATURE', 'TRAVEL', 'EVENT', 'VIDEOGRAPHY', 'OTHER'])
    .default('OTHER'),
  phone: z.string().optional(),
  budgetRange: z.string().optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    console.log('1. Starting contact form submission');

    // Parse and validate request body
    const body = await request.json();
    console.log('2. Request body parsed');

    const validatedData = contactSchema.parse(body);
    console.log('3. Data validated successfully');

    // Save to database
    console.log('4. Saving to database...');
    const inquiry = await prisma.inquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        subject: validatedData.subject,
        message: validatedData.message,
        category: validatedData.category,
        budgetRange: validatedData.budgetRange || null,
        eventDate: validatedData.eventDate
          ? new Date(validatedData.eventDate)
          : null,
        location: validatedData.location || null,
        status: 'NEW',
        priority: 'MEDIUM',
      },
    });
    console.log('5. Database save successful, ID:', inquiry.id);

    // TODO: Add email notifications here later
    console.log('6. Skipping email notifications for now');

    return NextResponse.json(
      {
        success: true,
        message:
          'Vielen Dank für Ihre Nachricht! Ich melde mich innerhalb von 24 Stunden bei Ihnen.',
        inquiryId: inquiry.id,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
