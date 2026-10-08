import { usePet } from "../pet/context";

/** Hand off appearance only; JSON stays available if protocol link is blocked. */
export default function PetPresetDownload() {
  const { petId, color, accessories } = usePet();
  const sendToDesktop = () => {
    const query = new URLSearchParams({ pet: petId, color: color ?? "", accessories: JSON.stringify(accessories) });
    window.location.href = `pocketpet://pet/apply?${query}`;
  };
  const download = () => {
    const data = { app: "PocketPet", type: "pet-preset", version: 1, pet: petId, color, accessories };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pocketpet-${petId}-preset.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="flex gap-2">
    <button type="button" onClick={sendToDesktop} className="min-w-0 flex-1 rounded-lg bg-accent px-2 py-2 text-xs font-bold text-accent-ink">Send to desktop app</button>
    <button type="button" onClick={download} className="rounded-lg border border-line px-2 py-2 text-xs font-bold" title="Import this file from PocketPet Settings → Pets">Save setup file</button>
  </div>;
}
