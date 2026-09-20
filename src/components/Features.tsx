import { usePet, type PetAction } from "../pet/PetContext";

const FEATURES: [string, string, React.ReactNode, PetAction][] = [
  ["🖱️", "Follows your cursor", "Walks when you're near, runs when you're far, sits when you stop, dozes off after half a minute of stillness.", "dash"],
  ["🪟", "Stands on your windows", "On Windows it walks along the top edge of your real windows and hops up onto ledges as they appear.", "hide"],
  ["🐾", "Presses real buttons", "Ask it to minimise or close the active window: it walks over, a ring marks the target, the paw reaches out.", "wave"],
  ["🍪", "Feed, pet, throw", "Drop food and it runs to eat. Rest your cursor on it for purrs and hearts. Drag and let go to throw it.", "feed"],
  ["🎮", "Games", <>Obstacle jump and hide &amp; seek — with a win record and milestones that unlock accessories.</>, "toss"],
  ["🎨", "Make it yours", "Name, colour picker, personality, up to four emoji accessories, a companion pet, or your own picture as a pet.", "spin"],
  ["⏰", "Break reminders", "Any interval, snooze with a right-click, countdown pill above the pet, optional timed work/break sessions.", "wave"],
  ["🔇", "Knows when to hush", "Focus mode when a fullscreen app is in front or during your quiet hours; low-power mode on battery.", "sleep"],
  ["🖥️", "Multi-monitor", <>Stands on the bottom of <em>its</em> screen, keeps to a chosen monitor or edge margin, respects a keep-out area.</>, "dash"],
];

export default function Features() {
  const { perform } = usePet();
  const tryIt = (action: PetAction) => {
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => perform(action), 450);
  };
  return (
    <section id="features" className="reveal scroll-mt-16 py-18">
      <div className="mb-10 max-w-[620px]">
        <p className="eyebrow mb-3">A companion with personality</p>
        <h2 className="text-[clamp(26px,3.4vw,38px)]">What it does all day</h2>
        <p className="mt-3 text-muted">It follows, naps, plays and stays out of the way. Every card below is also a shortcut to try the behavior.</p>
      </div>
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(([icon, title, body, action], i) => (
          <button
            key={title}
            type="button"
            onClick={() => tryIt(action)}
            style={{ transitionDelay: `${i * 40}ms` }}
            className="group reveal-item min-h-[220px] rounded-card border border-line bg-card p-6 text-left transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-soft"
          >
            <span className="mb-2.5 block text-[30px] transition-transform group-hover:-rotate-6 group-hover:scale-110">{icon}</span>
            <h3 className="mb-1.5 text-[19px]">{title}</h3>
            <p className="text-[14.5px] text-muted">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-extrabold text-accent">Try it <span className="transition-transform group-hover:-translate-y-1">↑</span></span>
          </button>
        ))}
      </div>
    </section>
  );
}
