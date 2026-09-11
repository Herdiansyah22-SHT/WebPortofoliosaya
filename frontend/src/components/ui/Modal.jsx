import { useEffect, useRef } from 'react'

export function Modal({ open, onClose, title, children, actions, className = '' }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/90 p-0 sm:items-center sm:p-4 animate-fade"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dialog'}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-card border border-navy-600 bg-navy-800 shadow-soft outline-none sm:w-full sm:max-w-md sm:rounded-card animate-scale-in ${
          className.includes('sm:') ? '' : 'pb-[env(safe-area-inset-bottom)]'
        } ${className}`}
      >
        {title && (
          <div className="border-b border-navy-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
        {actions && <div className="flex justify-end gap-2 border-t border-navy-600 px-6 py-4">{actions}</div>}
      </div>
    </div>
  )
}