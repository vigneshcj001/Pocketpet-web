type Cell = true | false | "partial";

const ROWS: [string, Cell, Cell, Cell, string?][] = [
  ["Follows your cursor, sits, sleeps, antics", true, true, true],
  ["Feed, pet, drag & throw, fetch", true, true, true],
  ["Obstacle jump & hide-and-seek games", true, true, true],
  ["Colour, name, personality, accessories, custom-image pets", true, true, true],
  ["Companion pet", true, true, true],
  ["Break reminders, quiet hours, low-power mode", true, true, true],
  ["Multi-monitor roaming, keep-out area", true, "partial", true, "macOS clips a window to one display"],
  ["Task agent: web search, page reading, its own browser", true, true, true],
  ["Global hotkeys", true, true, true],
  ["API keys in the OS keychain", true, true, true],
  ["Walks on the top edge of your real windows", true, false, false],
  ["Presses minimise / close buttons with its paw", true, false, false],
  ["Mischief mode, “sit on the active window”", true, false, false],
  ["Fullscreen-app detection for focus mode", true, false, false],
  ["Offline dictation (Windows speech)", true, "partial", "partial", "Whisper via an API key instead"],
  ["Click-through overlay", true, true, "partial", "X11 / XWayland only"],
];

function Mark({ v }: { v: Cell }) {
  if (v === true) return <span className="font-black text-green" aria-label="yes">✓</span>;
  if (v === "partial") return <span className="font-black text-accent" aria-label="partly">◐</span>;
  return <span className="text-muted/60" aria-label="no">—</span>;
}

export default function Compare() {
  return (
    <section id="compare" className="reveal scroll-mt-16 py-18">
      <div className="mb-9 text-center">
        <h2 className="text-[clamp(26px,3.4vw,38px)]">Same pet, three homes</h2>
        <p className="mt-2 text-muted">What each build can do. The window tricks need Win32 and UI Automation.</p>
      </div>
      <div className="overflow-x-auto rounded-card border border-line bg-card shadow-soft">
        <table className="w-full min-w-[560px] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-line text-left text-[12.5px] uppercase tracking-[0.08em] text-muted">
              <th className="px-4 py-3 font-extrabold">Feature</th>
              <th className="px-4 py-3 text-center font-extrabold">Windows</th>
              <th className="px-4 py-3 text-center font-extrabold">macOS</th>
              <th className="px-4 py-3 text-center font-extrabold">Linux</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([label, w, m, l, note]) => (
              <tr key={label} className="border-b border-line last:border-0 hover:bg-bg2/60">
                <td className="px-4 py-2.5">
                  {label}
                  {note && <span className="ml-2 text-[12px] text-muted">({note})</span>}
                </td>
                <td className="px-4 py-2.5 text-center text-lg"><Mark v={w} /></td>
                <td className="px-4 py-2.5 text-center text-lg"><Mark v={m} /></td>
                <td className="px-4 py-2.5 text-center text-lg"><Mark v={l} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
