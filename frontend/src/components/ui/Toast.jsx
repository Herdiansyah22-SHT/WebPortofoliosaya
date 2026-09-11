import { useCallback, useMemo, useRef, useState } from 'react'
import { ToastContext } from './toastContext'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const push = useCallback((variant, message) => {
    const id = ++nextId.current
    setToasts((list) => [...list, { id, variant, message }])
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const toast = useMemo(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('danger', message),
      info: (message) => push('info', message),
    }),
    [push],
  )

  const styles = {
    success: 'bg-green-600 text-slate-900',
    danger: 'bg-red-600 text-slate-900',
    info: 'bg-navy-900 text-slate-900',
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-xs flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto rounded-lg px-4 py-3 text-sm shadow-soft ${styles[t.variant]}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}