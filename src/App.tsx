import { useMemo } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Download from "./components/Download";
import Features from "./components/Features";
import Compare from "./components/Compare";
import Agent from "./components/Agent";
import Changelog from "./components/Changelog";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import SiteBuddy from "./components/SiteBuddy";
import MobileBar from "./components/MobileBar";
import { PetProvider } from "./pet/PetContext";
import { detectOs, primarySuffix, useMacArch, useRelease } from "./hooks/useRelease";
import { useRepo } from "./hooks/useRepo";
import { useReveal } from "./hooks/useReveal";

export default function App() {
  const os = useMemo(() => detectOs(), []);
  const rel = useRelease();
  const macArch = useMacArch(os);
  const stats = useRepo();
  useReveal([rel.releases.length]);
  // Once the release is known, the hero button downloads the visitor's file directly.
  // Macs get a direct link only when the browser reveals Apple Silicon vs Intel.
  const suffix = primarySuffix(os, macArch);
  const direct = suffix ? (rel.asset(suffix)?.url ?? null) : null;

  return (
    <PetProvider>
      <Header />
      <main id="top" className="mx-auto max-w-[1180px] px-5 sm:px-7">
        <Hero os={os} macArch={macArch} directUrl={direct} stats={stats} version={rel.release?.tag ?? null} />
        <Download os={os} macArch={macArch} rel={rel} />
        <Features />
        <Compare />
        <Agent />
        <Changelog releases={rel.releases} />
        <Faq />
      </main>
      <Footer />
      <SiteBuddy />
      <MobileBar os={os} href={direct ?? "#download"} />
    </PetProvider>
  );
}
