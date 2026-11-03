import { useEffect, useState } from 'react'

/** Types and deletes each phrase in turn. Returns the first phrase unchanged when disabled. */
export function useTypewriter(phrases, { enabled = true } = {}) {
  const [text, setText] = useState(phrases[0])

  useEffect(() => {
    if (!enabled) return
    let i = 0
    let j = phrases[0].length
    let deleting = true
    let timer

    const tick = () => {
      const word = phrases[i]
      j += deleting ? -1 : 1
      setText(word.slice(0, j))
      let delay = deleting ? 40 : 80
      if (!deleting && j === word.length) {
        deleting = true
        delay = 1800
      } else if (deleting && j === 0) {
        deleting = false
        i = (i + 1) % phrases.length
        delay = 300
      }
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, 0)
    return () => {
      clearTimeout(timer)
      setText(phrases[0])
    }
  }, [phrases, enabled])

  return text
}
