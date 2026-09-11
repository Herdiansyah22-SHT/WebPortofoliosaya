export function EmptyState({ title, description, cta, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-card border border-dashed border-navy-600 bg-navy-800/50 px-6 py-12 text-center ${className}`}
    >
      <svg
        className="mb-3 h-10 w-10 text-slate-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-700">{description}</p>
      )}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  )
}