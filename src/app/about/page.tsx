import Image from 'next/image';
import Link from 'next/link';

import { Award, Camera, Mountain, Users, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const stats = [
    { icon: Camera, value: '200+', label: 'Photo Sessions' },
    { icon: Mountain, value: '50+', label: 'Nature Shoots' },
    { icon: Users, value: '150+', label: 'Happy Clients' },
    { icon: Award, value: '2', label: 'Years Experience' },
  ];

  const values = [
    {
      title: 'Authentic Storytelling',
      description:
        'I believe every moment has a story to tell. My approach focuses on capturing genuine emotions and authentic interactions that reflect who you truly are.',
    },
    {
      title: 'Artistic Vision',
      description:
        'Combining technical expertise with creative artistry, I create images that are not just photographs, but works of art that you&apos;ll treasure forever.',
    },
    {
      title: 'Personal Connection',
      description:
        'Getting to know my clients personally allows me to capture their unique personality and create a comfortable, enjoyable photography experience.',
    },
    {
      title: 'Timeless Quality',
      description:
        'Using professional equipment and proven techniques, I ensure your photographs will remain beautiful and meaningful for generations to come.',
    },
  ];

  return (
    <div className='min-h-screen py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Hero Section */}
        <div className='mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
          <div>
            <h1 className='mb-6 text-4xl font-bold md:text-5xl'>
              Hello, I&apos;m
              <span className='text-primary'> Kilian Siebert</span>
            </h1>
            <p className='text-muted-foreground mb-6 text-lg leading-relaxed'>
              A 20-year-old visual storyteller with a burning passion for
              photography and videography. Although I only began my journey into
              the world of visual creation two years ago, it was love at first
              click. What started as curious experimentation has quickly
              developed into a deep passion that drives me to capture the beauty
              of the world around me.
            </p>
            <p className='text-muted-foreground mb-8 leading-relaxed'>
              Based in Germany, I specialize in travel, event, and nature
              photography, along with corporate videography. My approach
              combines authentic storytelling with creative vision, ensuring
              that every image and video captures not just how things looked,
              but the emotions and stories behind them.
            </p>
            <Button asChild size='lg'>
              <Link href='/contact'>Let&apos;s Work Together</Link>
            </Button>
          </div>
          <div className='relative'>
            <div className='relative aspect-[3/4] overflow-hidden rounded-2xl'>
              <Image
                src='/images/mein-portrait.JPG'
                alt='Photographer portrait'
                fill
                className='object-cover'
              />
            </div>
            <div className='bg-primary text-primary-foreground absolute -bottom-6 -left-6 rounded-2xl p-6'>
              <div className='text-2xl font-bold'>2</div>
              <div className='text-sm'>Years Experience</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className='mb-16 grid grid-cols-2 gap-6 md:grid-cols-4'>
          {stats.map((stat, index) => (
            <Card key={index} className='text-center'>
              <CardContent className='p-6'>
                <div className='mb-4 flex justify-center'>
                  <div className='bg-primary/10 rounded-full p-3'>
                    <stat.icon className='text-primary h-6 w-6' />
                  </div>
                </div>
                <div className='mb-1 text-2xl font-bold'>{stat.value}</div>
                <div className='text-muted-foreground text-sm'>
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Photography Philosophy */}
        <div className='mb-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
              My Visual Storytelling Philosophy
            </h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
              Every photograph and video should tell a story, evoke emotion, and
              capture the unique beauty of nature, travel, and life&apos;s
              special moments.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            {values.map((value, index) => (
              <Card
                key={index}
                className='transition-shadow duration-300 hover:shadow-lg'
              >
                <CardContent className='p-6'>
                  <h3 className='mb-3 text-xl font-semibold'>{value.title}</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Equipment & Process */}
        <div className='mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2'>
          <div>
            <h2 className='mb-6 text-2xl font-bold'>My Journey & Approach</h2>
            <div className='text-muted-foreground space-y-4'>
              <p>
                My photographic journey particularly excites me through the
                diversity of travel, event, and nature photography. It&apos;s
                the greatest privilege for me to capture the unique moments of a
                journey, document the vibrant atmosphere of events, or showcase
                nature&apos;s untouched splendor in all its facets.
              </p>
              <p>
                In addition to photography, I&apos;m also active in videography.
                Whether creating compelling corporate imagefilms or
                attention-grabbing advertising content for social media - I love
                using moving images to convey messages and captivate viewers.
              </p>
              <p>
                My goal is not just to document, but to tell stories that remain
                in memory. I&apos;m constantly seeking new challenges and
                opportunities to develop my skills and create unique visual
                content.
              </p>
            </div>
          </div>
          <div>
            <h2 className='mb-6 text-2xl font-bold'>Services & Specialties</h2>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='bg-primary/10 mt-1 rounded p-1'>
                  <Mountain className='text-primary h-4 w-4' />
                </div>
                <div>
                  <h3 className='font-semibold'>Nature Photography</h3>
                  <p className='text-muted-foreground text-sm'>
                    Capturing the raw beauty and untouched splendor of nature in
                    all its magnificent forms
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='bg-primary/10 mt-1 rounded p-1'>
                  <Camera className='text-primary h-4 w-4' />
                </div>
                <div>
                  <h3 className='font-semibold'>Travel Photography</h3>
                  <p className='text-muted-foreground text-sm'>
                    Documenting unique journeys and adventures, preserving
                    memories of special destinations
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='bg-primary/10 mt-1 rounded p-1'>
                  <Users className='text-primary h-4 w-4' />
                </div>
                <div>
                  <h3 className='font-semibold'>Event Photography</h3>
                  <p className='text-muted-foreground text-sm'>
                    Corporate events, celebrations, and special occasions
                    documented with professional expertise
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='bg-primary/10 mt-1 rounded p-1'>
                  <Video className='text-primary h-4 w-4' />
                </div>
                <div>
                  <h3 className='font-semibold'>Corporate Videography</h3>
                  <p className='text-muted-foreground text-sm'>
                    Professional imagefilms and social media content that tells
                    your brand story with impact
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className='bg-muted/30 rounded-2xl p-8 text-center md:p-12'>
          <h2 className='mb-4 text-2xl font-bold md:text-3xl'>
            Ready to Create Something Beautiful?
          </h2>
          <p className='text-muted-foreground mx-auto mb-6 max-w-2xl'>
            Whether you&apos;re planning an adventure, need corporate
            videography, or want to document nature&apos;s beauty, I&apos;d love
            to hear about your vision and discuss how we can bring it to life
            through visual storytelling.
          </p>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button asChild size='lg'>
              <Link href='/contact'>Get In Touch</Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/portfolio'>View My Work</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
