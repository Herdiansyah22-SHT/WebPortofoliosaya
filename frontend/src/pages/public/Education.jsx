import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { siteUrl } from '../../lib/seo'
import { useEducations } from '../../hooks/usePublicData'
import { Async } from '../../components/common/Async'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Card, Skeleton } from '../../components/ui'

export default function Education() {
  const educations = useEducations()

  useDocumentMeta({ title: 'Pendidikan — Achmad Herdiansyah', description: 'Riwayat pendidikan.', canonical: siteUrl('/education'), })

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <SectionHeading eyebrow="Education" title="Riwayat pendidikan" />

      <Async
        data={educations.data}
        isLoading={educations.isLoading}
        isError={educations.isError}
        onRetry={educations.refetch}
        emptyTitle="Belum ada data pendidikan."
        loading={<div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2"><Skeleton className="h-44" /><Skeleton className="h-44" /></div>}
      >
        {(list) => (
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
            {list.data.map((edu) => (
              <Card key={edu.id} className="group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-700 hover:shadow-[0_0_30px_rgba(11,165,233,0.3)]">
                <span className="inline-flex w-fit rounded-full bg-blue-900/40 border border-blue-600/30 px-3 py-1 text-xs font-semibold text-blue-600">
                  {edu.start_year} - {edu.end_year ?? 'Sekarang'}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{edu.institution}</h3>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {[edu.degree, edu.field_of_study].filter(Boolean).join(' - ')}
                </p>
                {edu.description && <p className="mt-3 text-sm text-slate-700">{edu.description}</p>}
              </Card>
            ))}
          </div>
        )}
      </Async>
    </section>
  )
}
