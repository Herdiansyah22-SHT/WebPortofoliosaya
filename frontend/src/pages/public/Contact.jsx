import { useState } from 'react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { siteUrl } from '../../lib/seo'
import { publicApi } from '../../services/public'
import { extractApiError } from '../../services/apiClient'
import { Alert, Button, Card, Input, Textarea } from '../../components/ui'
import { SectionHeading } from '../../components/common/SectionHeading'

export default function Contact() {
  useDocumentMeta({ title: 'Kontak — Achmad Herdiansyah', description: 'Hubungi saya untuk kolaborasi.', canonical: siteUrl('/contact'), })

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('') // '' | 'loading' | 'success' | 'error'
  const [alert, setAlert] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setAlert('')

    try {
      await publicApi.contact(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      const { message, errors: fieldErrors } = extractApiError(error)
      setStatus('error')
      setAlert(message)
      setErrors(fieldErrors)
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <SectionHeading eyebrow="Contact" title="Hubungi saya" description="Punya pertanyaan atau project? Kirim pesan, saya akan membalas secepatnya." />

      <Card className="mt-10 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-700 hover:shadow-[0_0_25px_rgba(11,165,233,0.15)]">
        {status === 'success' && (
          <Alert variant="success" className="mb-6">
            Pesan terkirim! Terima kasih sudah menghubungi saya.
          </Alert>
        )}
        {status === 'error' && <Alert variant="danger" className="mb-6">{alert}</Alert>}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Nama"
              name="name"
              placeholder="Nama kamu"
              required
              value={form.name}
              onChange={handleChange}
              error={errors.name?.[0]}
              disabled={status === 'loading'}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="email@example.com"
              required
              value={form.email}
              onChange={handleChange}
              error={errors.email?.[0]}
              disabled={status === 'loading'}
            />
            <Input
              label="Subjek"
              name="subject"
              placeholder="Topik pesan"
              required
              className="sm:col-span-2"
              value={form.subject}
              onChange={handleChange}
              error={errors.subject?.[0]}
              disabled={status === 'loading'}
            />
            <Textarea
              label="Pesan"
              name="message"
              rows={5}
              placeholder="Tulis pesan kamu…"
              required
              className="sm:col-span-2"
              value={form.message}
              onChange={handleChange}
              error={errors.message?.[0]}
              disabled={status === 'loading'}
            />
          </div>

          <div className="mt-6">
            <Button type="submit" size="lg" loading={status === 'loading'} disabled={status === 'loading'}>
              {status === 'loading' ? 'Mengirim…' : 'Kirim Pesan'}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  )
}
