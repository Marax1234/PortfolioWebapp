import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const cookies = request.headers.get('cookie') || ''
    
    return NextResponse.json({
      success: true,
      session: session ? {
        user: session.user,
        expires: session.expires
      } : null,
      cookies: {
        raw: cookies,
        sessionTokenExists: cookies.includes('next-auth.session-token') || cookies.includes('__Secure-next-auth.session-token')
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasSecret: !!process.env.NEXTAUTH_SECRET
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}