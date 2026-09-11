import { useEffect } from 'react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import {
  useCertificates,
  useExperiences,
  usePosts,
  useProfile,
  useProjects,
  useSkills,
  useSiteSettings,
} from '../../hooks/usePublicData'
import { injectJsonLd, siteUrl } from '../../lib/seo'
import { Hero } from '../../features/home/Hero'
import { AboutPreview } from '../../features/home/AboutPreview'
import { SkillsSection } from '../../features/home/SkillsSection'
import { FeaturedProjects } from '../../features/home/FeaturedProjects'
import { ExperienceSection } from '../../features/home/ExperienceSection'
import { CertificatesSection } from '../../features/home/CertificatesSection'
import { BlogSection } from '../../features/home/BlogSection'
import { ContactCta } from '../../features/home/ContactCta'
import { Async } from '../../components/common/Async'
import { Skeleton } from '../../components/ui'

export default function Home() {
  const profile = useProfile()
  const settings = useSiteSettings()
  const skills = useSkills()
  const projects = useProjects({ featured: 1, per_page: 3 })
  const experiences = useExperiences()
  const certificates = useCertificates()
  const posts = usePosts({ per_page: 3 })

  const p = profile.data?.data
  const site = settings.data?.data

  useDocumentMeta({
    title: p?.name
      ? `${p.name} — ${p.headline}`
      : site?.site?.name || 'Personal Portfolio',
    description: p?.bio || site?.site?.description || site?.seo?.default_description,
    canonical: siteUrl('/'),
    ogType: 'website',
    ogImage: site?.seo?.default_og_image || undefined,
  })

  useEffect(() => {
    if (!p?.name) return
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: p.name,
      jobTitle: p.headline,
      description: p.bio,
      email: p.email,
      telephone: p.phone,
      image: p.photo_url,
      url: siteUrl('/'),
      sameAs: Object.values(p.social_links || {}).filter(Boolean),
    })
  }, [JSON.stringify(p)])

  useEffect(() => {
    injectJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site?.site?.name || 'Personal Portfolio',
      description: site?.site?.description || undefined,
      url: siteUrl('/'),
    })
  }, [JSON.stringify(site)])

  return (
    <>
      <Async
        data={profile.data}
        isLoading={profile.isLoading}
        isError={profile.isError}
        errorMessage={profile.error?.message}
        onRetry={profile.refetch}
      >
        {(profileData) => <Hero profile={profileData.data} />}
      </Async>

      <Async
        data={profile.data}
        isLoading={profile.isLoading}
        isError={profile.isError}
        errorMessage={profile.error?.message}
        onRetry={profile.refetch}
      >
        {(profileData) => <AboutPreview profile={profileData.data} />}
      </Async>

      <Async
        data={skills.data}
        isLoading={skills.isLoading}
        isError={skills.isError}
        errorMessage={skills.error?.message}
        onRetry={skills.refetch}
        isEmpty={!skills.data?.data?.length}
        emptyTitle="Belum ada skill."
        loading={<div className="px-4 py-16"><Skeleton className="mx-auto h-40 max-w-6xl" /></div>}
      >
        {(list) => <SkillsSection skills={list.data} />}
      </Async>

      <Async
        data={projects.data}
        isLoading={projects.isLoading}
        isError={projects.isError}
        errorMessage={projects.error?.message}
        onRetry={projects.refetch}
        isEmpty={!projects.data?.data?.length}
        emptyTitle="Belum ada project."
        loading={<div className="px-4 py-16"><Skeleton className="mx-auto h-56 max-w-6xl" /></div>}
      >
        {(list) => <FeaturedProjects projects={list.data} />}
      </Async>

      <Async
        data={experiences.data}
        isLoading={experiences.isLoading}
        isError={experiences.isError}
        onRetry={experiences.refetch}
        isEmpty={!experiences.data?.data?.length}
        emptyTitle="Belum ada pengalaman."
        loading={<div className="px-4 py-16"><Skeleton className="mx-auto h-40 max-w-2xl" /></div>}
      >
        {(list) => <ExperienceSection experiences={list.data} />}
      </Async>

      <Async
        data={certificates.data}
        isLoading={certificates.isLoading}
        isError={certificates.isError}
        onRetry={certificates.refetch}
        isEmpty={!certificates.data?.data?.length}
        emptyTitle="Belum ada sertifikat."
        loading={<div className="px-4 py-16"><Skeleton className="mx-auto h-40 max-w-3xl" /></div>}
      >
        {(list) => <CertificatesSection certificates={list.data} />}
      </Async>

      <Async
        data={posts.data}
        isLoading={posts.isLoading}
        isError={posts.isError}
        onRetry={posts.refetch}
        isEmpty={!posts.data?.data?.length}
        emptyTitle="Belum ada tulisan."
        loading={<div className="px-4 py-16"><Skeleton className="mx-auto h-56 max-w-6xl" /></div>}
      >
        {(list) => <BlogSection posts={list.data} />}
      </Async>

      <ContactCta />
    </>
  )
}
