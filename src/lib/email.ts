/**
 * Email Service for Kilian Siebert Portfolio
 * Handles contact form submissions and admin notifications
 */
import nodemailer from 'nodemailer';

import { Logger } from '@/lib/logger';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
  budget?: string;
  timeline?: string;
}

/**
 * Email transporter configuration
 * Uses Gmail SMTP - can be switched to other providers
 */
const createTransporter = () => {
  // For development, use Ethereal Email (testing service)
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
    Logger.warn('Using simulated email service for development');
    return null; // Return null to simulate email sending
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send email using configured transporter
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const transporter = createTransporter();

  // For development without SMTP config, just log the email
  if (!transporter) {
    Logger.info('Simulated email send (development mode)', {
      to: options.to,
      subject: options.subject,
      hasHtml: !!options.html,
      hasText: !!options.text,
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Simulate occasional failures (5% in development)
    if (Math.random() < 0.05) {
      throw new Error('Simulated email service error for testing');
    }

    return;
  }

  const emailOptions = {
    from:
      options.from ||
      process.env.EMAIL_FROM ||
      'noreply@kiliansiebertphotography.com',
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
  };

  try {
    const info = await transporter.sendMail(emailOptions);
    Logger.info('Email sent successfully', {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
      accepted: info.accepted,
      rejected: info.rejected,
    });
  } catch (error) {
    Logger.error('Failed to send email', {
      error: error instanceof Error ? error.message : String(error),
      to: options.to,
      subject: options.subject,
    });
    throw error;
  }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactFormNotification(
  data: ContactFormData,
  inquiryId: string
): Promise<void> {
  const categoryLabels: Record<string, string> = {
    NATURE: 'Naturfotografie',
    TRAVEL: 'Reisefotografie',
    EVENT: 'Eventfotografie',
    VIDEOGRAPHY: 'Videografie',
    OTHER: 'Anderes',
  };

  const adminEmail: EmailOptions = {
    to: process.env.ADMIN_EMAIL || 'mhiller2005@gmail.com',
    subject: `🎯 Neue Kontaktanfrage: ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .footer { background: #1e293b; color: white; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1e293b; }
          .value { margin-top: 5px; padding: 8px; background: white; border-radius: 4px; }
          .message { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 15px 0; }
          .priority { background: #fef3c7; border: 1px solid #f59e0b; padding: 8px; border-radius: 4px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Neue Kontaktanfrage eingegangen</h1>
            <p>Eine neue Anfrage ist über das Portfolio-Kontaktformular eingegangen.</p>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">👤 Kontaktdaten:</div>
              <div class="value">
                <strong>Name:</strong> ${data.name}<br>
                <strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a><br>
                ${data.phone ? `<strong>Telefon:</strong> <a href="tel:${data.phone}">${data.phone}</a><br>` : ''}
              </div>
            </div>

            <div class="field">
              <div class="label">📝 Anfrage Details:</div>
              <div class="value">
                <strong>Betreff:</strong> ${data.subject}<br>
                <strong>Kategorie:</strong> ${categoryLabels[data.category] || data.category}<br>
                ${data.budget ? `<strong>Budget:</strong> ${data.budget}<br>` : ''}
                ${data.timeline ? `<strong>Timeline:</strong> ${data.timeline}<br>` : ''}
              </div>
            </div>

            <div class="field">
              <div class="label">💬 Nachricht:</div>
              <div class="message">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="field">
              <div class="label">🆔 System Info:</div>
              <div class="value">
                <strong>Inquiry ID:</strong> ${inquiryId}<br>
                <strong>Eingegangen am:</strong> ${new Date().toLocaleString('de-DE')}<br>
                <strong>Status:</strong> <span class="priority">Neu - Antwort erforderlich</span>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 4px;">
              <strong>⚡ Schnellaktionen:</strong><br>
              <a href="${process.env.NEXTAUTH_URL}/admin/inquiries" style="color: #2563eb;">→ Zur Admin-Verwaltung</a><br>
              <a href="mailto:${data.email}?subject=Re: ${data.subject}" style="color: #2563eb;">→ Direkt antworten</a>
            </div>
          </div>
          
          <div class="footer">
            <p>📧 Diese Benachrichtigung wurde automatisch vom Portfolio-System generiert.</p>
            <p>🎯 Antworten Sie zeitnah auf Kundenanfragen für beste Service-Qualität.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await sendEmail(adminEmail);
}

/**
 * Send auto-reply confirmation to customer
 */
export async function sendContactFormConfirmation(
  data: ContactFormData,
  inquiryId: string
): Promise<void> {
  const categoryLabels: Record<string, string> = {
    NATURE: 'Naturfotografie',
    TRAVEL: 'Reisefotografie',
    EVENT: 'Eventfotografie',
    VIDEOGRAPHY: 'Videografie',
    OTHER: 'Anderes',
  };

  const confirmationEmail: EmailOptions = {
    to: data.email,
    subject: '✅ Ihre Anfrage wurde empfangen - Kilian Siebert Photography',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .footer { background: #1e293b; color: white; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; }
          .summary { background: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .contact-info { background: #dbeafe; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .next-steps { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Vielen Dank für Ihre Anfrage!</h1>
            <p>Hallo ${data.name}, Ihre Nachricht ist bei mir eingegangen.</p>
          </div>
          
          <div class="content">
            <p>vielen Dank für Ihr Interesse an meinen Fotografie- und Videografie-Services! Ihre Anfrage wurde erfolgreich übermittelt und ich werde mich <strong>innerhalb von 24 Stunden</strong> bei Ihnen melden.</p>

            <div class="summary">
              <h3>📋 Ihre Anfrage im Überblick:</h3>
              <p><strong>Betreff:</strong> ${data.subject}</p>
              <p><strong>Kategorie:</strong> ${categoryLabels[data.category] || data.category}</p>
              ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
              ${data.timeline ? `<p><strong>Gewünschter Termin:</strong> ${data.timeline}</p>` : ''}
              <p><strong>Referenz-ID:</strong> ${inquiryId}</p>
            </div>

            <div class="next-steps">
              <h3>⏰ Wie geht es weiter?</h3>
              <ol>
                <li><strong>Schnelle Antwort:</strong> Ich melde mich innerhalb von 24 Stunden</li>
                <li><strong>Persönliches Gespräch:</strong> Wir besprechen Ihr Projekt im Detail</li>
                <li><strong>Individuelles Angebot:</strong> Sie erhalten ein maßgeschneidertes Angebot</li>
              </ol>
            </div>

            <div class="contact-info">
              <h3>📞 Direkte Kontaktmöglichkeiten:</h3>
              <p><strong>Telefon:</strong> <a href="tel:+4915141200330">+49 1514 1200330</a></p>
              <p><strong>Email:</strong> <a href="mailto:mhiller2005@gmail.com">mhiller2005@gmail.com</a></p>
              <p><strong>Standort:</strong> München, Deutschland</p>
              <p><em>Bei dringenden Anfragen können Sie mich gerne direkt anrufen!</em></p>
            </div>

            <h3>🎯 Über mich:</h3>
            <p>Ich bin ein 20-jähriger visueller Geschichtenerzähler mit einer brennenden Leidenschaft für Fotografie und Videografie. Besonders begeistert mich die Vielfalt der Reise-, Event- und Naturfotografie sowie die Videoproduktion für Imagefilme und Social Media.</p>

            <p>Ich freue mich darauf, Ihre Geschichte zu erzählen! 📸</p>
          </div>
          
          <div class="footer">
            <p>🎨 <strong>Kilian Siebert</strong> - Visual Storyteller</p>
            <p>📧 Diese Email wurde automatisch generiert. Bitte antworten Sie nicht auf diese Email.</p>
            <p>📝 Referenz-ID: ${inquiryId}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await sendEmail(confirmationEmail);
}

/**
 * Send custom reply from admin to customer
 */
export async function sendCustomReply(
  inquiry: any,
  replyMessage: string,
  adminName = 'Kilian Siebert'
): Promise<void> {
  const categoryLabels: Record<string, string> = {
    NATURE: 'Naturfotografie',
    TRAVEL: 'Reisefotografie',
    EVENT: 'Eventfotografie',
    VIDEOGRAPHY: 'Videografie',
    OTHER: 'Anderes',
  };

  const replyEmail: EmailOptions = {
    to: inquiry.email,
    subject: `Re: ${inquiry.subject} - Antwort von Kilian Siebert Photography`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
          .footer { background: #1e293b; color: white; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; }
          .reply { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .original { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .contact-info { background: #ecfdf5; padding: 15px; border-radius: 4px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Antwort auf Ihre Anfrage</h1>
            <p>Hallo ${inquiry.name}, hier ist meine persönliche Antwort auf Ihre Anfrage.</p>
          </div>
          
          <div class="content">
            <div class="reply">
              <h3>📝 Meine Antwort:</h3>
              ${replyMessage.replace(/\n/g, '<br>')}
            </div>

            <div class="contact-info">
              <h3>📞 Für weitere Fragen:</h3>
              <p><strong>Telefon:</strong> <a href="tel:+4915141200330">+49 1514 1200330</a></p>
              <p><strong>Email:</strong> <a href="mailto:mhiller2005@gmail.com">mhiller2005@gmail.com</a></p>
              <p><em>Sie können gerne jederzeit auf diese Email antworten oder mich direkt kontaktieren.</em></p>
            </div>

            <div class="original">
              <h3>📋 Ihre ursprüngliche Anfrage:</h3>
              <p><strong>Datum:</strong> ${new Date(inquiry.createdAt).toLocaleString('de-DE')}</p>
              <p><strong>Betreff:</strong> ${inquiry.subject}</p>
              <p><strong>Kategorie:</strong> ${categoryLabels[inquiry.category] || inquiry.category}</p>
              ${inquiry.budgetRange ? `<p><strong>Budget:</strong> ${inquiry.budgetRange}</p>` : ''}
              ${inquiry.eventDate ? `<p><strong>Event Datum:</strong> ${new Date(inquiry.eventDate).toLocaleDateString('de-DE')}</p>` : ''}
              <hr style="margin: 10px 0;">
              <p><strong>Ihre Nachricht:</strong></p>
              <p style="font-style: italic;">${inquiry.message}</p>
              <p><strong>Referenz-ID:</strong> ${inquiry.id}</p>
            </div>

            <p>Ich freue mich auf die weitere Zusammenarbeit mit Ihnen! 🎯</p>
          </div>
          
          <div class="footer">
            <p>🎨 <strong>${adminName}</strong> - Visual Storyteller</p>
            <p>📧 München, Deutschland | Tel: +49 1514 1200330</p>
            <p>💼 Spezialisiert auf Reise-, Event- & Naturfotografie sowie Videoproduktion</p>
          </div>
        </div>
      </body>
      </html>
    `,
    from: process.env.EMAIL_FROM || 'mhiller2005@gmail.com',
  };

  await sendEmail(replyEmail);
}
