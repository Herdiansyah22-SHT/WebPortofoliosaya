import { useState } from 'react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useMediaAdmin } from '../../hooks/useAdminData'
import { useDeleteMedia } from '../../hooks/useAdminMutations'
import { Async } from '../../components/common/Async'
import { Modal, Pagination, Skeleton, useToast, ConfirmDialog, Button } from '../../components/ui'
import { MediaUploader } from '../../features/media/MediaUploader'

export default function Media() {
  useDocumentMeta({ title: 'Media — Admin' })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  
  const query = useMediaAdmin({ page, per_page: 24 })
  const deleteMutation = useDeleteMedia()
  const toast = useToast()

  const items = query.data?.data ?? []
  const meta = query.data?.meta ?? {}

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success('Media berhasil dihapus.')
      setDeleteId(null)
      setSelected(null)
    } catch {
      toast.error('Gagal menghapus media.')
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Media</h2>
          <p className="mt-1 text-sm text-slate-700">Perpustakaan file dan gambar.</p>
        </div>
        <MediaUploader onUploaded={() => query.refetch()} />
      </div>

      <Async
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={query.error?.message}
        onRetry={query.refetch}
        isEmpty={!items.length}
        emptyTitle="Belum ada media."
        loading={<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /></div>}
      >
        {() => (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((media) => (
              <button
                key={media.id}
                type="button"
                onClick={() => setSelected(media)}
                className="group overflow-hidden rounded-card border border-slate-200 bg-white text-left shadow-soft transition-shadow hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-100">
                  <img src={media.url} alt={media.alt_text || media.name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]" />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-slate-900">{media.name}</p>
                  <p className="text-xs text-slate-900/60">{Math.round(media.size / 1024)} KB</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Async>

      {meta.last_page > 1 && (
        <Pagination page={meta.current_page} lastPage={meta.last_page} onChange={setPage} className="mt-6" />
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-100 mb-4">
               <img src={selected.url} alt={selected.alt_text || selected.name} className="h-full w-full object-contain" />
            </div>
            <dl className="space-y-1 text-sm bg-slate-50 p-4 rounded-lg">
              <div className="flex justify-between"><dt className="text-slate-700">URL</dt><dd className="font-medium text-slate-900 break-all">{selected.url}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-700">Tipe</dt><dd className="font-medium text-slate-900">{selected.mime_type}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-700">Ukuran</dt><dd className="font-medium text-slate-900">{Math.round(selected.size / 1024)} KB</dd></div>
              <div className="flex justify-between"><dt className="text-slate-700">Dimensi</dt><dd className="font-medium text-slate-900">{selected.width} x {selected.height}</dd></div>
              {selected.alt_text && <div className="flex justify-between"><dt className="text-slate-700">Alt</dt><dd className="text-right font-medium text-slate-900">{selected.alt_text}</dd></div>}
              <div className="flex justify-between"><dt className="text-slate-700">Koleksi</dt><dd className="font-medium text-slate-900">{selected.collection}</dd></div>
            </dl>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelected(null)}>Tutup</Button>
              <Button variant="danger" onClick={() => setDeleteId(selected.id)}>Hapus Media</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog 
        open={Boolean(deleteId)} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        loading={deleteMutation.isPending} 
        title="Hapus Media?" 
        description="Media yang dihapus mungkin akan menyebabkan link gambar rusak di konten terkait. Lanjutkan?"
      />
    </div>
  )
}