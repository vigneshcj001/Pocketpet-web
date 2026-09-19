import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { PETS, type Pet, type PetId } from "../data/pets";

/** Things any part of the page can ask the stage pet to do. */
export type PetAction = "feed" | "toss" | "spin" | "dash" | "sleep" | "wave" | "hide" | "celebrate";

export type Slot = "hat" | "face" | "neck" | "back" | "paw";
export interface Accessory {
  emoji: string;
  slot: Slot;
}

export const ACCESSORY_CHOICES: Accessory[] = [
  { emoji: "🎩", slot: "hat" },
  { emoji: "👑", slot: "hat" },
  { emoji: "🎀", slot: "hat" },
  { emoji: "🕶️", slot: "face" },
  { emoji: "🧣", slot: "neck" },
  { emoji: "🎈", slot: "paw" },
  { emoji: "🎒", slot: "back" },
  { emoji: "🦋", slot: "back" },
];

interface PetState {
  petId: PetId;
  pet: Pet;
  setPetId: (id: PetId) => void;
  color: string | null;
  setColor: (c: string | null) => void;
  accessories: Accessory[];
  toggleAccessory: (a: Accessory) => void;
  /** Ask the stage pet to do something; the stage subscribes. */
  perform: (action: PetAction) => void;
  subscribe: (fn: (action: PetAction) => void) => () => void;
  buddyHidden: boolean;
  setBuddyHidden: (v: boolean) => void;
}

const Ctx = createContext<PetState | null>(null);

export function PetProvider({ children }: { children: ReactNode }) {
  const [petId, setPetId] = useState<PetId>("cat");
  const [color, setColor] = useState<string | null>(null);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [buddyHidden, setBuddyHidden] = useState(false);
  const listeners = useRef(new Set<(a: PetAction) => void>());

  const toggleAccessory = useCallback((a: Accessory) => {
    setAccessories((list) => {
      if (list.some((x) => x.emoji === a.emoji)) return list.filter((x) => x.emoji !== a.emoji);
      // One accessory per slot, four at most — same rules as the app.
      const rest = list.filter((x) => x.slot !== a.slot);
      return [...rest, a].slice(-4);
    });
  }, []);

  const perform = useCallback((action: PetAction) => {
    for (const fn of listeners.current) fn(action);
  }, []);
  const subscribe = useCallback((fn: (a: PetAction) => void) => {
    listeners.current.add(fn);
    return () => {
      listeners.current.delete(fn);
    };
  }, []);

  const value = useMemo<PetState>(
    () => ({ petId, pet: PETS[petId], setPetId, color, setColor, accessories, toggleAccessory, perform, subscribe, buddyHidden, setBuddyHidden }),
    [petId, color, accessories, toggleAccessory, perform, subscribe, buddyHidden],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePet() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePet outside PetProvider");
  return v;
}
