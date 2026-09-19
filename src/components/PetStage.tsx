import { useEffect, useRef, useState } from "react";
import { PETS, PET_IDS } from "../data/pets";
import { ACCESSORY_CHOICES, usePet, type PetAction } from "../pet/PetContext";
import Sprite from "../pet/Sprite";

/**
 * The hero playground: a small version of the app's pet brain. It follows the
 * cursor, sits, sleeps, eats, gets thrown, hides behind a window, and talks
 * with the same dialogue tables the app ships. Runs on requestAnimationFrame
 * with a mutable state object; React owns the chrome (picker, bubble, hearts).
 * Other parts of the page can drive it through PetContext.perform().
 */

const SIZE = 120;
const FLOOR = 54;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

type Anim = "idle" | "walk" | "run" | "sleep" | "drag" | "fly" | "happy" | "spin" | "eat" | "yawn" | "stretch" | "look";
const BUSY: Anim[] = ["happy", "spin", "eat", "yawn", "stretch", "look"];

interface Brain {
  x: number; y: number; vx: number; vy: number;
  facing: 1 | -1;
  anim: Anim;
  target: { x: number } | null;
  cursorSeen: number;
  stillSince: number;
  dragging: boolean;
  dragOffset: { x: number; y: number };
  mode: "free" | "fly" | "hiding";
  food: { x: number; y: number } | null;
  lastAntic: number;
  /** Ignore the cursor while a scripted action runs. */
  scriptedUntil: number;
}

const HIDE_WINDOW = { leftPct: 8, width: 180 };

