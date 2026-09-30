/** Wall of Love — social proof quotes shown after the Errands/Agent section. */

interface Quote {
  body: string;
  name: string;
  handle: string;
  avatar: string; // emoji used as a lightweight avatar
}

const QUOTES: Quote[] = [
  {
    body: "I set it to order my usual lunch every Tuesday. It pauses before checkout so I can confirm. Genuinely one of the most useful little utilities I've installed in years.",
    name: "Priya M.",
    handle: "Senior developer",
    avatar: "🧑‍💻",
  },
  {
    body: "The pet wanders around while I'm in a meeting and honestly calms me down. Silly? Yes. But it works.",
    name: "Jonas W.",
    handle: "Product designer",
    avatar: "🎨",
  },
  {
    body: "I use the Pomodoro-style focus mode and let the pet 'sleep' when I want no distractions. My screen time is actually down.",
    name: "Amara O.",
    handle: "Grad student",
    avatar: "📚",
  },
  {
    body: "Got it for the novelty, stayed for the agent. It filled out a tedious government form for me while I watched. Stopped perfectly before submit.",
    name: "Kenji T.",
    handle: "Freelance engineer",
    avatar: "⚙️",
  },
  {
    body: "My six-year-old named it 'Bloop'. She checks in on it before school. We did not expect this level of attachment.",
    name: "Sarah L.",
    handle: "Parent & teacher",
    avatar: "👩‍👧",
  },
  {
    body: "Open source, local AI support, no telemetry, and it's adorable. This is the kind of software I actually want on my machine.",
    name: "Devesh R.",
    handle: "Systems programmer",
    avatar: "🛠️",
  },
];

export default function Testimonials() {
  return (
    <section id="love" className="reveal scroll-mt-16 py-16">
      <div className="mb-10 text-center">
        <p className="eyebrow mb-3">Wall of love</p>
        <h2 className="text-[clamp(26px,3.4vw,38px)]">People seem to like it.</h2>
        <p className="mt-2 text-muted">Real notes from real desktops.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {QUOTES.map((q, i) => (
          <figure
            key={q.handle}
            style={{ transitionDelay: `${i * 60}ms` }}
            className="reveal-item card flex flex-col justify-between gap-4"
          >
            {/* Decorative quote mark */}
            <span className="absolute right-5 top-4 text-[40px] leading-none text-accent/15 select-none" aria-hidden="true">
              "
            </span>
            <blockquote className="text-[14.5px] leading-relaxed text-muted">
              "{q.body}"
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-line pt-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-bg2 text-xl" aria-hidden="true">
                {q.avatar}
              </span>
              <div>
                <p className="text-[13.5px] font-extrabold text-ink">{q.name}</p>
                <p className="text-[12px] text-muted">{q.handle}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
