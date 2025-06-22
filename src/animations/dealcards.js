/**
 * @param cardRefs
 * @param groupRef
 */
export function animateDeal(cardRefs, groupRef) {
  const origin = groupRef.current.position
  const total  = cardRefs.length

  const spacingX    = 1.5    
  const separationZ = 0.2
  const yEnd        = -1.5
  const duration    = 600
  const delayEach   = 200

  function tween(from, to, dur, onUpdate) {
    const start = performance.now()
    function frame(now) {
      const t = Math.min((now - start) / dur, 1)
      onUpdate(from + (to - from) * t)
      if (t < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  cardRefs.forEach((ref, i) => {
    const m = ref.current
    if (!m) return

    m.position.set(origin.x, origin.y, origin.z)
    m.rotation.set(0, Math.PI, 0)

    const xEnd = -((total - 1) / 2) * spacingX + i * spacingX
    const zEnd = 0.5 + i * separationZ
    const rotY = (i - (total - 1) / 2) * 0.1

    setTimeout(() => {
      tween(m.position.x, xEnd,    duration, v => (m.position.x = v))
      tween(m.position.y, yEnd,    duration, v => (m.position.y = v))
      tween(m.position.z, zEnd,    duration, v => (m.position.z = v))
      tween(m.rotation.y, rotY,    duration, r => (m.rotation.y = r))
    }, i * delayEach)
  })
}
