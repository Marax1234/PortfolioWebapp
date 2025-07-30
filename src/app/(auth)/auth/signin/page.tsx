'use client';

import { Suspense, useEffect, useState } from 'react';

import { getSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { AlertTriangle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { z } from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  useEffect(() => {
    // Check if user is already signed in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push(callbackUrl);
      }
    };
    checkSession();
  }, [router, callbackUrl]);

  useEffect(() => {
    // Handle NextAuth errors
    if (error) {
      switch (error) {
        case 'CredentialsSignin':
          setAuthError('Invalid email or password. Please try again.');
          break;
        case 'Configuration':
          setAuthError('Authentication service error. Please try again later.');
          break;
        default:
          setAuthError('An error occurred during sign in. Please try again.');
      }
    }
  }, [error]);

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Partial<LoginFormData> = {};
        err.issues.forEach(issue => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as keyof LoginFormData] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Clear auth error when user modifies form
    if (authError) {
      setAuthError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      console.log('Attempting login with:', {
        email: formData.email.toLowerCase().trim(),
        callbackUrl,
      });

      // Use NextAuth signIn with redirect: false for better control
      const result = await signIn('credentials', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        redirect: false,
      });

      console.log('Login result:', result);

      if (result?.error) {
        console.error('Login error:', result.error);
        // Show specific error messages
        switch (result.error) {
          case 'CredentialsSignin':
            setAuthError(
              'Invalid email or password. Please check your credentials.'
            );
            break;
          case 'Configuration':
            setAuthError(
              'Authentication service error. Please try again later.'
            );
            break;
          default:
            setAuthError(`Login failed: ${result.error}`);
        }
      } else if (result?.ok && result?.url) {
        console.log('Login successful, redirecting to:', result.url);
        // Use the URL from NextAuth result
        window.location.href = result.url;
      } else if (result?.ok) {
        console.log(
          'Login successful, using fallback redirect to:',
          callbackUrl
        );
        // Fallback to callback URL
        window.location.href = callbackUrl;
      } else {
        console.error('Unexpected login result:', result);
        setAuthError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4'>
      <div className='w-full max-w-md'>
        {/* Logo/Brand */}
        <div className='mb-8 text-center'>
          <div className='relative mx-auto mb-4 h-16 w-16'>
            <Image
              src='/images/logo.png'
              alt='Portfolio Logo'
              width={64}
              height={64}
              className='rounded-full'
              onError={() => {
                // Fallback if logo doesn't exist
              }}
            />
          </div>
          <h1 className='text-2xl font-bold text-slate-900'>Admin Portal</h1>
          <p className='text-sm text-slate-600'>
            Sign in to manage your portfolio
          </p>
        </div>

        <Card className='shadow-lg'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl'>Sign In</CardTitle>
            <CardDescription className='text-center'>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-4'>
            {/* Auth Error Alert */}
            {authError && (
              <Alert variant='destructive'>
                <AlertTriangle className='h-4 w-4' />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Email Field */}
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <div className='relative'>
                  <Mail className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='admin@example.com'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isLoading}
                    autoComplete='email'
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <p className='text-sm text-red-600'>{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <div className='relative'>
                  <Lock className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={e =>
                      handleInputChange('password', e.target.value)
                    }
                    className={`pr-10 pl-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    disabled={isLoading}
                    autoComplete='current-password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 hover:text-slate-600'
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-sm text-red-600'>{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Development Credentials Helper */}
            {process.env.NODE_ENV === 'development' && (
              <div className='mt-6 rounded-md border border-blue-200 bg-blue-50 p-3'>
                <div className='mb-2 flex items-center justify-between'>
                  <p className='text-xs font-medium text-blue-800'>
                    Development Credentials:
                  </p>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='h-6 px-2 text-xs'
                    onClick={() => {
                      setFormData({
                        email: 'kilian@example.com',
                        password: 'AdminPass123!',
                      });
                      setErrors({});
                    }}
                    disabled={isLoading}
                  >
                    Auto-Fill
                  </Button>
                </div>
                <p className='text-xs text-blue-700'>
                  Email: kilian@example.com
                </p>
                <p className='text-xs text-blue-700'>Password: AdminPass123!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className='mt-6 text-center'>
          <p className='text-xs text-slate-500'>
            Protected by enterprise-grade security. Your session is encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
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
      <SignInContent />
    </Suspense>
  );
}
