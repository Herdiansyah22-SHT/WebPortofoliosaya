import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/format'

export function CertificateCard({ cert, to }) {
  const Wrapper = to ? Link : 'div'
  const wrapperProps = to ? { to } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="group block overflow-hidden border border-navy-600 bg-navy-800 transition-colors duration-200 hover:border-blue-700"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-navy-900">
        {cert.image_url ? (
          <img
            src={cert.image_url}
            alt={`${cert.title} certificate`}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy-800">
            <span className="font-display text-3xl font-bold text-navy-600">
              {cert.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          {cert.issuer}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
          {cert.title}
        </h3>
        {cert.issued_date && (
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-600">
            Diterbitkan {formatDate(cert.issued_date)}
          </p>
        )}
        {cert.credential_url && (
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Lihat Kredensial
            <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>
    </Wrapper>
  )
}