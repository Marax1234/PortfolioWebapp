'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Award,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich').max(100, 'Name zu lang'),
  email: z.string().email('Gültige Email ist erforderlich'),
  phone: z.string().optional(),
  subject: z
    .string()
    .min(1, 'Betreff ist erforderlich')
    .max(200, 'Betreff zu lang'),
  message: z
    .string()
    .min(10, 'Nachricht muss mindestens 10 Zeichen haben')
    .max(2000, 'Nachricht zu lang'),
  category: z
    .enum(['NATURE', 'TRAVEL', 'EVENT', 'VIDEOGRAPHY', 'OTHER'])
    .default('OTHER'),
  budgetRange: z.string().optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  gdprConsent: z.boolean().refine(val => val === true, {
    message: 'Datenschutzerklärung muss akzeptiert werden',
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

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
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setErrorMessage(errorData.message || 'Ein Fehler ist aufgetreten');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(
        'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen py-12'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-4xl font-bold md:text-5xl'>Kontakt</h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
            Hallo! Ich bin Kilian Siebert, ein visueller Geschichtenerzähler mit
            einer Leidenschaft für Fotografie und Videografie. Lassen Sie uns
            gemeinsam Ihre Geschichte erzählen!
          </p>
        </div>

        <div className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
          {/* Contact Form */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Nachricht Senden</CardTitle>
              </CardHeader>
              <CardContent>
                {submitStatus === 'success' && (
                  <Alert className='mb-6 border-green-200 bg-green-50'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                    <AlertTitle className='text-green-800'>
                      Nachricht erfolgreich gesendet!
                    </AlertTitle>
                    <AlertDescription className='text-green-700'>
                      Vielen Dank für Ihre Anfrage. Ich melde mich innerhalb von
                      24 Stunden bei Ihnen.
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === 'error' && (
                  <Alert variant='destructive' className='mb-6'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertTitle>Fehler beim Senden</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div>
                    <Label htmlFor='name' className='mb-2'>
                      Vollständiger Name
                    </Label>
                    <Input
                      id='name'
                      type='text'
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className='mt-1 text-sm text-red-500'>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='email' className='mb-2'>
                      Email
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className='mt-1 text-sm text-red-500'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='phone' className='mb-2'>
                      Telefon (Optional)
                    </Label>
                    <Input id='phone' type='tel' {...register('phone')} />
                  </div>

                  <div>
                    <Label htmlFor='subject' className='mb-2'>
                      Betreff
                    </Label>
                    <Input
                      id='subject'
                      type='text'
                      placeholder='z.B. Hochzeitsfotografie, Imagefilm, etc.'
                      {...register('subject')}
                      className={errors.subject ? 'border-red-500' : ''}
                    />
                    {errors.subject && (
                      <p className='mt-1 text-sm text-red-500'>
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='category' className='mb-2'>
                      Service Kategorie
                    </Label>
                    <Select {...register('category')} defaultValue='OTHER'>
                      <SelectTrigger>
                        <SelectValue placeholder='Wählen Sie eine Kategorie' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='OTHER'>Anderes</SelectItem>
                        <SelectItem value='NATURE'>Naturfotografie</SelectItem>
                        <SelectItem value='TRAVEL'>Reisefotografie</SelectItem>
                        <SelectItem value='EVENT'>Eventfotografie</SelectItem>
                        <SelectItem value='VIDEOGRAPHY'>
                          Videografie/Imagefilm
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className='mt-1 text-sm text-red-500'>
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor='budgetRange' className='mb-2'>
                      Budget Rahmen (Optional)
                    </Label>
                    <Input
                      id='budgetRange'
                      type='text'
                      placeholder='z.B. 500-1000€, Nach Absprache'
                      {...register('budgetRange')}
                    />
                  </div>

                  <div>
                    <Label htmlFor='eventDate' className='mb-2'>
                      Event Datum (Optional)
                    </Label>
                    <Input
                      id='eventDate'
                      type='date'
                      {...register('eventDate')}
                    />
                  </div>

                  <div>
                    <Label htmlFor='location' className='mb-2'>
                      Ort (Optional)
                    </Label>
                    <Input
                      id='location'
                      type='text'
                      placeholder='z.B. München, Online, etc.'
                      {...register('location')}
                    />
                  </div>

                  <div>
                    <Label htmlFor='message' className='mb-2'>
                      Projektbeschreibung
                    </Label>
                    <Textarea
                      id='message'
                      rows={5}
                      placeholder='Bitte beschreiben Sie Ihr Projekt, Ihre Vision, spezielle Anforderungen und andere wichtige Details...'
                      {...register('message')}
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className='mt-1 text-sm text-red-500'>
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className='flex items-start space-x-3'>
                    <Checkbox
                      id='gdprConsent'
                      {...register('gdprConsent')}
                      className='mt-1'
                    />
                    <div className='grid gap-1.5 leading-none'>
                      <Label
                        htmlFor='gdprConsent'
                        className='cursor-pointer text-sm leading-relaxed'
                      >
                        Ich stimme der Verarbeitung meiner personenbezogenen
                        Daten gemäß der{' '}
                        <a
                          href='/privacy'
                          className='text-blue-600 hover:underline'
                          target='_blank'
                        >
                          Datenschutzerklärung
                        </a>{' '}
                        zu. Meine Daten werden ausschließlich zur Bearbeitung
                        meiner Anfrage verwendet.
                      </Label>
                      {errors.gdprConsent && (
                        <p className='mt-1 text-sm text-red-500'>
                          {errors.gdprConsent.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type='submit'
                    className='w-full'
                    size='lg'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Wird gesendet...' : 'Nachricht Senden'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className='space-y-6'>
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Mail className='h-5 w-5' />
                  Kontaktinformationen
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <Phone className='text-muted-foreground h-4 w-4' />
                  <span>+49 1514 1200330</span>
                </div>
                <div className='flex items-center gap-3'>
                  <Mail className='text-muted-foreground h-4 w-4' />
                  <span>mhiller2005@gmail.com</span>
                </div>
                <div className='flex items-center gap-3'>
                  <MapPin className='text-muted-foreground h-4 w-4' />
                  <span>Munich, Germany</span>
                </div>
              </CardContent>
            </Card>

            {/* About Me */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  Über Mich
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  Ich bin ein 20-jähriger visueller Geschichtenerzähler mit
                  einer brennenden Leidenschaft für Fotografie und Videografie.
                  Was als neugieriges Ausprobieren begann, hat sich schnell zu
                  einer tiefen Passion entwickelt.
                  <br />
                  <br />
                  Besonders begeistert mich die Vielfalt der Reise-, Event- und
                  Naturfotografie. Neben der Fotografie bin ich auch aktiv im
                  Bereich der Videografie tätig, von packenden Imagefilmen bis
                  zu aufmerksamkeitsstarken Werbepostings für soziale Medien.
                </p>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5' />
                  Antwortzeit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  Ich antworte auf Anfragen in der Regel innerhalb von 24
                  Stunden. Für dringende Anfragen, rufen Sie mich bitte direkt
                  an.
                </p>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Award className='h-5 w-5' />
                  Erfahrung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-muted-foreground space-y-2 text-sm'>
                  <div>• 2 Jahre Erfahrung in Fotografie & Videografie</div>
                  <div>
                    • Spezialisiert auf Reise-, Event- & Naturfotografie
                  </div>
                  <div>• Videoproduktion für Imagefilme & Social Media</div>
                  <div>• Weltweit für Projekte verfügbar</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className='mt-16'>
          <h2 className='mb-8 text-center text-2xl font-bold'>
            Häufig gestellte Fragen
          </h2>
          <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <h3 className='mb-2 font-semibold'>
                Wie weit im Voraus sollte ich buchen?
              </h3>
              <p className='text-muted-foreground text-sm'>
                Für größere Projekte und Reisen empfehle ich eine frühzeitige
                Anfrage. Porträtsitzungen sind oft auch kurzfristiger möglich.
              </p>
            </div>
            <div>
              <h3 className='mb-2 font-semibold'>Reisen Sie für Aufträge?</h3>
              <p className='text-muted-foreground text-sm'>
                Ja! Ich bin weltweit für Projekte verfügbar. Für Aufträge
                außerhalb von München fallen Reisekosten an.
              </p>
            </div>
            <div>
              <h3 className='mb-2 font-semibold'>
                Wie lange dauert es bis zur Lieferung?
              </h3>
              <p className='text-muted-foreground text-sm'>
                Fotogalerien sind meist innerhalb von 2-3 Wochen fertig. Videos
                benötigen je nach Umfang ca. 3-4 Wochen.
              </p>
            </div>
            <div>
              <h3 className='mb-2 font-semibold'>
                Was beinhalten Ihre Pakete?
              </h3>
              <p className='text-muted-foreground text-sm'>
                Alle Pakete beinhalten professionelle Bearbeitung, eine
                Online-Galerie und Nutzungsrechte. Details variieren je nach
                Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
