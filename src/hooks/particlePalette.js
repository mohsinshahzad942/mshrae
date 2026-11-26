// Shared, mutable colours for the particle canvas. The scroll theme swaps them when the page
// turns light; the canvas reads them every frame. A plain object avoids re-rendering at 60fps.
export const particlePalette = {
  dot: 'rgba(15,118,110,.45)',
  line: '42,157,143',
}
