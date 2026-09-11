import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { siteUrl } from '../../lib/seo'
import { useExperiences } from '../../hooks/usePublicData'
import { Async } from '../../components/common/Async'
import { Reveal } from '../../components/common/Reveal'
import { Skeleton } from '../../components/ui'

export default function Experience() {
  const experiences = useExperiences()

  useDocumentMeta({ title: 'Pengalaman - Portfolio', description: 'Riwayat pengalaman kerja.', canonical: siteUrl('/experience') })

  return (
    <section className="bg-navy-950 py-20 lg:py-32 relative overflow-hidden min-h-screen">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-16 text-center">
            EXPERIENCE
          </h2>
        </Reveal>

        <Async
          data={experiences.data}
          isLoading={experiences.isLoading}
          isError={experiences.isError}
          onRetry={experiences.refetch}
          emptyTitle="Belum ada data pengalaman."
          loading={<div className="mt-12 space-y-5"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>}
        >
          {(list) => (
            <div className="relative border-l border-navy-800 ml-4 md:ml-0 md:border-none">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-navy-800 -translate-x-1/2" />
              <div className="space-y-16">
                {list.data.map((item, i) => {
                  const startYear = item.start_date ? item.start_date.substring(0, 4) : ''
                  const endYear = item.is_current
                    ? 'PRESENT'
                    : item.end_date
                      ? item.end_date.substring(0, 4)
                      : ''
                  const years = `${startYear} - ${endYear}`

                  return (
                    <Reveal key={item.id} delay={i * 80}>
                      <div className="relative md:grid md:grid-cols-2 md:gap-16 items-center">
                        <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-blue-500 shadow-glow md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-10" />

                        <div className={"pl-8 md:pl-0 md:text-right " + (i % 2 !== 0 ? "md:order-2 md:text-left" : "")}>
                          <h3 className="text-xl font-semibold text-slate-900">{item.position}</h3>
                          <p className="mt-2 text-sm font-semibold text-blue-600 tracking-widest uppercase">{item.company}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-700 tracking-wider">{years}</p>
                        </div>

                        <div className={"mt-4 pl-8 md:mt-0 md:pl-0 " + (i % 2 !== 0 ? "md:order-1" : "")}>
                          {item.description && <p className="text-sm leading-relaxed text-slate-900/80 font-light">{item.description}</p>}
                        </div>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          )}
        </Async>
      </div>
    </section>
  )
}