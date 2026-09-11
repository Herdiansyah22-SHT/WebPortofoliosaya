/** Base URL untuk canonical/OG. Env-aware; fallback ke origin saat ini. */
export function siteUrl(path = '') {
  const base = (import.meta.env.VITE_SITE_URL || window.location.origin || '').replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  if (content) el.setAttribute('content', content)
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  if (href) el.setAttribute('href', href)
}

/** Set title + meta dasar (description, robots, canonical, Open Graph, Twitter). */
export function setDocumentMeta({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  siteName = 'Personal Portfolio CMS',
}) {
  document.title = title || siteName
  const desc = description || ''
  upsertMeta('name', 'description', desc)
  upsertMeta('name', 'robots', 'index, follow')
  upsertMeta('property', 'og:locale', 'id_ID')
  upsertMeta('property', 'og:site_name', siteName)
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', desc)
  upsertMeta('property', 'og:type', ogType)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', desc)

  if (canonical) {
    upsertCanonical(canonical)
    upsertMeta('property', 'og:url', canonical)
  }

  if (ogImage) {
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('name', 'twitter:image', ogImage)
  }
}

/** Inject satu blok JSON-LD per @type (hapus duplicate lama). */
export function injectJsonLd(data) {
  const id = `jsonld-${data['@type']}`
  document.querySelectorAll(`script[data-jsonld][id^="jsonld-"]`).forEach((el) => el.remove())
  const el = document.createElement('script')
  el.type = 'application/ld+json'
  el.id = id
  el.setAttribute('data-jsonld', 'true')
  el.textContent = JSON.stringify(data)
  document.head.appendChild(el)
}