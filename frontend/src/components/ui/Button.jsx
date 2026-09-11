import { Spinner } from './Spinner'

const variants = {
  primary:
    'bg-blue-600 text-slate-900 hover:bg-blue-400 hover:-translate-y-0.5 focus-visible:ring-blue-600 border border-blue-700',
  secondary:
    'border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 hover:border-slate-400 hover:-translate-y-0.5 focus-visible:ring-slate-400',
  ghost: 'text-blue-600 hover:bg-blue-900 hover:text-blue-400 hover:-translate-y-0.5 focus-visible:ring-blue-600',
  danger: 'bg-red-900/30 text-red-500 border border-red-500/30 hover:bg-red-900/50 hover:border-red-500/50 hover:-translate-y-0.5 focus-visible:ring-red-500',
  light: 'bg-slate-900 text-navy-950 hover:bg-white hover:-translate-y-0.5 focus-visible:ring-slate-900',
  'ghost-light': 'border border-slate-600 text-slate-800 hover:bg-slate-100/10 hover:text-slate-900 hover:border-slate-500 hover:-translate-y-0.5 focus-visible:ring-slate-500',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 active:scale-[0.97] ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}