const QA: [string, React.ReactNode][] = [
  [
    "Is it really free?",
    "Yes. It's open source. The errand-running agent uses your own API key (or a free local model through Ollama), so any model spend is between you and your provider — there's a daily cap you control.",
  ],
  [
    "Why does the Mac / Linux version do less?",
    "Walking on window titlebars, pressing caption buttons, mischief mode and “sit on the active window” all need Win32 and UI Automation, which don't exist elsewhere. Everything else — following, feeding, games, customisation, errands — is the same.",
  ],
  [
    "Does it slow my computer down?",
    "It's a Tauri app: a few MB on disk, a transparent overlay drawn by the system webview. It drops to 15 fps when hidden, asleep or on battery, and scans windows less often.",
  ],
  [
    "Can it click things I didn't ask for?",
    "No. The overlay is click-through everywhere except the pet's own body and bubble. Window actions only happen when you pick them from the menu, and closing a window always asks for a second confirmation.",
  ],
  [
    "How do I uninstall?",
    <>Windows: Settings → Apps. macOS: drag the app to the Trash. Linux: delete the AppImage or <code>apt remove pocketpet</code>. Your settings live in the app data folder — Settings → Backup can export them first.</>,
  ],
];

export default function Faq() {
  return (
    <section id="faq" className="reveal mx-auto max-w-[760px] scroll-mt-16 py-18">
      <div className="mb-9 text-center">
        <h2 className="text-[clamp(26px,3.4vw,38px)]">Questions</h2>
      </div>
      {QA.map(([q, a], i) => (
        <details key={q} open={i === 0} className="group border-b border-line py-3.5">
          <summary className="flex cursor-pointer list-none justify-between text-[17px] font-extrabold after:font-black after:text-accent after:content-['+'] group-open:after:content-['–'] [&::-webkit-details-marker]:hidden">
            {q}
          </summary>
          <p className="mt-2 text-muted">{a}</p>
        </details>
      ))}
    </section>
  );
}
