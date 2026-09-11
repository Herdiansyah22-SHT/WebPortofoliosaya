import { Badge } from './Badge'

/**
 * DataTable reusable — desktop: <table>; mobile: stacked cards.
 * columns: [{ key, header, render(item) }]
 * empty: React node untuk kosong.
 */
export function DataTable({ columns, items = [], rowKey = 'id', empty, actions, onRowClick, className = '' }) {
  if (!items.length) {
    return empty || null
  }

  return (
    <>
      <div className={`hidden overflow-hidden rounded-card border border-navy-600 bg-navy-800 shadow-soft md:block ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-navy-600 bg-navy-900 text-xs uppercase tracking-wide text-slate-900/60">
                {columns.map((col) => (
                  <th key={col.key} scope="col" className="px-4 py-3 font-semibold text-slate-900/80">
                    {col.header}
                  </th>
                ))}
                {actions && (
                  <th scope="col" className="px-4 py-3 text-right font-semibold text-slate-900/80">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {items.map((item) => (
                <tr
                  key={item[rowKey]}
                  className={onRowClick ? 'cursor-pointer transition-colors hover:bg-navy-700/50' : ''}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-900/80">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">{actions(item)}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`space-y-3 md:hidden ${className}`}>
        {items.map((item) => (
          <div key={item[rowKey]} className="rounded-card border border-navy-600 bg-navy-800 p-4 shadow-soft">
            {columns.map((col) => (
              <div key={col.key} className="flex items-start justify-between gap-3 py-1">
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-700">
                  {col.header}
                </span>
                <div className="text-right text-sm text-slate-900/80">
                  {col.render ? col.render(item) : (item[col.key] ?? '-')}
                </div>
              </div>
            ))}
            {actions && <div className="mt-3 flex justify-end gap-2 border-t border-navy-600 pt-3">{actions(item)}</div>}
          </div>
        ))}
      </div>
    </>
  )
}

export function StatusBadge({ status }) {
  const map = {
    published: { label: 'Published', variant: 'success' },
    draft: { label: 'Draft', variant: 'warning' },
    archived: { label: 'Archived', variant: 'neutral' },
    active: { label: 'Active', variant: 'success' },
    inactive: { label: 'Inactive', variant: 'neutral' },
  }

  const cfg = map[status] || map.inactive
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}