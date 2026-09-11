import { Card } from '../../components/ui'

export function AdminModulePage({ title, description }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-700">{description}</p>}
      </div>

      <Card className="p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="h-3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-slate-900/60">
          Modul {title} akan diimplementasikan pada phase berikutnya.
        </p>
      </Card>
    </div>
  )
}
