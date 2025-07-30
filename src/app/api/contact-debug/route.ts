import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

// Simple contact form validation schema
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
    console.log('1. Starting contact debug API');

    const body = await request.json();
    console.log('2. Body parsed:', body);

    const validatedData = contactSchema.parse(body);
    console.log('3. Data validated:', validatedData);

    return NextResponse.json({
      success: true,
      message: 'Contact form debug successful',
      data: validatedData,
    });
  } catch (error) {
    console.error('Debug API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
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
