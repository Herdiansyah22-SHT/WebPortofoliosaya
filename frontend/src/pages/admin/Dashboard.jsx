import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import {
  useDashboard,
  useMessagesAdmin,
  usePostsAdmin,
  useProjectsAdmin,
} from '../../hooks/useAdminData'
import { Async } from '../../components/common/Async'
import { Badge, Button, Card, Skeleton } from '../../components/ui'
import { formatDate } from '../../utils/format'
import { StatusBadge } from '../../components/ui'

export default function Dashboard() {
  useDocumentMeta({ title: 'Dashboard — Admin', canonical: window.location.href })

  const stats = useDashboard()
  const recentProjects = useProjectsAdmin({ page: 1, per_page: 4 })
  const recentPosts = usePostsAdmin({ page: 1, per_page: 4 })
  const recentMessages = useMessagesAdmin({ page: 1, per_page: 4 })

  const counts = stats.data?.data ?? {}
  const statCards = [
    { label: 'Total Project', value: counts.projects, to: '/admin/projects' },
    { label: 'Total Posts', value: counts.posts, to: '/admin/blog' },
    { label: 'Total Media', value: counts.media, to: '/admin/media' },
    { label: 'Pesan Belum Dibaca', value: counts.unread_messages, to: '/admin/messages' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-700">Ringkasan konten portfolio kamu.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/projects">
            <Button variant="secondary" size="sm">Buat Project</Button>
          </Link>
          <Link to="/admin/blog">
            <Button size="sm">Tulis Post</Button>
          </Link>
        </div>
      </div>

      <Async
        isLoading={stats.isLoading}
        isError={stats.isError}
        errorMessage={stats.error?.message}
        onRetry={stats.refetch}
        loading={<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>}
        data={stats.data}
      >
        {() => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <Link key={card.label} to={card.to}>
                <Card className="p-5 transition-shadow hover:shadow-soft">
                  <p className="text-sm font-medium text-slate-700">{card.label}</p>
                  <p className="mt-1 text-3xl font-semibold text-slate-900">{card.value ?? '-'}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Async>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentList
          title="Project terbaru"
          query={recentProjects}
          emptyLabel="Belum ada project."
          renderItem={(p) => (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-slate-900">{p.title}</span>
              <StatusBadge status={p.status} />
            </div>
          )}
        />
        <RecentList
          title="Post terbaru"
          query={recentPosts}
          emptyLabel="Belum ada post."
          renderItem={(p) => (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-slate-900">{p.title}</span>
              <StatusBadge status={p.status} />
            </div>
          )}
        />
        <RecentList
          title="Pesan terbaru"
          query={recentMessages}
          emptyLabel="Belum ada pesan."
          renderItem={(m) => (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-slate-900">{m.subject}</span>
              <Badge variant={m.is_read ? 'neutral' : 'info'}>
                {m.is_read ? 'Dibaca' : 'Baru'}
              </Badge>
            </div>
          )}
        />
      </div>
    </div>
  )
}

function RecentList({ title, query, renderItem, emptyLabel }) {
  const items = query.data?.data ?? []

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <Async
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={query.error?.message}
        onRetry={query.refetch}
        isEmpty={!items.length}
        emptyTitle={emptyLabel}
        loading={<div className="mt-3 space-y-2"><Skeleton className="h-8" /><Skeleton className="h-8" /><Skeleton className="h-8" /></div>}
      >
        {() => (
          <ul className="mt-3 space-y-2">
            {items.map((item) => (
              <li key={item.id} className="rounded-lg bg-slate-50 px-3 py-2">
                {renderItem(item)}
                {item.created_at && (
                  <p className="mt-0.5 text-xs text-slate-900/60">{formatDate(item.created_at)}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Async>
    </Card>
  )
}