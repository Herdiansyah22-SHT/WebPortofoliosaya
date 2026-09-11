import { Button } from './Button'
import { Modal } from './Modal'

export function ConfirmDialog({ open, title = 'Hapus data?', description, confirmLabel = 'Hapus', loading, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading} disabled={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-900/60">
        {description || 'Tindakan ini tidak dapat dibatalkan.'}
      </p>
    </Modal>
  )
}