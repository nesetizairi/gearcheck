// Eine eigene Szene pro Pin (1000 × 440), passend zum Inhalt des Pins.
// Bewusst anders als die Bilder der Sportart-Seiten (assets/img/sport) und der Ratgeber (assets/img/ratgeber).
(function () {
  const { K, at, o, defs, label, check, shine, T } = window.ARTKIT;
  const COL = {
    fitness: ['#ff9a6b', '#ff5a1f', '#b83a0a'],
    kampfsport: ['#ff5c61', '#e0262b', '#8f1014'],
    fussball: ['#4ade80', '#16a34a', '#0c6b30'],
    running: ['#d9f566', '#a3cf1c', '#5f8100'],
    radsport: ['#a78bfa', '#7c3aed', '#4c1d95'],
    schwimmen: ['#60a5fa', '#1d6fe0', '#0f3f8f'],
    wintersport: ['#8fe0ff', '#38bdf8', '#0e7fb6'],
    racket: ['#5eead4', '#14b8a6', '#0b7266']
  };
  const svg = (sport, extra, body) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 440" width="1000" height="440">${defs(COL[sport], extra)}${body}</svg>`;
  const lin = (id, a, b, vertical = true) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const glow = (id, cx, cy, r, c, op = 0.45) =>
    `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c}" stop-opacity="${op}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const S = (inner) => `<g filter="url(#sh)">${inner}</g>`;
  const flakes = (pts, op = 0.8) => pts.map(([x, y, s]) => at(x, y, s, 0, `<path d="M0-10V10M-9-5L9 5M-9 5L9-5" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="${op}"/>`)).join('');

  const ART = {};

  // 1 Boxhandschuhe: vom Körpergewicht zur Unzen-Grösse
  ART['boxhandschuhe'] = () => svg('kampfsport',
    lin('wall', '#121212', '#2c2c2c') + glow('lg', 640, 40, 520, '#e0262b', 0.5) + lin('canvas', '#efebe4', '#cfc9bf'),
    `<rect width="1000" height="440" fill="url(#wall)"/><rect width="1000" height="440" fill="url(#lg)"/>
     <rect x="900" y="60" width="44" height="290" rx="8" fill="url(#gm)" ${o()}/>
     ${[130, 180, 230].map(y => `<path d="M0 ${y}H922" stroke="${K}" stroke-width="14"/><path d="M0 ${y}H922" stroke="#f4f4f4" stroke-width="8"/>`).join('')}
     <path d="M0 318H1000V440H0Z" fill="url(#canvas)"/><rect y="312" width="1000" height="10" fill="url(#gm)"/><rect y="322" width="1000" height="3" fill="${K}"/>
     ${S(at(230, 300, 0.82, -4, T.scale('72 kg')))}
     ${S(at(85, 388, 0.55, -8, T.wrap()))}
     <path d="M368 266H424V240L474 288 424 336V310H368Z" fill="#fff" ${o()}/>
     ${S(at(612, 238, 1.12, -14, T.glove()))}
     ${S(at(786, 244, 1.12, 13, T.glove()))}
     ${label(700, 402, '16 OZ', { size: 34, bg: 'url(#gm)', stroke: true })}`);

  // 2 Home-Gym für ca. 100 €
  ART['home-gym'] = () => svg('fitness',
    lin('wall', '#fbf6ef', '#eedfcd') + lin('hall', '#4a3427', '#20150f') + glow('lg', 820, 60, 400, '#ff5a1f', 0.22),
    `<rect width="1000" height="440" fill="url(#wall)"/><rect width="1000" height="440" fill="url(#lg)"/>
     <rect x="0" y="318" width="1000" height="122" fill="url(#gwood)"/>
     <path d="M0 350H1000M0 392H1000M120 318V350M420 318V350M760 318V350M260 350V392M600 350V392M900 350V392M80 392V440M480 392V440M820 392V440" stroke="#6b4425" stroke-width="3" opacity="0.55"/>
     <rect y="310" width="1000" height="10" fill="#fff" ${o(3)}/>
     <rect x="62" y="16" width="240" height="298" fill="#fff" ${o()}/><rect x="84" y="36" width="196" height="276" fill="url(#hall)" ${o(3)}/>
     <circle cx="262" cy="190" r="7" fill="url(#gs)" ${o(2.5)}/>
     ${S(at(182, 86, 0.78, 0, T.pullupbar(250)))}
     <path d="M370 336L880 336 950 428H300Z" fill="url(#gm)" ${o()}/>
     <path d="M384 346H866M330 416H920" stroke="#fff" stroke-width="2" stroke-dasharray="8 8" opacity="0.45"/>
     ${S(at(520, 380, 0.62, -6, T.rope()))}
     ${S(at(760, 374, 0.62, 8, T.bandLoop('url(#gk)')))}
     ${S(at(800, 360, 0.5, -10, T.bandLoop('#ffd23f')))}
     <rect x="380" y="48" width="230" height="190" rx="6" fill="#fff" ${o()}/>
     <rect x="396" y="64" width="198" height="158" fill="#bfe6ff"/>
     <path d="M396 200C440 170 480 180 520 160S580 150 594 156V222H396Z" fill="#9fd08a"/><circle cx="560" cy="100" r="18" fill="#fff6c8"/>
     <path d="M495 64V222M396 143H594" stroke="#fff" stroke-width="10"/><rect x="396" y="64" width="198" height="158" fill="none" ${o(3)}/>
     <rect x="366" y="236" width="258" height="14" rx="4" fill="#fff" ${o(3)}/>
     ${S(at(470, 214, 0.42, 0, `<path d="M-40 0H40L30 50H-30Z" fill="url(#gm)" ${o(5)}/><path d="M0 0C-30-40-50-60-40-90M0 0C10-50 30-70 50-80M0 0C-6-40 0-70 10-100" fill="none" stroke="#2c9e4b" stroke-width="12" stroke-linecap="round"/>`))}
     <path d="M880 40L884 128" stroke="${K}" stroke-width="3"/><circle cx="880" cy="38" r="6" fill="url(#gs)" ${o(2.5)}/>
     ${S(at(796, 146, 1.25, 4, T.pricetag('≈100 €')))}`);

  // 3 Fussballschuhe: drei Sohlen, drei Plätze
  ART['fussballschuhe'] = () => svg('fussball',
    `<pattern id="turf" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#3bc45a"/><circle cx="4" cy="4" r="1.6" fill="#111" opacity="0.6"/><circle cx="11" cy="10" r="1.3" fill="#111" opacity="0.5"/><path d="M7 2v5M2 9v4" stroke="#7be08f" stroke-width="1.5"/></pattern>
     <pattern id="grass" width="80" height="440" patternUnits="userSpaceOnUse"><rect width="40" height="440" fill="#2c9e4b"/><rect x="40" width="40" height="440" fill="#248c41"/></pattern>
     <pattern id="hard" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#6a6a6a"/><circle cx="3" cy="3" r="1" fill="#888"/><circle cx="8" cy="7" r="1" fill="#555"/></pattern>`,
    `<path d="M0 0H350L310 440H0Z" fill="url(#grass)"/><path d="M350 0H680L640 440H310Z" fill="url(#turf)"/><path d="M680 0H1000V440H640Z" fill="url(#hard)"/>
     <path d="M760 0L720 440" stroke="#fff" stroke-width="6" opacity="0.85"/>
     <path d="M350 0L310 440M680 0L640 440" stroke="${K}" stroke-width="10"/>
     ${label(172, 38, 'NATURRASEN', { size: 20, bg: '#fff', fg: K, stroke: true })}
     ${label(500, 38, 'KUNSTRASEN', { size: 20, bg: '#fff', fg: K, stroke: true })}
     ${label(845, 38, 'HARTPLATZ', { size: 20, bg: '#fff', fg: K, stroke: true })}
     ${S(at(172, 222, 1.05, -8, T.sole('FG')))}
     ${S(at(495, 222, 1.05, 0, T.sole('AG')))}
     ${S(at(830, 222, 1.05, 8, T.sole('TF')))}
     ${label(172, 400, 'FG', { size: 36, bg: 'url(#gm)', stroke: true })}
     ${label(495, 400, 'AG', { size: 36, bg: 'url(#gm)', stroke: true })}
     ${label(830, 400, 'TF', { size: 36, bg: 'url(#gm)', stroke: true })}`);

  // 4 Laufschuhe: Daumenbreite Platz, nachmittags anprobieren
  ART['laufschuhe'] = () => svg('running',
    lin('wall', '#f7fbe8', '#e1efb4') + lin('road', '#474747', '#2b2b2b'),
    `<rect width="1000" height="440" fill="url(#wall)"/>
     <rect y="330" width="1000" height="110" fill="url(#road)"/>
     <path d="M0 392H1000" stroke="url(#gm)" stroke-width="8" stroke-dasharray="60 40"/>
     ${at(150, 150, 1, 0, `<circle r="74" fill="#fff" ${o(5)}/><circle r="62" fill="none" stroke="${K}" stroke-width="2" opacity="0.2"/>
        ${[...Array(12)].map((_, i) => `<path d="M0-66V-56" transform="rotate(${i * 30})" stroke="${K}" stroke-width="${i % 3 ? 2 : 4}"/>`).join('')}
        <path d="M0 0V-44" stroke="${K}" stroke-width="7" stroke-linecap="round" transform="rotate(120)"/>
        <path d="M0 0V-34" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M0 0V-56" stroke="url(#gm)" stroke-width="3" transform="rotate(300)"/><circle r="7" fill="${K}"/>`)}
     ${label(150, 258, 'NACHMITTAGS', { size: 20 })}
     ${S(at(260, 352, 0.6, -82, T.sock()))}
     ${S(at(560, 248, 1.7, 0, T.runshoe()))}
     <path d="M712 150V330M752 150V330" stroke="${K}" stroke-width="3" stroke-dasharray="6 6"/>
     <path d="M716 162H748" stroke="${K}" stroke-width="4"/><path d="M716 162l10-7v14zM748 162l-10-7v14z" fill="${K}"/>
     ${label(822, 118, '1 DAUMEN PLATZ', { size: 22, bg: 'url(#gm)', fg: K, stroke: true })}
     <path d="M760 128L740 150" stroke="${K}" stroke-width="3"/>
     <rect x="340" y="344" width="470" height="34" rx="4" fill="#ffd23f" ${o(3.5)}/>
     ${[...Array(24)].map((_, i) => `<path d="M${354 + i * 19} 344v${i % 5 ? 10 : 18}" stroke="${K}" stroke-width="2"/>`).join('')}
     <text x="840" y="370" font-family="Segoe UI, Arial" font-weight="900" font-style="italic" font-size="22" fill="#fff">+½ – 1 Nr.</text>`);

  // 5 Velohelm: richtig eingestellt
  ART['velohelm'] = () => svg('radsport',
    lin('bg', '#1b0e36', '#3d1a80') + glow('lg', 520, 120, 420, '#a78bfa', 0.55),
    `<rect width="1000" height="440" fill="url(#bg)"/><rect width="1000" height="440" fill="url(#lg)"/>
     <path d="M0 360C200 340 400 352 600 344S900 330 1000 340V440H0Z" fill="#000" opacity="0.25"/>
     <path d="M395 440C398 400 392 370 372 340 344 300 340 230 362 180 392 112 470 92 530 110 572 124 592 160 590 200 590 214 596 226 606 242 612 252 608 258 596 260 598 272 596 278 590 282 594 290 592 298 584 302 588 318 580 336 560 338 548 340 540 350 540 370L544 440Z" fill="#f2e4d6" ${o()}/>
     <ellipse cx="440" cy="252" rx="16" ry="25" fill="#e3cdb8" ${o(3)}/>
     <path d="M560 212C566 208 574 208 578 212" fill="none" ${o(3.5)}/>
     <path d="M562 200C570 196 580 196 588 200" fill="none" stroke="#6b4a33" stroke-width="5" stroke-linecap="round"/>
     <g transform="translate(0 -16)">${S(`<path d="M336 214C324 136 398 74 482 72 566 70 622 118 616 172 615 182 608 186 598 185L360 224C348 226 338 222 336 214Z" fill="url(#gm)" ${o()}/>
       <g fill="${K}"><path d="M396 136C410 116 430 104 452 98L458 118C440 124 424 134 412 148Z"/><path d="M480 92C504 90 528 96 546 106L536 124C522 116 502 112 482 112Z"/><path d="M566 116C582 128 594 142 600 158L580 162C576 150 568 140 556 132Z"/></g>
       <path d="M362 222C440 206 530 192 598 184" fill="none" stroke="#fff" stroke-width="5" opacity="0.7"/>
       ${shine('M352 180C366 130 410 96 462 88', 9, 0.35)}`)}</g>
     <g fill="#f2e4d6" ${o(2.5)}><rect x="584" y="172" width="58" height="12" rx="6"/><rect x="584" y="186" width="58" height="12" rx="6"/></g>
     <path d="M556 164L452 292M392 200L452 292M452 292C480 316 520 332 548 336" fill="none" stroke="${K}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
     ${at(500, 318, 1, 24, `<rect x="-14" y="-8" width="28" height="16" rx="4" fill="url(#gk)" ${o(2.5)}/>`)}
     ${label(760, 180, '2 FINGER', { size: 26, bg: '#fff', fg: K, stroke: true })}<path d="M650 182H690" stroke="#fff" stroke-width="4"/>
     ${label(280, 300, 'V-FORM', { size: 26, bg: '#fff', fg: K, stroke: true })}<path d="M346 300H430" stroke="#fff" stroke-width="4"/>
     <path d="M560 344C572 352 582 352 592 346" fill="none" stroke="#fff" stroke-width="4"/>
     ${label(720, 350, '1 FINGER', { size: 26, bg: '#fff', fg: K, stroke: true })}<path d="M600 348H640" stroke="#fff" stroke-width="4"/>
     ${check(880, 180, 1.1)}${check(165, 300, 1.1)}${check(840, 350, 1.1)}`);

  // 6 Schwimmbrille: vier Glasfarben, vom Hallenbad zum See
  ART['schwimmbrille'] = () => svg('schwimmen',
    lin('sky', '#bfe6ff', '#eaf7ff') + lin('water', '#2b8fe6', '#0f4fa8') + lin('fade', '#eaf6ff', '#eaf6ff', false) +
    `<linearGradient id="mask" x1="0" y1="0" x2="1" y2="0"><stop offset="0.38" stop-color="#fff"/><stop offset="0.62" stop-color="#fff" stop-opacity="0"/></linearGradient>
     <pattern id="tiles" width="34" height="34" patternUnits="userSpaceOnUse"><rect width="34" height="34" fill="#e9f6ff"/><path d="M0 0H34V34" fill="none" stroke="#b8dcf4" stroke-width="2"/></pattern>
     <linearGradient id="mir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd24a"/><stop offset="0.45" stop-color="#ff6aa0"/><stop offset="1" stop-color="#3b5bff"/></linearGradient>` + glow('sun', 900, 60, 120, '#fff7c2', 0.9),
    `<rect width="1000" height="260" fill="url(#sky)"/><circle cx="900" cy="60" r="120" fill="url(#sun)"/><circle cx="900" cy="60" r="26" fill="#fff6c8"/>
     <path d="M520 260L620 170 680 214 760 140 860 230 920 190 1000 236V260Z" fill="#7aa6c7" opacity="0.8"/>
     <path d="M560 260L660 200 740 240 820 196 940 260Z" fill="#4f86ad"/>
     <rect width="1000" height="260" fill="url(#tiles)" clip-path="url(#leftclip)"/>
     <clipPath id="leftclip"><path d="M0 0H430C470 80 470 180 430 260H0Z"/></clipPath>
     <rect y="260" width="1000" height="180" fill="url(#water)"/>
     <path d="M0 300C40 292 80 308 120 300S200 292 240 300 320 308 360 300 440 292 480 300 560 308 600 300 680 292 720 300 800 308 840 300 920 292 1000 300" fill="none" stroke="#fff" stroke-width="3" opacity="0.4"/>
     <path d="M0 360H440" stroke="#ffd23f" stroke-width="10" stroke-dasharray="14 8"/><path d="M0 360H440" stroke="${K}" stroke-width="1" opacity="0.4"/>
     <path d="M430 0C470 80 470 180 430 260" fill="none" stroke="#fff" stroke-width="6" opacity="0.8"/>
     ${S(at(130, 200, 0.82, -4, T.swimgoggles('#eef9ff', 'url(#gk)')))}
     ${S(at(375, 196, 0.82, 3, T.swimgoggles('#7cc4ff', 'url(#gm)')))}
     ${S(at(625, 200, 0.82, -3, T.swimgoggles('#1e2f48', 'url(#gk)')))}
     ${S(at(870, 196, 0.82, 4, T.swimgoggles('url(#mir)', 'url(#gm)')))}
     ${label(130, 290, 'KLAR', { size: 22 })}${label(375, 290, 'LEICHT GETÖNT', { size: 22 })}
     ${label(625, 290, 'DUNKEL', { size: 22 })}${label(870, 290, 'VERSPIEGELT', { size: 22 })}
     ${label(200, 400, 'HALLENBAD', { size: 20, bg: '#fff', fg: K, stroke: true })}${label(780, 400, 'FREIBAD & SEE', { size: 20, bg: '#fff', fg: K, stroke: true })}`);

  // 7 Skibrille: S0 bis S4, von der Nacht bis zum Gletscher
  ART['skibrille'] = () => {
    const lens = [['#f4f8ff', '#cfe3ff'], ['#fff06a', '#ffb02e'], ['#ffb27a', '#e0507a'], ['#7e8fb0', '#2a4cff'], ['#3a3550', '#120f22']];
    const g = lens.map((c, i) => `<linearGradient id="l${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`).join('');
    const xs = [104, 302, 500, 698, 896];
    const sub = ['NACHT', 'NEBEL', 'WECHSELHAFT', 'SONNE', 'GLETSCHER'];
    return svg('wintersport',
      `<linearGradient id="sky" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0b1433"/><stop offset="0.3" stop-color="#53718f"/><stop offset="0.6" stop-color="#7cc8f4"/><stop offset="1" stop-color="#e8f8ff"/></linearGradient>` + g + glow('sun', 930, 50, 160, '#ffffff', 0.95),
      `<rect width="1000" height="440" fill="url(#sky)"/><circle cx="930" cy="50" r="160" fill="url(#sun)"/>
       ${[[30, 40], [80, 90], [140, 30], [60, 160], [180, 120], [230, 60], [120, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff" opacity="0.9"/>`).join('')}
       <circle cx="200" cy="44" r="16" fill="#f4f1d8"/><circle cx="207" cy="40" r="14" fill="#1a2648"/>
       
       <path d="M0 330L120 250 200 300 330 220 450 300 560 230 680 290 800 210 920 280 1000 250V440H0Z" fill="#dfefff"/>
       <path d="M330 220L370 250 350 252 390 280M800 210L840 240 820 244 860 270M120 250L150 272" fill="none" stroke="#9fc2e0" stroke-width="4"/>
       <path d="M0 370C200 350 400 380 600 360S900 350 1000 366V440H0Z" fill="#fff"/>
       ${xs.map((x, i) => S(at(x, 230, 0.74, 0, T.skigoggles(`url(#l${i})`)))).join('')}
       ${xs.map((x, i) => label(x, 140, 'S' + i, { size: 38, bg: i === 2 || i === 3 ? 'url(#gm)' : K })).join('')}
       ${xs.map((x, i) => label(x, 400, sub[i], { size: 18, bg: '#fff', fg: K, stroke: true })).join('')}`);
  };

  // 8 Schläger: Tennis gegen Padel
  ART['schlaeger'] = () => svg('racket',
    lin('tc', '#2aa58c', '#17705f') + lin('pc', '#2f74c8', '#174a8c'),
    `<path d="M0 0H520L460 440H0Z" fill="url(#tc)"/><path d="M520 0H1000V440H460Z" fill="url(#pc)"/>
     <path d="M60 440L150 60H430L440 440M120 180H420" fill="none" stroke="#fff" stroke-width="5" opacity="0.75"/>
     <path d="M560 30H980V300H560Z" fill="#cfe8ff" opacity="0.18" stroke="#fff" stroke-width="4"/>
     <path d="M700 30V300M840 30V300M560 165H980" stroke="#fff" stroke-width="3" opacity="0.5"/>
     <path d="M520 0L460 440" stroke="${K}" stroke-width="10"/>
     ${S(at(300, 236, 1.12, -20, T.tennisracket()))}
     ${S(at(700, 232, 1.08, 18, T.padelracket()))}
     ${S(at(150, 350, 1.1, 0, T.tennisball()))}${S(at(880, 360, 1.1, 30, T.tennisball()))}
     ${label(240, 404, 'TENNIS', { size: 30, bg: '#fff', fg: K, stroke: true })}
     ${label(780, 404, 'PADEL', { size: 30, bg: '#fff', fg: K, stroke: true })}`);

  // 9 Kampfsport: alles ausgelegt auf der Matte
  ART['kampfsport-liste'] = () => svg('kampfsport',
    lin('mat', '#262626', '#161616'),
    `<rect width="1000" height="440" fill="url(#mat)"/>
     <path d="M0 146H1000M0 292H1000M333 0V440M666 0V440" stroke="#000" stroke-width="4" opacity="0.5"/>
     <rect x="0" y="0" width="1000" height="440" fill="none" stroke="url(#gm)" stroke-width="22"/>
     ${S(at(112, 190, 0.92, -18, T.glove()))}${S(at(232, 200, 0.92, 16, T.glove()))}
     ${S(at(392, 108, 0.78, -10, T.mouthguard()))}
     ${S(at(330, 362, 0.78, -4, T.wrap()))}
     ${S(at(560, 196, 1.02, 0, T.headgear()))}
     ${S(at(712, 210, 0.9, -10, T.shinguard()))}${S(at(806, 222, 0.9, 8, T.shinguard()))}
     ${S(at(918, 118, 0.7, 0, T.mitt()))}
     ${S(at(912, 356, 0.62, -10, T.cup()))}
     ${check(470, 110)}${check(640, 380)}${check(80, 360)}`);

  // 10 Fussball: alles ausgelegt auf dem Rasen
  ART['fussball-liste'] = () => svg('fussball',
    `<pattern id="grass" width="100" height="440" patternUnits="userSpaceOnUse"><rect width="50" height="440" fill="#2c9e4b"/><rect x="50" width="50" height="440" fill="#248c41"/></pattern>`,
    `<rect width="1000" height="440" fill="url(#grass)"/>
     <path d="M640 -10A140 140 0 0 1 640 450" fill="none" stroke="#fff" stroke-width="6" opacity="0.6"/>
     ${S(at(180, 104, 0.88, -6, T.boot()))}${S(at(196, 234, 0.88, -2, T.boot()))}
     ${S(at(410, 188, 0.82, -10, T.shinguardSlip()))}${S(at(494, 200, 0.82, 10, T.shinguardSlip()))}
     ${S(at(652, 196, 0.82, 10, T.keeperglove()))}
     ${S(at(790, 220, 0.82, -12, T.sock()))}
     ${S(at(910, 110, 0.9, 0, T.ball()))}
     ${S(at(886, 348, 0.62, -14, T.pump()))}
     ${S(at(110, 376, 0.8, 0, T.discCone()))}${S(at(196, 392, 0.8, 0, T.discCone()))}${S(at(282, 378, 0.8, 0, T.discCone()))}
     ${check(560, 380)}${check(330, 70)}`);

  // 11 Home-Gym: alles ausgelegt auf dem Holzboden
  ART['home-gym-liste'] = () => svg('fitness', '',
    `<rect width="1000" height="440" fill="url(#gwood)"/>
     <path d="M0 88H1000M0 176H1000M0 264H1000M0 352H1000M180 0V88M620 0V88M400 88V176M860 88V176M120 176V264M560 176V264M320 264V352M780 264V352M500 352V440M900 352V440" stroke="#6b4425" stroke-width="3" opacity="0.5"/>
     ${S(at(196, 92, 0.88, 0, T.matRoll()))}
     ${S(at(150, 236, 0.8, 0, T.dumbbell()))}${S(at(160, 350, 0.8, 0, T.dumbbell()))}
     ${S(at(400, 260, 1.05, 0, T.kettlebell()))}
     ${S(at(560, 96, 0.72, -8, T.bandLoop('url(#gm)')))}${S(at(612, 150, 0.6, 10, T.bandLoop('url(#gk)')))}
     ${S(at(640, 360, 0.86, -4, T.pullupbar(300)))}
     ${S(at(842, 210, 0.78, 90, T.roller()))}
     ${S(at(600, 254, 0.56, 0, T.rope()))}
     ${check(300, 360)}${check(940, 380)}`);

  // 12 Running: alles ausgelegt auf dem Asphalt
  ART['running-liste'] = () => svg('running',
    lin('road', '#4a4a4a', '#2c2c2c') + `<pattern id="grit" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1.3" fill="#777"/><circle cx="13" cy="12" r="1" fill="#222"/><circle cx="9" cy="2" r="0.8" fill="#888"/></pattern>`,
    `<rect width="1000" height="440" fill="url(#road)"/><rect width="1000" height="440" fill="url(#grit)"/>
     <path d="M0 418H1000" stroke="url(#gm)" stroke-width="10"/>
     ${S(at(180, 110, 0.86, -4, T.runshoe()))}${S(at(196, 250, 0.86, 2, T.runshoe()))}
     ${S(at(270, 372, 0.6, -80, T.sock()))}
     ${S(at(440, 168, 0.98, 0, T.shirt()))}
     ${S(at(612, 250, 0.86, 22, T.watch()))}
     ${S(at(770, 110, 0.76, 0, T.headlamp()))}
     ${S(at(900, 290, 0.96, 14, T.bottle()))}
     ${S(at(470, 346, 0.5, -6, T.jacket("url(#gk)", true)))}
     ${check(330, 60)}${check(700, 380)}`);

  // 13 Radsport: alles ausgelegt auf dem Garagenboden
  ART['radsport-liste'] = () => svg('radsport', lin('floor', '#e2e2dd', '#c9c9c2'),
    `<rect width="1000" height="440" fill="url(#floor)"/>
     <path d="M0 146H1000M0 292H1000M250 0V440M500 0V440M750 0V440" stroke="#aaa" stroke-width="2"/>
     <rect y="0" width="1000" height="14" fill="url(#gm)"/>
     ${S(at(172, 170, 1.0, -4, T.bikehelmet()))}
     ${S(at(120, 352, 0.74, -10, T.bikelight(false)))}${S(at(210, 360, 0.74, 8, T.bikelight(true)))}
     ${S(at(430, 200, 0.98, -8, T.ulock()))}
     ${S(at(640, 330, 0.72, -90, T.floorpump()))}
     ${S(at(686, 120, 0.88, -6, T.multitool()))}
     ${S(at(890, 214, 0.92, 6, T.bikecomputer()))}
     ${check(330, 380)}${check(890, 80)}`);

  // 14 Schwimmen: alles ausgelegt am Beckenrand
  ART['schwimmen-liste'] = () => svg('schwimmen',
    `<pattern id="tiles" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#dff1ff"/><path d="M0 0H44V44" fill="none" stroke="#a9d3ef" stroke-width="3"/></pattern>` + lin('water', '#2b8fe6', '#0f4fa8'),
    `<rect width="1000" height="440" fill="url(#tiles)"/>
     <rect y="380" width="1000" height="60" fill="url(#water)"/><rect y="372" width="1000" height="12" fill="#fff" ${o(3)}/>
     ${[[300, 120, 14], [520, 60, 10], [860, 330, 12], [80, 250, 9]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.7}" fill="#fff" opacity="0.7"/>`).join('')}
     ${S(at(176, 108, 0.86, -6, T.swimgoggles('url(#gm)', 'url(#gk)')))}
     ${S(at(170, 280, 0.88, 0, T.swimcap()))}
     ${S(at(394, 220, 0.86, 22, T.pullbuoy()))}
     ${S(at(574, 140, 0.72, -12, T.paddle()))}${S(at(612, 290, 0.72, 14, T.paddle()))}
     ${S(at(790, 196, 0.8, -10, T.fin()))}${S(at(896, 210, 0.8, 10, T.fin()))}
     ${check(480, 330)}${check(950, 60)}`);

  // 15 Wintersport: Packliste im Schnee
  ART['wintersport-liste'] = () => svg('wintersport',
    lin('snow', '#f6fbff', '#d8ecfb') + `<linearGradient id="glens" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd24a"/><stop offset="0.5" stop-color="#ff6a3d"/><stop offset="1" stop-color="#3b5bff"/></linearGradient>`,
    `<rect width="1000" height="440" fill="url(#snow)"/>
     <path d="M0 120C120 100 260 140 400 116S700 96 1000 130M0 300C200 280 380 320 560 296S860 280 1000 300" fill="none" stroke="#c3dcf0" stroke-width="5" opacity="0.8"/>
     ${flakes([[60, 50, 1], [300, 30, 0.8], [520, 410, 1], [960, 50, 0.9], [700, 30, 0.7], [40, 400, 0.8]], 0.9).replace(/#fff/g, '#a9d3ef')}
     ${S(at(170, 170, 0.92, -4, T.skihelmet()))}
     ${S(at(170, 350, 0.76, 4, T.skigoggles()))}
     ${S(at(400, 220, 0.92, 0, T.backprotector()))}
     ${S(at(600, 216, 0.94, 0, T.jacket()))}
     ${S(at(800, 140, 0.7, -10, T.skiglove()))}${S(at(896, 160, 0.7, 12, T.skiglove()))}
     ${S(at(830, 340, 0.64, -76, T.sock('url(#gw)')))}
     ${check(290, 60)}${check(720, 400)}`);

  // 16 Tennis & Padel: alles ausgelegt auf dem Court
  ART['tennis-padel-liste'] = () => svg('racket', lin('court', '#2b6fc0', '#1d528f'),
    `<rect width="1000" height="440" fill="url(#court)"/>
     <path d="M0 70H1000M0 370H1000M500 70V370" stroke="#fff" stroke-width="6" opacity="0.8"/>
     ${S(at(150, 230, 0.96, -18, T.tennisracket()))}
     ${S(at(350, 226, 0.92, 14, T.padelracket()))}
     ${S(at(520, 340, 1, 0, T.tennisball()))}${S(at(572, 310, 1, 40, T.tennisball()))}${S(at(566, 368, 1, 80, T.tennisball()))}
     ${S(at(520, 128, 0.78, -10, T.griproll()))}
     ${S(at(758, 196, 0.84, -4, T.runshoe('url(#gw)')))}
     ${S(at(778, 326, 0.8, 2, T.runshoe()))}
     ${S(at(870, 86, 0.48, 0, T.racketbag()))}
     ${check(660, 400)}${check(960, 220)}`);

  // 17 Boxsack: drei Grössen nebeneinander, mit Messband
  ART['boxsack'] = () => {
    const cm = v => 80 + v * 1.63;
    return svg('kampfsport', lin('wall', '#141414', '#2e2e2e') + glow('lg', 500, 0, 520, '#e0262b', 0.45) + lin('floor', '#2a2a2a', '#151515'),
      `<rect width="1000" height="440" fill="url(#wall)"/><rect width="1000" height="440" fill="url(#lg)"/>
       <rect y="380" width="1000" height="60" fill="url(#floor)"/><rect y="378" width="1000" height="5" fill="url(#gm)"/>
       <rect x="0" y="0" width="1000" height="26" fill="url(#gk)" ${o(3)}/>
       ${S(at(190, 80, 1, 0, T.bag(cm(70) - 80, 70)))}
       ${S(at(440, 80, 1, 0, T.bag(cm(100) - 80, 92)))}
       ${S(at(690, 80, 1, 0, T.bag(cm(165) - 80, 104)))}
       <rect x="884" y="78" width="40" height="${cm(180) - 78}" fill="#ffd23f" ${o(3)}/>
       ${[...Array(19)].map((_, i) => `<path d="M884 ${cm(i * 10)}h${i % 5 ? 12 : 22}" stroke="${K}" stroke-width="2.5"/>`).join('')}
       ${[50, 100, 150].map(v => `<text x="934" y="${cm(v) + 8}" font-family="Segoe UI, Arial" font-weight="900" font-size="22" fill="#fff">${v}</text>`).join('')}
       ${label(190, 412, 'KINDER', { size: 22, bg: '#fff', fg: K, stroke: true })}
       ${label(440, 412, 'BOXEN', { size: 22, bg: '#fff', fg: K, stroke: true })}
       ${label(690, 412, 'KICK & THAI', { size: 22, bg: 'url(#gm)', stroke: true })}`);
  };

  // 18 Zwiebelprinzip: drei Schichten nebeneinander
  ART['zwiebelprinzip'] = () => svg('wintersport',
    lin('sky', '#bfe6ff', '#eef9ff') + lin('fleece', '#8a96a6', '#4f5a68') + lin('base', '#e9fbff', '#9fdcf6'),
    `<rect width="1000" height="440" fill="url(#sky)"/>
     <path d="M0 300L140 200 230 250 380 150 520 250 640 180 780 260 900 170 1000 220V440H0Z" fill="#e4f3ff"/>
     <path d="M380 150L420 182 400 184 440 214M900 170L936 200 916 202 950 228" fill="none" stroke="#a9cfe9" stroke-width="4"/>
     <path d="M0 360C200 340 400 370 600 350S900 344 1000 356V440H0Z" fill="#fff"/>
     ${flakes([[180, 60, 1], [470, 40, 0.8], [760, 70, 1], [960, 110, 0.8], [620, 30, 0.6], [330, 100, 0.6]])}
     ${at(70, 200, 1, 0, `<rect x="-14" y="-110" width="28" height="170" rx="14" fill="#fff" ${o()}/><rect x="-6" y="-20" width="12" height="80" fill="#e0262b"/>
        <circle cy="72" r="26" fill="#e0262b" ${o()}/>${[...Array(6)].map((_, i) => `<path d="M14 ${-90 + i * 18}h10" stroke="${K}" stroke-width="2.5"/>`).join('')}`)}
     ${label(70, 316, '−5°', { size: 22 })}
     ${S(at(260, 210, 0.92, -4, T.longsleeve('url(#base)')))}
     ${S(at(510, 210, 0.98, 0, T.jacket('url(#fleece)', false)))}
     ${S(at(770, 206, 1.02, 4, T.jacket('url(#gm)', true)))}
     <path d="M372 210H404M388 194V226M626 210H658M642 194V226" stroke="${K}" stroke-width="8" stroke-linecap="round"/>
     ${[[260, '1'], [510, '2'], [770, '3']].map(([x, n]) => at(x - 92, 92, 1, 0, `<circle r="26" fill="${K}"/><text y="11" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="900" font-style="italic" font-size="32" fill="#fff">${n}</text>`)).join('')}
     ${label(260, 400, 'BASIS', { size: 24 })}${label(510, 400, 'WÄRME', { size: 24 })}${label(770, 400, 'SCHUTZ', { size: 24, bg: 'url(#gm)' })}`);

  // 19 Schienbeinschoner: drei Grössen auf dem Rasen
  ART['schienbeinschoner'] = () => svg('fussball',
    `<pattern id="grass" width="100" height="440" patternUnits="userSpaceOnUse"><rect width="50" height="440" fill="#2c9e4b"/><rect x="50" width="50" height="440" fill="#248c41"/></pattern>`,
    `<rect width="1000" height="440" fill="url(#grass)"/>
     <path d="M0 340H1000" stroke="#fff" stroke-width="8" opacity="0.85"/>
     <rect x="880" y="40" width="50" height="300" fill="#fff" ${o(3)}/>
     ${[...Array(16)].map((_, i) => `<path d="M880 ${340 - i * 20}h${i % 5 ? 14 : 26}" stroke="${K}" stroke-width="2.5"/>`).join('')}
     ${S(at(140, 300, 0.72, 0, T.ball()))}
     ${S(at(330, 330 - 104 * 0.66, 0.66, 0, T.shinguardSlip()))}
     ${S(at(530, 330 - 104 * 0.84, 0.84, 0, T.shinguardSlip()))}
     ${S(at(740, 330 - 104 * 1.04, 1.04, 0, T.shinguardSlip()))}
     ${label(330, 396, 'S · 120–140', { size: 22, bg: '#fff', fg: K, stroke: true })}
     ${label(530, 396, 'M · 140–160', { size: 22, bg: '#fff', fg: K, stroke: true })}
     ${label(740, 396, 'L · 160–180', { size: 22, bg: 'url(#gm)', stroke: true })}
     <text x="905" y="30" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="900" font-size="20" fill="#fff">CM</text>`);

  // 20 Kurzhanteln: drei Systeme nebeneinander
  ART['kurzhanteln'] = () => svg('fitness',
    lin('wall', '#151515', '#2b2b2b') + glow('lg', 500, 0, 520, '#ff5a1f', 0.4) + `<pattern id="rub" width="110" height="110" patternUnits="userSpaceOnUse"><rect width="110" height="110" fill="#262626"/><path d="M0 0H110V110" fill="none" stroke="#111" stroke-width="3"/><circle cx="30" cy="40" r="1.5" fill="#444"/><circle cx="80" cy="70" r="1.5" fill="#444"/></pattern>`,
    `<rect width="1000" height="440" fill="url(#wall)"/><rect width="1000" height="440" fill="url(#lg)"/>
     <rect y="250" width="1000" height="190" fill="url(#rub)"/><rect y="246" width="1000" height="6" fill="url(#gm)"/>
     ${S(at(172, 196, 1.15, 0, T.plateDumbbell()))}
     ${S(at(496, 190, 1.0, 0, T.selectorDumbbell()))}
     ${S(at(830, 190, 1.05, 0, T.dialDumbbell()))}
     ${label(172, 336, 'SCHEIBEN', { size: 26, bg: '#fff', fg: K, stroke: true })}
     ${label(500, 336, 'STECKSYSTEM', { size: 26, bg: '#fff', fg: K, stroke: true })}
     ${label(830, 336, 'DREHSYSTEM', { size: 26, bg: 'url(#gm)', stroke: true })}
     <g font-family="Segoe UI, Arial" font-weight="700" font-size="22" fill="#cfcfcf" text-anchor="middle"><text x="172" y="392">Wechsel: langsam</text><text x="500" y="392">Wechsel: schnell</text><text x="830" y="392">Wechsel: Sekunden</text></g>`);

  window.ART = ART;
})();
