import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { extractApiError } from '../../services/apiClient'
import { Alert, Button, Card, Input } from '../../components/ui'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setAlert('')
    setErrors({})

    try {
      await login(form.email, form.password)
      navigate('/admin', { replace: true })
    } catch (error) {
      const { message, errors: fieldErrors } = extractApiError(error)
      setAlert(message)
      setErrors(fieldErrors)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <Card className="w-full max-w-md border-navy-800 p-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-blue-600 uppercase">CMS Dashboard</p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">
            Admin<span className="text-blue-600">.Login</span>
          </h1>
          <p className="mt-2 text-sm text-slate-700">Masuk untuk mengelola konten.</p>
        </div>

        {alert && <Alert variant="danger" className="mb-6">{alert}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email?.[0]}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Masukkan password"
            value={form.password}
            onChange={handleChange}
            error={errors.password?.[0]}
          />
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-none"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Memuat...' : 'Masuk'}
          </Button>
        </form>
      </Card>
    </div>
  )
}