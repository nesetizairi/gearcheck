// Gezeichnete Einzelteile für die Pin-Szenen (art-szenen.js).
// Jedes Teil ist um den Nullpunkt gezeichnet und wird mit at(x, y, grösse, drehung, teil) platziert.
// Farben: url(#gm) = Farbe der Sportart, #gk dunkel, #gs Metall, #gw weiss, #gwood Holz.
(function () {
  const K = '#0d0d0d';
  let uid = 0;
  const nid = p => p + (++uid);
  const at = (x, y, s, r, inner) => `<g transform="translate(${x} ${y}) rotate(${r || 0}) scale(${s || 1})">${inner}</g>`;
  const o = (w = 4) => `stroke="${K}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const shine = (d, w = 7, op = 0.4) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;

  function defs(c, extra = '') {
    return `<defs>
      <linearGradient id="gm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="0.5" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient>
      <linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient>
      <linearGradient id="gk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4a4a"/><stop offset="0.5" stop-color="#262626"/><stop offset="1" stop-color="#111"/></linearGradient>
      <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fafafa"/><stop offset="0.45" stop-color="#9a9a9a"/><stop offset="0.55" stop-color="#7d7d7d"/><stop offset="1" stop-color="#dcdcdc"/></linearGradient>
      <linearGradient id="gsh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fafafa"/><stop offset="0.45" stop-color="#9a9a9a"/><stop offset="0.55" stop-color="#7d7d7d"/><stop offset="1" stop-color="#dcdcdc"/></linearGradient>
      <linearGradient id="gw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d4d4d0"/></linearGradient>
      <linearGradient id="gwood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9a470"/><stop offset="1" stop-color="#9a6436"/></linearGradient>
      <linearGradient id="gy" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2ff7a"/><stop offset="0.5" stop-color="#d4ee26"/><stop offset="1" stop-color="#94ad00"/></linearGradient>
      <filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="7" stdDeviation="5" flood-color="#000" flood-opacity="0.35"/></filter>
      ${extra}
    </defs>`;
  }

  // Beschriftung im Stil der Website: fett, kursiv, Grossbuchstaben
  function label(x, y, text, opt = {}) {
    const size = opt.size || 26, fg = opt.fg || '#fff', bg = opt.bg || K;
    const w = Math.round(text.length * size * (opt.wf || 0.66) + size * 1.1), h = Math.round(size * 1.6);
    return `<g transform="translate(${x} ${y}) rotate(${opt.r || 0})">
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${Math.round(h / 4)}" fill="${bg}" ${opt.stroke ? o(3) : ''}/>
      <text x="0" y="${Math.round(size * 0.36)}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="900" font-style="italic" font-size="${size}" fill="${fg}" letter-spacing="0.5">${text.replace(/&/g, "&amp;")}</text></g>`;
  }
  function check(x, y, s = 1) {
    return at(x, y, s, 0, `<circle r="20" fill="url(#gm)" ${o(3.5)}/><path d="M-9 0l6 7 12-14" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`);
  }

  const T = {};

  // ---------- Kampfsport ----------
  T.glove = () => `<g transform="translate(-60 -88)">
    <path d="M20 118C6 98 4 58 16 34 28 10 52 2 70 4c28 2 46 24 46 56l-2 34c-2 16-12 26-26 28H32c-6 0-10-2-12-4z" fill="url(#gm)" ${o()}/>
    <path d="M30 116c26 6 58 6 82-14-4 14-14 20-26 22H32z" fill="#000" opacity="0.25"/>
    <path d="M38 26c18-10 46-10 64 4" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5 5" opacity="0.6"/>
    ${shine('M30 42c10-20 30-28 50-26', 9, 0.35)}
    <path d="M22 62C8 64 2 82 9 96c6 12 21 15 31 9 6-6 4-18-2-26z" fill="url(#gm)" ${o()}/>
    ${shine('M14 78c4-6 10-8 16-6', 4)}
    <rect x="28" y="118" width="70" height="56" rx="10" fill="url(#gm)" ${o()}/>
    <rect x="28" y="128" width="70" height="26" fill="#fff" ${o(3)}/>
    <path d="M34 133h58M34 149h58" stroke="${K}" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.5"/></g>`;

  T.wrap = () => `<g>
    <path d="M14 -17H178a6 6 0 0 1 6 6V11a6 6 0 0 1-6 6H14z" fill="url(#gmv)" ${o()}/>
    <rect x="150" y="-17" width="34" height="34" rx="5" fill="#fff" ${o(3)}/>
    <path d="M156 -9h22M156 0h22M156 9h22" stroke="${K}" stroke-width="1.5" opacity="0.35"/>
    <path d="M70 -17v34M112 -17v34" stroke="#000" stroke-width="3" opacity="0.15"/>
    <circle r="42" fill="url(#gm)" ${o()}/>
    <circle r="30" fill="none" stroke="${K}" stroke-width="2.5" opacity="0.35"/>
    <circle r="18" fill="none" stroke="${K}" stroke-width="2.5" opacity="0.35"/>
    <circle r="7" fill="${K}" opacity="0.55"/>
    ${shine('M-26 -28a38 38 0 0 1 30-10', 6)}</g>`;

  T.mouthguard = () => `<g>
    <path d="M-58 22C-62-40-32-64 0-64S62-40 58 22C57 42 30 42 30 24 32-14 18-34 0-34S-32-14-30 24C-30 42-57 42-58 22Z" fill="url(#gm)" ${o()}/>
    <path d="M-45 4C-45-34-22-50 0-50S45-34 45 4" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="1 10" stroke-linecap="round" opacity="0.7"/>
    ${shine('M-40-30C-30-46-14-52 0-52', 6)}</g>`;

  T.shinguard = () => `<g>
    <path d="M-32 60C-54 72-58 100-42 112H42C58 100 54 72 32 60Z" fill="url(#gm)" ${o()}/>
    <path d="M-42-112C-42-132 42-132 42-112L38 44C36 60 22 66 0 66S-36 60-38 44Z" fill="url(#gm)" ${o()}/>
    <path d="M-26-100C-26-112 26-112 26-100L23 34C21 44-21 44-23 34Z" fill="#fff" opacity="0.22" stroke="#fff" stroke-width="2" stroke-dasharray="4 5"/>
    <path d="M-30-56H30M-28-12H28M-26 30H26" stroke="#000" stroke-width="3" opacity="0.18"/>
    <rect x="-50" y="-86" width="100" height="14" rx="5" fill="url(#gk)" ${o(3)}/>
    <rect x="-50" y="8" width="100" height="14" rx="5" fill="url(#gk)" ${o(3)}/>
    <path d="M-30 86H30" stroke="#000" stroke-width="3" opacity="0.2"/>
    ${shine('M-30-118C-14-124 14-124 30-118', 6)}</g>`;

  T.headgear = () => `<g>
    <path d="M-76 30C-82-52-46-92 0-92S82-52 76 30C74 72 54 88 34 86V42C34 6-34 6-34 42V86C-54 88-74 72-76 30Z" fill="url(#gm)" ${o()}/>
    <path d="M-34 86V42C-34 6 34 6 34 42V86" fill="none" ${o(5)}/>
    <path d="M-76 14H-34M34 14H76" stroke="#000" stroke-width="3" opacity="0.25"/>
    <rect x="-34" y="-56" width="68" height="18" rx="5" fill="#fff" ${o(3)}/>
    <path d="M-60-34C-62-6-54 30-48 60M60-34C62-6 54 30 48 60" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 5" opacity="0.6"/>
    ${shine('M-52-62C-26-84 20-86 46-66', 9, 0.35)}</g>`;

  T.mitt = () => `<g>
    <ellipse rx="64" ry="72" fill="url(#gk)" ${o()}/>
    <ellipse rx="46" ry="52" fill="url(#gm)" ${o(3)}/>
    <circle r="19" fill="#fff" ${o(3)}/>
    <ellipse rx="56" ry="63" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 6" opacity="0.5"/>
    ${shine('M-40-48C-22-62 6-64 26-56', 6, 0.3)}</g>`;

  T.cup = () => `<g>
    <path d="M-58-38H58C54 12 32 58 0 66-32 58-54 12-58-38Z" fill="url(#gw)" ${o()}/>
    <path d="M-32-24C-26 10-14 34 0 46" fill="none" stroke="#000" stroke-width="6" opacity="0.12" stroke-linecap="round"/>
    <circle cx="-14" cy="0" r="5" fill="${K}" opacity="0.5"/><circle cx="14" cy="0" r="5" fill="${K}" opacity="0.5"/><circle cx="0" cy="22" r="5" fill="${K}" opacity="0.5"/>
    <rect x="-82" y="-58" width="164" height="22" rx="9" fill="url(#gm)" ${o(3)}/>
    <path d="M-74-47H74" stroke="#fff" stroke-width="2" stroke-dasharray="5 5" opacity="0.6"/></g>`;

  T.bag = (h = 200, w = 92) => `<g>
    <path d="M0-46L${-w / 2 + 8} 4M0-46L${w / 2 - 8} 4M0-46L-12 2M0-46L12 2" stroke="#9a9a9a" stroke-width="3"/>
    <circle cy="-50" r="8" fill="none" stroke="#bdbdbd" stroke-width="4"/>
    <rect x="${-w / 2}" y="0" width="${w}" height="${h}" rx="${w * 0.2}" fill="url(#gm)" ${o()}/>
    <rect x="${-w / 2}" y="14" width="${w}" height="16" fill="url(#gk)" ${o(3)}/>
    <rect x="${-w / 2}" y="${h - 34}" width="${w}" height="16" fill="url(#gk)" ${o(3)}/>
    <path d="M${-w / 2 + 14} 40V${h - 44}" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.28"/>
    <path d="M${w / 2 - 16} 40V${h - 44}" stroke="#000" stroke-width="12" stroke-linecap="round" opacity="0.18"/></g>`;

  T.scale = (txt = '72 kg') => `<g>
    <rect x="-108" y="-118" width="216" height="236" rx="34" fill="url(#gw)" ${o()}/>
    <rect x="-94" y="-104" width="188" height="208" rx="26" fill="none" stroke="#000" stroke-width="2" opacity="0.12"/>
    <rect x="-66" y="-90" width="132" height="54" rx="10" fill="${K}"/>
    <text x="0" y="-51" text-anchor="middle" font-family="Consolas, monospace" font-weight="700" font-size="34" fill="#7cff9a">${txt}</text>
    <path d="M-74 -6C-82 30-70 82-40 90-20 94-14 70-18 40-22 10-34-8-52-10-62-10-70-10-74-6Z" fill="url(#gk)" opacity="0.85"/>
    <path d="M74 -6C82 30 70 82 40 90 20 94 14 70 18 40 22 10 34-8 52-10 62-10 70-10 74-6Z" fill="url(#gk)" opacity="0.85"/>
    ${shine('M-90-100C-60-112 20-114 60-110', 6, 0.7)}</g>`;

  // ---------- Fussball ----------
  T.boot = () => `<g>
    <path d="M-112 12C-114-22-98-38-72-42L-22-54C0-58 22-52 42-38 72-18 102-8 114 4 120 12 118 24 106 26H-104C-112 26-113 20-112 12Z" fill="url(#gm)" ${o()}/>
    <path d="M-58-44C-40-30-24-28-6-32" fill="none" ${o(3)}/>
    <path d="M-6-50L40-30M4-54L50-34M14-56L58-37" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <path d="M-96 2C-40-8 30-6 104 10" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity="0.85"/>
    <rect x="-110" y="22" width="226" height="11" rx="4" fill="${K}"/>
    <g fill="#e9e9e9" ${o(2.5)}><rect x="-96" y="31" width="13" height="16" rx="3"/><rect x="-62" y="31" width="13" height="16" rx="3"/><rect x="14" y="31" width="13" height="16" rx="3"/><rect x="50" y="31" width="13" height="16" rx="3"/><rect x="84" y="31" width="13" height="16" rx="3"/></g>
    ${shine('M-90-30C-70-38-50-42-30-44', 6, 0.45)}</g>`;

  // Sohle von unten: typ = 'FG' | 'AG' | 'TF'
  T.sole = typ => {
    const id = nid('sole');
    const pts = [];
    const inside = (x, y) => ((x / 42) ** 2 + ((y + 58) / 66) ** 2 <= 1) || ((x / 31) ** 2 + ((y - 92) / 38) ** 2 <= 1);
    const step = typ === 'FG' ? 0 : typ === 'AG' ? 17 : 11;
    if (typ === 'FG') {
      pts.push([-24, -96], [16, -104], [-30, -60], [28, -66], [-24, -24], [24, -26], [0, -64], [-18, 78], [18, 78], [-16, 112], [16, 112]);
    } else {
      for (let y = -118; y <= 126; y += step) for (let x = -44; x <= 44; x += step) {
        const xx = x + ((Math.round((y + 118) / step) % 2) ? step / 2 : 0);
        if (inside(xx, y) && inside(xx * 1.15, y * 1.03)) pts.push([xx, y]);
      }
    }
    const r = typ === 'FG' ? 10 : typ === 'AG' ? 6 : 3.6;
    const studs = pts.map(([x, y]) => typ === 'FG'
      ? `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gw)" ${o(2.5)}/><circle cx="${x - 2}" cy="${y - 2}" r="3" fill="#fff"/>`
      : `<circle cx="${x}" cy="${y}" r="${r}" fill="${typ === 'AG' ? '#f2f2f2' : '#3c3c3c'}" stroke="${K}" stroke-width="${typ === 'AG' ? 2 : 1.2}"/>`).join('');
    return `<g><clipPath id="${id}"><path d="M0-134C42-134 54-92 52-52 50-12 38 8 38 40 38 82 46 112 32 130 20 142-20 142-32 130-46 112-38 82-38 40-38 8-50-12-52-52-54-92-42-134 0-134Z"/></clipPath>
      <path d="M0-134C42-134 54-92 52-52 50-12 38 8 38 40 38 82 46 112 32 130 20 142-20 142-32 130-46 112-38 82-38 40-38 8-50-12-52-52-54-92-42-134 0-134Z" fill="${typ === 'TF' ? '#1d1d1d' : 'url(#gk)'}" ${o()}/>
      <path d="M-30 10C-10 20 10 20 30 10" fill="none" stroke="url(#gm)" stroke-width="10"/>
      <g clip-path="url(#${id})">${studs}</g>
      <path d="M-34-110C-22-126 4-128 22-122" fill="none" stroke="#fff" stroke-width="4" opacity="0.25" stroke-linecap="round"/></g>`;
  };

  T.ball = () => {
    const pent = (cx, cy, r, rot) => {
      let d = '';
      for (let i = 0; i < 5; i++) { const a = (rot + i * 72) * Math.PI / 180; d += (i ? 'L' : 'M') + (cx + r * Math.sin(a)).toFixed(1) + ' ' + (cy - r * Math.cos(a)).toFixed(1); }
      return d + 'Z';
    };
    const id = nid('ball');
    let p = pent(0, 0, 17, 0);
    const outer = [0, 72, 144, 216, 288].map(a => { const rad = a * Math.PI / 180; return pent(44 * Math.sin(rad), -44 * Math.cos(rad), 16, a + 36); }).join('');
    const seams = [0, 72, 144, 216, 288].map(a => { const r1 = a * Math.PI / 180; return `M${(16 * Math.sin(r1)).toFixed(1)} ${(-16 * Math.cos(r1)).toFixed(1)}L${(30 * Math.sin(r1)).toFixed(1)} ${(-30 * Math.cos(r1)).toFixed(1)}`; }).join('');
    return `<g><clipPath id="${id}"><circle r="54"/></clipPath><circle r="54" fill="url(#gw)"/>
      <g clip-path="url(#${id})"><path d="${p}${outer}" fill="${K}"/><path d="${seams}" stroke="${K}" stroke-width="2.5"/></g>
      <circle r="54" fill="none" ${o()}/><path d="M-34-36C-20-48 0-52 14-50" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.6"/></g>`;
  };

  T.discCone = () => `<g><circle r="30" fill="url(#gm)" ${o(3)}/><circle r="20" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/><circle r="11" fill="#000" opacity="0.35" ${o(2.5)}/></g>`;

  T.pump = () => `<g>
    <rect x="-90" y="-13" width="150" height="26" rx="8" fill="url(#gm)" ${o()}/>
    <rect x="-112" y="-30" width="22" height="60" rx="8" fill="url(#gk)" ${o(3.5)}/>
    <rect x="60" y="-8" width="22" height="16" rx="3" fill="url(#gk)" ${o(3)}/>
    <path d="M82 0H120" stroke="#cfcfcf" stroke-width="5"/><path d="M82 0H120" stroke="${K}" stroke-width="1" opacity="0.5"/>
    ${shine('M-80-4H46', 5, 0.45)}</g>`;

  T.keeperglove = () => `<g>
    <g fill="#ececec" ${o()}>
      <rect x="-46" y="-94" width="22" height="90" rx="11"/><rect x="-22" y="-110" width="22" height="106" rx="11"/>
      <rect x="2" y="-106" width="22" height="102" rx="11"/><rect x="26" y="-88" width="22" height="84" rx="11"/>
    </g>
    <path d="M-50-16C-78-30-90-8-80 8L-52 34Z" fill="#ececec" ${o()}/>
    <path d="M-50-20H48V40C48 58 34 66 0 66S-50 58-50 40Z" fill="#ececec" ${o()}/>
    <path d="M-36-8H34M-36 14H34" stroke="#000" stroke-width="2" opacity="0.15"/>
    <rect x="-48" y="60" width="96" height="46" rx="8" fill="url(#gm)" ${o()}/>
    <rect x="-48" y="72" width="96" height="18" fill="${K}" opacity="0.8"/>
    ${shine('M-36-82V-30', 5, 0.8)}</g>`;

  T.sock = (fill = 'url(#gw)') => `<g>
    <path d="M-22-86H22V26C22 38 32 42 48 44 70 48 76 62 72 76 68 88 54 90 42 88L-8 80C-26 76-28 62-24 40Z" fill="${fill}" ${o()}/>
    <rect x="-22" y="-86" width="44" height="26" fill="url(#gm)" ${o(3)}/>
    <path d="M-22-70H22" stroke="#fff" stroke-width="3" opacity="0.7"/>
    <path d="M44 46C60 50 70 60 70 72" fill="none" stroke="#000" stroke-width="9" opacity="0.12" stroke-linecap="round"/></g>`;

  T.shinguardSlip = () => `<g>
    <path d="M-44-90C-44-112 44-112 44-90L38 70C36 92 18 102 0 104-18 102-36 92-38 70Z" fill="url(#gm)" ${o()}/>
    <path d="M-30-82C-30-96 30-96 30-82L26 60C24 76 12 84 0 86-12 84-24 76-26 60Z" fill="#fff" opacity="0.2"/>
    <path d="M-28-40H28M-26 0H26M-24 40H24" stroke="#000" stroke-width="3" opacity="0.16"/>
    <path d="M-36-104C-16-112 16-112 36-104" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.45"/>
    <circle cx="0" cy="-58" r="12" fill="#fff" ${o(2.5)}/></g>`;

  // ---------- Running ----------
  T.runshoe = (fill = 'url(#gm)') => `<g>
    <path d="M-110-6C-112-34-98-52-74-56L-30-62C-6-66 16-58 34-44 64-24 98-16 110-4 116 4 114 10 106 12H-106Z" fill="${fill}" ${o()}/>
    <path d="M-114 8H110C118 8 120 18 112 24 102 34 60 38 0 38L-104 42C-120 42-122 22-114 8Z" fill="url(#gw)" ${o()}/>
    <path d="M-110 34C-60 30 40 30 112 22" fill="none" stroke="${K}" stroke-width="3" opacity="0.5"/>
    <path d="M-56-50C-40-36-22-34-6-38" fill="none" ${o(3)}/>
    <path d="M-2-50L34-34M8-54L44-38M18-56L52-42" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <path d="M-100-14C-60-26-10-24 40-10" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
    <path d="M-112-34L-100-58" stroke="${K}" stroke-width="10" stroke-linecap="round"/>
    ${shine('M-90-40C-74-48-56-52-38-54', 5, 0.4)}</g>`;

  T.watch = (txt = '5.21') => `<g>
    <rect x="-17" y="-96" width="34" height="192" rx="12" fill="url(#gk)" ${o(3.5)}/>
    <path d="M-17-70H17M-17-56H17M-17 56H17M-17 70H17" stroke="#555" stroke-width="2"/>
    <circle r="42" fill="url(#gs)" ${o()}/><circle r="34" fill="${K}"/>
    <text y="4" text-anchor="middle" font-family="Consolas, monospace" font-weight="700" font-size="22" fill="url(#gm)">${txt}</text>
    <text y="22" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="700" font-size="10" fill="#bdbdbd">KM</text>
    <path d="M-26-10A27 27 0 0 1 20-20" fill="none" stroke="url(#gm)" stroke-width="4" stroke-linecap="round"/>
    <rect x="40" y="-12" width="9" height="24" rx="3" fill="url(#gs)" ${o(2.5)}/></g>`;

  T.headlamp = () => `<g>
    <ellipse rx="78" ry="54" fill="none" stroke="${K}" stroke-width="18"/>
    <ellipse rx="78" ry="54" fill="none" stroke="url(#gm)" stroke-width="11"/>
    <rect x="-34" y="30" width="68" height="40" rx="12" fill="url(#gk)" ${o()}/>
    <circle cy="50" r="13" fill="#fff9d6" ${o(3)}/><circle cx="-3" cy="47" r="4" fill="#fff"/>
    <rect x="18" y="38" width="8" height="8" rx="2" fill="url(#gm)"/></g>`;

  T.shirt = (fill = 'url(#gm)') => `<g>
    <path d="M-42-74L-14-78C-8-66 8-66 14-78L42-74 84-42 66-12 46-22V80H-46V-22L-66-12-84-42Z" fill="${fill}" ${o()}/>
    <path d="M-14-78C-8-62 8-62 14-78" fill="none" ${o(3)}/>
    <path d="M-46-22V20M46-22V20" stroke="#000" stroke-width="2" opacity="0.15"/>
    <path d="M-30-56C-34-20-32 30-30 66" fill="none" stroke="#fff" stroke-width="10" opacity="0.22" stroke-linecap="round"/></g>`;

  T.bottle = () => `<g>
    <rect x="-26" y="-60" width="52" height="128" rx="18" fill="url(#gm)" opacity="0.92" ${o()}/>
    <rect x="-18" y="-84" width="36" height="28" rx="6" fill="url(#gk)" ${o(3.5)}/>
    <rect x="-7" y="-98" width="14" height="16" rx="3" fill="url(#gk)" ${o(3)}/>
    <path d="M-26-10H26M-26 20H26" stroke="#000" stroke-width="2" opacity="0.2"/>
    ${shine('M-14-46V50', 6, 0.45)}</g>`;

  // ---------- Radsport ----------
  T.bikehelmet = () => `<g>
    <path d="M-104 30C-108-32-54-76 8-74 70-72 110-34 106 18 104 32 94 36 82 34L-92 40C-100 40-104 36-104 30Z" fill="url(#gm)" ${o()}/>
    <g fill="${K}"><path d="M-62-30C-50-46-36-54-20-58L-14-40C-30-34-42-26-50-14Z"/><path d="M-4-60C14-62 32-58 46-50L38-32C26-38 12-42-2-42Z"/><path d="M60-42C74-32 84-20 90-6L72-2C68-14 62-22 52-28Z"/></g>
    <path d="M-92 40C-40 30 30 28 82 34" fill="none" stroke="#fff" stroke-width="5" opacity="0.6"/>
    <path d="M-30 40L-10 96 30 40M-10 96L20 112" fill="none" stroke="${K}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="12" y="104" width="22" height="14" rx="4" fill="url(#gk)" ${o(2.5)}/>
    ${shine('M-80-8C-66-44-30-64 4-66', 8, 0.35)}</g>`;

  T.bikelight = (rear = false) => `<g>
    <rect x="-28" y="-44" width="56" height="88" rx="16" fill="url(#gk)" ${o()}/>
    <rect x="-18" y="-32" width="36" height="52" rx="10" fill="${rear ? '#ff3b3b' : '#fffbe0'}" ${o(3)}/>
    <path d="M-10-24V10" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    <circle cy="32" r="5" fill="url(#gm)"/></g>`;

  T.ulock = () => `<g>
    <path d="M-44 44V-30A44 44 0 0 1 44-30V44" fill="none" stroke="${K}" stroke-width="28"/>
    <path d="M-44 44V-30A44 44 0 0 1 44-30V44" fill="none" stroke="url(#gm)" stroke-width="18"/>
    ${shine('M-44 20V-30A44 44 0 0 1-10-72', 5, 0.5)}
    <rect x="-70" y="30" width="140" height="34" rx="12" fill="url(#gs)" ${o()}/>
    <circle cx="30" cy="47" r="7" fill="${K}"/><rect x="28" y="47" width="4" height="10" fill="${K}"/></g>`;

  T.floorpump = () => `<g>
    <rect x="-70" y="80" width="140" height="18" rx="7" fill="url(#gk)" ${o()}/>
    <rect x="-17" y="-96" width="34" height="180" rx="8" fill="url(#gm)" ${o()}/>
    <rect x="-4" y="-130" width="8" height="40" fill="url(#gs)" ${o(2.5)}/>
    <rect x="-52" y="-142" width="104" height="20" rx="10" fill="url(#gk)" ${o()}/>
    <circle cy="44" r="22" fill="#fff" ${o(3.5)}/><path d="M0 44L12 32" stroke="#e0262b" stroke-width="3" stroke-linecap="round"/>
    <path d="M17-40C60-40 70 10 58 60 50 92 72 100 90 92" fill="none" stroke="${K}" stroke-width="7" stroke-linecap="round"/>
    ${shine('M-8-86V18', 5, 0.45)}</g>`;

  T.multitool = () => `<g>
    ${[-62, -40, -18, 8].map(a => `<g transform="rotate(${a} -50 0)"><rect x="-50" y="-6" width="110" height="12" rx="5" fill="url(#gs)" ${o(3)}/></g>`).join('')}
    <rect x="-64" y="-18" width="120" height="36" rx="16" fill="url(#gk)" ${o()}/>
    <rect x="-46" y="-8" width="40" height="16" rx="6" fill="url(#gm)"/>
    <circle cx="-50" cy="0" r="7" fill="url(#gs)" ${o(2)}/><circle cx="40" cy="0" r="7" fill="url(#gs)" ${o(2)}/></g>`;

  T.bikecomputer = (txt = '32.4') => `<g>
    <rect x="-50" y="-40" width="100" height="80" rx="16" fill="url(#gk)" ${o()}/>
    <rect x="-38" y="-28" width="76" height="50" rx="6" fill="#d7ecd2" ${o(2.5)}/>
    <text x="0" y="6" text-anchor="middle" font-family="Consolas, monospace" font-weight="700" font-size="24" fill="${K}">${txt}</text>
    <text x="0" y="18" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="700" font-size="9" fill="#3a3a3a">KM/H</text>
    <rect x="-14" y="40" width="28" height="12" rx="3" fill="url(#gm)" ${o(2.5)}/></g>`;

  // ---------- Schwimmen ----------
  T.swimgoggles = (lens = 'url(#gm)', strap = 'url(#gk)') => `<g>
    <path d="M-120 6C-100-30 100-30 120 6" fill="none" stroke="${K}" stroke-width="14" stroke-linecap="round"/>
    <path d="M-120 6C-100-30 100-30 120 6" fill="none" stroke="${strap}" stroke-width="8" stroke-linecap="round"/>
    <path d="M-12 0C-6-8 6-8 12 0" fill="none" ${o(6)}/>
    <ellipse cx="-44" cy="4" rx="36" ry="25" fill="#1b1b1b" ${o()}/><ellipse cx="44" cy="4" rx="36" ry="25" fill="#1b1b1b" ${o()}/>
    <ellipse cx="-44" cy="4" rx="28" ry="18" fill="${lens}"/><ellipse cx="44" cy="4" rx="28" ry="18" fill="${lens}"/>
    <path d="M-60-4C-54-12-44-14-36-12M28-4C34-12 44-14 52-12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.75"/></g>`;

  T.swimcap = () => `<g>
    <path d="M-80 40C-84-26-44-66 0-66S84-26 80 40C60 48-60 48-80 40Z" fill="url(#gm)" ${o()}/>
    <path d="M-80 40C-60 30 60 30 80 40" fill="none" stroke="#000" stroke-width="3" opacity="0.2"/>
    ${shine('M-52-30C-36-52-8-58 16-56', 10, 0.35)}</g>`;

  T.pullbuoy = () => `<g>
    <rect x="-34" y="-86" width="68" height="76" rx="30" fill="url(#gm)" ${o()}/>
    <rect x="-34" y="10" width="68" height="76" rx="30" fill="url(#gm)" ${o()}/>
    <rect x="-22" y="-16" width="44" height="32" rx="8" fill="url(#gw)" ${o(3.5)}/>
    ${shine('M-20-70V-30M-20 26V66', 6, 0.4)}</g>`;

  T.paddle = () => `<g>
    <path d="M-50-64C-50-84 50-84 50-64V54C50 80 30 92 0 92S-50 80-50 54Z" fill="url(#gm)" opacity="0.92" ${o()}/>
    ${[-30, 0, 30].map(x => [-50, -20, 10, 40].map(y => `<circle cx="${x}" cy="${y}" r="5" fill="${K}" opacity="0.55"/>`).join('')).join('')}
    <path d="M-50-30H50M-50 24H50" stroke="url(#gk)" stroke-width="10"/>
    ${shine('M-36-66C-20-74 10-74 30-68', 5, 0.5)}</g>`;

  T.fin = () => `<g>
    <path d="M-34-80C-34-100 34-100 34-80L30-8C60 40 66 84 50 100H-50C-66 84-60 40-30-8Z" fill="url(#gm)" ${o()}/>
    <path d="M-24-76C-24-88 24-88 24-76L22-24H-22Z" fill="url(#gk)" ${o(3)}/>
    <path d="M-16 0C-28 40-30 70-24 92M16 0C28 40 30 70 24 92" fill="none" stroke="#000" stroke-width="4" opacity="0.2"/></g>`;

  // ---------- Wintersport ----------
  T.skihelmet = () => `<g>
    <path d="M-100 34C-106-36-56-84 6-84 70-84 108-38 102 26 100 40 90 46 76 44L-84 46C-94 46-100 42-100 34Z" fill="url(#gm)" ${o()}/>
    <path d="M-60 46C-64 70-50 92-28 92S6 74 4 46Z" fill="url(#gk)" ${o()}/>
    <circle cx="-28" cy="66" r="10" fill="none" stroke="#555" stroke-width="3"/>
    <path d="M-84 46C-30 36 30 34 76 44" fill="none" stroke="${K}" stroke-width="3" opacity="0.4"/>
    <path d="M40-70C60-60 76-46 84-30" fill="none" stroke="#000" stroke-width="9" opacity="0.15" stroke-linecap="round"/>
    ${shine('M-74-20C-58-58-26-74 8-76', 10, 0.38)}</g>`;

  T.skigoggles = (lens = 'url(#glens)') => `<g>
    <path d="M-120 0H120" stroke="${K}" stroke-width="26" stroke-linecap="round"/>
    <path d="M-120 0H120" stroke="url(#gm)" stroke-width="18" stroke-linecap="round"/>
    <path d="M-86-38H86C98-38 104-30 104-18V18C104 32 94 40 80 40 52 40 36 26 22 26H-22C-36 26-52 40-80 40-94 40-104 32-104 18V-18C-104-30-98-38-86-38Z" fill="url(#gk)" ${o()}/>
    <path d="M-80-28H80C88-28 92-22 92-14V14C92 24 86 30 76 30 54 30 40 18 24 18H-24C-40 18-54 30-76 30-86 30-92 24-92 14V-14C-92-22-88-28-80-28Z" fill="${lens}"/>
    <path d="M-76-18L-40-18M50-18L70-18" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.7"/></g>`;

  T.skiglove = () => `<g>
    <path d="M-44-10C-48-40-46-80-24-88 0-96 34-94 42-70 50-40 48-4 44 20H-40Z" fill="url(#gk)" ${o()}/>
    <path d="M-44 0C-72-10-86 10-76 30L-40 44Z" fill="url(#gk)" ${o()}/>
    <path d="M-20-86V-20M4-92V-20M26-86V-20" stroke="#000" stroke-width="4" opacity="0.4"/>
    <rect x="-46" y="16" width="94" height="64" rx="12" fill="url(#gm)" ${o()}/>
    <path d="M-46 40H48" stroke="${K}" stroke-width="3" opacity="0.4"/>
    <rect x="-20" y="50" width="40" height="14" rx="4" fill="${K}"/>
    ${shine('M-30-70C-20-82 0-86 16-84', 6, 0.3)}</g>`;

  T.backprotector = () => `<g>
    <path d="M-44-104C-70-104-76-70-62-50M44-104C70-104 76-70 62-50" fill="none" stroke="${K}" stroke-width="16" stroke-linecap="round"/>
    <path d="M-44-104C-70-104-76-70-62-50M44-104C70-104 76-70 62-50" fill="none" stroke="url(#gm)" stroke-width="9" stroke-linecap="round"/>
    <path d="M-56-104C-56-124 56-124 56-104V76C56 92 40 100 0 100S-56 92-56 76Z" fill="url(#gm)" ${o()}/>
    ${[-102, -64, -26, 12].map((y, i) => `<rect x="${-42 + i * 2}" y="${y}" width="${84 - i * 4}" height="32" rx="11" fill="url(#gk)" ${o(3.5)}/><path d="M${-30 + i * 2} ${y + 9}H${30 - i * 2}" stroke="#fff" stroke-width="3" opacity="0.25"/>`).join('')}
    <rect x="-84" y="58" width="168" height="28" rx="10" fill="url(#gk)" ${o()}/><rect x="-14" y="62" width="28" height="20" rx="4" fill="url(#gs)" ${o(2.5)}/></g>`;

  T.jacket = (fill = 'url(#gm)', hood = true) => `<g>
    ${hood ? `<path d="M-34-96C-30-122 30-122 34-96L26-70H-26Z" fill="${fill}" ${o()}/>` : ''}
    <path d="M-48-86L-20-92 0-70 20-92 48-86 96-46 100 40 72 44 62-10 54 96H-54L-62-10-72 44-100 40-96-46Z" fill="${fill}" ${o()}/>
    <path d="M0-70V96" stroke="${K}" stroke-width="4"/><path d="M0-70V96" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3"/>
    <path d="M-40 20H-14M14 20H40" stroke="${K}" stroke-width="3" opacity="0.6"/>
    <path d="M-36-60C-40-10-40 40-38 84" fill="none" stroke="#fff" stroke-width="12" opacity="0.18" stroke-linecap="round"/>
    <path d="M-100 34H-72M100 34H72" stroke="${K}" stroke-width="6"/></g>`;

  T.longsleeve = (fill) => `<g>
    <path d="M-40-80L-14-84C-8-72 8-72 14-84L40-80 70-56 92 60 70 64 50-20 46 86H-46L-50-20-70 64-92 60-70-56Z" fill="${fill}" ${o()}/>
    <path d="M-14-84C-8-68 8-68 14-84" fill="none" ${o(3)}/>
    <path d="M-30-60C-34-20-32 40-30 76" fill="none" stroke="#fff" stroke-width="10" opacity="0.2" stroke-linecap="round"/></g>`;

  // ---------- Tennis & Padel ----------
  T.tennisracket = () => {
    const id = nid('str');
    let s = '';
    for (let x = -48; x <= 48; x += 12) s += `M${x} -140V0`;
    for (let y = -134; y <= -6; y += 12) s += `M-60 ${y}H60`;
    return `<g><clipPath id="${id}"><ellipse cy="-70" rx="52" ry="66"/></clipPath>
      <path d="M-14 0L-6 70H6L14 0" fill="none" stroke="${K}" stroke-width="14" stroke-linejoin="round"/>
      <path d="M-14 0L-6 70H6L14 0" fill="none" stroke="url(#gm)" stroke-width="7" stroke-linejoin="round"/>
      <g clip-path="url(#${id})"><path d="${s}" stroke="#f4f4f4" stroke-width="2"/></g>
      <ellipse cy="-70" rx="56" ry="70" fill="none" stroke="${K}" stroke-width="16"/>
      <ellipse cy="-70" rx="56" ry="70" fill="none" stroke="url(#gm)" stroke-width="9"/>
      <rect x="-11" y="66" width="22" height="84" rx="6" fill="url(#gk)" ${o(3.5)}/>
      <path d="M-11 82l22-8M-11 100l22-8M-11 118l22-8M-11 136l22-8" stroke="#555" stroke-width="2"/>
      <path d="M-40-118C-26-134 0-140 20-136" fill="none" stroke="#fff" stroke-width="3" opacity="0.6" stroke-linecap="round"/></g>`;
  };

  T.padelracket = () => `<g>
    <path d="M-60-60C-60-120 60-120 60-60 60-10 30 10 14 22L8 64H-8L-14 22C-30 10-60-10-60-60Z" fill="url(#gm)" ${o()}/>
    <path d="M-50-62C-50-108 50-108 50-62 50-24 26-6 0-2-26-6-50-24-50-62Z" fill="#000" opacity="0.12"/>
    ${(() => { let c = ''; for (let y = -96; y <= -12; y += 14) for (let x = -42; x <= 42; x += 14) { const xx = x + ((y / 14) % 2 ? 7 : 0); if ((xx / 48) ** 2 + ((y + 58) / 50) ** 2 < 1) c += `<circle cx="${xx}" cy="${y}" r="3.5" fill="${K}" opacity="0.7"/>`; } return c; })()}
    <path d="M-12 10L0 30 12 10" fill="none" stroke="${K}" stroke-width="3"/>
    <rect x="-11" y="60" width="22" height="76" rx="6" fill="url(#gk)" ${o(3.5)}/>
    <path d="M0 136C-14 156-14 170 0 176 14 170 14 156 0 136" fill="none" stroke="${K}" stroke-width="4"/>
    ${shine('M-40-96C-24-112 6-116 28-108', 7, 0.45)}</g>`;

  T.tennisball = () => `<g><circle r="26" fill="url(#gy)" ${o(3.5)}/>
    <path d="M-20-16C-6-8-6 8-20 16M20-16C6-8 6 8 20 16" fill="none" stroke="#fff" stroke-width="3.5"/>
    <path d="M-14-14C-8-20 0-22 6-22" fill="none" stroke="#fff" stroke-width="4" opacity="0.5" stroke-linecap="round"/></g>`;

  T.griproll = () => `<g>
    <path d="M14 -13H120a6 6 0 0 1 6 6V7a6 6 0 0 1-6 6H14z" fill="#f4f4f4" ${o(3.5)}/>
    <circle r="30" fill="#f4f4f4" ${o(3.5)}/><circle r="20" fill="none" stroke="${K}" stroke-width="2" opacity="0.3"/>
    <circle r="11" fill="url(#gm)" ${o(2.5)}/></g>`;

  T.racketbag = () => `<g>
    <path d="M-150-40C-150-62-130-70-100-70H110C140-70 156-56 156-30V34C156 56 140 66 110 66H-100C-130 66-150 56-150 34Z" fill="url(#gk)" ${o()}/>
    <path d="M-140-10H146" stroke="url(#gm)" stroke-width="12"/>
    <path d="M-140-10H146" stroke="${K}" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
    <rect x="90" y="-20" width="16" height="22" rx="4" fill="url(#gs)" ${o(2)}/>
    <path d="M-80-70C-70-100 70-100 80-70" fill="none" stroke="${K}" stroke-width="12" stroke-linecap="round"/>
    ${shine('M-120-50H90', 6, 0.15)}</g>`;

  // ---------- Home-Gym ----------
  T.dumbbell = () => `<g>
    <rect x="-46" y="-9" width="92" height="18" rx="5" fill="url(#gs)" ${o(3)}/>
    <path d="M-30-9V9M-20-9V9M-10-9V9M0-9V9M10-9V9M20-9V9M30-9V9" stroke="#666" stroke-width="2"/>
    <path d="M-92-34L-76-44H-56L-46-34V34L-56 44H-76L-92 34Z" fill="url(#gk)" ${o()}/>
    <path d="M92-34L76-44H56L46-34V34L56 44H76L92 34Z" fill="url(#gk)" ${o()}/>
    <path d="M-84-28V28M84-28V28" stroke="#fff" stroke-width="4" opacity="0.2"/></g>`;

  T.plateDumbbell = () => `<g>
    <rect x="-122" y="-8" width="244" height="16" rx="5" fill="url(#gs)" ${o(3)}/>
    <rect x="-36" y="-12" width="72" height="24" rx="6" fill="url(#gk)" ${o(3)}/>
    <path d="M-28-12V12M-18-12V12M-8-12V12M2-12V12M12-12V12M22-12V12" stroke="#555" stroke-width="2"/>
    ${[[-98, 56], [-82, 48], [-68, 38]].map(([x, h]) => `<rect x="${x - 7}" y="${-h}" width="14" height="${2 * h}" rx="5" fill="url(#gk)" ${o(3)}/><rect x="${-x - 7}" y="${-h}" width="14" height="${2 * h}" rx="5" fill="url(#gk)" ${o(3)}/>`).join('')}
    <rect x="-56" y="-20" width="12" height="40" rx="4" fill="url(#gm)" ${o(3)}/><rect x="44" y="-20" width="12" height="40" rx="4" fill="url(#gm)" ${o(3)}/>
    <path d="M-50-14V14M50-14V14" stroke="#fff" stroke-width="2" opacity="0.6"/></g>`;

  T.selectorDumbbell = () => `<g>
    <rect x="-130" y="30" width="260" height="34" rx="8" fill="url(#gk)" ${o()}/>
    ${[-110, -94, -78, -62, 62, 78, 94, 110].map((x, i) => `<rect x="${x - 7}" y="-48" width="14" height="80" rx="4" fill="${i === 0 || i === 7 ? 'url(#gm)' : 'url(#gk)'}" ${o(2.5)}/>`).join('')}
    <rect x="-56" y="-8" width="112" height="16" rx="5" fill="url(#gs)" ${o(3)}/>
    <rect x="-30" y="-12" width="60" height="24" rx="6" fill="url(#gk)" ${o(3)}/>
    <path d="M140-6L152 10" stroke="${K}" stroke-width="5"/><circle cx="140" cy="-14" r="10" fill="url(#gm)" ${o(3)}/>
    <path d="M128-6H150" stroke="url(#gs)" stroke-width="5"/><path d="M128-6H150" stroke="${K}" stroke-width="1"/></g>`;

  T.dialDumbbell = () => `<g>
    <path d="M-140 20C-140 0-120-4-110-4H110C120-4 140 0 140 20V58H-140Z" fill="url(#gk)" ${o()}/>
    <rect x="-120" y="-48" width="64" height="88" rx="18" fill="url(#gk)" ${o()}/><rect x="56" y="-48" width="64" height="88" rx="18" fill="url(#gk)" ${o()}/>
    <path d="M-108-36V30M-96-36V30M-84-36V30M-72-36V30M72-36V30M84-36V30M96-36V30M108-36V30" stroke="#444" stroke-width="3"/>
    <rect x="-56" y="-10" width="112" height="20" rx="6" fill="url(#gk)" ${o(3)}/>
    <circle cx="-88" cy="46" r="16" fill="url(#gm)" ${o(3)}/><circle cx="88" cy="46" r="16" fill="url(#gm)" ${o(3)}/>
    <path d="M-88 36V46M88 36V46" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    ${shine('M-110-30V20M66-30V20', 4, 0.2)}</g>`;

  T.kettlebell = () => `<g>
    <path d="M-36-30C-40-66-26-82 0-82S40-66 36-30" fill="none" stroke="${K}" stroke-width="24"/>
    <path d="M-36-30C-40-66-26-82 0-82S40-66 36-30" fill="none" stroke="url(#gk)" stroke-width="15"/>
    <path d="M-56 10C-56-28-30-44 0-44S56-28 56 10C56 40 40 60 30 62H-30C-40 60-56 40-56 10Z" fill="url(#gm)" ${o()}/>
    <rect x="-34" y="56" width="68" height="12" rx="4" fill="url(#gk)" ${o(3)}/>
    <text y="20" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="900" font-style="italic" font-size="26" fill="#fff" opacity="0.9">12</text>
    ${shine('M-40-6C-38-24-24-34-10-36', 7, 0.4)}</g>`;

  T.roller = () => `<g>
    <rect x="-110" y="-30" width="220" height="60" rx="30" fill="url(#gm)" ${o()}/>
    ${[-80, -50, -20, 10, 40, 70].map(x => `<rect x="${x}" y="-30" width="12" height="60" fill="#000" opacity="0.18"/>`).join('')}
    <ellipse cx="96" rx="14" ry="30" fill="url(#gk)" ${o(3)}/>
    ${shine('M-96-16H80', 6, 0.35)}</g>`;

  T.mat = (fill = 'url(#gm)') => `<g>
    <rect x="-180" y="-60" width="360" height="120" rx="14" fill="${fill}" ${o()}/>
    <path d="M-160-40H160M-160 40H160" stroke="#fff" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
    <circle cx="180" cy="0" r="0"/></g>`;

  T.matRoll = () => `<g>
    <rect x="-120" y="-32" width="240" height="64" rx="10" fill="url(#gm)" ${o()}/>
    <path d="M-60-32V32M0-32V32M60-32V32" stroke="#000" stroke-width="3" opacity="0.12"/>
    <ellipse cx="120" rx="20" ry="32" fill="url(#gmv)" ${o()}/>
    <path d="M120-18A14 14 0 1 1 112 10" fill="none" stroke="${K}" stroke-width="2.5" opacity="0.6"/>
    <rect x="-70" y="-36" width="16" height="72" rx="3" fill="url(#gk)" ${o(2.5)}/><rect x="40" y="-36" width="16" height="72" rx="3" fill="url(#gk)" ${o(2.5)}/></g>`;

  T.bandLoop = (col) => `<g><ellipse rx="70" ry="34" fill="none" stroke="${K}" stroke-width="20"/><ellipse rx="70" ry="34" fill="none" stroke="${col}" stroke-width="12"/>
    <path d="M-50-20C-30-30 10-32 40-24" fill="none" stroke="#fff" stroke-width="3" opacity="0.5" stroke-linecap="round"/></g>`;

  T.rope = () => `<g>
    <path d="M-120-30C-60 60 0-80 40 10S120 20 120-40" fill="none" stroke="${K}" stroke-width="9" stroke-linecap="round"/>
    <path d="M-120-30C-60 60 0-80 40 10S120 20 120-40" fill="none" stroke="#e8e8e8" stroke-width="4" stroke-linecap="round"/>
    ${at(-136, -48, 1, -40, `<rect x="-10" y="-34" width="20" height="58" rx="9" fill="url(#gm)" ${o(3.5)}/>`)}
    ${at(130, -60, 1, 30, `<rect x="-10" y="-34" width="20" height="58" rx="9" fill="url(#gm)" ${o(3.5)}/>`)}</g>`;

  T.pullupbar = (w = 260) => `<g>
    <rect x="${-w / 2}" y="-10" width="${w}" height="20" rx="10" fill="url(#gs)" ${o()}/>
    <rect x="${-w / 2 + 34}" y="-13" width="56" height="26" rx="10" fill="url(#gk)" ${o(3)}/><rect x="${w / 2 - 90}" y="-13" width="56" height="26" rx="10" fill="url(#gk)" ${o(3)}/>
    <rect x="${-w / 2 - 14}" y="-24" width="24" height="48" rx="6" fill="url(#gm)" ${o(3.5)}/><rect x="${w / 2 - 10}" y="-24" width="24" height="48" rx="6" fill="url(#gm)" ${o(3.5)}/></g>`;

  T.bench = () => `<g>
    <rect x="-150" y="-20" width="300" height="34" rx="12" fill="url(#gk)" ${o()}/>
    <path d="M-110 14L-130 70M110 14L130 70M-110 14L-90 70M110 14L90 70" stroke="${K}" stroke-width="12" stroke-linecap="round"/>
    <path d="M-110 14L-130 70M110 14L130 70M-110 14L-90 70M110 14L90 70" stroke="url(#gm)" stroke-width="6" stroke-linecap="round"/>
    <path d="M-140-8H140" stroke="#fff" stroke-width="3" opacity="0.2"/></g>`;

  T.pricetag = (txt) => `<g>
    <path d="M-80-44H70L110 0 70 44H-80C-90 44-96 38-96 28V-28C-96-38-90-44-80-44Z" fill="#fff" ${o()}/>
    <circle cx="78" cy="0" r="8" fill="none" ${o(3.5)}/>
    <text x="-12" y="15" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="900" font-style="italic" font-size="40" fill="url(#gm)">${txt}</text></g>`;

  window.ARTKIT = { K, at, o, nid, defs, label, check, shine, T };
})();
