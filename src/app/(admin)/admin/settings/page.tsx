"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCurrentUser } from "@/components/auth/session-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Lock, 
  Settings, 
  Database,
  CheckCircle2, 
  AlertTriangle,
  Save,
  Eye,
  EyeOff
} from "lucide-react"

// Validation Schemas
const profileFormSchema = z.object({
  firstName: z.string().min(1, "Vorname ist erforderlich"),
  lastName: z.string().min(1, "Nachname ist erforderlich"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
})

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Aktuelles Passwort ist erforderlich"),
  newPassword: z.string().min(8, "Neues Passwort muss mindestens 8 Zeichen lang sein"),
  confirmPassword: z.string().min(1, "Passwort bestätigen ist erforderlich"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
})

const portfolioSettingsSchema = z.object({
  defaultStatus: z.enum(["DRAFT", "REVIEW", "PUBLISHED"]),
  defaultSortOrder: z.enum(["newest", "oldest", "alphabetical", "views"]),
  featuredItemsLimit: z.number().min(1).max(20),
})

type ProfileFormData = z.infer<typeof profileFormSchema>
type PasswordFormData = z.infer<typeof passwordFormSchema>
type PortfolioSettingsData = z.infer<typeof portfolioSettingsSchema>

export default function SettingsPage() {
  const { user } = useCurrentUser()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Profile Form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  })

  // Password Form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Portfolio Settings Form
  const portfolioForm = useForm<PortfolioSettingsData>({
    resolver: zodResolver(portfolioSettingsSchema),
    defaultValues: {
      defaultStatus: "DRAFT",
      defaultSortOrder: "newest",
      featuredItemsLimit: 6,
    },
  })

  // Load existing portfolio settings
  useEffect(() => {
    const loadPortfolioSettings = async () => {
      try {
        const response = await fetch('/api/settings/portfolio')
        if (response.ok) {
          const data = await response.json()
          if (data.settings) {
            portfolioForm.reset(data.settings)
          }
        }
      } catch (error) {
        console.error('Failed to load portfolio settings:', error)
      }
    }

    loadPortfolioSettings()
  }, [portfolioForm])

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil erfolgreich aktualisiert' })
      } else {
        setMessage({ type: 'error', text: 'Fehler beim Aktualisieren des Profils' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Netzwerkfehler beim Aktualisieren des Profils' })
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Passwort erfolgreich geändert' })
        passwordForm.reset()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Fehler beim Ändern des Passworts' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Netzwerkfehler beim Ändern des Passworts' })
    } finally {
      setIsLoading(false)
    }
  }

  const onPortfolioSubmit = async (data: PortfolioSettingsData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/settings/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Portfolio-Einstellungen gespeichert' })
      } else {
        setMessage({ type: 'error', text: 'Fehler beim Speichern der Portfolio-Einstellungen' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Netzwerkfehler beim Speichern der Einstellungen' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Einstellungen</h1>
        <p className="text-slate-600 mt-2">
          Verwalten Sie Ihr Profil und die Portfolio-Einstellungen
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'error' ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil-Einstellungen
            </CardTitle>
            <CardDescription>
              Aktualisieren Sie Ihre persönlichen Informationen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vorname</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nachname</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Mail-Adresse</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ihre E-Mail-Adresse für Anmeldung und Benachrichtigungen
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Speichern...' : 'Profil speichern'}
                  </Button>
                  {user?.emailVerified ? (
                    <Badge variant="secondary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      E-Mail verifiziert
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      E-Mail nicht verifiziert
                    </Badge>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Passwort ändern
            </CardTitle>
            <CardDescription>
              Aktualisieren Sie Ihr Passwort für mehr Sicherheit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aktuelles Passwort</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Neues Passwort</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Mindestens 8 Zeichen
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort bestätigen</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  <Lock className="h-4 w-4 mr-2" />
                  {isLoading ? 'Ändern...' : 'Passwort ändern'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Portfolio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Portfolio-Einstellungen
            </CardTitle>
            <CardDescription>
              Standard-Einstellungen für neue Portfolio-Inhalte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...portfolioForm}>
              <form onSubmit={portfolioForm.handleSubmit(onPortfolioSubmit)} className="space-y-4">
                <FormField
                  control={portfolioForm.control}
                  name="defaultStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standard-Status für neue Inhalte</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Entwurf</SelectItem>
                          <SelectItem value="REVIEW">Zur Überprüfung</SelectItem>
                          <SelectItem value="PUBLISHED">Veröffentlicht</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Neuer Inhalt wird mit diesem Status erstellt
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={portfolioForm.control}
                  name="defaultSortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standard-Sortierung</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sortierung wählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="newest">Neueste zuerst</SelectItem>
                          <SelectItem value="oldest">Älteste zuerst</SelectItem>
                          <SelectItem value="alphabetical">Alphabetisch</SelectItem>
                          <SelectItem value="views">Nach Aufrufen</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Standard-Reihenfolge für Portfolio-Anzeige
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={portfolioForm.control}
                  name="featuredItemsLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximale Anzahl hervorgehobener Inhalte</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          {...field}
                          value={field.value.toString()}
                          onChange={(e) => {
                            const value = e.target.value
                            const parsed = parseInt(value)
                            field.onChange(isNaN(parsed) ? 1 : parsed)
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Wie viele Inhalte gleichzeitig hervorgehoben werden können (1-20)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Speichern...' : 'Einstellungen speichern'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System-Informationen
            </CardTitle>
            <CardDescription>
              Aktuelle System- und Account-Informationen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Benutzer-ID</span>
                  <Badge variant="secondary">{user?.id}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Rolle</span>
                  <Badge variant="default">{user?.role}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">E-Mail-Status</span>
                  {user?.emailVerified ? (
                    <Badge variant="secondary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verifiziert
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Nicht verifiziert
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Session-Status</span>
                  <Badge variant="secondary">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Aktiv
                  </Badge>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-slate-500">
                  System läuft ordnungsgemäß. Alle Services sind verfügbar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}