import { useEffect, useRef } from 'react'

export function useCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const cursor = document.createElement('div')
    cursor.classList.add('cursor')
    document.body.appendChild(cursor)
    cursorRef.current = cursor

    const move = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }

    const enlarge = () => cursor.classList.add('cursor--large')
    const shrink = () => cursor.classList.remove('cursor--large')

    window.addEventListener('mousemove', move)

    document.querySelectorAll('a, button, [data-cursor-large]').forEach((el) => {
      el.addEventListener('mouseenter', enlarge)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      cursor.remove()
    }
  }, [])
}
