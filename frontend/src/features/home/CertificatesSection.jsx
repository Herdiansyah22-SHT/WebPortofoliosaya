import { Link } from 'react-router-dom'
import { Button } from '../../components/ui'
import { SectionHeading } from '../../components/common/SectionHeading'
import { Reveal } from '../../components/common/Reveal'
import { CertificateCard } from '../certificates/CertificateCard'

export function CertificatesSection({ certificates }) {
  if (!certificates?.length) return null

  return (
    <section className="relative py-16 sm:py-24 bg-navy-900/30 border-y border-navy-800">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <SectionHeading eyebrow="Certificates" title="Sertifikat" />
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {certificates.slice(0, 4).map((cert, i) => (
            <Reveal key={cert.id} delay={i * 80}>
              <CertificateCard cert={cert} to={`/certificates`} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center" delay={120}>
          <Link to="/certificates">
            <Button variant="ghost" size="lg" className="border border-blue-700 text-slate-700 hover:bg-blue-600/20 hover:text-slate-900">Lihat semua sertifikat</Button>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}