import { Link } from 'react-router-dom'
import { Button } from '../../components/ui'

export function ContactCta() {
  return (
    <section className="relative border-t border-navy-600 bg-navy-950 py-20 text-center sm:py-32">
      <div className="relative mx-auto max-w-2xl px-6 py-10 z-10">
        <p className="text-xs font-semibold tracking-[0.3em] text-blue-600 uppercase mb-5">Let's connect</p>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
          Tertarik bekerja sama?
        </h2>
        <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-700">
          Punya project atau kesempatan kerja? Kirim pesan dan saya akan segera merespons.
        </p>
        <div className="mt-10">
          <Link to="/contact">
            <Button size="lg" className="px-10 rounded-md bg-blue-600 text-slate-900 hover:bg-blue-400">
              HUBUNGI SAYA
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
