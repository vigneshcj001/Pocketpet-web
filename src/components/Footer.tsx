import { REPO_URL } from "../hooks/useRelease";
import { usePet } from "../pet/PetContext";
import Sprite from "../pet/Sprite";

export default function Footer() {
  const { pet, color, accessories } = usePet();
  return (
    <footer className="mt-10 border-t border-line bg-bg2/50 px-5 pb-16 pt-12 text-center text-sm text-muted">
      {/* Your pet, asleep — same sprite and sleep animation as the app. */}
      <div className="pet mx-auto mb-2.5 !static size-16 cursor-default opacity-90 [--pet-size:64px]" data-state="sleep">
        <Sprite pet={pet} color={color} accessories={accessories} />
      </div>
      <p className="font-extrabold text-ink">Good company for long days at your computer.</p>
      <p className="mt-2">Free and open source · Built with Tauri and Rust ·{" "}<a href={REPO_URL} target="_blank" rel="noopener" className="font-bold text-ink">Source on GitHub ↗</a></p>
    </footer>
  );
}
