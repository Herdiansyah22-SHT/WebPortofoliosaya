export function Textarea({ label, error, hint, className = '', id, rows = 4, ...props }) {
  const fieldId = id || props.name || 'textarea'

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
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error
            ? `${fieldId}-error`
            : hint
              ? `${fieldId}-hint`
              : undefined
        }
        className={`w-full rounded-lg border bg-navy-700 px-3 py-2 text-sm text-slate-900 transition-colors duration-150 placeholder:text-slate-700 focus:border-blue-500 disabled:opacity-50 ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-300/30'}`}
        {...props}
      />
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="mt-1 text-xs text-slate-700">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}