// Shared, mutable colours for the particle canvas. The scroll theme swaps them when the page
// turns light; the canvas reads them every frame. A plain object avoids re-rendering at 60fps.
export const particlePalette = {
  dot: 'rgba(61,242,255,.75)',
  line: '91,140,255',
}
