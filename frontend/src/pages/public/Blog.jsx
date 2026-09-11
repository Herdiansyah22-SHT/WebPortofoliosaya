import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { siteUrl } from '../../lib/seo'
import { useCategories, usePosts } from '../../hooks/usePublicData'
import { BlogCard } from '../../features/blog/BlogCard'
import { Async } from '../../components/common/Async'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Pagination, Skeleton } from '../../components/ui'

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || ''
  const [page, setPage] = useState(1)

  const categories = useCategories()
  const posts = usePosts({ page, per_page: 9, category })

  useDocumentMeta({ title: 'Blog — Achmad Herdiansyah', description: 'Artikel tentang pengembangan web.', canonical: siteUrl('/blog'), })

  const meta = posts.data?.data?.meta
  const items = posts.data?.data ?? []
  const selectable = categories.data?.data ?? []

  return (
    <section className="bg-navy-950 mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <SectionHeading eyebrow="Blog" title="Tulisan" description="Catatan seputar pengembangan web dan teknologi." />

      {selectable.length > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSearchParams({})
              setPage(1)
            }}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${!category ? 'border-blue-500/60 bg-blue-900 text-slate-900 shadow-[0_0_15px_rgba(11,165,233,0.25)]' : 'border-navy-700 bg-navy-800 text-slate-800 hover:border-blue-700 hover:text-slate-900'}`}
          >
            Semua
          </button>
          {selectable.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSearchParams({ category: cat.slug })
                setPage(1)
              }}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${category === cat.slug ? 'border-blue-500/60 bg-blue-900 text-slate-900 shadow-[0_0_15px_rgba(11,165,233,0.25)]' : 'border-navy-700 bg-navy-800 text-slate-800 hover:border-blue-700 hover:text-slate-900'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <Async
        data={posts.data}
        isLoading={posts.isLoading}
        isError={posts.isError}
        errorMessage={posts.error?.message}
        onRetry={posts.refetch}
        isEmpty={!items.length}
        emptyTitle="Belum ada tulisan."
        empty={
          <div className="mx-auto mt-10 max-w-md text-center text-slate-600">
            <p>{category ? `Belum ada tulisan pada kategori "${category}".` : 'Belum ada tulisan dipublikasikan.'}</p>
          </div>
        }
        loading={<div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"><Skeleton className="h-72" /><Skeleton className="h-72" /><Skeleton className="h-72" /></div>}
      >
        {() => (
          <div className="mt-10 space-y-6">
            {items[0] && <BlogCard post={items[0]} featured />}

            {items.length > 1 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.slice(1).map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </Async>

      {meta && (
        <Pagination
          page={meta.current_page}
          lastPage={meta.last_page}
          onChange={(next) => {
            setPage(next)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="mt-12"
        />
      )}
    </section>
  )
}
