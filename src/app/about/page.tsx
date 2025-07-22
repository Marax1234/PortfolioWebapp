import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Award, Users, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const stats = [
    { icon: Camera, value: "500+", label: "Photo Sessions" },
    { icon: Heart, value: "100+", label: "Weddings" },
    { icon: Users, value: "1000+", label: "Happy Clients" },
    { icon: Award, value: "5+", label: "Years Experience" },
  ]

  const values = [
    {
      title: "Authentic Storytelling",
      description: "I believe every moment has a story to tell. My approach focuses on capturing genuine emotions and authentic interactions that reflect who you truly are."
    },
    {
      title: "Artistic Vision",
      description: "Combining technical expertise with creative artistry, I create images that are not just photographs, but works of art that you&apos;ll treasure forever."
    },
    {
      title: "Personal Connection",
      description: "Getting to know my clients personally allows me to capture their unique personality and create a comfortable, enjoyable photography experience."
    },
    {
      title: "Timeless Quality",
      description: "Using professional equipment and proven techniques, I ensure your photographs will remain beautiful and meaningful for generations to come."
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hello, I&apos;m a 
              <span className="text-primary"> Photography Enthusiast</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              With over 5 years of experience in professional photography, I&apos;ve had the privilege of capturing 
              life&apos;s most precious moments for hundreds of clients. From intimate wedding ceremonies to corporate 
              events, my passion lies in telling stories through the lens of creativity and authenticity.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Based in Munich, Germany, I specialize in wedding photography, portrait sessions, and event documentation. 
              My approach combines photojournalistic storytelling with artistic vision, ensuring that every image 
              captures not just how things looked, but how they felt.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">
                Let&apos;s Work Together
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
              <Image
                src="/images/mein-portrait.JPG"
                alt="Photographer portrait"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl">
              <div className="text-2xl font-bold">5+</div>
              <div className="text-sm">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Photography Philosophy */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Photography Philosophy</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every photograph should tell a story, evoke emotion, and capture the essence of the moment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Equipment & Process */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-6">Equipment & Approach</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I use professional-grade Canon equipment, including the latest mirrorless cameras and a selection 
                of prime and zoom lenses to ensure the highest image quality in any lighting condition.
              </p>
              <p>
                My shooting style is unobtrusive and natural, allowing genuine moments to unfold while being ready 
                to capture both planned shots and spontaneous emotions. I believe the best photographs happen when 
                people feel comfortable and relaxed.
              </p>
              <p>
                Post-processing is done with care and attention to detail, enhancing the natural beauty of each 
                image while maintaining authentic colors and tones that will stand the test of time.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Services & Specialties</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-primary/10 mt-1">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Wedding Photography</h3>
                  <p className="text-sm text-muted-foreground">Complete wedding day coverage from preparation to celebration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-primary/10 mt-1">
                  <Camera className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Portrait Sessions</h3>
                  <p className="text-sm text-muted-foreground">Professional headshots, family portraits, and personal branding</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-primary/10 mt-1">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Event Documentation</h3>
                  <p className="text-sm text-muted-foreground">Corporate events, celebrations, and special occasions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-muted/30 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Create Something Beautiful?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you&apos;re planning a wedding, need professional portraits, or want to document a special event, 
            I&apos;d love to hear about your vision and discuss how we can bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get In Touch</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/portfolio">View My Work</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}