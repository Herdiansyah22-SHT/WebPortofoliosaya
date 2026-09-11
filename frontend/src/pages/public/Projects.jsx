import { useState } from 'react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { siteUrl } from '../../lib/seo'
import { useProjects } from '../../hooks/usePublicData'
import { ProjectCard } from '../../features/projects/ProjectCard'
import { Async } from '../../components/common/Async'
import { Reveal } from '../../components/common/Reveal'
import { Button, Pagination, Skeleton } from '../../components/ui'

export default function Projects() {
  const [page, setPage] = useState(1)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const query = useProjects({ page, per_page: 10, featured: featuredOnly ? 1 : 0 })

  useDocumentMeta({
    title: 'Projects  Portfolio',
    description: 'Kumpulan project yang pernah dikerjakan.',
    canonical: siteUrl('/projects'),
  })

  const meta = query.data?.data?.meta

  return (
    <section className="bg-navy-950 py-20 lg:py-32 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Reveal>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-4 text-center">
            SELECTED WORKS
          </h2>
          <p className="text-center text-slate-700 max-w-2xl mx-auto text-lg font-light">
            Kumpulan eksplorasi desain, studi kasus, dan pengembangan aplikasi web.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12 flex justify-center">
          <Button
            variant={featuredOnly ? 'primary' : 'ghost-light'}
            size="md"
            className="rounded-full tracking-widest uppercase text-xs"
            onClick={() => {
              setFeaturedOnly((v) => !v)
              setPage(1)
            }}
          >
            {featuredOnly ? 'Menampilkan Featured' : 'Tampilkan Featured Saja'}
          </Button>
        </Reveal>

<Async
          data={query.data}
          isLoading={query.isLoading}
          isError={query.isError}
          errorMessage={query.error?.message}
          onRetry={query.refetch}
          isEmpty={!query.data?.data?.length}
          emptyTitle="Belum ada project."
          empty={
            <div className="mt-20">
              <AsyncErrorEmpty onActivate={() => setFeaturedOnly(false)} />
            </div>
          }
          loading={<div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2"><Skeleton className="h-96" /><Skeleton className="h-96" /><Skeleton className="h-96" /></div>}
        >
          {(list) => (
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              {list.data.map((project, i) => (
                <Reveal key={project.id} delay={(i % 2) * 100}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          )}
        </Async>

        {meta && !featuredOnly && (
          <Reveal className="mt-20">
            <Pagination
              page={meta.current_page}
              lastPage={meta.last_page}
              onChange={(next) => {
                setPage(next)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}

function AsyncErrorEmpty({ onActivate }) {
  return (
    <div className="text-center text-slate-600">
      <p>Belum ada project pada filter ini.</p>
      <button type="button" onClick={onActivate} className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700">
        Tampilkan semua project
      </button>
    </div>
  )
}
