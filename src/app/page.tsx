import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Camera, Heart, Users, Building } from "lucide-react";

// Mock data for portfolio preview
const portfolioPreview = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500&h=600&fit=crop",
    alt: "Wedding Photography",
    category: "Wedding",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&h=400&fit=crop",
    alt: "Portrait Photography",
    category: "Portrait",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=700&fit=crop",
    alt: "Event Photography",
    category: "Event",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&h=500&fit=crop",
    alt: "Commercial Photography",
    category: "Commercial",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&h=600&fit=crop",
    alt: "Wedding Moments",
    category: "Wedding",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=500&h=400&fit=crop",
    alt: "Professional Portrait",
    category: "Portrait",
  },
];

const services = [
  {
    icon: Heart,
    title: "Wedding Photography",
    description: "Capturing your special day with creativity and elegance. From intimate ceremonies to grand celebrations.",
    href: "/services/wedding",
  },
  {
    icon: Camera,
    title: "Portrait Sessions",
    description: "Professional headshots and personal portraits that showcase your unique personality and style.",
    href: "/services/portrait",
  },
  {
    icon: Users,
    title: "Event Photography",
    description: "Corporate events, parties, and celebrations documented with professional expertise.",
    href: "/services/event",
  },
  {
    icon: Building,
    title: "Commercial Work",
    description: "Product photography, corporate imaging, and commercial projects tailored to your business needs.",
    href: "/services/commercial",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&h=1080&fit=crop"
            alt="Featured Photography"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Capturing Life&apos;s
            <span className="block text-accent">Precious Moments</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Professional photography services specializing in weddings, portraits, and events. 
            Every moment deserves to be preserved with artistic vision and technical excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/portfolio">
                View Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[200px] bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/contact">
                Get In Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Work</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A glimpse into my latest photography projects across weddings, portraits, and events.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {portfolioPreview.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/portfolio">
                View Full Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Photography Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Specialized photography services tailored to capture your most important moments with professional excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={service.href}>
                      Learn More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Capture Your Story?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Let&apos;s discuss your photography needs and create something beautiful together. 
            Every story deserves to be told through exceptional imagery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/about">
                Learn About Me
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
