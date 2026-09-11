import { useState } from 'react'
import { useUploadMedia } from '../../hooks/useAdminMutations'
import { extractApiError } from '../../services/apiClient'
import { Button, Modal, Input, FormActions } from '../../components/ui'
import { useToast } from '../../components/ui'

export function MediaUploader({ onUploaded }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [altText, setAltText] = useState('')
  const [collection, setCollection] = useState('default')
  const [errors, setErrors] = useState({})
  
  const mutation = useUploadMedia()
  const toast = useToast()

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null)
    setErrors(p => ({ ...p, file: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setErrors({ file: ['Pilih file terlebih dahulu.'] })
      return
    }

    setErrors({})
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt_text', altText)
      formData.append('collection', collection)

      await mutation.mutateAsync(formData)
      toast.success('Media berhasil diunggah.')
      setOpen(false)
      setFile(null)
      setAltText('')
      setCollection('default')
      onUploaded?.()
    } catch (error) {
      const { message, errors: fieldErrors } = extractApiError(error)
      toast.error(message)
      setErrors(fieldErrors)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Upload Media</Button>
      <Modal open={open} onClose={() => !mutation.isPending && setOpen(false)} title="Upload Media">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Pilih Gambar</label>
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/webp,image/gif" 
              onChange={handleFileChange}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-navy-900 transition-colors duration-150 focus:border-blue-500 disabled:opacity-50 ${errors.file ? 'border-red-500' : 'border-slate-300'}`}
              disabled={mutation.isPending}
            />
            <p className="mt-1 text-xs text-slate-600">Maks. 2MB (jpg, png, webp, gif)</p>
            {errors.file && <p role="alert" className="mt-1 text-xs text-red-600">{errors.file[0]}</p>}
          </div>
          
          <Input 
            label="Alt Text (SEO)" 
            value={altText} 
            onChange={(e) => { setAltText(e.target.value); setErrors(p => ({ ...p, alt_text: '' })) }} 
            error={errors.alt_text?.[0]} 
            disabled={mutation.isPending} 
            hint="Deskripsi gambar untuk aksesibilitas dan SEO."
          />
          
          <Input 
            label="Koleksi" 
            value={collection} 
            onChange={(e) => { setCollection(e.target.value); setErrors(p => ({ ...p, collection: '' })) }} 
            error={errors.collection?.[0]} 
            disabled={mutation.isPending} 
            hint="Contoh: thumbnail, gallery, cover, profile_photo"
          />

          <FormActions submitLabel="Upload" onCancel={() => setOpen(false)} loading={mutation.isPending} />
        </form>
      </Modal>
    </>
  )
}