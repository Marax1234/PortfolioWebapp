import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, User, Clock, Award } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontakt</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hallo! Ich bin Kilian Siebert, ein visueller Geschichtenerzähler mit einer Leidenschaft für Fotografie und Videografie. Lassen Sie uns gemeinsam Ihre Geschichte erzählen!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Nachricht Senden</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Vorname</Label>
                      <Input id="firstName" name="firstName" type="text" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nachname</Label>
                      <Input id="lastName" name="lastName" type="text" required />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefon (Optional)</Label>
                    <Input id="phone" name="phone" type="tel" />
                  </div>
                  
                  <div>
                    <Label htmlFor="service">Service</Label>
                    <select 
                      id="service" 
                      name="service" 
                      className="w-full p-3 border rounded-md bg-background"
                      required
                    >
                      <option value="">Service auswählen</option>
                      <option value="nature">Naturfotografie</option>
                      <option value="travel">Reisefotografie</option>
                      <option value="event">Eventfotografie</option>
                      <option value="portrait">Portraits</option>
                      <option value="corporate-video">Imagefilm</option>
                      <option value="social-media">Social-Media-Inhalte</option>
                      <option value="other">Anderes</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="eventDate">Datum des Events (falls zutreffend)</Label>
                    <Input id="eventDate" name="eventDate" type="date" />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Erzählen Sie mir von Ihrem Projekt</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      rows={5}
                      placeholder="Bitte beschreiben Sie Ihr Projekt, Ihre Vision, den Ort und andere wichtige Details..."
                      required 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" size="lg">
                    Nachricht Senden
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
                  Kontaktinformationen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+49 1514 1200330</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>kilian.seibert@web.de</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Munich, Germany</span>
                </div>
              </CardContent>
            </Card>

            {/* About Me */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Über Mich
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ich bin ein 20-jähriger visueller Geschichtenerzähler mit einer brennenden Leidenschaft für Fotografie und Videografie. Was als neugieriges Ausprobieren begann, hat sich schnell zu einer tiefen Passion entwickelt.
                  <br/><br/>
                  Besonders begeistert mich die Vielfalt der Reise-, Event- und Naturfotografie. Neben der Fotografie bin ich auch aktiv im Bereich der Videografie tätig, von packenden Imagefilmen bis zu aufmerksamkeitsstarken Werbepostings für soziale Medien.
                </p>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Antwortzeit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Ich antworte auf Anfragen in der Regel innerhalb von 24 Stunden. Für dringende Anfragen, 
                  rufen Sie mich bitte direkt an.
                </p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Erfahrung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>• 2 Jahre Erfahrung in Fotografie & Videografie</div>
                  <div>• Spezialisiert auf Reise-, Event- & Naturfotografie</div>
                  <div>• Videoproduktion für Imagefilme & Social Media</div>
                  <div>• Weltweit für Projekte verfügbar</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Häufig gestellte Fragen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Wie weit im Voraus sollte ich buchen?</h3>
              <p className="text-muted-foreground text-sm">
                Für größere Projekte und Reisen empfehle ich eine frühzeitige Anfrage. Porträtsitzungen sind oft auch kurzfristiger möglich.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Reisen Sie für Aufträge?</h3>
              <p className="text-muted-foreground text-sm">
                Ja! Ich bin weltweit für Projekte verfügbar. Für Aufträge außerhalb von München fallen Reisekosten an.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Wie lange dauert es bis zur Lieferung?</h3>
              <p className="text-muted-foreground text-sm">
                Fotogalerien sind meist innerhalb von 2-3 Wochen fertig. Videos benötigen je nach Umfang ca. 3-4 Wochen.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Was beinhalten Ihre Pakete?</h3>
              <p className="text-muted-foreground text-sm">
                Alle Pakete beinhalten professionelle Bearbeitung, eine Online-Galerie und Nutzungsrechte. Details variieren je nach Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}