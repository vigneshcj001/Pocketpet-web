import { useEffect, useRef, useState } from "react";
import { PETS, PET_IDS } from "../data/pets";
import Sprite from "../pet/Sprite";
import { usePet } from "../pet/PetContext";
import PetStage from "./PetStage";
import "./companion.css";

type Phase = "idle" | "starting" | "thinking" | "completed";
type VoiceResult = { isFinal: boolean; 0: { transcript: string } };
interface VoiceRecognition {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<VoiceResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
}

const EXAMPLES = [
  { title: "Explain AI basics", answer: "AI (artificial intelligence) is technology that enables computers to perform tasks such as understanding language, recognizing images, and finding patterns. It learns patterns from examples to make predictions or generate responses. It can be useful, but it can also make mistakes — so check important answers." },
  { title: "Plan a focus break", answer: "Here’s a little reset: step away from your screen, stretch your shoulders, and get a glass of water. After five minutes, come back and pick one small thing to work on. Your tiny companion will be right here." },
];

function Icon({ name }: { name: "compose" | "voice" | "chevron" | "plus" | "send" | "check" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "compose" && <><path d="M11 4H6a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-5" /><path d="m10 14 1-4L19 2a2.1 2.1 0 0 1 3 3l-8 8-4 1Z" /></>}
      {name === "voice" && <><path d="M4 10v4M8 6v12M12 3v18M16 8v8M20 10v4" /></>}
      {name === "chevron" && <path d="m6 9 6 6 6-6" />}
      {name === "plus" && <path d="M12 5v14M5 12h14" />}
      {name === "send" && <path d="M12 19V5m-5 5 5-5 5 5" />}
      {name === "check" && <><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" /><path d="m8 12 3 3 5-6" stroke="white" strokeWidth="2" /></>}
    </svg>
  );
}

