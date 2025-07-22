import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Camera, Clock, Award } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ready to capture your special moments? Let&apos;s discuss your photography needs and create something beautiful together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" type="text" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" type="text" required />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" name="phone" type="tel" />
                  </div>
                  
                  <div>
                    <Label htmlFor="service">Service Interest</Label>
                    <select 
                      id="service" 
                      name="service" 
                      className="w-full p-3 border rounded-md bg-background"
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="wedding">Wedding Photography</option>
                      <option value="portrait">Portrait Session</option>
                      <option value="event">Event Photography</option>
                      <option value="commercial">Commercial Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="eventDate">Event Date (If applicable)</Label>
                    <Input id="eventDate" name="eventDate" type="date" />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Tell me about your project</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      rows={5}
                      placeholder="Please describe your photography needs, vision, location, and any other important details..."
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+49 123 456 789</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>contact@photographer.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Munich, Germany</span>
                </div>
              </CardContent>
            </Card>

            {/* Photography Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photography Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  I specialize in capturing authentic moments with a blend of photojournalistic and artistic styles. 
                  My approach focuses on natural lighting, genuine emotions, and timeless compositions.
                </p>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  I typically respond to inquiries within 24 hours. For urgent requests, 
                  please call directly and I&apos;ll do my best to accommodate your timeline.
                </p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>• 5+ years professional experience</div>
                  <div>• 100+ weddings photographed</div>
                  <div>• Published in photography magazines</div>
                  <div>• Available for travel worldwide</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">How far in advance should I book?</h3>
              <p className="text-muted-foreground text-sm">
                I recommend booking 6-12 months in advance for weddings, and 2-4 weeks for portrait sessions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you travel for shoots?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! I&apos;m available for destination weddings and shoots worldwide. Travel fees apply for locations outside Munich.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How long until I receive my photos?</h3>
              <p className="text-muted-foreground text-sm">
                Wedding galleries are delivered within 4-6 weeks, while portrait sessions are ready in 1-2 weeks.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What&apos;s included in your packages?</h3>
              <p className="text-muted-foreground text-sm">
                All packages include professional editing, online gallery delivery, and printing rights. Specific details vary by service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}