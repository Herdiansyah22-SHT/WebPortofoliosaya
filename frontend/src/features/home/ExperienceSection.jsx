import { Link } from 'react-router-dom'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Button } from '../../components/ui'
import { Reveal } from '../../components/common/Reveal'

export function ExperienceSection({ experiences }) {
  if (!experiences?.length) return null

  return (
    <section className="relative mx-auto max-w-5xl px-4 py-20 sm:py-32">
      <Reveal>
        <SectionHeading eyebrow="Experience" title="PENGALAMAN" description="Jejak profesional dan kolaborasi." align="center" />
      </Reveal>

      <div className="relative mt-16 sm:mt-24">
        {/* Animated Vertical Timeline Line */}
        <Reveal as="div" className="absolute left-4 top-0 bottom-0 w-px bg-navy-700 sm:left-1/2 sm:-translate-x-1/2">
          <div className="timeline-line absolute inset-0 bg-blue-600/50 w-full" aria-hidden="true" />
        </Reveal>

        <div className="space-y-16">
          {experiences.slice(0, 4).map((item, i) => {
            const year = item.start_date.substring(0, 4)
            const isEven = i % 2 === 0

            return (
              <Reveal key={item.id} delay={i * 100} className="relative flex flex-col sm:flex-row items-start">
                
                {/* Node Dot (Mobile & Desktop) */}
                <div className="absolute left-[11px] sm:left-1/2 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 shadow-glow sm:-translate-x-1/2 z-10" aria-hidden="true" />

                {/* Left Side (Desktop: Year/Company for even, content for odd) */}
                <div className={`pl-12 sm:pl-0 sm:w-1/2 ${isEven ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:order-2'}`}>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{item.position}</h3>
                  <p className="mt-1 text-sm font-semibold tracking-[0.15em] text-blue-600 uppercase">
                    {item.company}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-700 sm:hidden">
                    {year}
                  </p>
                  {item.description && (
                    <p className="mt-4 text-sm leading-relaxed text-slate-900/80 font-light">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Right Side (Desktop: Content for even, Year/Company for odd) */}
                <div className={`hidden sm:block sm:w-1/2 ${isEven ? 'sm:pl-12 sm:order-2' : 'sm:pr-12 sm:text-right'}`}>
                   <p className="text-4xl font-black text-blue-600 tracking-tighter">
                     {year}
                   </p>
                   {item.is_current && (
                     <span className="inline-block mt-2 rounded-full border border-blue-500/30 bg-blue-900 px-3 py-1 text-xs font-semibold text-blue-600 uppercase tracking-widest">
                       Present
                     </span>
                   )}
                </div>

              </Reveal>
            )
          })}
        </div>
      </div>

      <Reveal className="mt-20 text-center" delay={200}>
        <Link to="/experience">
          <Button variant="ghost-light" size="lg" className="px-10 rounded-none border-slate-600 hover:border-white">VIEW FULL RESUME</Button>
        </Link>
      </Reveal>
    </section>
  )
}
