import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact | Dio Pratama',
  description: 'Send Dio Pratama a message about your mobile app project.',
}

export default function ContactPage() {
  return <ContactForm />
}
