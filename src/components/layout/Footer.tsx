import Link from "next/link"
import { Instagram, Mail, Phone, MapPin } from "lucide-react"

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/photographer",
    icon: Instagram,
  },
  {
    name: "Email",
    href: "mailto:contact@photographer.com",
    icon: Mail,
  },
]

const contactInfo = [
  {
    name: "Phone",
    value: "+49 123 456 789",
    icon: Phone,
  },
  {
    name: "Location",
    value: "Munich, Germany",
    icon: MapPin,
  },
]

const footerLinks = [
  {
    title: "Portfolio",
    links: [
      { name: "Weddings", href: "/portfolio?category=wedding" },
      { name: "Portraits", href: "/portfolio?category=portrait" },
      { name: "Events", href: "/portfolio?category=event" },
      { name: "Commercial", href: "/portfolio?category=commercial" },
    ],
  },
  {
    title: "Services",
    links: [
      { name: "Wedding Photography", href: "/services/wedding" },
      { name: "Portrait Sessions", href: "/services/portrait" },
      { name: "Event Photography", href: "/services/event" },
      { name: "Commercial Work", href: "/services/commercial" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "My Story", href: "/about" },
      { name: "Equipment", href: "/about/equipment" },
      { name: "Process", href: "/about/process" },
      { name: "FAQ", href: "/about/faq" },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand and Contact Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="font-bold text-xl">Portfolio</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Capturing life&apos;s precious moments through the lens of creativity 
                and passion. Professional photography services in Munich and beyond.
              </p>
              
              {/* Contact Information */}
              <div className="space-y-3 mb-6">
                {contactInfo.map((item) => (
                  <div key={item.name} className="flex items-center space-x-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
        <div className="border-t py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Portfolio. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link
                href="/legal/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/legal/imprint"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Imprint
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}