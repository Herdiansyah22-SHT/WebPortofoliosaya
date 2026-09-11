import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useCertificates, useEducations, useExperiences, useProfile, useProjects, useSkills } from '../../hooks/usePublicData'
import { Async } from '../../components/common/Async'
import { Reveal } from '../../components/common/Reveal'
import { Button, Card, Skeleton } from '../../components/ui'
import { siteUrl } from '../../lib/seo'

const FALLBACK_PHOTO = '/dummy-profile.png'

function StatCard({ value, label, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="rounded-card border border-navy-600 bg-navy-800/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-700 hover:shadow-[0_0_30px_rgba(11,165,233,0.25)]">
        <p className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{value ?? '-'}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">{label}</p>
      </div>
    </Reveal>
  )
}

export default function About() {
  const profile = useProfile()
  const educations = useEducations()
  const experiences = useExperiences()
  const skills = useSkills()
  const projects = useProjects({ per_page: 1 })
  const certificates = useCertificates()

  useDocumentMeta({
    title: 'Tentang - Portfolio',
    description: profile.data?.data?.bio,
    canonical: siteUrl('/about'),
  })

  const p = profile.data?.data
  const projectCount = projects.data?.meta?.total ?? projects.data?.data?.length ?? null
  const eduList = educations.data?.data ?? []
  const expList = experiences.data?.data ?? []
  const skillList = skills.data?.data ?? []
  const certList = certificates.data?.data ?? []

  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-sm font-semibold tracking-[0.3em] text-blue-600 uppercase">Tentang saya</p>
              <h2 className="mt-3 text-4xl sm:text-6xl font-bold tracking-tighter text-slate-900">
                {p?.name ?? 'ABOUT'}
              </h2>
              {p?.headline && (
                <p className="mt-3 text-lg font-medium tracking-wide text-blue-600 uppercase sm:text-xl">{p.headline}</p>
              )}
            </Reveal>

            <Async
              isLoading={profile.isLoading}
              isError={profile.isError}
              onRetry={profile.refetch}
              emptyTitle="Belum ada data profil."
              loading={<div className="mt-10 space-y-3"><Skeleton className="h-6 w-2/3" /><Skeleton className="h-4" /><Skeleton className="h-4" /></div>}
              data={profile.data}
            >
              {() => (
                <div className="mt-10 space-y-6">
                  {p?.bio && (
                    <Reveal delay={100}>
                      <p className="text-lg sm:text-xl leading-relaxed text-slate-900/80 font-light">{p.bio}</p>
                    </Reveal>
                  )}

                  <Reveal delay={150}>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {p?.is_available && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-700 bg-blue-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-glow" aria-hidden="true" />
                          Available for work
                        </span>
                      )}
                      {p?.location && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-800/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-800">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {p.location}
                        </span>
                      )}
                    </div>
                  </Reveal>
                </div>
              )}
            </Async>
          </div>

          <div className="lg:col-span-5 relative">
            <Reveal delay={150}>
              <div className="sticky top-32 overflow-hidden rounded-card border border-navy-700">
                <img
                  src={p?.photo_url || FALLBACK_PHOTO}
                  alt={p?.name || 'Portrait'}
                  className="w-full h-auto max-h-[85vh] object-cover portrait-cinematic grayscale contrast-125"
                />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard value={projectCount} label="Projects" delay={0} />
          <StatCard value={certList.length || null} label="Sertifikat" delay={80} />
          <StatCard value={expList.length || null} label="Pengalaman" delay={160} />
          <StatCard value={eduList.length || null} label="Pendidikan" delay={240} />
        </div>

        {skillList.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <p className="text-sm font-semibold tracking-[0.3em] text-blue-600 uppercase">Tech Stack</p>
              <h3 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Keahlian Utama</h3>
            </Reveal>
            <Reveal delay={100} className="mt-8 flex flex-wrap gap-2">
              {skillList.slice(0, 14).map((s) => (
                <span
                  key={s.id}
                  className="rounded-md border border-navy-700 bg-navy-800/60 px-3 py-1.5 text-sm font-medium text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-700 hover:text-slate-700 hover:shadow-[0_0_20px_rgba(11,165,233,0.25)]"
                >
                  {s.name}
                </span>
              ))}
            </Reveal>
          </div>
        )}

        {expList.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <p className="text-sm font-semibold tracking-[0.3em] text-blue-600 uppercase">Experience</p>
              <h3 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Pengalaman Profesional</h3>
            </Reveal>
            <div className="mt-10 space-y-10 border-l border-navy-800 pl-8 ml-2">
              {expList.slice(0, 4).map((item, i) => {
                const startYear = item.start_date ? item.start_date.substring(0, 4) : ''
                const endYear = item.is_current
                  ? 'Sekarang'
                  : item.end_date
                    ? item.end_date.substring(0, 4)
                    : ''
                return (
                  <Reveal key={item.id} delay={i * 100}>
                    <div className="relative">
                      <span className="absolute -left-[37px] top-1.5 h-2 w-2 rounded-full bg-blue-500 shadow-glow" />
                      <span className="text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase block mb-2">
                        {startYear}{endYear ? ` - ${endYear}` : ''}
                      </span>
                      <h4 className="text-xl font-semibold text-slate-900">{item.position}</h4>
                      <p className="mt-1 text-sm font-semibold tracking-wide text-slate-700 uppercase">
                        {item.company}{item.location ? ` - ${item.location}` : ''}
                      </p>
                      {item.description && (
                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-900/80 font-light">{item.description}</p>
                      )}
                    </div>
                  </Reveal>
                )
              })}
            </div>
            <Reveal className="mt-10 text-center" delay={300}>
              <Link to="/experience">
                <Button variant="ghost-light" size="md" className="rounded-none border-slate-600 hover:border-white">Lihat semua pengalaman</Button>
              </Link>
            </Reveal>
          </div>
        )}

        {eduList.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <p className="text-sm font-semibold tracking-[0.3em] text-blue-600 uppercase">Education</p>
              <h3 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Riwayat Pendidikan</h3>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {eduList.map((edu, i) => (
                <Reveal key={edu.id} delay={i * 100}>
                  <Card className="flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-700 hover:shadow-[0_0_30px_rgba(11,165,233,0.3)]">
                    <span className="inline-flex w-fit rounded-full bg-blue-900/40 border border-blue-600/30 px-3 py-1 text-xs font-semibold text-blue-600">
                      {edu.start_year} - {edu.end_year ?? 'Sekarang'}
                    </span>
                    <h4 className="mt-4 text-lg font-semibold text-slate-900">{edu.institution}</h4>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {[edu.degree, edu.field_of_study].filter(Boolean).join(' - ')}
                    </p>
                    {edu.description && <p className="mt-3 text-sm text-slate-700">{edu.description}</p>}
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal className="mt-24 text-center" delay={100}>
          <p className="text-sm font-semibold tracking-[0.3em] text-blue-600 uppercase">Mari terhubung</p>
          <h3 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tighter text-slate-900">Tertarik bekerja sama?</h3>
          <p className="mt-3 max-w-xl mx-auto text-base text-slate-900/70 font-light">
            Saya terbuka untuk diskusi, kolaborasi, maupun kesempatan kerja baru. Jangan ragu untuk menghubungi saya.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact">
              <Button variant="primary" size="lg" className="px-8 rounded-none">Hubungi Saya</Button>
            </Link>
            <Link to="/projects">
              <Button variant="ghost-light" size="lg" className="px-8 rounded-none border-slate-600 hover:border-white">Lihat Project</Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
