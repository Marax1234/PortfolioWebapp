"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, User, Clock, Award, CheckCircle, AlertCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100, 'Name zu lang'),
  email: z.string().email('Gültige Email ist erforderlich'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Betreff ist erforderlich').max(200, 'Betreff zu lang'),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen haben').max(2000, 'Nachricht zu lang'),
  category: z.enum(['NATURE', 'TRAVEL', 'EVENT', 'VIDEOGRAPHY', 'OTHER']).default('OTHER'),
  budgetRange: z.string().optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, {
    message: 'Datenschutzerklärung muss akzeptiert werden'
  })
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          category: data.category,
          budget: data.budgetRange,
          timeline: data.eventDate,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        reset()
      } else {
        const errorData = await response.json()
        setSubmitStatus('error')
        setErrorMessage(errorData.message || 'Ein Fehler ist aufgetreten')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-green-800 font-medium">Nachricht erfolgreich gesendet!</p>
                      <p className="text-green-700 text-sm">Vielen Dank für Ihre Anfrage. Ich melde mich innerhalb von 24 Stunden bei Ihnen.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-red-800 font-medium">Fehler beim Senden</p>
                      <p className="text-red-700 text-sm">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Vollständiger Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefon (Optional)</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      {...register('phone')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Betreff</Label>
                    <Input 
                      id="subject" 
                      type="text" 
                      placeholder="z.B. Hochzeitsfotografie, Imagefilm, etc."
                      {...register('subject')}
                      className={errors.subject ? 'border-red-500' : ''}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Service Kategorie</Label>
                    <select 
                      id="category"
                      {...register('category')}
                      className="w-full p-3 border rounded-md bg-background"
                    >
                      <option value="OTHER">Anderes</option>
                      <option value="NATURE">Naturfotografie</option>
                      <option value="TRAVEL">Reisefotografie</option>
                      <option value="EVENT">Eventfotografie</option>
                      <option value="VIDEOGRAPHY">Videografie/Imagefilm</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="budgetRange">Budget Rahmen (Optional)</Label>
                    <Input 
                      id="budgetRange" 
                      type="text" 
                      placeholder="z.B. 500-1000€, Nach Absprache"
                      {...register('budgetRange')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="eventDate">Event Datum (Optional)</Label>
                    <Input 
                      id="eventDate" 
                      type="date" 
                      {...register('eventDate')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Ort (Optional)</Label>
                    <Input 
                      id="location" 
                      type="text" 
                      placeholder="z.B. München, Online, etc."
                      {...register('location')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Projektbeschreibung</Label>
                    <Textarea 
                      id="message" 
                      rows={5}
                      placeholder="Bitte beschreiben Sie Ihr Projekt, Ihre Vision, spezielle Anforderungen und andere wichtige Details..."
                      {...register('message')}
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="gdprConsent"
                      {...register('gdprConsent')}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="gdprConsent" className="text-sm leading-relaxed cursor-pointer">
                        Ich stimme der Verarbeitung meiner personenbezogenen Daten gemäß der{' '}
                        <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                          Datenschutzerklärung
                        </a>{' '}
                        zu. Meine Daten werden ausschließlich zur Bearbeitung meiner Anfrage verwendet.
                      </Label>
                      {errors.gdprConsent && (
                        <p className="text-red-500 text-sm mt-1">{errors.gdprConsent.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Wird gesendet...' : 'Nachricht Senden'}
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
                  <span>mhiller2005@gmail.com</span>
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