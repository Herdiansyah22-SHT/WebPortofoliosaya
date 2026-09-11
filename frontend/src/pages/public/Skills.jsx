import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { siteUrl } from '../../lib/seo'
import { useSkills } from '../../hooks/usePublicData'
import { Async } from '../../components/common/Async'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Skeleton } from '../../components/ui'
import { SkillMatrix } from '../../features/skills/SkillMatrix'

export default function Skills() {
  const skills = useSkills()

  useDocumentMeta({
    title: 'Skills - Achmad Herdiansyah',
    description: 'Keahlian pengembangan web.',
    canonical: siteUrl('/skills'),
  })

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <SectionHeading
        eyebrow="Skills"
        title="Keahlian"
        description="Pengelompokan kemampuan berdasarkan kategori."
      />

      <Async
        data={skills.data}
        isLoading={skills.isLoading}
        isError={skills.isError}
        onRetry={skills.refetch}
        emptyTitle="Belum ada data skill."
        loading={
          <div className="mt-12 space-y-6">
            <div className="mx-auto h-32 max-w-3xl border border-navy-700 bg-navy-900" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Skeleton className="h-40" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-40" />
            </div>
          </div>
        }
      >
        {(list) => <SkillMatrix skills={list.data} />}
      </Async>
    </section>
  )
}