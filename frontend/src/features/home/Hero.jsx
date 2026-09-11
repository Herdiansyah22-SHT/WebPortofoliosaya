import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../../components/common/Reveal'
import { Button } from '../../components/ui'

export function Hero({ profile }) {
  const fullName = profile?.name || 'Achmad Herdiansyah'
  const [firstName, ...restName] = fullName.split(' ')
  const lastName = restName.join(' ')
  
  const headline = profile?.headline || 'Junior Web Developer'
  const bio = profile?.bio || 'Membangun aplikasi web dengan pendekatan yang bersih, aman, dan dapat diskalakan.'
  
  const [typedName, setTypedName] = useState('')

  useEffect(() => {
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setTypedName(lastName.slice(0, index))
      if (index >= lastName.length) window.clearInterval(timer)
    }, 85)
    return () => window.clearInterval(timer)
  }, [lastName])

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen overflow-hidden bg-navy-950 flex items-center">
      <div className="absolute inset-0 z-0 bg-navy-950">
        <img 
          src="/workspace-bg.jpg" 
          alt="Workspace" 
          className="w-full h-full object-cover opacity-35 object-right" 
        />
        <div className="absolute inset-0 bg-navy-950/60" />
      </div>

<div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 gap-12 items-center">
        <div className="max-w-3xl pt-20 pb-12 lg:py-0">
          <Reveal delay={100}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.02] text-slate-900" aria-label={fullName}>
              <span className="text-blue-600">{firstName}</span>{' '}
              <span aria-hidden="true">{typedName}</span><span className="typing-caret" aria-hidden="true" />
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 text-xl sm:text-2xl font-light text-blue-600 tracking-[0.15em] uppercase">
              {headline}
            </p>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-slate-900/80 font-light">
              {bio}
            </p>
          </Reveal>

          <Reveal delay={400} className="mt-12 flex flex-wrap gap-5">
            <Link to="/projects">
              <Button variant="ghost-light" size="lg" className="px-10 rounded-none border border-blue-500/60 text-slate-900 hover:border-blue-400 hover:bg-blue-500/10">VIEW PROJECTS</Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost-light" size="lg" className="px-10 rounded-none border border-white/30 text-slate-700 hover:border-white hover:text-slate-900">CONTACT ME</Button>
            </Link>
          </Reveal>

          {profile?.social_links && (
            <Reveal delay={500} className="mt-16 flex items-center gap-8">
              {Object.entries(profile.social_links).filter(([, value]) => value).map(([key, value]) => (
                <a key={key} href={value} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition-colors hover:text-slate-900">
                  {key}
                </a>
              ))}
            </Reveal>
          )}
</div>
      </div>
    </section>
  )
}
