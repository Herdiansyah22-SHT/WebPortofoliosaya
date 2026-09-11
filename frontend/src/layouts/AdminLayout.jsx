import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui'

const groups = [
  {
    label: 'Umum',
    items: [
      { to: '/admin', label: 'Dashboard', end: true, perm: 'dashboard.view' },
    ],
  },
  {
    label: 'Konten',
    items: [
      { to: '/admin/projects', label: 'Projects', perm: 'projects.view' },
      { to: '/admin/skills', label: 'Skills', perm: 'skills.view' },
      { to: '/admin/experience', label: 'Experience', perm: 'experience.view' },
      { to: '/admin/education', label: 'Education', perm: 'education.view' },
      { to: '/admin/certificates', label: 'Certificates', perm: 'certificates.view' },
      { to: '/admin/blog', label: 'Blog', perm: 'posts.view' },
      { to: '/admin/categories', label: 'Categories', perm: 'posts.view' },
      { to: '/admin/tags', label: 'Tags', perm: 'posts.view' },
      { to: '/admin/media', label: 'Media', perm: 'media.view' },
    ],
  },
  {
    label: 'Inbox',
    items: [{ to: '/admin/messages', label: 'Messages', perm: 'messages.view' }],
  },
  {
    label: 'Konfigurasi',
    items: [
      { to: '/admin/profile', label: 'Profile', perm: 'profile.update' },
      { to: '/admin/seo', label: 'SEO', perm: 'seo.view' },
      { to: '/admin/settings', label: 'Settings', perm: 'settings.view' },
    ],
  },
]

function SidebarContent({ onNavigate }) {
  const { hasPermission } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-navy-800 px-6 py-6">
        <p className="font-display text-lg font-bold tracking-tight text-slate-900">
          CMS<span className="text-blue-600">.</span>Admin
        </p>
        <p className="mt-1 text-xs tracking-widest uppercase text-slate-700">Dashboard</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Menu admin">
        {groups.map((group) => {
          const visible = group.items.filter((item) => !item.perm || hasPermission(item.perm))
          if (visible.length === 0) return null

          return (
            <div key={group.label} className="mb-6">
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                {group.label}
              </p>
              {visible.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className="mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900/60 transition-all duration-200 hover:bg-navy-800 hover:px-4 hover:text-slate-900 aria-[current=page]:bg-blue-900/25 aria-[current=page]:text-slate-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-600 aria-[current=page]:bg-blue-500" aria-hidden="true" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-navy-800 px-6 py-4">
        <p className="text-xs text-slate-700">REST API · Sanctum · RBAC</p>
      </div>
    </div>
  )
}

function pageTitle(pathname) {
  if (pathname === '/admin') return 'Dashboard'
  const segment = pathname.replace('/admin/', '').split('/')[0]
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-600">
      {/* Sidebar (Desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-navy-800 bg-[#0e1216] lg:block">
        <SidebarContent />
      </aside>

      {/* Sidebar (Mobile Drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-950/80"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-[#0e1216]">
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-800 bg-navy-950/80 px-4 lg:px-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg border border-navy-700 p-2 text-slate-900/60 transition-colors hover:border-blue-700 hover:text-slate-900 lg:hidden focus-visible:ring-blue-500"
              aria-label="Buka menu"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
              <span className="font-medium text-slate-700">Admin</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <h1 className="font-semibold text-slate-900">{pageTitle(location.pathname)}</h1>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{user?.name}</p>
              <p className="text-xs text-blue-600">{user?.roles?.[0]}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Keluar
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}