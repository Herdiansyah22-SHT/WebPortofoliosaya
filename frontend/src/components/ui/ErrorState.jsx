import { Button } from './Button'

export function ErrorState({ message = 'Gagal memuat data.', onRetry, className = '' }) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-card border border-red-500/30 bg-red-900/10 px-6 py-12 text-center ${className}`}
    >
      <svg
        className="mb-3 h-10 w-10 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p className="text-sm font-medium text-red-400">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  )
}