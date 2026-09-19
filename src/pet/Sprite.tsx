import { useMemo } from "react";
import type { Pet } from "../data/pets";
import { tintedSvg } from "./tint";
import type { Accessory } from "./PetContext";

/** The pet's SVG plus its emoji accessories, recoloured if asked. */
export default function Sprite({ pet, color = null, accessories = [] }: { pet: Pet; color?: string | null; accessories?: Accessory[] }) {
  const svg = useMemo(() => tintedSvg(pet.svg, pet.tint, color), [pet, color]);
  return (
    <>
      <div className="sprite" dangerouslySetInnerHTML={{ __html: svg }} />
      {accessories.length > 0 && (
        <div className="accessories">
          {accessories.map((a) => (
            <span key={a.emoji} className={`acc acc-${a.slot}`}>{a.emoji}</span>
          ))}
        </div>
      )}
    </>
  );
}