function ChatCompanion({ active }: { active: boolean }) {
  const { pet, color, accessories } = usePet();
  const [phase, setPhase] = useState<Phase>("idle");
  const [composer, setComposer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [task, setTask] = useState({ title: "", answer: "" });
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState("");
  const [patted, setPatted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const voice = useRef<VoiceRecognition | null>(null);
  const patTimer = useRef(0);
  const busy = phase === "starting" || phase === "thinking";

  const stopVoice = () => {
    if (voice.current) {
      voice.current.onresult = null;
      voice.current.onerror = null;
      voice.current.onend = null;
      voice.current.abort();
      voice.current = null;
    }
    setListening(false);
  };
  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => {
    timers.current.forEach(window.clearTimeout);
    window.clearTimeout(patTimer.current);
    if (voice.current) {
      voice.current.onresult = null;
      voice.current.onerror = null;
      voice.current.onend = null;
      voice.current.abort();
    }
  }, []);

  useEffect(() => {
    if (!active) voice.current?.abort();
  }, [active]);

  useEffect(() => {
    if (active && composer && !collapsed && !busy) inputRef.current?.focus();
  }, [active, composer, collapsed, busy]);

  const newChat = () => {
    clearTimers();
    stopVoice();
    setPhase("idle");
    setTask({ title: "", answer: "" });
    setDraft("");
    setNotice("");
    setAnswerOpen(false);
    setExamplesOpen(false);
    setCollapsed(false);
    setComposer(true);
  };

  const runTask = (prompt: string) => {
    const title = prompt.trim();
    if (!title || busy) return;
    clearTimers();
    stopVoice();
    const example = EXAMPLES.find((item) => item.title.toLowerCase() === title.toLowerCase())
      ?? (/\b(ai|artificial intelligence)\b/i.test(title) ? EXAMPLES[0] : undefined);
    setTask({ title, answer: example?.answer ?? "This website previews how your companion starts, thinks, and finishes a task. Try ‘Explain AI basics’ or ‘Plan a focus break’ for a sample answer. To run your own tasks, download PocketPet and connect your preferred AI provider." });
    setDraft("");
    setNotice("");
    setComposer(false);
    setCollapsed(false);
    setAnswerOpen(false);
    setExamplesOpen(false);
    setPhase("starting");
    timers.current = [
      window.setTimeout(() => setPhase("thinking"), 1100),
      window.setTimeout(() => setPhase("completed"), 3500),
    ];
  };

  const startVoice = () => {
    if (listening) { stopVoice(); return; }
    if (busy) return;
    const browser = window as typeof window & { SpeechRecognition?: new () => VoiceRecognition; webkitSpeechRecognition?: new () => VoiceRecognition };
    const Recognition = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
    setCollapsed(false);
    setComposer(true);
    setNotice("");
    if (!Recognition) {
      setNotice("Voice input isn’t available in this browser. You can type a task below.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.onresult = (event) => setDraft(Array.from(event.results).map((result) => result[0].transcript).join(" "));
    recognition.onerror = (event) => {
      setListening(false);
      setNotice(event.error === "not-allowed" ? "Microphone access wasn’t allowed. You can still type a task." : "I couldn’t hear that. Try again, or type your task.");
    };
    recognition.onend = () => { setListening(false); voice.current = null; };
    voice.current = recognition;
    try {
      recognition.start();
      setListening(true);
    } catch {
      stopVoice();
      setNotice("Voice input couldn’t start. You can type a task below.");
    }
  };

  const pat = () => {
    window.clearTimeout(patTimer.current);
    setPatted(true);
    patTimer.current = window.setTimeout(() => setPatted(false), 1400);
  };

  return (
    <div className="companion-chat">
      <div className="companion-intro"><span className="companion-live-dot" /> A little company, a little help.</div>
      <div className="companion-character">
        <button type="button" className="companion-pet pet" data-state={patted ? "happy" : phase === "thinking" ? (pet.id === "droplet" ? "thinking" : "sleep") : phase === "completed" ? "happy" : "idle"} onClick={pat} aria-label={`Pet ${pet.name}`} title="A little hello">
          <Sprite pet={pet} color={color} accessories={accessories} />
        </button>
        <div className="companion-controls" role="group" aria-label="Companion controls">
          <button type="button" onClick={newChat} aria-label="Start a new chat" title="New chat"><Icon name="compose" /></button>
          <span className="companion-divider" />
          <button type="button" onClick={startVoice} aria-label={listening ? "Stop voice input" : "Use voice input"} aria-pressed={listening} disabled={busy} title="Voice input" className={listening ? "is-listening" : ""}><Icon name="voice" /></button>
          <span className="companion-divider" />
          <button type="button" onClick={() => { setCollapsed((value) => !value); stopVoice(); }} aria-label={collapsed ? "Expand companion panel" : "Collapse companion panel"} aria-expanded={!collapsed} aria-controls="companion-panel" title={collapsed ? "Expand" : "Collapse"} className={collapsed ? "is-collapsed" : ""}><Icon name="chevron" /></button>
        </div>
      </div>

      <div id="companion-panel" className="companion-panel" hidden={collapsed}>
        <div role="status" aria-live="polite" aria-atomic="true" className="companion-status">
          {phase !== "idle" && (
            <button type="button" className={`companion-task ${phase === "completed" ? "is-completed" : ""}`} onClick={() => phase === "completed" && setAnswerOpen((value) => !value)} disabled={phase !== "completed"} aria-expanded={phase === "completed" ? answerOpen : undefined} aria-controls={phase === "completed" ? "companion-answer" : undefined}>
              {phase === "completed" ? <><span className="companion-task-result"><span className="companion-check"><Icon name="check" /></span><strong>{task.title}</strong><span className="companion-result-separator"> · </span><span>{task.answer}</span></span><span className="sr-only">{answerOpen ? "Hide" : "Read"} full answer</span></> : <><strong>{task.title}</strong><span>{phase === "starting" ? "Starting your task" : "Thinking"}<span className="companion-thinking-dots" aria-hidden="true">...</span></span></>}
            </button>
          )}
        </div>
        {phase === "completed" && <div id="companion-answer" className="companion-answer" hidden={!answerOpen}><p>{task.answer}</p><button type="button" onClick={newChat}>Start another chat <span aria-hidden="true">↗</span></button></div>}
        {notice && <p className="companion-notice" role="status">{notice}</p>}
        {composer && (
          <form className="companion-composer" onSubmit={(event) => { event.preventDefault(); runTask(draft); }}>
            <button type="button" className="companion-add" onClick={() => setExamplesOpen((value) => !value)} aria-label="Choose an example task" aria-expanded={examplesOpen} aria-controls="companion-examples"><Icon name="plus" /></button>
            <input ref={inputRef} aria-label="Your task" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={listening ? "Listening…" : "Start a new chat"} maxLength={300} disabled={busy} onKeyDown={(event) => { if (event.key === "Escape") { stopVoice(); setComposer(false); } }} />
            <button type="submit" className="companion-send" disabled={!draft.trim() || busy} aria-label="Send task"><Icon name="send" /></button>
          </form>
        )}
        {phase === "idle" && (!composer || examplesOpen) && (
          <div className="companion-examples" id="companion-examples"><p>Try a little task</p><div>{EXAMPLES.map((example) => <button key={example.title} type="button" onClick={() => runTask(example.title)}>{example.title}<span aria-hidden="true">↗</span></button>)}</div></div>
        )}
      </div>
      <p className="companion-disclaimer">Interactive preview · Sample answers</p>
    </div>
  );
}

export default function CompanionDemo() {
  const [view, setView] = useState<"companion" | "playground">("companion");
  const { subscribe, petId, setPetId } = usePet();
  useEffect(() => subscribe(() => setView("playground")), [subscribe]);

  return (
    <div className="companion-demo" aria-label="Interactive PocketPet demo">
      <div className="companion-topbar">
        <div className="companion-tabs" role="group" aria-label="Demo view">
          <button type="button" aria-pressed={view === "companion"} onClick={() => setView("companion")}>Companion</button>
          <button type="button" aria-pressed={view === "playground"} onClick={() => setView("playground")}>Playground</button>
        </div>
        <span className="companion-preview-label">LIVE DEMO</span>
      </div>
      <div className="companion-pet-picker" role="group" aria-label="Choose your companion">
        {PET_IDS.map((id) => <button key={id} type="button" aria-label={PETS[id].name} title={PETS[id].name} aria-pressed={petId === id} onClick={() => setPetId(id)}>{PETS[id].emoji}</button>)}
      </div>
      <div className="companion-views">
        <div className="companion-view" inert={view !== "companion"} aria-hidden={view !== "companion"} style={{ visibility: view === "companion" ? "visible" : "hidden" }}><ChatCompanion active={view === "companion"} /></div>
        <div className="companion-view companion-playground" inert={view !== "playground"} aria-hidden={view !== "playground"} style={{ visibility: view === "playground" ? "visible" : "hidden" }}><PetStage /></div>
      </div>
    </div>
  );
}
