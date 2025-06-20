export function animateShuffle(groupRef, options = {},  onComplete) {
  const {
    liftAmount = 2,
    liftTime = 0.3,
    scatterTime = 0.5,
    restackTime = 0.7,
    staggerAmount = 0.02,
  } = options;
  
  const group = groupRef.current;
  const cards = group.children.slice();
  const total = cards.length;

  function tween(from, to, duration, apply, done) {
    const start = performance.now()
    function frame(now) {
      const t = Math.min((now - start) / duration, 1)
      apply(from + (to - from) * t)
      if (t < 1) requestAnimationFrame(frame)
      else done && done()
    }
    requestAnimationFrame(frame)
  }

  cards.forEach(m => {
    const lift = 1 + Math.random() * 0.5
    tween(m.position.y, m.position.y + lift, 300, v => (m.position.y = v))
  })

  setTimeout(() => {
    cards.forEach(m => {
      tween(m.position.x, (Math.random() - 0.5) * 1.5, 400, v => (m.position.x = v))
      tween(m.rotation.y,   0, 400, r => (m.rotation.y = r))
    })
  }, 350)

  setTimeout(() => {
    let done = 0;
    const finish = () => {
      done++;
      if (done === total) {
        cards.forEach((card) => {
          group.remove(card);
          group.add(card);
        });
        if (onComplete && typeof onComplete === 'function') {
          onComplete();
        }
      }
    };
    
    cards.forEach((m, newIndex) => {
      setTimeout(() => {
        tween(m.position.x, 0, 600, v => (m.position.x = v));
        tween(m.position.y, -newIndex * 0.02, 600, v => (m.position.y = v));
        tween(m.position.z, newIndex * 0.001, 600, v => (m.position.z = v));
        tween(m.rotation.y, 0, 600, r => (m.rotation.y = r));
        tween(m.rotation.z, 0, 600, r => (m.rotation.z = r), finish);
      }, newIndex * 40);
    });
  }, 1000);
}
