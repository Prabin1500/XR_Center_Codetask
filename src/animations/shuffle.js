export function animateShuffle(groupRef, options = {},  onComplete) {
  const {
    liftAmount = 2,
    liftTime = 0.3,
    scatterTime = 0.5,
    restackTime = 0.7,
    staggerAmount = 0.02,
    liftHeight = 0.5 
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

  cards.forEach((m, i) => {
    const lift = (total - i) * 0.01 * liftAmount + Math.random() * liftHeight;
    tween(
      m.position.y,
      m.position.y + lift,
      liftTime,
      v => (m.position.y = v),
      t => t * (2 - t) // easeOutQuad
    );
  })

  setTimeout(() => {
    cards.forEach(card => {
      tween(
        card.position.x,
        (Math.random() - 0.5) * 2 * scatterRadius,
        scatterTime,
        v => (card.position.x = v),
        t => t * (2 - t)
      );
      tween(
        card.rotation.y,
        (Math.random() - 0.5) * Math.PI * 0.2,
        scatterTime,
        r => (card.rotation.y = r)
      );
      tween(
        card.rotation.z,
        (Math.random() - 0.5) * Math.PI * 0.1,
        scatterTime,
        r => (card.rotation.z = r)
      );
    });
  }, liftTime * 1000);

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
        tween(m.position.x, 0, restackTime, v => (m.position.x = v));
        tween(m.position.y, -newIndex * 0.02, restackTime, v => (m.position.y = v));
        tween(m.position.z, newIndex * 0.001, restackTime, v => (m.position.z = v));
        tween(m.rotation.y, 0, restackTime, r => (m.rotation.y = r));
        tween(m.rotation.z, 0, restackTime, r => (m.rotation.z = r), finish);
      }, newIndex * staggerAmount * 1000);
    });
  }, 1000);
}
