import { useMemo } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Download, { PRIMARY_SUFFIX } from "./components/Download";
import Features from "./components/Features";
import Compare from "./components/Compare";
import Agent from "./components/Agent";
import Changelog from "./components/Changelog";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import SiteBuddy from "./components/SiteBuddy";
import MobileBar from "./components/MobileBar";
import { PetProvider } from "./pet/PetContext";
import { detectOs, useRelease, RELEASES_URL } from "./hooks/useRelease";
import { useRepo } from "./hooks/useRepo";
import { useReveal } from "./hooks/useReveal";

export default function App() {
  const os = useMemo(detectOs, []);
  const rel = useRelease();
  const { stats, releases } = useRepo();
  useReveal([releases.length]);
  // Once the release is known, the hero button downloads the visitor's file directly.
  const direct = os ? (rel.asset(PRIMARY_SUFFIX[os])?.url ?? null) : null;

  return (
    <PetProvider>
      <Header />
      <main id="top" className="mx-auto max-w-[1120px] px-5">
        <Hero os={os} directUrl={direct} stats={stats} version={rel.release?.tag ?? null} />
        <Download os={os} rel={rel} />
        <Features />
        <Compare />
        <Agent />
        <Changelog releases={releases} />
        <Faq />
      </main>
      <Footer />
      <SiteBuddy />
      <MobileBar os={os} href={direct ?? (rel.release?.url ?? RELEASES_URL)} />
    </PetProvider>
  );
}
