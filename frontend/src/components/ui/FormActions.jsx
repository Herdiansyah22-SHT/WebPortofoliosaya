import { Button } from './Button'

export function FormActions({ onCancel, submitLabel = 'Simpan', loading = false, className = '' }) {
  return (
    <div className={`flex items-center justify-end gap-2 border-t border-navy-600 pt-4 ${className}`}>
      {onCancel && (
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
      )}
      <Button type="submit" loading={loading} disabled={loading}>
        {loading ? 'Menyimpan…' : submitLabel}
      </Button>
    </div>
  )
}