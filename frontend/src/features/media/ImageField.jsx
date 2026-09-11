import { useRef, useState } from 'react'
import { adminApi } from '../../services/admin'
import { extractApiError } from '../../services/apiClient'
import { useToast } from '../../hooks/useToast'
import { Button } from '../../components/ui'

/**
 * ImageField — upload/ganti/hapus satu gambar, nilai yang dikirim = media id.
 * onChange(mediaId | null) dipanggil setelah upload/hapus.
 */
export function ImageField({ label, currentUrl, onChange, hint, className = '' }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(currentUrl || '')
  const [uploading, setUploading] = useState(false)
  const toast = useToast()

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('collection', 'temporary')

      const body = await adminApi.uploadMedia(formData)
      setPreview(URL.createObjectURL(file))
      onChange(body.data.id)
      toast.success('Gambar diunggah. Simpan untuk menerapkan.')
    } catch (error) {
      toast.error(extractApiError(error).message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setPreview('')
    onChange(null)
  }

  return (
    <div className={className}>
      {label && (
        <p className="mb-2 text-sm font-medium text-slate-900/80">{label}</p>
      )}

      <div className="flex items-start gap-4">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-navy-700 bg-navy-800">
          {preview ? (
            <img src={preview} alt={label || 'gambar'} className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 text-center text-xs text-slate-900/40">Belum ada gambar</span>
          )}
        </div>

        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            hidden
          />
          <Button
            variant="secondary"
            size="sm"
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? 'Mengunggah...' : 'Unggah / Ganti'}
          </Button>
          {preview && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="text-red-300 hover:bg-red-900/30"
              onClick={handleRemove}
            >
              Hapus
            </Button>
          )}
          {hint && <p className="text-xs text-slate-900/50">{hint}</p>}
        </div>
      </div>
    </div>
  )
}