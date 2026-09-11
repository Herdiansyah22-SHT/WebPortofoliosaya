import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/format'

export function BlogCard({ post, featured = false }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`group relative block overflow-hidden bg-navy-900 transition-colors duration-300 ${featured ? 'md:col-span-2 lg:col-span-2' : ''}`}>
      <div className={`aspect-[4/3] w-full overflow-hidden relative ${featured ? 'md:aspect-[21/9]' : ''}`}>
        {post.cover_url ? (
          <img
            src={post.cover_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-colors duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy-800">
            <span className="font-display text-3xl font-bold text-navy-600">
              {post.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-navy-900/70 transition-colors duration-300 group-hover:bg-navy-900/80" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
        <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-semibold tracking-widest text-slate-700 uppercase">
            {post.category && (
              <span className="text-blue-600">
                {post.category.name}
              </span>
            )}
            <span>{formatDate(post.published_at)}</span>
          </div>

          <h3 className={`font-bold tracking-tight text-slate-900 ${featured ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}>
            {post.title}
          </h3>
          
          {post.excerpt && (
            <div className="mt-4 grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100">
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-slate-700 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                  Read Article 
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
