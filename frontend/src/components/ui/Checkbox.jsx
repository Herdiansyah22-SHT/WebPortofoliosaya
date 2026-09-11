export function Checkbox({ label, error, hint, className = '', id, ...props }) {
  const fieldId = id || props.name || 'checkbox'

  return (
    <div className={className}>
      <label className="flex items-start gap-2 text-sm text-slate-800">
        <input
          id={fieldId}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-slate-300/30 bg-navy-700 text-blue-600 focus:ring-blue-500"
          {...props}
        />
        <span>{label}</span>
      </label>
      {hint && <p className="mt-1 text-xs text-slate-700">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}