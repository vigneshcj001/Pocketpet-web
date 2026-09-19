import { useEffect, useRef, useState } from "react";
import { usePet } from "../pet/PetContext";
import Sprite from "../pet/Sprite";

/**
 * The pet that leaves the stage and walks along the bottom of the browser
 * window while you read — the closest a web page gets to the real thing. It
 * appears once the hero scrolls away, follows the cursor across the page,
 * comments on the section you're reading, and can be sent away.
 */

const SIZE = 84;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

const SECTION_LINES: Record<string, string[]> = {
  download: ["Take me home? 🥺", "I'm only a few MB, promise.", "Pick your platform, I'll wait."],
  features: ["I can do all of this. Mostly.", "The window-walking is my favourite.", "Ask me to close a window. Go on."],
  compare: ["Windows gets the full me.", "Mac and Linux me is still cute.", "Ledge-walking needs Win32, sorry."],
  agent: ["I run errands too. For snacks.", "I always ask before paying. Always.", "I never touch your passwords."],
  changelog: ["Look how much I've grown.", "Every release, a little smarter."],
  faq: ["Questions? I have answers.", "Still here. Still cute."],
};

export default function SiteBuddy() {
  const { pet, color, accessories, buddyHidden, setBuddyHidden, perform } = usePet();
  const [visible, setVisible] = useState(false);
  const [anim, setAnim] = useState<"idle" | "walk" | "run" | "sleep" | "happy">("idle");
  const [bubble, setBubble] = useState<string | null>(null);
  const [hearts, setHearts] = useState<number[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const brain = useRef({ x: 0, target: null as number | null, facing: 1 as 1 | -1, anim: "idle", stillSince: 0, lastSection: "" });
  const bubbleTimer = useRef(0);
  const lastSaid = useRef(0);

  const say = (text: string, ms = 2800) => {
    if (performance.now() - lastSaid.current < 1200) return;
    lastSaid.current = performance.now();
    setBubble(text);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
  };

  // Show once the hero stage is out of view.
  useEffect(() => {
    const stage = document.querySelector('[aria-label="Interactive PocketPet demo"]');
    if (!stage) return;
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { threshold: 0.1 });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // Comment on the section being read.
  useEffect(() => {
    const sections = [...document.querySelectorAll("main section[id]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = (e.target as HTMLElement).id;
          if (id === brain.current.lastSection) continue;
          brain.current.lastSection = id;
          const lines = SECTION_LINES[id];
          if (lines && visible && !buddyHidden) say(pick(lines));
        }
      },
      { threshold: 0.45 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, buddyHidden]);

  // Follow the cursor along the bottom edge.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const b = brain.current;
    b.x = innerWidth * 0.5;
    b.stillSince = performance.now();
    const onMove = (e: PointerEvent) => {
      b.target = e.clientX;
      b.stillSince = performance.now();
      if (b.anim === "sleep") { b.anim = "idle"; setAnim("idle"); }
    };
    addEventListener("pointermove", onMove);
    let raf = 0;
    let last = performance.now();
    let lastX = NaN;
    let lastFacing = 0;
    const set = (a: typeof b.anim) => { if (b.anim !== a) { b.anim = a; setAnim(a as never); } };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      if (b.anim === "happy") return;
      if (b.target != null) {
        const want = clamp(b.target - SIZE / 2, 0, innerWidth - SIZE);
        const dx = want - b.x;
        const dist = Math.abs(dx);
        if (dist > 10) {
          b.facing = dx > 0 ? 1 : -1;
          b.x += Math.sign(dx) * Math.min(dist, (dist > 260 ? 300 : 140) * dt);
          set(dist > 260 ? "run" : "walk");
        } else set(now - b.stillSince > 20000 ? "sleep" : "idle");
      }
      // Write to the DOM only when something moved; the loop itself is cheap.
      const el = rootRef.current;
      if (el && (b.x !== lastX || b.facing !== lastFacing)) {
        lastX = b.x;
        lastFacing = b.facing;
        el.style.transform = `translate3d(${b.x}px, 0, 0)`;
        el.style.setProperty("--facing", String(b.facing));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", onMove); };
  }, []);

  const pat = () => {
    setHearts((h) => [...h, Date.now()]);
    window.setTimeout(() => setHearts((h) => h.slice(1)), 1600);
    brain.current.anim = "happy";
    setAnim("happy");
    say(pick(pet.lines.click ?? ["Hi!"]));
    window.setTimeout(() => { brain.current.anim = "idle"; setAnim("idle"); }, 1300);
  };

  const shown = visible && !buddyHidden;

  return (
    <>
      <div
        ref={rootRef}
        className={`pet z-30 transition-opacity duration-500 ${shown ? "opacity-100" : "pointer-events-none opacity-0"}`}
        // Inline because the unlayered .pet rule would beat Tailwind's `fixed`.
        style={{ "--pet-size": `${SIZE}px`, width: SIZE, height: SIZE, position: "fixed", top: "auto", bottom: 0, left: 0 } as React.CSSProperties}
        data-state={anim}
        onClick={pat}
        onDoubleClick={() => { perform("spin"); document.getElementById("top")?.scrollIntoView(); }}
        title="Click to pat · double-click to go back to the stage"
        aria-hidden="true"
      >
        {bubble && <div className="bubble"><span>{bubble}</span></div>}
        <Sprite pet={pet} color={color} accessories={accessories} />
        <div className="hearts">{hearts.map((id) => <span key={id} style={{ left: "50%" }}>❤️</span>)}</div>
        {anim === "sleep" && <div className="zzz">z<span>z</span><span>z</span></div>}
      </div>
      {visible && (
        <button
          type="button"
          onClick={() => setBuddyHidden(!buddyHidden)}
          className="fixed bottom-3 right-3 z-30 rounded-full border border-line bg-card/90 px-3 py-1.5 text-xs font-extrabold text-muted shadow-soft backdrop-blur hover:text-ink"
          title={buddyHidden ? "Bring the pet back" : "Hide the pet (like Ctrl+Alt+P in the app)"}
        >
          {buddyHidden ? "🐾 Show pet" : "Hide pet"}
        </button>
      )}
    </>
  );
}
