import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview';
import { Button } from '@/components/ui/button';


export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className='relative flex h-screen items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/images/hero/HeroStart.jpg'
            alt='Featured Photography'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-black/40' />
        </div>

        <div className='relative z-10 mx-auto max-w-4xl px-4 text-center text-white'>
          <h1 className='mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl'>
            Capturing Life&apos;s
            <span className='text-accent block'>Precious Moments</span>
          </h1>
          <p className='mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl'>
            Professional photography and videography specializing in
            travel, events, and nature. Every moment deserves to be
            preserved with artistic vision and technical excellence.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg' className='min-w-[200px]'>
              <Link href='/portfolio'>
                View Portfolio
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='min-w-[200px] border-white/20 bg-white/10 text-white hover:bg-white/20'
            >
              <Link href='/contact'>Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <PortfolioPreview maxItems={6} />


      {/* Call to Action */}
      <section className='bg-primary text-primary-foreground py-16 md:py-24'>
        <div className='container mx-auto px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Ready to Capture Your Story?
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg opacity-90'>
            Let&apos;s create something beautiful together. Every story deserves to be told
            through exceptional visual content.
          </p>
          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg' variant='secondary'>
              <Link href='/contact'>
                Start Your Project
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button
              asChild
              size='lg'
              variant='outline'
              className='border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent'
            >
              <Link href='/about'>Learn About Me</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
