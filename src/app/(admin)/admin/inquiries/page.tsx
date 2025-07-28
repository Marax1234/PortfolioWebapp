"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Euro,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Reply
} from "lucide-react"

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  category: 'NATURE' | 'TRAVEL' | 'EVENT' | 'VIDEOGRAPHY' | 'OTHER'
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  budgetRange?: string
  eventDate?: string
  location?: string
  createdAt: string
  updatedAt: string
}

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800'
}

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800'
}

const categoryLabels = {
  NATURE: 'Naturfotografie',
  TRAVEL: 'Reisefotografie',
  EVENT: 'Eventfotografie',
  VIDEOGRAPHY: 'Videografie',
  OTHER: 'Anderes'
}

const statusLabels = {
  NEW: 'Neu',
  IN_PROGRESS: 'In Bearbeitung',
  RESOLVED: 'Beantwortet',
  CLOSED: 'Geschlossen'
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/inquiries')
      if (!response.ok) throw new Error('Failed to fetch inquiries')
      
      const data = await response.json()
      setInquiries(data.inquiries || [])
    } catch (err) {
      setError('Fehler beim Laden der Anfragen')
      console.error('Failed to fetch inquiries:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        await fetchInquiries()
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry(prev => prev ? { ...prev, status: status as any } : null)
        }
      }
    } catch (err) {
      console.error('Failed to update inquiry status:', err)
    }
  }

  const sendReply = async (inquiryId: string) => {
    if (!replyText.trim()) return
    
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText })
      })
      
      if (response.ok) {
        setReplyText('')
        await updateInquiryStatus(inquiryId, 'RESOLVED')
      }
    } catch (err) {
      console.error('Failed to send reply:', err)
    }
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Lade Anfragen...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kontaktanfragen</h1>
          <p className="text-muted-foreground">Verwalten Sie eingehende Kundenanfragen</p>
        </div>
        <Button onClick={fetchInquiries} variant="outline">
          Aktualisieren
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen nach Name, Email oder Betreff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">Alle Status</option>
            <option value="NEW">Neu</option>
            <option value="IN_PROGRESS">In Bearbeitung</option>
            <option value="RESOLVED">Beantwortet</option>
            <option value="CLOSED">Geschlossen</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Gesamt</p>
                <p className="text-2xl font-bold">{inquiries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Neu</p>
                <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'NEW').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">In Bearbeitung</p>
                <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'IN_PROGRESS').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">Beantwortet</p>
                <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'RESOLVED').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredInquiries.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Keine Anfragen gefunden</p>
              </CardContent>
            </Card>
          ) : (
            filteredInquiries.map((inquiry) => (
              <Card 
                key={inquiry.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedInquiry?.id === inquiry.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedInquiry(inquiry)}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{inquiry.name}</h3>
                        <Badge className={statusColors[inquiry.status]}>
                          {statusLabels[inquiry.status]}
                        </Badge>
                        <Badge className={priorityColors[inquiry.priority]}>
                          {inquiry.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {inquiry.phone}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm font-medium mb-1">{inquiry.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {inquiry.message}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>{categoryLabels[inquiry.category]}</span>
                        {inquiry.budgetRange && (
                          <div className="flex items-center gap-1">
                            <Euro className="h-3 w-3" />
                            {inquiry.budgetRange}
                          </div>
                        )}
                        {inquiry.eventDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(inquiry.eventDate).toLocaleDateString('de-DE')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-right">
                      {new Date(inquiry.createdAt).toLocaleDateString('de-DE')}
                      <br />
                      {new Date(inquiry.createdAt).toLocaleTimeString('de-DE', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Inquiry Detail Panel */}
        <div className="space-y-4">
          {selectedInquiry ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Anfrage Details</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedInquiry(null)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Kontakt</Label>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-3 w-3" />
                        {selectedInquiry.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                          {selectedInquiry.email}
                        </a>
                      </div>
                      {selectedInquiry.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          <a href={`tel:${selectedInquiry.phone}`} className="text-blue-600 hover:underline">
                            {selectedInquiry.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Betreff</Label>
                    <p className="mt-1 text-sm">{selectedInquiry.subject}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Nachricht</Label>
                    <p className="mt-1 text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>

                  {selectedInquiry.budgetRange && (
                    <div>
                      <Label className="text-sm font-medium">Budget</Label>
                      <p className="mt-1 text-sm">{selectedInquiry.budgetRange}</p>
                    </div>
                  )}

                  {selectedInquiry.eventDate && (
                    <div>
                      <Label className="text-sm font-medium">Event Datum</Label>
                      <p className="mt-1 text-sm">
                        {new Date(selectedInquiry.eventDate).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  )}

                  {selectedInquiry.location && (
                    <div>
                      <Label className="text-sm font-medium">Ort</Label>
                      <p className="mt-1 text-sm">{selectedInquiry.location}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium">Status ändern</Label>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
                        <Button
                          key={status}
                          size="sm"
                          variant={selectedInquiry.status === status ? 'default' : 'outline'}
                          onClick={() => updateInquiryStatus(selectedInquiry.id, status)}
                        >
                          {statusLabels[status as keyof typeof statusLabels]}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reply Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Reply className="h-4 w-4" />
                    Schnellantwort
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="reply">Antwort schreiben</Label>
                    <Textarea
                      id="reply"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Ihre Antwort an den Kunden..."
                      rows={4}
                    />
                  </div>
                  <Button 
                    onClick={() => sendReply(selectedInquiry.id)}
                    disabled={!replyText.trim()}
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Antwort senden
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Die Antwort wird an {selectedInquiry.email} gesendet und der Status auf "Beantwortet" gesetzt.
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Wählen Sie eine Anfrage aus der Liste aus</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}