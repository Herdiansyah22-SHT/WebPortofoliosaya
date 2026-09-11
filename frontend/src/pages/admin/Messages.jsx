import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useMessagesAdmin } from '../../hooks/useAdminData'
import { useUpdateMessage, useDeleteMessage } from '../../hooks/useAdminMutations'
import { Async } from '../../components/common/Async'
import { Badge, Button, Card, ConfirmDialog, Pagination, Skeleton, useToast } from '../../components/ui'
import { formatDate } from '../../utils/format'
import { useState } from 'react'

export default function Messages() {
  useDocumentMeta({ title: 'Messages — Admin' })
  const [page, setPage] = useState(1)
  const [unread, setUnread] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const query = useMessagesAdmin({ page, per_page: 10, ...(unread ? { unread: 1 } : {}) })
  const updateMutation = useUpdateMessage()
  const deleteMutation = useDeleteMessage()
  const toast = useToast()

  const items = query.data?.data ?? []
  const meta = query.data?.meta ?? {}

  const toggleRead = async (message) => {
    try {
      await updateMutation.mutateAsync({ id: message.id, is_read: !message.is_read })
      toast.success(message.is_read ? 'Ditandai belum dibaca.' : 'Ditandai sudah dibaca.')
    } catch {
      toast.error('Gagal memperbarui pesan.')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success('Pesan berhasil dihapus.')
      setDeleteId(null)
    } catch {
      toast.error('Gagal menghapus pesan. Pastikan Anda memiliki izin.')
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Messages</h2>
          <p className="mt-1 text-sm text-slate-700">Pesan masuk dari form kontak.</p>
        </div>
        <Button variant={unread ? 'primary' : 'secondary'} size="sm" onClick={() => { setUnread((v) => !v); setPage(1); }}>
          Belum dibaca saja
        </Button>
      </div>

      <Async
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={query.error?.message}
        onRetry={query.refetch}
        isEmpty={!items.length}
        emptyTitle="Tidak ada pesan."
        loading={<div className="space-y-3"><Skeleton className="h-20" /><Skeleton className="h-20" /><Skeleton className="h-20" /></div>}
      >
        {() => (
          <div className="space-y-3">
            {items.map((message) => (
              <Card key={message.id} className={`p-5 transition-colors ${message.is_read ? 'bg-white' : 'border-blue-300 bg-blue-50/30'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold text-slate-900">{message.subject}</h3>
                      <Badge variant={message.is_read ? 'neutral' : 'info'}>
                        {message.is_read ? 'Dibaca' : 'Baru'}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-blue-600">
                      {message.name} <span className="font-normal text-slate-700">· {message.email}</span>
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-900/60">{formatDate(message.created_at)}</span>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{message.message}</p>
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                  <Button variant="ghost" size="sm" onClick={() => toggleRead(message)} disabled={updateMutation.isPending}>
                    {message.is_read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setDeleteId(message.id)}>
                    Hapus
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Async>

      {meta.last_page > 1 && (
        <Pagination page={meta.current_page} lastPage={meta.last_page} onChange={setPage} className="mt-6" />
      )}

      <ConfirmDialog 
        open={Boolean(deleteId)} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete} 
        loading={deleteMutation.isPending} 
        title="Hapus Pesan?" 
        description="Pesan akan dihapus permanen. Lanjutkan?"
      />
    </div>
  )
}