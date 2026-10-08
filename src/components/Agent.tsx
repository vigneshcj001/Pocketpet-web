import { useEffect, useRef, useState } from "react";

const TASK = "Order a margherita pizza from Domino's to my usual address — stop before payment.";
const STEPS = ["Open dominos.in", "Pick a margherita, medium", "Add to cart, choose delivery", "Stop at payment and ask"];
type Status = "todo" | "doing" | "done";

const CHECKS: Array<{ text: string; tip?: { label: string; body: string } }> = [
  {
    text: "Works with Claude, OpenAI, Gemini, Groq, DeepSeek, or local models via Ollama.",
    tip: {
      label: "Get a free API key",
      body: "Gemini and Groq both have generous free tiers — no credit card needed. Sign up, copy your key, paste it once in PocketPet's settings, and you're done.",
    },
  },
  { text: "Stops for your approval before anything that pays, books, logs in, sends or deletes." },
  { text: "Never types passwords or card numbers — you do that step in its window." },
  { text: "Allowed-site list, per-site rules, purchase cap, daily spend cap, kill switch." },
  { text: "Save task recipes, schedule them, then review links, prices, dates, approvals and audit history in result cards." },
  { text: "Keys live in the OS keychain, never in settings or backups." },
];

/** Inline tooltip that opens on click/focus — keyboard and pointer accessible. */
function Tip({ label, body }: { label: string; body: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span ref={ref} className="relative ml-2 inline-block align-middle">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        aria-expanded={open}
        aria-label={label}
        className="inline-flex size-[18px] cursor-pointer items-center justify-center rounded-full border border-accent/60 bg-accent-soft text-[10px] font-extrabold text-accent transition hover:bg-accent hover:text-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-[240px] -translate-x-1/2 rounded-2xl border border-line bg-card p-3 text-[13px] font-medium leading-snug text-ink shadow-soft"
        >
          <strong className="mb-1 block text-[12px] font-extrabold uppercase tracking-wide text-accent">{label}</strong>
          {body}
          <span className="absolute top-full left-1/2 -ml-1.5 border-[6px] border-transparent border-t-card" />
        </span>
      )}
    </span>
  );
}

/** A looping, typed-out task with a plan that ticks off and an approval card. */
function Demo() {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [typed, setTyped] = useState(reducedMotion ? TASK : "");
  const [plan, setPlan] = useState<Status[]>(reducedMotion ? STEPS.map(() => "done") : []);
  const [ask, setAsk] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    let alive = true;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    (async () => {
      while (alive) {
        setTyped("");
        setPlan([]);
        setAsk(false);
        for (let i = 1; i <= TASK.length && alive; i++) {
          setTyped(TASK.slice(0, i));
          await sleep(28);
        }
        await sleep(600);
        for (let i = 0; i < STEPS.length && alive; i++) {
          setPlan((p) => [...p, "todo"]);
          await sleep(250);
        }
        for (let i = 0; i < STEPS.length && alive; i++) {
          setPlan((p) => p.map((s, j) => (j === i ? "doing" : s)));
          await sleep(1100);
          setPlan((p) => p.map((s, j) => (j === i ? "done" : s)));
        }
        setAsk(true);
        await sleep(4200);
      }
    })();
    return () => {
      alive = false;
    };
  }, [reducedMotion]);

  return (
    <div className="overflow-hidden rounded-card border border-line bg-card text-sm shadow-soft" aria-hidden="true">
      <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-2.5 font-extrabold text-muted">
        <span className="dots"><i /><i /><i /></span> Ask me to do something
      </div>
      <div className="grid min-h-[360px] content-start gap-3 p-4 sm:p-5">
        <div className="caret min-h-[42px] rounded-xl bg-bg2 px-3 py-2.5">{typed}</div>
        <ol className="grid list-decimal gap-1 pl-[22px]">
          {STEPS.slice(0, plan.length).map((s, i) => (
            <li
              key={s}
              className={`rise ${plan[i] === "doing" ? "font-extrabold after:text-accent after:content-['_…']" : ""} ${plan[i] === "done" ? "text-muted line-through" : ""}`}
            >
              {s}
            </li>
          ))}
        </ol>
        {ask && (
          <div className="rise rounded-xl border border-accent p-3 shadow-[0_0_0_3px_var(--accent-soft)]">
            <b>Approve this step?</b>
            <p className="mb-2.5 mt-1">Click “Place order” for ₹349 on dominos.in?</p>
            <div className="flex gap-2">
              <span className="rounded-[9px] border border-accent bg-accent px-3.5 py-1.5 font-extrabold text-accent-ink">Allow</span>
              <span className="rounded-[9px] border border-line px-3.5 py-1.5 font-extrabold">Don’t</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Agent() {
  return (
    <section id="agent" className="reveal my-8 grid scroll-mt-16 grid-cols-1 items-center gap-12 rounded-[32px] border border-line bg-bg2/60 px-5 py-14 sm:px-8 md:grid-cols-2 md:px-12">
      <div>
        <p className="eyebrow mb-3.5">Ask me to do something</p>
        <h2 className="text-[clamp(26px,3.4vw,38px)]">It runs errands, too.</h2>
        <p className="my-4 text-[17px] text-muted">
          Type or say a task. The pet plans it in steps, searches the web, reads pages and drives its own browser window
          — separate from yours — narrating as it goes. Save repeatable task recipes, schedule them, and review structured results afterward.
        </p>
        <ul className="grid gap-2.5">
          {CHECKS.map((c) => (
            <li key={c.text} className="relative pl-7 before:absolute before:left-0 before:top-0 before:font-black before:text-green before:content-['✓']">
              {c.text}
              {c.tip && <Tip label={c.tip.label} body={c.tip.body} />}
            </li>
          ))}
        </ul>
      </div>
      <Demo />
    </section>
  );
}
