import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { adminApi } from '../../services/admin'
import ResourcePage from './ResourcePage'
import { StatusBadge, ResourceModalForm, ConfirmDialog, useToast } from '../../components/ui'
import { formatDate } from '../../utils/format'
import { useState } from 'react'
import { useProjectsAdmin, usePostsAdmin } from '../../hooks/useAdminData'
import { skillMutations, experienceMutations, educationMutations, certificateMutations, projectMutations, postMutations } from '../../hooks/useAdminMutations'
import { extractApiError } from '../../services/apiClient'
import { ProjectFormModal } from '../../features/projects/ProjectFormModal'
import { PostFormModal } from '../../features/blog/PostFormModal'

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
      refetchQuery?.()
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
      refetchQuery?.()
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

export function Projects() {
  useDocumentMeta({ title: 'Projects — Admin' })
  const query = useProjectsAdmin({ page: 1, per_page: 20 }) // ResourcePage manages its own state usually, we hack refetch here
  const crud = useCrudLogic(projectMutations, query.refetch)

  const mapToFormData = (item) => ({
    ...item,
    technologies: item.technologies?.join(', ') || ''
  })

  return (
    <>
      <ResourcePage
        title="Projects"
        description="Kelola project portfolio."
        queryKey="admin-projects"
        queryFn={adminApi.projects}
        searchPlaceholder="Cari project…"
        primaryLabel="Tambah Project"
        onPrimaryAction={crud.handleCreate}
        onEdit={(item) => crud.handleEdit(mapToFormData(item))}
        onDelete={crud.handleDeletePrompt}
      filters={[
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ]}
      columns={[
        { key: 'title', header: 'Judul', render: (p) => <span className="font-medium text-slate-900">{p.title}</span> },
        { key: 'slug', header: 'Slug', render: (p) => <span className="text-xs text-slate-900/60">{p.slug}</span> },
        { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
        { key: 'featured', header: 'Featured', render: (p) => (p.is_featured ? 'Ya' : '-') },
        { key: 'date', header: 'Terbit', render: (p) => (p.published_at ? formatDate(p.published_at) : '-') },
      ]}
    />
      <ProjectFormModal 
        open={crud.formOpen} 
        onClose={() => crud.setFormOpen(false)} 
        initialData={crud.editingItem} 
        refetch={query.refetch} 
      />
      <ConfirmDialog open={Boolean(crud.deleteId)} onClose={() => crud.setDeleteId(null)} onConfirm={crud.handleDeleteConfirm} loading={crud.isDeleting} />
    </>
  )
}

export function Skills() {
  useDocumentMeta({ title: 'Skills — Admin' })
  const crud = useCrudLogic(skillMutations)

  return (
    <>
      <ResourcePage
        title="Skills"
        description="Kelola skill dan kategori."
        queryKey="admin-skills"
        queryFn={adminApi.skills}
        searchPlaceholder="Cari skill…"
        primaryLabel="Tambah Skill"
        onPrimaryAction={crud.handleCreate}
        onEdit={crud.handleEdit}
        onDelete={crud.handleDeletePrompt}
        columns={[
          { key: 'name', header: 'Nama', render: (s) => <span className="font-medium text-slate-900">{s.name}</span> },
          { key: 'category', header: 'Kategori' },
          { key: 'level', header: 'Level', render: (s) => (s.level != null ? `${s.level}%` : '-') },
          { key: 'is_active', header: 'Status', render: (s) => <StatusBadge status={s.is_active ? 'active' : 'inactive'} /> },
        ]}
      />
      <ResourceModalForm
        open={crud.formOpen}
        onClose={() => crud.setFormOpen(false)}
        title={crud.editingItem ? 'Edit Skill' : 'Tambah Skill'}
        initialData={crud.editingItem}
        onSubmit={crud.handleSubmit}
        isPending={crud.isPending}
        apiErrors={crud.apiErrors}
        fields={[
          { name: 'name', label: 'Nama Skill', required: true },
          { name: 'category', label: 'Kategori' },
          { name: 'level', label: 'Level (%)', type: 'number', hint: '1-100 (opsional)' },
          { name: 'sort_order', label: 'Urutan', type: 'number', default: 0 },
          { name: 'is_active', label: 'Aktif', type: 'toggle', default: true },
        ]}
      />
      <ConfirmDialog open={Boolean(crud.deleteId)} onClose={() => crud.setDeleteId(null)} onConfirm={crud.handleDeleteConfirm} loading={crud.isDeleting} />
    </>
  )
}

export function Experience() {
  useDocumentMeta({ title: 'Experience — Admin' })
  const crud = useCrudLogic(experienceMutations)

  return (
    <>
      <ResourcePage
        title="Experience"
        description="Kelola pengalaman kerja."
        queryKey="admin-experiences"
        queryFn={adminApi.experiences}
        searchPlaceholder="Cari experience…"
        primaryLabel="Tambah Pengalaman"
        onPrimaryAction={crud.handleCreate}
        onEdit={crud.handleEdit}
        onDelete={crud.handleDeletePrompt}
        columns={[
          { key: 'position', header: 'Posisi', render: (e) => <span className="font-medium text-slate-900">{e.position}</span> },
          { key: 'company', header: 'Perusahaan' },
          { key: 'period', header: 'Periode', render: (e) => `${formatDate(e.start_date)} — ${e.is_current ? 'Sekarang' : formatDate(e.end_date)}` },
          { key: 'is_active', header: 'Status', render: (e) => <StatusBadge status={e.is_active ? 'active' : 'inactive'} /> },
        ]}
      />
      <ResourceModalForm
        open={crud.formOpen}
        onClose={() => crud.setFormOpen(false)}
        title={crud.editingItem ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
        initialData={crud.editingItem}
        onSubmit={crud.handleSubmit}
        isPending={crud.isPending}
        apiErrors={crud.apiErrors}
        fields={[
          { name: 'company', label: 'Perusahaan', required: true },
          { name: 'position', label: 'Posisi', required: true },
          { name: 'location', label: 'Lokasi' },
          { name: 'start_date', label: 'Tanggal Mulai', type: 'date', required: true },
          { name: 'end_date', label: 'Tanggal Selesai', type: 'date' },
          { name: 'is_current', label: 'Masih Bekerja di Sini', type: 'toggle', default: false },
          { name: 'description', label: 'Deskripsi', type: 'textarea' },
          { name: 'sort_order', label: 'Urutan', type: 'number', default: 0 },
          { name: 'is_active', label: 'Aktif', type: 'toggle', default: true },
        ]}
      />
      <ConfirmDialog open={Boolean(crud.deleteId)} onClose={() => crud.setDeleteId(null)} onConfirm={crud.handleDeleteConfirm} loading={crud.isDeleting} />
    </>
  )
}

export function Education() {
  useDocumentMeta({ title: 'Education — Admin' })
  const crud = useCrudLogic(educationMutations)

  return (
    <>
      <ResourcePage
        title="Education"
        description="Kelola riwayat pendidikan."
        queryKey="admin-educations"
        queryFn={adminApi.educations}
        searchPlaceholder="Cari pendidikan…"
        primaryLabel="Tambah Pendidikan"
        onPrimaryAction={crud.handleCreate}
        onEdit={crud.handleEdit}
        onDelete={crud.handleDeletePrompt}
        columns={[
          { key: 'institution', header: 'Institusi', render: (e) => <span className="font-medium text-slate-900">{e.institution}</span> },
          { key: 'degree', header: 'Jenjang', render: (e) => [e.degree, e.field_of_study].filter(Boolean).join(' · ') },
          { key: 'years', header: 'Tahun', render: (e) => `${e.start_year} — ${e.end_year ?? 'Sekarang'}` },
          { key: 'is_active', header: 'Status', render: (e) => <StatusBadge status={e.is_active ? 'active' : 'inactive'} /> },
        ]}
      />
      <ResourceModalForm
        open={crud.formOpen}
        onClose={() => crud.setFormOpen(false)}
        title={crud.editingItem ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
        initialData={crud.editingItem}
        onSubmit={crud.handleSubmit}
        isPending={crud.isPending}
        apiErrors={crud.apiErrors}
        fields={[
          { name: 'institution', label: 'Institusi', required: true },
          { name: 'degree', label: 'Gelar/Jenjang' },
          { name: 'field_of_study', label: 'Bidang Studi' },
          { name: 'start_year', label: 'Tahun Mulai', type: 'number', required: true },
          { name: 'end_year', label: 'Tahun Selesai', type: 'number' },
          { name: 'description', label: 'Deskripsi', type: 'textarea' },
          { name: 'sort_order', label: 'Urutan', type: 'number', default: 0 },
          { name: 'is_active', label: 'Aktif', type: 'toggle', default: true },
        ]}
      />
      <ConfirmDialog open={Boolean(crud.deleteId)} onClose={() => crud.setDeleteId(null)} onConfirm={crud.handleDeleteConfirm} loading={crud.isDeleting} />
    </>
  )
}

export function Certificates() {
  useDocumentMeta({ title: 'Certificates — Admin' })
  const crud = useCrudLogic(certificateMutations)

  return (
    <>
      <ResourcePage
        title="Certificates"
        description="Kelola sertifikat."
        queryKey="admin-certificates"
        queryFn={adminApi.certificates}
        searchPlaceholder="Cari sertifikat…"
        primaryLabel="Tambah Sertifikat"
        onPrimaryAction={crud.handleCreate}
        onEdit={crud.handleEdit}
        onDelete={crud.handleDeletePrompt}
        columns={[
          { key: 'title', header: 'Sertifikat', render: (c) => <span className="font-medium text-slate-900">{c.title}</span> },
          { key: 'issuer', header: 'Penerbit' },
          { key: 'issued', header: 'Terbit', render: (c) => (c.issued_date ? formatDate(c.issued_date) : '-') },
          { key: 'is_active', header: 'Status', render: (c) => <StatusBadge status={c.is_active ? 'active' : 'inactive'} /> },
        ]}
      />
      <ResourceModalForm
        open={crud.formOpen}
        onClose={() => crud.setFormOpen(false)}
        title={crud.editingItem ? 'Edit Sertifikat' : 'Tambah Sertifikat'}
        initialData={crud.editingItem}
        onSubmit={crud.handleSubmit}
        isPending={crud.isPending}
        apiErrors={crud.apiErrors}
fields={[
          { name: 'image_media_id', type: 'image', label: 'Gambar Sertifikat', currentUrl: crud.editingItem?.image_url, hint: 'JPG / PNG / WebP / GIF, maks 2MB.' },
          { name: 'title', label: 'Judul Sertifikat', required: true },
          { name: 'issuer', label: 'Penerbit', required: true },
          { name: 'credential_id', label: 'ID Kredensial' },
          { name: 'credential_url', label: 'URL Kredensial', type: 'url' },
          { name: 'issued_date', label: 'Tanggal Terbit', type: 'date' },
          { name: 'expiration_date', label: 'Tanggal Kadaluarsa', type: 'date' },
          { name: 'sort_order', label: 'Urutan', type: 'number', default: 0 },
          { name: 'is_active', label: 'Aktif', type: 'toggle', default: true },
        ]}
      />
      <ConfirmDialog open={Boolean(crud.deleteId)} onClose={() => crud.setDeleteId(null)} onConfirm={crud.handleDeleteConfirm} loading={crud.isDeleting} />
    </>
  )
}

export function Blog() {
  useDocumentMeta({ title: 'Blog — Admin' })
  const query = usePostsAdmin({ page: 1, per_page: 20 })
  const crud = useCrudLogic(postMutations, query.refetch)

  const mapToFormData = (item) => ({
    ...item,
    tags: item.tags?.map(t => t.name).join(', ') || '',
    category_id: item.category?.id || ''
  })

  return (
    <>
      <ResourcePage
        title="Blog"
        description="Kelola artikel blog."
        queryKey="admin-posts"
        queryFn={adminApi.posts}
        searchPlaceholder="Cari post…"
        primaryLabel="Tambah Post"
        onPrimaryAction={crud.handleCreate}
        onEdit={(item) => crud.handleEdit(mapToFormData(item))}
        onDelete={crud.handleDeletePrompt}
      filters={[
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ]}
      columns={[
        { key: 'title', header: 'Judul', render: (p) => <span className="font-medium text-slate-900">{p.title}</span> },
        { key: 'category', header: 'Kategori', render: (p) => p.category?.name ?? '-' },
        { key: 'reading', header: 'Baca', render: (p) => (p.reading_time ? `${p.reading_time} mnt` : '-') },
        { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
        { key: 'date', header: 'Terbit', render: (p) => (p.published_at ? formatDate(p.published_at) : '-') },
      ]}
    />
      <PostFormModal 
        open={crud.formOpen} 
        onClose={() => crud.setFormOpen(false)} 
        initialData={crud.editingItem} 
        refetch={query.refetch} 
      />
      <ConfirmDialog open={Boolean(crud.deleteId)} onClose={() => crud.setDeleteId(null)} onConfirm={crud.handleDeleteConfirm} loading={crud.isDeleting} />
    </>
  )
}
