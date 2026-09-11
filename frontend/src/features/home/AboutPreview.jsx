import { Link } from 'react-router-dom'
import { Button } from '../../components/ui'
import { Reveal } from '../../components/common/Reveal'

export function AboutPreview({ profile }) {
  if (!profile) return null

  const photo = profile.photo_url || '/dummy-profile.png'

  return (
    <section className="mx-auto max-w-7xl px-6 lg:px-12 py-20 sm:py-32 bg-navy-900/30 border-y border-navy-800/50">
      <Reveal>
        <div className="mb-16">
          <p className="text-sm font-semibold tracking-[0.3em] text-blue-600 uppercase">Tentang</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tighter text-slate-900">KENALAN SINGKAT</h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Foto */}
        <Reveal delay={150} className="lg:col-span-5">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-navy-950/40 z-10" aria-hidden="true" />
            <img
              src={photo}
              alt={profile.name}
              loading="lazy"
              className="w-full max-h-[70vh] object-cover portrait-cinematic grayscale contrast-125"
            />
          </div>
        </Reveal>

        {/* Konten */}
        <div className="lg:col-span-7">
          <Reveal delay={100}>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900">{profile.name}</h3>
            <p className="mt-2 text-lg font-medium text-blue-600 tracking-wide uppercase">{profile.headline}</p>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-900/80 font-light">{profile.bio}</p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {profile.is_available && (
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-700 bg-blue-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-glow" aria-hidden="true" />
                  Available
                </span>
              )}
              <Link to="/about">
                <Button variant="ghost-light" size="md" className="rounded-none border border-blue-700 text-slate-700 hover:border-blue-400 hover:text-slate-900">
                  SELENGKAPNYA
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <dl className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 border-t border-navy-800 pt-10">
              {profile.location && (
                <div>
                  <dt className="text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase">Location</dt>
                  <dd className="mt-2 text-sm font-medium text-slate-900">{profile.location}</dd>
                </div>
              )}
              {profile.email && (
                <div>
                  <dt className="text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase">Email</dt>
                  <dd className="mt-2 text-sm font-medium text-slate-900 break-all">{profile.email}</dd>
                </div>
              )}
              {profile?.social_links && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase">Social</dt>
                  <dd className="mt-3 flex flex-wrap gap-3">
                    {Object.entries(profile.social_links).filter(([, v]) => v).map(([key, value]) => (
                      <a key={key} href={value} target="_blank" rel="noreferrer" className="text-sm font-semibold tracking-widest uppercase text-slate-700 transition-colors hover:text-slate-900">
                        {key}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
