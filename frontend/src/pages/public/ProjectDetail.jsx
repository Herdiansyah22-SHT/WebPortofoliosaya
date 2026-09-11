import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useProject } from '../../hooks/usePublicData'
import { injectJsonLd, siteUrl } from '../../lib/seo'
import { Async } from '../../components/common/Async'
import { RichText } from '../../components/common/RichText'
import { Badge, Button, Skeleton } from '../../components/ui'

export default function ProjectDetail() {
const { slug } = useParams()
  const query = useProject(slug)

  useDocumentMeta({
    title: query.data?.data?.title ? `${query.data.data.title} — Achmad Herdiansyah` : 'Project',
    description: query.data?.data?.summary,
    canonical: siteUrl(`/projects/${slug}`),
    ogImage: query.data?.data?.thumbnail_url || undefined,
  })

  const project = query.data?.data
  useEffect(() => {
    if (!project?.title || !slug) return
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.summary || project.title,
      image: project.thumbnail_url || undefined,
      url: siteUrl(`/projects/${slug}`),
      datePublished: project.published_at || undefined,
    })
  }, [JSON.stringify(project), slug])

  return (
    <Async
      data={query.data}
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error?.message}
      onRetry={query.refetch}
      emptyTitle="Project tidak ditemukan."
      loading={<div className="mx-auto max-w-4xl px-4 py-16 space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-72" /><Skeleton className="h-4" /><Skeleton className="h-4" /></div>}
    >
      {({ data }) => (
        <article className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <Link to="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Kembali ke projects
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Badge variant="success">Published</Badge>
            {data.is_featured && <Badge variant="info">Featured</Badge>}
          </div>

          <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">{data.title}</h1>
          {data.summary && <p className="mt-3 text-lg text-slate-700">{data.summary}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            {data.live_url && (
              <a href={data.live_url} target="_blank" rel="noreferrer">
                <Button variant="primary">Live Demo</Button>
              </a>
            )}
            {data.repo_url && (
              <a href={data.repo_url} target="_blank" rel="noreferrer">
                <Button variant="secondary">Source Code</Button>
              </a>
            )}
          </div>

          <div className="mt-6 overflow-hidden rounded-card border border-navy-700">
            {data.thumbnail_url ? (
              <img src={data.thumbnail_url} alt={data.title} fetchPriority="high" className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-navy-800">
                <span className="font-display text-4xl font-semibold text-slate-700">
                  {data.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {data.technologies?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {data.technologies.map((tech) => (
                <span key={tech} className="rounded-md bg-navy-800 border border-navy-700 px-3 py-1 text-sm font-medium text-slate-800">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 rich-text">
            {data.description ? (
              <RichText html={data.description} />
            ) : (
              <p className="text-slate-600">Deskripsi lengkap belum tersedia.</p>
            )}
          </div>
        </article>
      )}
    </Async>
  )
}
