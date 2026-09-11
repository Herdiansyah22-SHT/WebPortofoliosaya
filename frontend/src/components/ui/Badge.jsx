const variants = {
  neutral: 'bg-navy-600 text-slate-700 border border-slate-300/20',
  success: 'bg-green-900/30 text-green-500 border border-green-500/20',
  warning: 'bg-amber-900/30 text-amber-500 border border-amber-500/20',
  danger: 'bg-red-900/30 text-red-500 border border-red-500/20',
  info: 'bg-blue-900 text-blue-600 border border-blue-500/20',
}

export function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}