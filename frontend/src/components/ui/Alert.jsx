const variants = {
  info: 'border-blue-500/30 bg-blue-900 text-blue-600',
  success: 'border-green-500/30 bg-green-900/20 text-green-400',
  warning: 'border-amber-500/30 bg-amber-900/20 text-amber-400',
  danger: 'border-red-500/30 bg-red-900/20 text-red-400',
}

export function Alert({ variant = 'info', className = '', children }) {
  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-sm ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  )
}