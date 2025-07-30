import Link from 'next/link';

import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/strategieutopie/',
    icon: Instagram,
  },
  {
    name: 'Email',
    href: 'mailto:kilian.seibert@web.de',
    icon: Mail,
  },
];

const contactInfo = [
  {
    name: 'Phone',
    value: '+49 1514 1200330',
    icon: Phone,
  },
  {
    name: 'Location',
    value: 'Germany, Munich',
    icon: MapPin,
  },
];

const footerLinks = [
  {
    title: 'Portfolio',
    links: [
      { name: 'Nature', href: '/portfolio?category=nature' },
      { name: 'Travel', href: '/portfolio?category=travel' },
      { name: 'Events', href: '/portfolio?category=event' },
      { name: 'Videography', href: '/portfolio?category=videography' },
    ],
  },
  {
    title: 'Services',
    links: [
      { name: 'Nature Photography', href: '/services/nature' },
      { name: 'Travel Photography', href: '/services/travel' },
      { name: 'Event Photography', href: '/services/event' },
      { name: 'Videography', href: '/services/videography' },
    ],
  },
  {
    title: 'About',
    links: [
      { name: 'My Story', href: '/about' },
      { name: 'Equipment', href: '/about/equipment' },
      { name: 'Process', href: '/about/process' },
      { name: 'FAQ', href: '/about/faq' },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-muted/30 border-t'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='py-12'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5'>
            {/* Brand and Contact Info */}
            <div className='lg:col-span-2'>
              <div className='mb-4 flex items-center space-x-2'>
                <span className='text-xl font-bold'>Portfolio</span>
              </div>
              <p className='text-muted-foreground mb-6 max-w-md'>
                Capturing life&apos;s precious moments through the lens of
                creativity and passion. Professional photography and videography
                services throughout Germany.
              </p>

              {/* Contact Information */}
              <div className='mb-6 space-y-3'>
                {contactInfo.map(item => (
                  <div key={item.name} className='flex items-center space-x-3'>
                    <item.icon className='text-muted-foreground h-4 w-4' />
                    <span className='text-muted-foreground text-sm'>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className='flex space-x-4'>
                {socialLinks.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className='text-muted-foreground hover:text-primary transition-colors'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <span className='sr-only'>{item.name}</span>
                    <item.icon className='h-5 w-5' />
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerLinks.map(section => (
              <div key={section.title}>
                <h3 className='mb-4 font-semibold'>{section.title}</h3>
                <ul className='space-y-2'>
                  {section.links.map(link => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className='text-muted-foreground hover:text-primary text-sm transition-colors'
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t py-6'>
          <div className='flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0'>
            <div className='text-muted-foreground text-sm'>
              © {currentYear} Portfolio. All rights reserved.
            </div>
            <div className='flex space-x-6'>
              <Link
                href='/legal/privacy'
                className='text-muted-foreground hover:text-primary text-sm transition-colors'
              >
                Privacy Policy
              </Link>
              <Link
                href='/legal/terms'
                className='text-muted-foreground hover:text-primary text-sm transition-colors'
              >
                Terms of Service
              </Link>
              <Link
                href='/legal/imprint'
                className='text-muted-foreground hover:text-primary text-sm transition-colors'
              >
                Imprint
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
