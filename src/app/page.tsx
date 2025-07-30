import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Camera, Mountain, Users, Video } from 'lucide-react';

import { PortfolioPreview } from '@/components/portfolio/PortfolioPreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  {
    icon: Mountain,
    title: 'Nature Photography',
    description:
      'Capturing the raw beauty and untouched splendor of nature in all its magnificent forms and seasons.',
    href: '/services/nature',
  },
  {
    icon: Camera,
    title: 'Travel Photography',
    description:
      'Documenting unique journeys and adventures, preserving the essence and memories of special destinations.',
    href: '/services/travel',
  },
  {
    icon: Users,
    title: 'Event Photography',
    description:
      'Corporate events, parties, and celebrations documented with professional expertise and creative vision.',
    href: '/services/event',
  },
  {
    icon: Video,
    title: 'Corporate Videography',
    description:
      'Professional imagefilms and social media content creation that tells your brand story with impact.',
    href: '/services/videography',
  },
];

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
            Professional photography and videography services specializing in
            travel, events, and nature photography. Every moment deserves to be
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

      {/* Services Section */}
      <section className='py-16 md:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              Photography Services
            </h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
              Specialized photography and videography services tailored to
              capture your adventures and important moments with professional
              excellence.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {services.map((service, index) => (
              <Card
                key={index}
                className='group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg'
              >
                <CardContent className='p-6 text-center'>
                  <div className='mb-4 flex justify-center'>
                    <div className='bg-primary/10 group-hover:bg-primary/20 rounded-full p-3 transition-colors duration-300'>
                      <service.icon className='text-primary h-6 w-6' />
                    </div>
                  </div>
                  <h3 className='mb-3 text-xl font-semibold'>
                    {service.title}
                  </h3>
                  <p className='text-muted-foreground mb-4 text-sm leading-relaxed'>
                    {service.description}
                  </p>
                  <Button asChild variant='ghost' size='sm'>
                    <Link href={service.href}>
                      Learn More
                      <ArrowRight className='ml-1 h-3 w-3' />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='bg-primary text-primary-foreground py-16 md:py-24'>
        <div className='container mx-auto px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Ready to Capture Your Story?
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg opacity-90'>
            Let&apos;s discuss your photography and videography needs and create
            something beautiful together. Every story deserves to be told
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
