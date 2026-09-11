import { useState, useEffect } from 'react'
import { ImageField } from '../../features/media/ImageField'
import { Modal, Input, Textarea, Select, Checkbox, Toggle, FormActions } from './index'

export function ResourceModalForm({
  open,
  onClose,
  title,
  fields,
  initialData,
  onSubmit,
  isPending,
  apiErrors
}) {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(initialData || {})
      setErrors({})
    }
  }, [open, initialData])

  useEffect(() => {
    if (apiErrors) setErrors(apiErrors)
  }, [apiErrors])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm(p => ({ ...p, [name]: val }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleToggle = (name, value) => {
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal open={open} onClose={() => !isPending && onClose()} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="max-h-[60vh] overflow-y-auto space-y-4 px-1 py-2">
          {fields.map((field) => {
            const err = errors[field.name]?.[0]
            if (field.type === 'textarea') {
              return <Textarea key={field.name} label={field.label} name={field.name} value={form[field.name] ?? ''} onChange={handleChange} error={err} hint={field.hint} required={field.required} />
            }
            if (field.type === 'select') {
              return (
                <Select key={field.name} label={field.label} name={field.name} value={form[field.name] ?? ''} onChange={handleChange} error={err} hint={field.hint} required={field.required}>
                  {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              )
            }
            if (field.type === 'toggle') {
              return <Toggle key={field.name} label={field.label} checked={form[field.name] ?? field.default ?? false} onChange={(v) => handleToggle(field.name, v)} hint={field.hint} />
            }
            if (field.type === 'checkbox') {
              return <Checkbox key={field.name} label={field.label} name={field.name} checked={form[field.name] ?? false} onChange={handleChange} error={err} hint={field.hint} />
            }
            if (field.type === 'image') {
              return (
                <ImageField
                  key={field.name}
                  label={field.label}
                  currentUrl={field.currentUrl || undefined}
                  hint={field.hint}
                  onChange={(mediaId) => handleToggle(field.name, mediaId)}
                />
              )
            }

            return <Input key={field.name} label={field.label} name={field.name} type={field.type || 'text'} value={form[field.name] ?? ''} onChange={handleChange} error={err} hint={field.hint} required={field.required} />
          })}
        </div>
        <FormActions submitLabel="Simpan" onCancel={onClose} loading={isPending} />
      </form>
    </Modal>
  )
}