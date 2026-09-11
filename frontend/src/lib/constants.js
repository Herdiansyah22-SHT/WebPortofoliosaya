/** Pemetaan status konten → varian Badge + label (docs/05 design system). */
export const CONTENT_STATUS = {
  published: { label: 'Published', variant: 'success' },
  draft: { label: 'Draft', variant: 'warning' },
  archived: { label: 'Archived', variant: 'neutral' },
}

export const ACTIVE_STATUS = {
  true: { label: 'Active', variant: 'success' },
  false: { label: 'Inactive', variant: 'neutral' },
}