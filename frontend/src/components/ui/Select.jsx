export function Select({ label, error, hint, className = '', id, children, ...props }) {
  const fieldId = id || props.name || 'select'

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-sm font-medium text-slate-800"
        >
          {label}
        </label>
      )}
      <select
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-lg border bg-navy-700 px-3 py-2 text-sm text-slate-900 transition-colors duration-150 focus:border-blue-500 disabled:opacity-50 ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-300/30'}`}
        {...props}
      >
        {children}
      </select>
      {hint && !error && (
        <p className="mt-1 text-xs text-slate-700">{hint}</p>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}