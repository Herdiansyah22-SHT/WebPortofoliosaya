import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { usePost } from '../../hooks/usePublicData'
import { injectJsonLd, siteUrl } from '../../lib/seo'
import { Async } from '../../components/common/Async'
import { RichText } from '../../components/common/RichText'
import { Skeleton } from '../../components/ui'
import { formatDate } from '../../utils/format'

export default function BlogDetail() {
const { slug } = useParams()
  const query = usePost(slug)

  const post = query.data?.data
  useDocumentMeta({
    title: post?.title ? `${post.title} — Blog` : 'Blog',
    description: post?.excerpt,
    canonical: siteUrl(`/blog/${slug}`),
    ogType: 'article',
    ogImage: post?.cover_url || undefined,
  })

  useEffect(() => {
    if (!post?.title || !slug) return
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.cover_url || undefined,
      url: siteUrl(`/blog/${slug}`),
      datePublished: post.published_at || undefined,
      author: post.author ? { '@type': 'Person', name: post.author.name } : undefined,
    })
  }, [JSON.stringify(post), slug])

  return (
    <Async
      data={query.data}
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error?.message}
      onRetry={query.refetch}
      emptyTitle="Tulisan tidak ditemukan."
      loading={<div className="mx-auto max-w-3xl px-4 py-16 space-y-4"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-72" /><Skeleton className="h-4" /><Skeleton className="h-4" /></div>}
    >
      {({ data }) => (
        <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <Link to="/blog" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Kembali ke blog
          </Link>

          <h1 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl">{data.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-700">
            {data.category && (
              <Link to={`/blog?category=${data.category.slug}`} className="font-medium text-blue-600 hover:text-slate-700">
                {data.category.name}
              </Link>
            )}
            <span>{formatDate(data.published_at)}</span>
            {data.reading_time && <span>{data.reading_time} mnt baca</span>}
            {data.author?.name && <span>oleh {data.author.name}</span>}
          </div>

          {data.cover_url && (
            <div className="mt-6 overflow-hidden rounded-card border border-navy-700 bg-navy-800">
              <img src={data.cover_url} alt={data.title} fetchPriority="high" className="aspect-video w-full object-cover" />
            </div>
          )}

          <div className="mt-8 rich-text">
            {data.body ? (
              <RichText html={data.body} />
            ) : (
              <p className="text-slate-600">Konten belum tersedia.</p>
            )}
          </div>

          {data.tags?.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-navy-800 pt-6">
              {data.tags.map((tag) => (
                <span key={tag.id} className="rounded-md bg-navy-800 border border-navy-700 px-3 py-1 text-sm text-slate-800">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </article>
      )}
    </Async>
  )
}
