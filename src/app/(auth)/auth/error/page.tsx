'use client';

import { Suspense } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Configuration Error',
    description:
      'There was a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: "You don't have permission to access this resource.",
  },
  Verification: {
    title: 'Verification Required',
    description: 'Please verify your email address before signing in.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication.',
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';

  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4'>
      <div className='w-full max-w-md'>
        <Card className='shadow-lg'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
              <AlertTriangle className='h-6 w-6 text-red-600' />
            </div>
            <CardTitle className='text-xl text-red-900'>
              Authentication Failed
            </CardTitle>
            <CardDescription>
              We encountered an issue while trying to sign you in.
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            <Alert variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>{errorInfo.title}</AlertTitle>
              <AlertDescription className='mt-2'>
                {errorInfo.description}
              </AlertDescription>
            </Alert>

            <div className='space-y-3'>
              <Button asChild className='w-full'>
                <Link href='/auth/signin'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Try Again
                </Link>
              </Button>

              <Button
                variant='outline'
                className='w-full'
                onClick={() => window.location.reload()}
              >
                <RefreshCw className='mr-2 h-4 w-4' />
                Reload Page
              </Button>
            </div>

            <div className='pt-4 text-center'>
              <p className='text-sm text-slate-600'>
                If the problem persists, please{' '}
                <Link href='/contact' className='text-blue-600 hover:underline'>
                  contact support
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4'>
          <div className='text-center'>
            <div className='border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2'></div>
            <p className='mt-2 text-slate-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
