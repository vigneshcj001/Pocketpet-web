import { createContext, useContext } from "react";
import type { Pet, PetId } from "../data/pets";

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

export interface PetState {
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

export const Ctx = createContext<PetState | null>(null);

export function usePet() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePet outside PetProvider");
  return v;
}
