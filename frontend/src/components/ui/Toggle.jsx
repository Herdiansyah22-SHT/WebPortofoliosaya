export function Toggle({ label, hint, checked, onChange, disabled, className = '' }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-3 text-sm text-slate-800">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
            checked ? 'bg-blue-600' : 'bg-navy-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span>{label}</span>
      </label>
      {hint && <p className="mt-1 text-xs text-slate-700">{hint}</p>}
    </div>
  )
}