import { Spinner } from '../ui'

export function LoadingScreen() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status">
      <Spinner size="lg" className="text-blue-600" />
      <span className="sr-only">Memuat…</span>
    </div>
  )
}
