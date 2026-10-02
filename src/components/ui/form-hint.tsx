'use client';

import React from 'react';

import { Info } from 'lucide-react';

import { Alert, AlertDescription } from './alert';

interface FormHintProps {
  children: React.ReactNode;
  className?: string;
}

export function FormHint({ children, className = '' }: FormHintProps) {
  return (
    <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
      <Info className='h-4 w-4 text-blue-600' />
      <AlertDescription className='text-sm text-blue-800'>
        {children}
      </AlertDescription>
    </Alert>
  );
}

export default FormHint;
