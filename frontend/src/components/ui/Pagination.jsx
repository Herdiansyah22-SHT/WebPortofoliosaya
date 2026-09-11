import { Button } from './Button'

export function Pagination({ page, lastPage, onChange, className = '' }) {
  if (lastPage <= 1) return null

  const window = []
  for (let i = Math.max(1, page - 1); i <= Math.min(lastPage, page + 1); i++) {
    window.push(i)
  }

  return (
    <nav className={`flex items-center justify-center gap-1 overflow-x-auto px-2 ${className}`} aria-label="Paginasi">
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Sebelumnya
      </Button>

      {window[0] > 1 && <span className="px-1 text-sm text-slate-900/60">…</span>}

      {window.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          aria-current={item === page ? 'page' : undefined}
          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm transition-colors ${
            item === page
              ? 'bg-blue-600 font-medium text-slate-900'
              : 'text-slate-900/60 hover:bg-navy-800 hover:text-slate-900/70'
          }`}
        >
          {item}
        </button>
      ))}

      {window[window.length - 1] < lastPage && (
        <span className="px-1 text-sm text-slate-900/60">…</span>
      )}

      <Button
        variant="secondary"
        size="sm"
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
      >
        Berikutnya
      </Button>
    </nav>
  )
}