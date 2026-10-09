import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { PETS, type PetId } from "../data/pets";
import { Ctx, type Accessory, type PetAction, type PetState } from "./context";

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
