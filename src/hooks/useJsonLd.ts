import { useEffect } from 'react'

/**
 * Injects one or more JSON-LD <script> tags into <head> on mount,
 * removes them on unmount. Pass a stable object/array reference or
 * memoize with useMemo to avoid re-injection on every render.
 */
export function useJsonLd(schema: object | object[]) {
  useEffect(() => {
    const schemas = Array.isArray(schema) ? schema : [schema]
    const scripts: HTMLScriptElement[] = schemas.map((s) => {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.textContent = JSON.stringify(s)
      document.head.appendChild(el)
      return el
    })
    return () => {
      scripts.forEach((el) => el.remove())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(schema)])
}
