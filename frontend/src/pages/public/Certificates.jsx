import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { siteUrl } from '../../lib/seo'
import { useCertificates } from '../../hooks/usePublicData'
import { Async } from '../../components/common/Async'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Skeleton } from '../../components/ui'
import { CertificateCard } from '../../features/certificates/CertificateCard'

export default function Certificates() {
  const certificates = useCertificates()

  useDocumentMeta({ title: 'Sertifikat — Achmad Herdiansyah', description: 'Daftar sertifikat.', canonical: siteUrl('/certificates'), })

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <SectionHeading eyebrow="Certificates" title="Sertifikat & kredensial" />

      <Async
        data={certificates.data}
        isLoading={certificates.isLoading}
        isError={certificates.isError}
        onRetry={certificates.refetch}
        emptyTitle="Belum ada data sertifikat."
        loading={<div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"><Skeleton className="h-36" /><Skeleton className="h-36" /><Skeleton className="h-36" /></div>}
      >
        {(list) => (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.data.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} to={`/certificates/${cert.id}`} />
            ))}
          </div>
        )}
      </Async>
    </section>
  )
}