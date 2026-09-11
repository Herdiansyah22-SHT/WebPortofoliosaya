import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button } from '../components/ui'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/education', label: 'Education' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

const navClass = 'relative px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-slate-900 after:absolute after:inset-x-4 after:-bottom-1 after:h-px after:scale-x-0 after:bg-blue-600 after:opacity-0 after:transition-all after:duration-200 hover:after:scale-x-100 hover:after:opacity-100 aria-[current=page]:text-blue-600 aria-[current=page]:after:scale-x-100 aria-[current=page]:after:opacity-100'
const mobileNavClass = 'block rounded-md px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-navy-800 hover:pl-6 hover:text-slate-900 aria-[current=page]:bg-blue-900 aria-[current=page]:text-blue-600'

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-navy-600 bg-[#111110]">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Navigasi utama">
        <div className="flex flex-1 lg:hidden">
          <button type="button" className="rounded-md border border-navy-600 p-2.5 text-slate-700 transition-colors hover:border-blue-600 hover:text-slate-900" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}>
            <span className="sr-only">{open ? 'Tutup menu' : 'Buka menu'}</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        <div className="flex justify-center lg:justify-start">
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap font-display text-lg font-semibold tracking-widest text-slate-900 uppercase">
            Herdiansyah
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden="true" />
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => <li key={link.to}><NavLink to={link.to} end={link.end} className={navClass}>{link.label}</NavLink></li>)}
          </ul>
        </div>

        <div className="flex flex-1 lg:hidden"></div>
      </nav>

      <div id="mobile-menu" className={`overflow-hidden border-t border-navy-600 bg-[#111110] transition-all duration-300 lg:hidden ${open ? 'max-h-[32rem] opacity-100' : 'max-h-0 border-transparent opacity-0'}`}>
        <div className="space-y-1 px-3 py-3">
          {navLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setOpen(false)} className={mobileNavClass}>{link.label}</NavLink>)}
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-auto border-t border-navy-600 bg-[#111110] z-10">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-blue-600 uppercase mb-5">Let's connect</p>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-[1.05]">
              LET'S WORK<br />TOGETHER.
            </h2>
            <a href="mailto:admin@example.com" className="mt-6 inline-block text-base sm:text-lg font-medium text-slate-700 hover:text-blue-400 transition-colors">
              admin@example.com
            </a>
            <div className="mt-8">
              <Link to="/contact">
                <Button size="md" className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-slate-900 hover:bg-blue-400">
                  GET IN TOUCH
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:justify-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-700 uppercase mb-5">Sitemap</p>
              <ul className="space-y-3">
                {navLinks.slice(0, 4).map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} end={link.end} className="text-slate-700 hover:text-blue-400 transition-colors">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-700 uppercase mb-5">Socials</p>
              <ul className="space-y-3">
                <li>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-400 transition-colors">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-400 transition-colors">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="mailto:admin@example.com" className="inline-flex items-center gap-2 text-slate-700 hover:text-blue-400 transition-colors">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-navy-600 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs tracking-wider uppercase">
          <p className="text-slate-700">{'\u00A9'} {year} Herdiansyah.dev</p>
          <p className="text-slate-600">Designed &amp; Developed with passion.</p>
        </div>
      </div>
    </footer>
  )
}

export default function PublicLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-navy-950">
      <Navbar />
      <main className="relative z-10 flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}