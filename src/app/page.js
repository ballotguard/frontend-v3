"use client";

import Link from "next/link";
import { HeroAuthButtons } from "../components/HeroAuthButtons";
import { Button } from "../components/ui/Button";
import {
  ShieldCheck,
  Zap,
  Lock,
  KeyRound,
  Globe,
  ScrollText,
  Mail,
  BarChart2,
  Timer,
  ShieldAlert,
} from "lucide-react";

// Feature Marquee Items
const MARQUEE_ITEMS = [
  { icon: ShieldCheck,  title: "End-to-End Encryption" },
  { icon: Zap,          title: "Instant Real-Time Tally" },
  { icon: Lock,         title: "Zero-Knowledge Ballots" },
  { icon: KeyRound,     title: "HMAC-SHA256 Token Sealing" },
  { icon: Globe,        title: "One-Click Google OAuth" },
  { icon: ScrollText,   title: "Verifiable Audit Certificates" },
  { icon: Mail,         title: "Automated SMTP Invitations" },
  { icon: BarChart2,    title: "Live Turnout Visualizer" },
  { icon: Timer,        title: "Scheduled Window Control" },
  { icon: ShieldAlert,  title: "Rate-Limited DDoS Guard" },
];

export default function Home() {
  const word1 = "BALLOT";
  const word2 = "GUARD";

  return (
    <div className="w-full flex flex-col bg-canvas text-ink transition-colors">
      {/* =========================================================================
          HERO SECTION: EDITORIAL DARK REGISTER (Canvas 1: Primary Indigo Navy)
          ========================================================================= */}
      <section className="relative w-full h-screen flex flex-col pt-16 pb-0 px-6 sm:px-12 md:px-16 hero-atmosphere text-white overflow-hidden select-none">
        
        {/* TOP RIGHT CORNER: Motto, Taglines, and Auth CTAs */}
        <div className="w-full flex justify-end z-10 pt-4 sm:pt-6">
          <div className="w-full max-w-md lg:max-w-lg flex flex-col items-start lg:items-end text-left lg:text-right space-y-5 animate-fade-down">
            
            {/* Eyebrow without bg or border */}
            <div className="text-surface-violet-soft text-xs font-semibold tracking-widest uppercase">
              VERIFIABLE VOTING ENGINE
            </div>

            {/* Editorial Lead Motto */}
            <p className="text-xl sm:text-2xl font-normal leading-snug tracking-tight text-white/95 text-balance">
              Democracy in high fidelity. Cryptographically sealed, verifiable digital elections built for modern organizations.
            </p>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm">
              Eliminate ballot stuffing and voter tampering with cryptographic HMAC tokens, instant real-time tallies, and audit proofs.
            </p>

            {/* Single hero pill CTA in pale violet */}
            <div className="pt-2">
              <HeroAuthButtons variant="hero" />
            </div>
          </div>
        </div>

        {/* BALLOTGUARD Display — sits below tagline */}
        <div className="w-full z-10 mt-4 pb-14">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-surface-violet-soft/75 font-semibold mb-2">
              01 // TRUST ARCHITECTURE
            </span>

            {/* Giant stacked title: BALLOT / GUARD */}
            <h1
              className="flex flex-col leading-[0.85] tracking-[-0.05em] font-semibold text-white"
              aria-label="BallotGuard"
            >
              <span className="flex flex-wrap text-[18vw] sm:text-[18vw] lg:text-[18vw] xl:text-[22vh]">
                {word1.split("").map((char, index) => (
                  <span key={`w1-${index}`} className="char-container">
                    <span
                      className="char-animated inline-block text-white"
                      style={{ animationDelay: `${index * 55 + 80}ms` }}
                    >
                      {char}
                    </span>
                  </span>
                ))}
              </span>
              <span className="flex flex-wrap text-[18vw] sm:text-[18vw] lg:text-[18vw] xl:text-[22vh]">
                {word2.split("").map((char, index) => (
                  <span key={`w2-${index}`} className="char-container">
                    <span
                      className="char-animated inline-block text-white"
                      style={{ animationDelay: `${(word1.length + index) * 55 + 80}ms` }}
                    >
                      {char}
                    </span>
                  </span>
                ))}
              </span>
            </h1>
          </div>
        </div>

        {/* MARQUEE — absolutely pinned to bottom of hero, always in viewport */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/5 border-t border-white/10 backdrop-blur-sm py-3 overflow-hidden">
          <div className="marquee-track flex items-center gap-6 select-none">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 text-white/70 text-xs font-medium tracking-tight whitespace-nowrap hover:text-white/100 transition-colors"
              >
                <span className="opacity-60">
                  {(() => { const Icon = item.icon; return <Icon size={12} strokeWidth={1.8} />; })()}
                </span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BODY SECTION: WHITE CANVAS (Canvas 2: Clean Editorial Feature Breakdown)
          ========================================================================= */}
      <section className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-24 space-y-24">
        
        {/* Section Opener */}
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-wider text-ink-mute font-semibold">
            System Guarantees
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-[-1.32px] leading-[0.96] text-ink mt-3">
            Uncompromising integrity for every vote cast.
          </h2>
          <p className="text-base sm:text-lg text-ink-mute leading-relaxed mt-5">
            Designed for institutional governance, academic elections, shareholder decisions, and community polls that demand unquestionable proof of results.
          </p>
        </div>

        {/* Feature Row 1: HMAC Cryptographic Sealing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-8 sm:p-12 rounded-lg bg-canvas-soft border border-hairline">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-teal-deep">
              02 / Cryptographic Security
            </span>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-[-0.63px] leading-[1.14] text-ink">
              Tamper-proof HMAC ballot tokens.
            </h3>
            <p className="text-sm text-ink-mute leading-relaxed">
              Every voter receives a cryptographically generated, one-time secret token hashed with the election&apos;s master key. Ballots cannot be intercepted, replayed, or cast by unauthorized parties.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-ink-mute">
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">—</span>
                HmacSHA256 signature verification on every submitted ballot
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">—</span>
                Strict single-vote enforcement per cryptographic credential
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">—</span>
                Absolute separation between voter identity and ballot choice
              </li>
            </ul>
          </div>

          {/* Interactive UI Representation */}
          <div className="p-6 rounded-lg bg-canvas border border-hairline shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">VALIDATED</span>
                <span className="text-xs font-mono font-medium text-ink">HMAC_VERIFIER</span>
              </div>
              <span className="text-[11px] font-mono text-ink-faint">256-bit Key</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded bg-canvas-soft text-ink-mute">
                <span className="text-ink-faint block text-[10px]">VOTING SECRET HASH</span>
                <span className="text-ink break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>
              <div className="p-2.5 rounded bg-canvas-soft text-ink-mute flex items-center justify-between">
                <span>STATUS: CIPHER_LOCKED</span>
                <span className="text-emerald-700 font-semibold text-[11px]">VERIFIED ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Row 2: One-Click Google Authentication & Voter Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-8 sm:p-12 rounded-lg bg-canvas border border-hairline">
          {/* Visual UI Representation */}
          <div className="order-2 md:order-1 p-6 rounded-lg bg-canvas-soft border border-hairline shadow-sm space-y-3">
            <div className="text-xs font-medium text-ink flex items-center justify-between">
              <span>Imported Voter Roster</span>
              <span className="text-[11px] text-ink-mute">240 Eligible Voters</span>
            </div>
            
            <div className="space-y-2">
              {[
                { email: "sarah.connor@university.edu", status: "Invitation Sent", ok: true },
                { email: "alex.thorne@organization.org", status: "Ballot Cast", ok: true },
                { email: "elena.rostova@academics.org", status: "Ballot Cast", ok: true },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded bg-canvas border border-hairline text-xs">
                  <span className="font-mono text-ink">{row.email}</span>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-teal-deep">
              02 / Authentication &amp; Delivery
            </span>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-[-0.63px] leading-[1.14] text-ink">
              One-click Google login &amp; confidential email delivery.
            </h3>
            <p className="text-sm text-ink-mute leading-relaxed">
              No passwords to remember or compromise. Organizers authenticate seamlessly via Google OAuth, while voters receive personalized, sealed ballot links dispatched directly through your configured SMTP service.
            </p>
            <div className="pt-2">
              <Link href="/auth/login">
                <Button variant="secondary" size="md">
                  Explore Authentication Flow →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Row 3: Live Real-Time Analytics & Audit Records */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-8 sm:p-12 rounded-lg bg-canvas-soft border border-hairline">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-teal-deep">
              03 / Real-Time Tally
            </span>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-[-0.63px] leading-[1.14] text-ink">
              Live turnout telemetry &amp; certified audit certificates.
            </h3>
            <p className="text-sm text-ink-mute leading-relaxed">
              Observe voter turnout in real-time through low-latency WebSockets. Once an election ends, the system locks the tally permanently and produces verifiable cryptographic summary certificates.
            </p>
          </div>

          {/* Turnout Mock UI */}
          <div className="p-6 rounded-lg bg-canvas border border-hairline shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink">Executive Council Election 2026</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                LIVE
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-ink-mute">
                <span>Turnout Progress</span>
                <span className="text-ink font-semibold">84.2%</span>
              </div>
              <div className="w-full h-2 rounded-sm bg-canvas-soft overflow-hidden border border-hairline">
                <div className="h-full bg-primary rounded-sm" style={{ width: "84.2%" }} />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-ink-mute border-t border-hairline">
              <span>Votes Verified: 421 / 500</span>
              <span className="font-mono text-[10px]">TALLY_SEALED::OK</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CLOSING CTA BAND: DEEP TEAL (Canvas 3: Surface Teal Deep)
          ========================================================================= */}
      <section className="w-full bg-surface-teal-deep text-white py-24 sm:py-32 px-6 sm:px-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 z-10">
          <span className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">
            SECURE DEMOCRACY AWAITS
          </span>
          <h2 className="text-3xl sm:text-5xl font-medium tracking-[-1.32px] leading-[0.96] text-white">
            Ready to run your next election with mathematical certainty?
          </h2>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-lg mx-auto">
            Create an election in less than three minutes, distribute sealed tokens, and watch verifiable results stream in.
          </p>
          <div className="pt-4 flex justify-center">
            <HeroAuthButtons variant="teal" />
          </div>
        </div>
      </section>
    </div>
  );
}
