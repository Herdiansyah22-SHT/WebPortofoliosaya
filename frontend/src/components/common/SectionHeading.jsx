export function SectionHeading({ eyebrow, title, description, align = 'center', className = '' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center mx-auto'

  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-slate-700">{description}</p>}
    </div>
  )
}