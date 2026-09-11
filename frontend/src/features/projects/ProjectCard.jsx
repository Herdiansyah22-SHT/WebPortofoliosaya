import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui'

export function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="group relative block overflow-hidden bg-navy-900 transition-colors duration-300">
      {/* Background Image & Overlay */}
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-colors duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy-800">
            <span className="font-display text-4xl font-bold text-navy-600">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-navy-900/75 transition-colors duration-300 group-hover:bg-navy-900/85" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
        <div className="translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
          <div className="mb-3 flex items-center gap-3">
            {project.is_featured && <Badge variant="info" className="bg-transparent border border-blue-500 text-blue-600">Featured</Badge>}
            {project.technologies?.length > 0 && (
              <span className="text-xs font-semibold tracking-widest text-slate-700 uppercase">
                {project.technologies[0]}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {project.title}
          </h3>
          
          <div className="mt-4 grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100">
            <div className="overflow-hidden">
              <p className="text-sm leading-relaxed text-slate-700">
                {project.summary}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold tracking-wider text-blue-600 uppercase">
                View Project 
                <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