export default function PetStage() {
  const { petId, pet, setPetId, color, setColor, accessories, toggleAccessory, subscribe } = usePet();
  const [bubble, setBubble] = useState<string | null>(null);
  const [anim, setAnimState] = useState<Anim>("idle");
  const [foodPos, setFoodPos] = useState<{ x: number; y: number } | null>(null);
  const [hearts, setHearts] = useState<{ id: number; emoji: string; drift: number; left: number; delay: number }[]>([]);
  const [landed, setLanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dressUp, setDressUp] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const petRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const foodRef = useRef<HTMLDivElement>(null);
  const petIdRef = useRef(petId);
  petIdRef.current = petId;
  const brain = useRef<Brain>({
    x: 120, y: 0, vx: 0, vy: 0, facing: 1, anim: "idle", target: null, cursorSeen: 0,
    stillSince: performance.now(), dragging: false, dragOffset: { x: 0, y: 0 }, mode: "free",
    food: null, lastAntic: performance.now(), scriptedUntil: 0,
  });
  const bubbleTimer = useRef(0);
  const heartId = useRef(0);

  const lines = (key: string, fallback: string) => PETS[petIdRef.current].lines[key] ?? [fallback];

  // --- helpers the loop and the handlers share ---------------------------------
  const setAnim = (name: Anim) => {
    if (brain.current.anim === name) return;
    brain.current.anim = name;
    setAnimState(name);
  };
  const say = (text: string, ms = 2600) => {
    setBubble(text);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble(null), ms);
  };
  const burst = (n = 4, emojis = ["❤️", "💛", "🧡", "💕"]) => {
    const batch = Array.from({ length: n }, (_, i) => ({
      id: heartId.current++, emoji: pick(emojis), drift: (Math.random() - 0.5) * 60, left: 40 + Math.random() * 30, delay: i * 0.12,
    }));
    setHearts((h) => [...h, ...batch]);
    window.setTimeout(() => setHearts((h) => h.filter((x) => !batch.some((b) => b.id === x.id))), 1700);
  };
  const happyThenIdle = () => {
    setAnim("happy");
    window.setTimeout(() => brain.current.anim === "happy" && setAnim("idle"), 1300);
  };
  const stageW = () => stageRef.current?.clientWidth ?? 600;
  const groundY = () => (stageRef.current?.clientHeight ?? 420) - FLOOR - SIZE + 10;

  const paint = () => {
    const b = brain.current;
    const p = petRef.current;
    const s = shadowRef.current;
    if (!p || !s) return;
    p.style.setProperty("--facing", String(b.facing));
    p.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
    const height = groundY() - b.y;
    s.style.transform = `translate3d(${b.x}px, ${groundY() + SIZE - 12}px, 0) scale(${clamp(1 - height / 500, 0.4, 1)})`;
    s.style.opacity = String(clamp(0.45 - height / 900, 0.1, 0.45));
    if (b.food && foodRef.current) foodRef.current.style.transform = `translate3d(${b.food.x}px, ${b.food.y}px, 0)`;
  };

  // --- actions (buttons, keyboard, feature cards) ------------------------------------
  const feed = () => {
    const b = brain.current;
    if (b.food) return;
    const x = clamp(Math.random() * (stageW() - 80) + 20, 20, stageW() - 60);
    b.food = { x, y: groundY() + SIZE - 46 };
    b.mode = "free";
    setHidden(false);
    setFoodPos(b.food);
    say(pick(lines("hungry", "Snack!")), 1500);
    paint();
  };
  const toss = () => {
    const b = brain.current;
    b.mode = "fly";
    setHidden(false);
    b.vx = (Math.random() - 0.5) * 18;
    b.vy = -22;
    setAnim("fly");
    say(pick(lines("drag", "Whoa!")), 1400);
  };
  const spin = () => {
    setAnim("spin");
    say("Wheee!", 1200);
    window.setTimeout(() => brain.current.anim === "spin" && setAnim("idle"), 950);
  };
  const dash = () => {
    // Sprint to the far side, then back — "follows your cursor" on demand.
    const b = brain.current;
    b.mode = "free";
    setHidden(false);
    b.target = { x: b.x < stageW() / 2 ? stageW() - 40 : 40 };
    b.cursorSeen = performance.now() + 3000;
    b.scriptedUntil = performance.now() + 1600;
    say(pick(lines("call", "Coming!")), 1400);
  };
  const doze = () => {
    setAnim("sleep");
    brain.current.stillSince = -1e9;
    say(pick(lines("sleep", "zzz")), 2200);
  };
  const wave = () => {
    burst();
    say(pick(lines("click", "Hi!")), 2000);
    happyThenIdle();
  };
  const hide = () => {
    // Walk behind the notes window, vanish, then peek back out.
    const b = brain.current;
    b.mode = "hiding";
    b.food = null;
    setFoodPos(null);
    const behind = (stageW() * HIDE_WINDOW.leftPct) / 100 + HIDE_WINDOW.width / 2 - SIZE / 2;
    b.target = { x: behind + SIZE / 2 };
    b.cursorSeen = performance.now() + 5000;
    say("Count to ten!", 1400);
  };
  const celebrate = () => {
    burst(8, ["🎉", "✨", "🎊", "⭐"]);
    say("Yay! See you on the desktop!", 3200);
    happyThenIdle();
  };

  useEffect(() => {
    const map: Record<PetAction, () => void> = { feed, toss, spin, dash, sleep: doze, wave, hide, celebrate };
    return subscribe((a) => map[a]());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe]);

  // Keyboard: F feed, T toss, S spin, H hide, 1–4 pick a pet — when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      const k = e.key.toLowerCase();
      if (k === "f") feed();
      else if (k === "t") toss();
      else if (k === "s") spin();
      else if (k === "h") hide();
      else if (/^[1-4]$/.test(k)) choosePet(PET_IDS[Number(k) - 1]);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choosePet = (id: (typeof PET_IDS)[number]) => {
    setPetId(id);
    petIdRef.current = id;
    say(pick(PETS[id].lines.greet ?? ["Hi!"]), 2200);
    happyThenIdle();
  };

  // --- the loop ---------------------------------------------------------------------
  useEffect(() => {
    const b = brain.current;
    b.x = stageW() * 0.4;
    b.y = groundY();
    paint();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      const gy = groundY();

      if (b.dragging) return paint();

      if (b.mode === "fly") {
        b.vy += 60 * dt * 16;
        b.x += b.vx * dt * 60;
        b.y += b.vy * dt * 60;
        if (b.x < 0) { b.x = 0; b.vx = -b.vx * 0.6; }
        if (b.x > stageW() - SIZE) { b.x = stageW() - SIZE; b.vx = -b.vx * 0.6; }
        if (b.y >= gy) {
          b.y = gy; b.mode = "free"; b.vx = b.vy = 0;
          setLanded(true);
          window.setTimeout(() => setLanded(false), 320);
          setAnim("idle");
          say(pick(lines("land", "Oof.")), 1500);
          b.stillSince = now;
        }
        return paint();
      }

      b.y = gy;

      if (b.mode === "hiding" && b.target) {
        const want = b.target.x - SIZE / 2;
        const dx = want - b.x;
        if (Math.abs(dx) > 6) {
          b.facing = dx > 0 ? 1 : -1;
          b.x += Math.sign(dx) * 200 * dt;
          setAnim("run");
        } else {
          setAnim("idle");
          setHidden(true);
          b.mode = "free";
          b.target = null;
          b.stillSince = now;
          window.setTimeout(() => {
            setHidden(false);
            b.facing = -1;
            say(pick(lines("perch", "Found me?")), 2000);
            happyThenIdle();
          }, 2600);
        }
        return paint();
      }

      if (b.food) {
        const dx = b.food.x - 20 - b.x;
        if (Math.abs(dx) > 6) {
          b.facing = dx > 0 ? 1 : -1;
          b.x += Math.sign(dx) * 160 * dt;
          setAnim("walk");
        } else if (b.anim !== "eat") {
          setAnim("eat");
          window.setTimeout(() => {
            b.food = null;
            setFoodPos(null);
            burst(3);
            say(pick(lines("eat", "Yum!")), 1800);
            happyThenIdle();
            b.stillSince = performance.now();
          }, 1400);
        }
        return paint();
      }

      if (BUSY.includes(b.anim)) return paint();

      const cursorFresh = b.target && now - b.cursorSeen < 4000;
      if (cursorFresh && b.target) {
        const want = clamp(b.target.x - SIZE / 2, 0, stageW() - SIZE);
        const dx = want - b.x;
        const dist = Math.abs(dx);
        if (dist > 14) {
          b.facing = dx > 0 ? 1 : -1;
          const speed = dist > 220 ? 320 : 150;
          b.x += Math.sign(dx) * Math.min(dist, speed * dt);
          setAnim(dist > 220 ? "run" : "walk");
          b.stillSince = now;
        } else setAnim("idle");
      } else {
        if (b.anim === "walk" || b.anim === "run") setAnim("idle");
        const still = now - b.stillSince;
        if (still > 18000 && b.anim !== "sleep") {
          setAnim("sleep");
          say(pick(lines("sleep", "zzz")), 2200);
        } else if (b.anim === "idle" && now - b.lastAntic > 6000 && Math.random() < 0.01) {
          b.lastAntic = now;
          const antic = pick(["yawn", "stretch", "look", "say", "wander"] as const);
          if (antic === "say") say(pick(lines("idle", "...")), 2200);
          else if (antic === "wander") { b.target = { x: Math.random() * stageW() }; b.cursorSeen = now; }
          else {
            setAnim(antic);
            window.setTimeout(() => b.anim === antic && setAnim("idle"), 1500);
          }
        }
      }
      paint();
    };
    raf = requestAnimationFrame(tick);
    const onResize = () => { b.x = clamp(b.x, 0, stageW() - SIZE); b.y = Math.min(b.y, groundY()); paint(); };
    addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", onResize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- pointer handlers ----------------------------------------------------------------
  const stageRect = () => stageRef.current!.getBoundingClientRect();

  const onStageMove = (e: React.PointerEvent) => {
    const b = brain.current;
    const r = stageRect();
    if (b.dragging) {
      b.x = e.clientX - r.left - b.dragOffset.x;
      b.y = e.clientY - r.top - b.dragOffset.y;
      b.vx = (e.nativeEvent as PointerEvent).movementX * 1.6;
      b.vy = (e.nativeEvent as PointerEvent).movementY * 1.6;
      return;
    }
    if (b.mode === "hiding" || performance.now() < b.scriptedUntil) return;
    b.target = { x: e.clientX - r.left };
    b.cursorSeen = performance.now();
    b.stillSince = performance.now();
    if (b.anim === "sleep") {
      setAnim("idle");
      say(pick(lines("idle", "Hm?")), 1600);
    }
  };

  const onPetDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const b = brain.current;
    const r = stageRect();
    b.dragging = true;
    setDragging(true);
    b.mode = "free";
    setHidden(false);
    b.dragOffset = { x: e.clientX - r.left - b.x, y: e.clientY - r.top - b.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    setAnim("drag");
    say(pick(lines("drag", "Whee!")), 1500);
  };

  const onPetUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const b = brain.current;
    if (!b.dragging) return;
    b.dragging = false;
    setDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (Math.hypot(b.vx, b.vy) > 3 || b.y < groundY()) {
      b.mode = "fly";
      setAnim("fly");
    } else {
      b.vx = b.vy = 0;
      wave();
    }
  };

  return (
    <div
      ref={stageRef}
      className="stage-sky relative h-[420px] overflow-hidden rounded-[28px] border border-line shadow-soft cursor-crosshair touch-none max-md:h-[360px] max-sm:h-[320px]"
      aria-label="Interactive PocketPet demo"
      onPointerMove={onStageMove}
      onPointerLeave={() => { brain.current.target = null; }}
    >
      {/* The notes window is in front of the pet only while it hides. */}
      <FakeWindow className={`w-[180px] bottom-[150px] ${hidden ? "z-[4]" : ""}`} style={{ left: `${HIDE_WINDOW.leftPct}%` }} title="notes.txt" />
      <FakeWindow className="right-[6%] bottom-[200px] w-[240px] max-sm:hidden" title="browser — pocketpet" />
      <div className="absolute inset-x-0 bottom-0 h-[54px] bg-floor border-t-[3px] border-black/30" />

      <div ref={shadowRef} className="pet-shadow" />
      <div
        ref={petRef}
        className={`pet ${dragging ? "dragging" : ""} ${landed ? "landed" : ""}`}
        data-state={anim}
        onPointerDown={onPetDown}
        onPointerUp={onPetUp}
        onDoubleClick={spin}
        onPointerEnter={() => { if (!brain.current.dragging && brain.current.anim !== "sleep") burst(2); }}
      >
        {bubble && <div className="bubble"><span>{bubble}</span></div>}
        <Sprite pet={pet} color={color} accessories={accessories} />
        <div className="hearts">
          {hearts.map((h) => (
            <span key={h.id} style={{ "--drift": `${h.drift}px`, left: `${h.left}%`, animationDelay: `${h.delay}s` } as React.CSSProperties}>{h.emoji}</span>
          ))}
        </div>
        {anim === "sleep" && <div className="zzz">z<span>z</span><span>z</span></div>}
      </div>
      {foodPos && <div ref={foodRef} className="food">{pet.food}</div>}

      {/* Toolbar */}
      <div
        role="group"
        aria-label="Choose a pet"
        className="absolute left-3 top-3 z-[5] flex items-center gap-1.5 rounded-full border border-line bg-card/85 p-1.5 backdrop-blur cursor-default max-sm:flex-wrap max-sm:rounded-2xl"
        onPointerMove={(e) => e.stopPropagation()}
      >
        {PET_IDS.map((id, i) => (
          <button
            key={id}
            type="button"
            title={`${PETS[id].name} (${i + 1})`}
            aria-pressed={id === petId}
            onClick={() => choosePet(id)}
            className={`h-[34px] min-w-[34px] rounded-full border px-2 text-lg transition-colors hover:bg-bg2 ${id === petId ? "border-accent bg-accent-soft" : "border-transparent"}`}
          >
            {PETS[id].emoji}
          </button>
        ))}
        <span className="h-[22px] w-px bg-line" />
        <Tool onClick={feed} title="Drop a snack (F)">🍪 Feed</Tool>
        <Tool onClick={toss} title="Toss it in the air (T)">🪁 Toss</Tool>
        <Tool onClick={hide} title="Hide & seek (H)">📦 Hide</Tool>
        <Tool onClick={() => setDressUp((v) => !v)} title="Colour and accessories" active={dressUp}>🎨</Tool>
      </div>

      {/* Dress-up drawer: the app's own colour picker + accessory slots. */}
      {dressUp && (
        <div
          className="absolute right-3 top-3 z-[5] flex w-[230px] flex-col gap-2.5 rounded-2xl border border-line bg-card/95 p-3 text-[13px] backdrop-blur cursor-default"
          onPointerMove={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between font-extrabold">
            <span>Dress up {pet.name}</span>
            <button type="button" onClick={() => setDressUp(false)} className="text-muted hover:text-ink" aria-label="Close">×</button>
          </div>
          <label className="flex items-center gap-2">
            <span className="flex-1 font-bold">Colour</span>
            <input type="color" value={color ?? pet.tint[0]} onChange={(e) => setColor(e.target.value)} className="h-7 w-10 cursor-pointer rounded-md border border-line bg-bg p-0.5" />
            <button type="button" onClick={() => setColor(null)} className="rounded-md border border-line px-2 py-0.5 text-[11.5px] font-bold hover:bg-bg2">Reset</button>
          </label>
          <div className="font-bold">Accessories <span className="text-muted">· {accessories.length}/4</span></div>
          <div className="flex flex-wrap gap-1">
            {ACCESSORY_CHOICES.map((a) => {
              const on = accessories.some((x) => x.emoji === a.emoji);
              return (
                <button
                  key={a.emoji}
                  type="button"
                  title={`${a.emoji} on ${a.slot}`}
                  aria-pressed={on}
                  onClick={() => toggleAccessory(a)}
                  className={`size-8 rounded-lg border text-base ${on ? "border-accent bg-accent-soft" : "border-line hover:bg-bg2"}`}
                >
                  {a.emoji}
                </button>
              );
            })}
          </div>
          <p className="text-[11.5px] text-muted">Same rules as the app: one per slot, four at most. Eyes, cheeks and beaks keep their colour.</p>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-[62px] right-4 text-[11px] font-bold text-muted/70 max-sm:hidden">
        keys: F feed · T toss · S spin · H hide · 1–4 pets
      </div>
    </div>
  );
}

function Tool({ children, onClick, title, active }: { children: React.ReactNode; onClick: () => void; title: string; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`h-[34px] rounded-full border px-2.5 text-[13.5px] font-extrabold hover:bg-bg2 ${active ? "border-accent bg-accent-soft" : "border-transparent"}`}
    >
      {children}
    </button>
  );
}

function FakeWindow({ className, style, title }: { className: string; style?: React.CSSProperties; title: string }) {
  return (
    <div style={style} className={`absolute flex h-[26px] items-center gap-2 rounded-t-lg border border-b-0 border-line bg-card px-2.5 text-[11px] font-bold text-muted shadow-[0_-4px_20px_rgba(0,0,0,0.06)] ${className}`}>
      <span className="dots"><i /><i /><i /></span>
      <span>{title}</span>
      <span className="absolute inset-x-[-1px] top-full h-[200px] border border-t-0 border-line bg-card" />
    </div>
  );
}
