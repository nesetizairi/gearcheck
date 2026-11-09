// Szenen für die Pins 27–35 (1000 × 440): drei Ratgeber mit eigener Erfahrung und sechs Vergleiche.
// Ergänzt window.ART aus art-szenen.js. Bewusst anders als die Titelbilder der Ratgeber und Vergleiche auf der Website.
(function () {
  const { K, at, o, defs, label, shine, T } = window.ARTKIT;
  const ART = window.ART;
  const COL = {
    fitness: ['#ff9a6b', '#ff5a1f', '#b83a0a'], kampfsport: ['#ff5c61', '#e0262b', '#8f1014'],
    fussball: ['#4ade80', '#16a34a', '#0c6b30'], running: ['#d9f566', '#a3cf1c', '#5f8100'],
    radsport: ['#a78bfa', '#7c3aed', '#4c1d95'], schwimmen: ['#60a5fa', '#1d6fe0', '#0f3f8f'],
    wintersport: ['#8fe0ff', '#38bdf8', '#0e7fb6'], racket: ['#5eead4', '#14b8a6', '#0b7266']
  };
  const svg = (sport, extra, body) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 440" width="1000" height="440">${defs(COL[sport], extra)}${body}</svg>`;
  const lin = (id, a, b, v = true) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const glow = (id, cx, cy, r, c, op = 0.45) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c}" stop-opacity="${op}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const S = inner => `<g filter="url(#sh)">${inner}</g>`;
  const room = sport => lin('wall', '#121212', '#2c2c2c') + glow('lg', 500, 0, 560, COL[sport][1], 0.45);
  const tick = (x, y, c) => at(x, y, 1, 0, `<path d="M0 0l28 28 56-64" fill="none" stroke="${c}" stroke-width="20" stroke-linecap="square" opacity="0.22"/>`);

  // Aufgerollte Bandage
  const roll = r => `<g><circle r="${r}" fill="url(#gm)" ${o()}/>
    <circle r="${(r * 0.72).toFixed(1)}" fill="none" stroke="${K}" stroke-width="2.5" opacity="0.35"/>
    <circle r="${(r * 0.44).toFixed(1)}" fill="none" stroke="${K}" stroke-width="2.5" opacity="0.35"/>
    <circle r="${(r * 0.17).toFixed(1)}" fill="${K}" opacity="0.6"/>
    <path d="M${r * 0.2} ${r - 2}h${r * 0.9}v${r * 0.36}h${-r * 0.9}z" fill="url(#gm)" ${o(3)}/>
    ${shine(`M${-r * 0.62} ${-r * 0.62}a${r * 0.88} ${r * 0.88} 0 0 1 ${r * 0.74} ${-r * 0.22}`, 6, 0.4)}</g>`;

  // MMA-Handschuh, pad = Dicke des Polsters über den Knöcheln
  const mma = pad => `<g transform="translate(-60 -86)">
    <g fill="#f1cdb1" ${o(3.5)}><rect x="26" y="0" width="17" height="40" rx="8.5"/><rect x="45" y="-6" width="17" height="46" rx="8.5"/><rect x="64" y="-4" width="17" height="44" rx="8.5"/><rect x="83" y="4" width="16" height="36" rx="8"/></g>
    <path d="M14 70C4 66 0 84 8 96L22 112 28 82Z" fill="#f1cdb1" ${o(3.5)}/>
    <path d="M22 50H104C110 50 112 56 112 62V108C112 120 104 128 92 128H38C28 128 22 120 22 110Z" fill="url(#gm)" ${o()}/>
    <rect x="${18 - pad / 6}" y="${42 - pad}" width="${98 + pad / 3}" height="${30 + pad}" rx="${10 + pad / 3}" fill="url(#gm)" ${o()}/>
    ${shine(`M30 ${50 - pad}H${98 + pad / 6}`, 6, 0.4)}
    <rect x="24" y="126" width="88" height="44" rx="8" fill="url(#gk)" ${o()}/>
    <rect x="24" y="136" width="88" height="20" fill="#fff" opacity="0.9"/>
    <path d="M30 140h76M30 152h76" stroke="${K}" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.5"/></g>`;

  // Standboxsack, Gleitschicht (MIPS), Stollen für den Trailschuh
  const freeBag = () => `<g>
    <path d="M-74 196V218A74 20 0 0 0 74 218V196" fill="url(#gk)" ${o()}/>
    <ellipse cy="196" rx="74" ry="20" fill="#3a3a3a" ${o()}/>
    <rect x="-16" y="150" width="32" height="46" rx="6" fill="url(#gsh)" ${o(3)}/>
    <path d="M-48 -30C-48-62 48-62 48-30V136C48 150 36 156 0 156S-48 150-48 136Z" fill="url(#gm)" ${o()}/>
    <rect x="-48" y="-14" width="96" height="16" fill="url(#gk)" ${o(3)}/>
    <rect x="-48" y="112" width="96" height="16" fill="url(#gk)" ${o(3)}/>
    <path d="M-32 14V96" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.28"/></g>`;
  const mips = () => `<g><path d="M-88 34C-82-10-44-46 8-48 58-50 90-16 86 26" fill="none" stroke="#ffd23f" stroke-width="9" stroke-linecap="round" opacity="0.95"/>
    <path d="M-88 34C-82-10-44-46 8-48 58-50 90-16 86 26" fill="none" stroke="${K}" stroke-width="2" stroke-dasharray="6 6" opacity="0.5"/></g>`;
  const lugs = () => `<g fill="#1a1a1a" ${o(2)}>${[-96, -72, -48, -24, 0, 24, 48, 72, 96].map(x => `<path d="M${x - 8} 38h16l-3 10h-10z"/>`).join('')}</g>`;

  // Gemeinsamer Aufbau der Vergleichs-Pins: links gegen rechts, VS in der Mitte
  function vs(sport, floor, left, right, la, ra, extra = '') {
    const c = COL[sport];
    return svg(sport, room(sport) + lin('gtrail', '#5a5a5a', '#1c1c1c') + extra,
      `<rect width="1000" height="440" fill="url(#wall)"/><rect width="1000" height="440" fill="url(#lg)"/>
       ${floor}
       <path d="M520 0H548L480 330H452Z" fill="${c[1]}" opacity="0.16"/>
       ${left}${right}
       <g transform="translate(500 196)"><circle r="46" fill="${K}"/><circle r="46" fill="none" stroke="${c[1]}" stroke-width="6"/>
         <text y="14" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="900" font-style="italic" font-size="38" fill="#fff">VS</text></g>
       ${label(250, 392, la, { size: 26, bg: '#fff', fg: K, stroke: true, wf: 0.74 })}
       ${label(750, 392, ra, { size: 26, bg: c[1], fg: sport === 'running' ? K : '#fff', stroke: true, wf: 0.74 })}`);
  }
  const plainFloor = sport => `<rect y="330" width="1000" height="110" fill="#1b1b1b"/><rect y="326" width="1000" height="6" fill="url(#gm)"/>`;

  // 27 Handbandagen: vier Längen nebeneinander, 4,5 m hervorgehoben
  ART['handbandagen'] = () => {
    const rolls = [[150, 40, '2,5 M', 'Kinder · MMA'], [380, 50, '3,5 M', 'kleinere Hände'], [620, 60, '4,5 M', 'Standard'], [860, 70, '5 M', 'grosse Hände']];
    return svg('kampfsport', room('kampfsport') + lin('plank', '#d39b66', '#8a5a32'),
      `<rect width="1000" height="440" fill="url(#wall)"/><rect width="1000" height="440" fill="url(#lg)"/>
       ${tick(48, 80, COL.kampfsport[1])}
       <rect y="318" width="1000" height="122" fill="#161616"/>
       <rect x="30" y="300" width="940" height="22" rx="4" fill="url(#plank)" ${o(3)}/>
       <path d="M60 310h170M300 314h260M640 309h300" stroke="#6b4425" stroke-width="2" opacity="0.6"/>
       ${rolls.map(([x, r, t, s], i) => S(at(x, 300 - r, 1, 0, roll(r))) +
         label(x, 300 - 2 * r - 42, t, { size: 26, bg: i === 2 ? 'url(#gm)' : K, stroke: true }) +
         `<text x="${x}" y="368" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="700" font-size="24" fill="#d0d0d0">${s}</text>`).join('')}`);
  };

  // 28 MMA-Handschuhe: dünnes gegen dickes Polster
  ART['mma-handschuhe'] = () => {
    const c = COL.kampfsport;
    return svg('kampfsport', room('kampfsport'),
      `<rect width="1000" height="440" fill="url(#wall)"/><rect width="1000" height="440" fill="url(#lg)"/>
       <rect y="330" width="1000" height="110" fill="url(#gk)"/><rect y="326" width="1000" height="6" fill="url(#gm)"/>
       ${S(at(250, 200, 1.38, -6, mma(4)))}
       ${S(at(750, 194, 1.38, 6, mma(26)))}
       <path d="M410 170H580" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M566 152L592 170 566 188" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
       ${label(500, 126, 'MEHR POLSTER', { size: 20, bg: K, stroke: true, wf: 0.7 })}
       ${label(250, 392, 'WETTKAMPF · ≈ 4 OZ', { size: 24, bg: '#fff', fg: K, stroke: true, wf: 0.7 })}
       ${label(750, 392, 'SPARRING · 6–7 OZ', { size: 24, bg: c[1], stroke: true, wf: 0.7 })}`);
  };

  // 29 Klimmzugstange: erst den Türrahmen messen
  ART['klimmzugstange'] = () => {
    const c = COL.fitness;
    return svg('fitness', room('fitness') + lin('tape', '#ffe14d', '#f2b705'),
      `<rect width="1000" height="440" fill="url(#wall)"/><rect width="1000" height="440" fill="url(#lg)"/>
       ${tick(60, 120, c[1])}
       <rect y="372" width="1000" height="68" fill="url(#gwood)"/><rect y="368" width="1000" height="6" fill="url(#gm)"/>
       <rect x="380" y="70" width="240" height="300" fill="#0b0b0b"/>
       <rect x="354" y="50" width="26" height="320" fill="url(#gw)" ${o(3.5)}/><rect x="620" y="50" width="26" height="320" fill="url(#gw)" ${o(3.5)}/>
       <rect x="346" y="36" width="308" height="28" rx="3" fill="url(#gw)" ${o(3.5)}/>
       <path d="M396 36V18H416M604 36V18H584" fill="none" stroke="${K}" stroke-width="9" stroke-linecap="round"/>
       <path d="M396 36V18H416M604 36V18H584" fill="none" stroke="url(#gs)" stroke-width="4" stroke-linecap="round"/>
       <path d="M402 64L392 104M598 64L608 104" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="M402 64L392 104M598 64L608 104" stroke="url(#gs)" stroke-width="6" stroke-linecap="round"/>
       ${S(at(500, 112, 1, 0, T.pullupbar(320)))}
       <rect x="380" y="226" width="240" height="22" fill="url(#tape)" ${o(3)}/>
       <path d="${Array.from({ length: 24 }, (_, i) => `M${390 + i * 10} 226v${i % 5 ? 7 : 13}`).join('')}" stroke="${K}" stroke-width="2"/>
       <rect x="300" y="210" width="80" height="58" rx="14" fill="url(#gm)" ${o()}/><circle cx="340" cy="239" r="12" fill="url(#gk)" ${o(3)}/>
       ${label(500, 290, 'BREITE MESSEN', { size: 22, bg: K, stroke: true, wf: 0.72 })}
       <path d="M690 160H760M690 148V172M760 148V172" stroke="#fff" stroke-width="4"/>
       ${label(820, 160, 'WANDSTÄRKE', { size: 20, bg: '#fff', fg: K, stroke: true, wf: 0.72 })}`);
  };

  // 30 Boxsack hängend oder stehend
  ART['vs-boxsack'] = () => vs('kampfsport', plainFloor('kampfsport'),
    `<path d="M110 26H390" stroke="${K}" stroke-width="12"/><path d="M110 26H390" stroke="#9a9a9a" stroke-width="6"/>` + S(at(250, 84, 1.08, 0, T.bag(220, 104))),
    S(at(750, 82, 1.02, 0, freeBag())),
    'HÄNGEND', 'STEHEND');

  // 31 FG oder AG
  ART['vs-fg-ag'] = () => vs('fussball',
    `<rect y="330" width="500" height="110" fill="url(#grass)"/><rect x="500" y="330" width="500" height="110" fill="url(#turf)"/>
     ${Array.from({ length: 60 }, (_, i) => `<circle cx="${510 + (i * 53) % 480}" cy="${340 + (i * 29) % 95}" r="2.5" fill="#111" opacity="0.7"/>`).join('')}
     <path d="M0 360H1000" stroke="#fff" stroke-width="5" opacity="0.8"/><rect y="326" width="1000" height="6" fill="url(#gm)"/>`,
    at(250, 190, 1.02, -8, T.sole('FG')),
    at(750, 190, 1.02, 8, T.sole('AG')),
    'FG · NATURRASEN', 'AG · KUNSTRASEN',
    lin('grass', '#3fae58', '#1f7a37') + lin('turf', '#2f8f4e', '#1d5f33'));

  // 32 Verstellbare oder feste Kurzhanteln
  ART['vs-kurzhanteln'] = () => vs('fitness', plainFloor('fitness'),
    S(at(250, 214, 1.38, 0, T.plateDumbbell())),
    S(at(690, 150, 1.0, -8, T.dumbbell())) + S(at(780, 222, 1.18, -8, T.dumbbell())) + S(at(700, 290, 1.36, -8, T.dumbbell())),
    'VERSTELLBAR', 'FEST');

  // 33 Kettlebell oder Kurzhantel
  ART['vs-kettlebell'] = () => vs('fitness', plainFloor('fitness'),
    S(at(250, 214, 1.85, 0, T.kettlebell())),
    S(at(760, 230, 1.75, -12, T.dumbbell())),
    'KETTLEBELL', 'KURZHANTEL');

  // 34 Velohelm mit oder ohne MIPS
  ART['vs-mips'] = () => vs('radsport', plainFloor('radsport'),
    S(at(250, 204, 1.4, 0, T.bikehelmet())),
    S(at(750, 204, 1.4, 0, T.bikehelmet() + mips())) + label(860, 70, 'GLEITSCHICHT', { size: 18, bg: '#ffd23f', fg: K, stroke: true, wf: 0.72 }),
    'OHNE MIPS', 'MIT MIPS');

  // 35 Trail- oder Strassenlaufschuh
  ART['vs-trail'] = () => vs('running',
    `<rect y="330" width="500" height="110" fill="#3a3a3e"/><path d="M40 382H140M200 382H300M360 382H460" stroke="#fff" stroke-width="6" opacity="0.8"/>
     <rect x="500" y="330" width="500" height="110" fill="url(#dirt)"/>
     ${Array.from({ length: 22 }, (_, i) => `<ellipse cx="${520 + (i * 61) % 460}" cy="${348 + (i * 37) % 80}" rx="${6 + (i % 3) * 3}" ry="${4 + (i % 2) * 2}" fill="#8b7d6b" ${o(1.5)}/>`).join('')}
     <rect y="326" width="1000" height="6" fill="url(#gm)"/>`,
    S(at(250, 262, 1.5, -3, T.runshoe())),
    S(at(750, 262, 1.5, -3, T.runshoe('url(#gtrail)') + lugs())),
    'STRASSE', 'TRAIL',
    lin('dirt', '#6b4f33', '#3e2c1a'));
})();
