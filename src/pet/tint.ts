// Recolouring, ported from PetExt/src/appearance.js: every fill in the pet's
// `tint` list is replaced by the chosen colour, keeping each fill's lightness
// offset from the first (the "base" body colour).

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function hexToHsl(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

export function hslToHex(h: number, s: number, l: number) {
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function tintedSvg(svg: string, tint: string[], color: string | null) {
  if (!color || !tint.length) return svg;
  const target = hexToHsl(color);
  const base = hexToHsl(tint[0]);
  const map = new Map<string, string>();
  for (const c of tint) {
    const src = hexToHsl(c);
    const l = clamp(target.l + (src.l - base.l), 0.04, 0.96);
    const s = clamp(target.s + (src.s - base.s) * 0.5, 0, 1);
    map.set(c.toLowerCase(), hslToHex(target.h, s, l));
  }
  const pattern = new RegExp([...map.keys()].join("|"), "gi");
  return svg.replace(pattern, (m) => map.get(m.toLowerCase()) ?? m);
}
