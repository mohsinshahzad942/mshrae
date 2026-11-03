import { useEffect, useState } from 'react'

/** Copies `value` to the clipboard and confirms for 1.5s. Falls back to selecting `targetRef`'s text. */
export function CopyButton({ value, targetRef, label }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  const selectText = () => {
    const el = targetRef?.current
    if (!el) return
    const range = document.createRange()
    range.selectNodeContents(el)
    const sel = getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      selectText()
    }
  }

  return (
    <button className="copy" type="button" onClick={onClick} aria-label={`Copy ${label}`}>
      {copied ? 'Copied' : 'Copy'}
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copied` : ''}
      </span>
    </button>
  )
}
