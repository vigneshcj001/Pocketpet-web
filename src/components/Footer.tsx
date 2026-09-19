import { REPO_URL } from "../hooks/useRelease";
import { usePet } from "../pet/PetContext";
import Sprite from "../pet/Sprite";

export default function Footer() {
  const { pet, color, accessories } = usePet();
  return (
    <footer className="mt-5 border-t border-line px-5 pb-15 pt-10 text-center text-sm text-muted">
      {/* Your pet, asleep — same sprite and sleep animation as the app. */}
      <div className="pet mx-auto mb-2.5 !static size-16 cursor-default opacity-90 [--pet-size:64px]" data-state="sleep">
        <Sprite pet={pet} color={color} accessories={accessories} />
      </div>
      <p>
        PocketPet · Built with Tauri, Rust and a lot of CSS animation ·{" "}
        <a href={REPO_URL} target="_blank" rel="noopener">Source on GitHub</a>
      </p>
    </footer>
  );
}
