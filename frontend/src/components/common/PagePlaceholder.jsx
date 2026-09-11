export function PagePlaceholder({ title, description }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">Phase 7 - Fondasi</p>
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-xl text-slate-700">{description}</p>
    </section>
  )
}
