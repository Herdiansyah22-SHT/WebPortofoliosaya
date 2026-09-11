import { useEffect } from 'react'
import { setDocumentMeta } from '../lib/seo'

export function useDocumentMeta(input) {
  useEffect(() => {
    setDocumentMeta(input)
  }, [input])
}