import DOMPurify from 'dompurify'

/**
 * Render HTML CMS (blog body / project description) yang telah disanitasi.
 * DOMPurify menghapus <script>, handler on*, javascript: URL, dan iframe berbahaya.
 * Sanitasi dilakukan di client (tempat konten dirender) — admin-only input tetap disanitasi.
 */
export function RichText({ html, className = '' }) {
  const clean = DOMPurify.sanitize(html || '', { USE_PROFILES: { html: true } })

  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}