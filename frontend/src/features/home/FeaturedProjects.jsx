import { Link } from 'react-router-dom'
import { ProjectCard } from '../projects/ProjectCard'
import { Reveal } from '../../components/common/Reveal'
import { Button } from '../../components/ui'

export function FeaturedProjects({ projects }) {
  if (!projects?.length) return null

  return (
    <section className="relative mx-auto w-full px-4 py-20 sm:py-32 bg-navy-900/20 border-y border-navy-800/50">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-blue-600 uppercase mb-3">Selected Works</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tighter">PORTFOLIO</h2>
            </div>
            <Link to="/projects" className="hidden md:block">
              <Button variant="ghost-light" className="rounded-none border-slate-700 hover:border-white">VIEW ALL PROJECTS</Button>
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {projects.slice(0, 4).map((project, i) => (
            <Reveal key={project.id} delay={i * 100}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center md:hidden" delay={120}>
          <Link to="/projects">
            <Button variant="ghost-light" size="lg" className="w-full rounded-none border-slate-700">VIEW ALL PROJECTS</Button>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
