// Layout: donut, how one whole splits into parts (skill BP-donut). The ring sits on top, one
// legend card per part below. Each ring segment is a connector (link-NN) so it draws in with its card.
Layouts['donut'] = {
  build(K) {
    const { D, board } = K;
    const total = D.cards.reduce((s, c) => s + c.value, 0);
    const R = 168, SW = 62, C = 230, GAP = 0.012;
    let a0 = -Math.PI / 2, arcs = '';
    const pt = a => `${(C + R * Math.cos(a)).toFixed(2)},${(C + R * Math.sin(a)).toFixed(2)}`;
    // four clearly different slices from the brand palette (deeper tints of lavender and mint so they read on paper)
    const SEG = [['#3d6661', '#3d6661', '#fff'], ['#77eedf', '#17766c', '#fff'], ['#9fb2e0', '#3d6661', '#3d6661'], ['#f6a9b9', '#b04560', '#3d6661'], ['#a6ece3', '#17766c', '#3d6661']];
    D.cards.forEach((c, i) => {
      const sweep = (c.value / total) * Math.PI * 2;
      const s = a0 + GAP * Math.PI, e = a0 + sweep - GAP * Math.PI;
      const big = e - s > Math.PI ? 1 : 0;
      arcs += `<g class="link" id="link-${K.pad(i)}"><path d="M${pt(s)} A${R},${R} 0 ${big} 1 ${pt(e)}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" fill="none" stroke="${SEG[i % SEG.length][0]}" stroke-width="${SW}" stroke-linecap="butt"/></g>`;
      a0 += sweep;
    });
    // in the dark theme the ring sits on a white plate (see donut.css), so every slice reads on purple
    const ring = document.createElement('div');
    ring.className = 'ring';
    ring.innerHTML = `<svg viewBox="0 0 ${C * 2} ${C * 2}" width="${C * 2}" height="${C * 2}">
        <circle class="plate" cx="${C}" cy="${C}" r="${Math.min(C - 2, R + SW / 2 + 14)}" fill="#fff"/><circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="rgba(61,102,97,.06)" stroke-width="${SW + 18}"/>${arcs}</svg>
      <div class="centre" id="hub"><b>${D.centre.big}</b><span>${D.centre.small}</span></div>
      ${D.example ? '<span class="example-chip">Example data</span>' : ''}`;
    board.appendChild(ring);
    const legend = document.createElement('div');
    legend.className = 'legend';
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`;
      K.paint(el, i);
      const [h, ht, on] = SEG[i % SEG.length];
      el.style.setProperty('--h', h); el.style.setProperty('--h-text', ht); el.style.setProperty('--on-h', on);
      el.style.setProperty('--card-fill', `color-mix(in srgb, ${h} 14%, #fff)`);
      el.style.setProperty('--card-line', `color-mix(in srgb, ${h} 38%, #fff)`);
      el.innerHTML = `<span class="sw"></span><div class="txt"><h3>${c.title}</h3><p class="body">${c.body}</p></div><b class="pct">${Math.round(c.value / total * 100)}%</b>`;
      legend.appendChild(el);
    });
    board.appendChild(legend);
  },
};
