import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useCategoriesAdmin, useTagsAdmin } from '../../hooks/useAdminData'
import { categoryMutations, tagMutations } from '../../hooks/useAdminMutations'
import { Async } from '../../components/common/Async'
import { Card, DataTable, Skeleton, StatusBadge, Button, ResourceModalForm, ConfirmDialog, useToast } from '../../components/ui'
import { extractApiError } from '../../services/apiClient'
import { useState } from 'react'

function useCrudLogic(mutationsHook, refetchQuery) {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [apiErrors, setApiErrors] = useState({})
  
  const m = mutationsHook
  const createMut = m.useCreate()
  const updateMut = m.useUpdate()
  const deleteMut = m.useDelete()
  const toast = useToast()

  const handleCreate = () => {
    setEditingItem(null)
    setApiErrors({})
    setFormOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setApiErrors({})
    setFormOpen(true)
  }

  const handleDeletePrompt = (item) => {
    setDeleteId(item.id)
  }

  const handleSubmit = async (data) => {
    setApiErrors({})
    try {
      if (editingItem) {
        await updateMut.mutateAsync({ id: editingItem.id, ...data })
        toast.success('Data berhasil diperbarui.')
      } else {
        await createMut.mutateAsync(data)
        toast.success('Data berhasil dibuat.')
      }
      setFormOpen(false)
      refetchQuery()
    } catch (err) {
      setApiErrors(extractApiError(err).errors)
      toast.error(extractApiError(err).message)
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteMut.mutateAsync(deleteId)
      toast.success('Data berhasil dihapus.')
      setDeleteId(null)
      refetchQuery()
    } catch {
      toast.error('Gagal menghapus data.')
      setDeleteId(null)
    }
  }

  return {
    formOpen, setFormOpen, deleteId, setDeleteId, editingItem, apiErrors,
    handleCreate, handleEdit, handleDeletePrompt, handleSubmit, handleDeleteConfirm,
    isPending: createMut.isPending || updateMut.isPending,
    isDeleting: deleteMut.isPending
  }
}

export function Categories() {
  useDocumentMeta({ title: 'Categories — Admin' })
  const query = useCategoriesAdmin()
  const items = query.data?.data ?? []
  const crud = useCrudLogic(categoryMutations, query.refetch)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Categories</h2>
          <p className="mt-1 text-sm text-slate-700">Kelola kategori untuk post blog.</p>
        </div>
        <Button onClick={crud.handleCreate}>Tambah Kategori</Button>
      </div>

      <Async
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={query.error?.message}
        onRetry={query.refetch}
        isEmpty={!items.length}
        emptyTitle="Belum ada kategori."
        loading={<Skeleton className="h-48 w-full" />}
      >
        {() => (
          <DataTable
            columns={[
              { key: 'name', header: 'Nama', render: (c) => <span className="font-medium text-slate-900">{c.name}</span> },
              { key: 'slug', header: 'Slug', render: (c) => <span className="text-xs text-slate-900/60">{c.slug}</span> },
              { key: 'is_active', header: 'Status', render: (c) => <StatusBadge status={c.is_active ? 'active' : 'inactive'} /> },
            ]}
            items={items}
            actions={(item) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => crud.handleEdit(item)}>Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => crud.handleDeletePrompt(item)}>Hapus</Button>
              </div>
            )}
          />
        )}
      </Async>
      
      <ResourceModalForm
        open={crud.formOpen}
        onClose={() => crud.setFormOpen(false)}
        title={crud.editingItem ? 'Edit Kategori' : 'Tambah Kategori'}
        initialData={crud.editingItem}
        onSubmit={crud.handleSubmit}
        isPending={crud.isPending}
        apiErrors={crud.apiErrors}
        fields={[
          { name: 'name', label: 'Nama Kategori', required: true },
          { name: 'slug', label: 'Slug', hint: 'Dibuat otomatis dari nama jika kosong.' },
          { name: 'sort_order', label: 'Urutan', type: 'number', default: 0 },
          { name: 'is_active', label: 'Aktif', type: 'toggle', default: true },
        ]}
      />
      <ConfirmDialog open={Boolean(crud.deleteId)} onClose={() => crud.setDeleteId(null)} onConfirm={crud.handleDeleteConfirm} loading={crud.isDeleting} />
    </div>
  )
}

export function Tags() {
  useDocumentMeta({ title: 'Tags — Admin' })
  const query = useTagsAdmin()
  const items = query.data?.data ?? []
  const crud = useCrudLogic(tagMutations, query.refetch)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Tags</h2>
          <p className="mt-1 text-sm text-slate-700">Kelola tag untuk post blog.</p>
        </div>
        <Button onClick={crud.handleCreate}>Tambah Tag</Button>
      </div>

      <Async
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={query.error?.message}
        onRetry={query.refetch}
        isEmpty={!items.length}
        emptyTitle="Belum ada tag."
        loading={<Skeleton className="h-48 w-full" />}
      >
        {() => (
          <Card className="p-4">
            <div className="flex flex-wrap gap-2">
              {items.map((tag) => (
                <div key={tag.id} className="flex items-center gap-1 rounded-md bg-slate-100 pl-3 pr-1 py-1 text-sm text-slate-700">
                  <span>#{tag.name}</span>
                  <button onClick={() => crud.handleEdit(tag)} className="p-1 text-slate-900/60 hover:text-blue-400 rounded">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => crud.handleDeletePrompt(tag)} className="p-1 text-slate-900/60 hover:text-red-600 rounded">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </Async>

      <ResourceModalForm
        open={crud.formOpen}
        onClose={() => crud.setFormOpen(false)}
        title={crud.editingItem ? 'Edit Tag' : 'Tambah Tag'}
        initialData={crud.editingItem}
        onSubmit={crud.handleSubmit}
        isPending={crud.isPending}
        apiErrors={crud.apiErrors}
        fields={[
          { name: 'name', label: 'Nama Tag', required: true },
          { name: 'slug', label: 'Slug', hint: 'Dibuat otomatis dari nama jika kosong.' },
        ]}
      />
      <ConfirmDialog open={Boolean(crud.deleteId)} onClose={() => crud.setDeleteId(null)} onConfirm={crud.handleDeleteConfirm} loading={crud.isDeleting} />
    </div>
  )
}
