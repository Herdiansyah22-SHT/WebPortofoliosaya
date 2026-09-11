import { LoadingScreen } from './LoadingScreen'
import { ErrorState, EmptyState } from '../ui'

/**
 * Pintu data tunggal untuk loading/error/empty/success.
 * isLoading -> skeleton/spinner, isError -> ErrorState + retry,
 * isEmpty -> EmptyState, else children(data).
 */
export function Async({
  isLoading,
  isError,
  errorMessage,
  onRetry,
  loading,
  empty,
  emptyTitle = 'Belum ada data.',
  isEmpty = false,
  data,
  children,
}) {
  if (isLoading) return loading ?? <LoadingScreen />
  if (isError) return <ErrorState message={errorMessage || 'Gagal memuat data.'} onRetry={onRetry} />
  if (isEmpty) return empty ?? <EmptyState title={emptyTitle} />
  return children(data)
}
