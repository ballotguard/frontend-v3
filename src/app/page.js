import Link from "next/link";
import { Card } from "../components/ui/Card";
import { HeroAuthButtons } from "../components/HeroAuthButtons";

function BallotIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M8 12h8M8 16h5" />
      <path d="M7 8l4-5h6l-4 5H7z" />
    </svg>
  );
}

function LockIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="10" width="18" height="11" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3" />
    </svg>
  );
}

function ChartIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3v18h18" />
      <rect x="7" y="13" width="3" height="5" />
      <rect x="12" y="9" width="3" height="9" />
      <rect x="17" y="5" width="3" height="13" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden p-10 text-center">
        <h1 className="mx-auto  text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#4E74A9] via-[#6B8FBD] to-[#9DB7DF] mb-6 pb-2 ">
          
          Secure Digital Voting Platform
        </h1>
        <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
          Create elections, invite voters, and view results with complete transparency and security.
        </p>
  <HeroAuthButtons variant="hero" />
      </div>

      {/* Informational Panes (full-width stacked) */}
      <div className="space-y-10">
        {/* Pane 1: Create Election */}
  <section className="relative overflow-hidden rounded-3xl border border-[#4E74A9] dark:border-neutral-700/40 backdrop-blur-2xl bg-white/25 dark:bg-neutral-900/25 px-8 py-10 flex flex-col md:flex-row items-stretch gap-10 shadow-lg shadow-neutral-900/5 dark:shadow-none">
          {/* accents */}
          <div className="pointer-events-none absolute -top-16 -left-24 h-64 w-64 bg-gradient-to-br from-sky-400/30 via-indigo-400/20 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 bg-gradient-to-tr from-indigo-500/30 via-sky-400/20 to-transparent blur-3xl" />
          <div className="md:w-5/12 relative z-10 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-4">Create elections in minutes</h3>
            <p className="text-neutral-700 dark:text-neutral-300 mb-3 text-sm sm:text-base">Define the title, description, allowed voters and precise start / end times inside a guided multi‑step wizard.</p>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Flexible layouts, single or multiple choice polls, and instant validation help you launch confidently.</p>
            <div className="mt-6 flex gap-3">
            </div>
          </div>
          {/* Visual mock / right side */}
          <div className="relative z-10 md:flex-1 grid place-items-center">
            <div className="w-full max-w-md aspect-[5/4] rounded-2xl border border-neutral-300/60 dark:border-neutral-700/50 bg-white/60 dark:bg-neutral-800/40 backdrop-blur-xl p-5 shadow-sm flex flex-col space-y-4">
              {/* Title field (skeleton) */}
              <div>
                <div className="h-3 w-16 mb-1 rounded bg-neutral-300/70 dark:bg-neutral-600/60" />
                <div className="h-9 rounded-md border border-neutral-300/70 dark:border-neutral-600/60 bg-white/80 dark:bg-neutral-700/50 flex items-center px-3">
                  <div className="h-3 w-2/3 rounded bg-neutral-300/70 dark:bg-neutral-500/70" />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="h-2 w-5/6 rounded bg-neutral-300/60 dark:bg-neutral-600/60" />
                  <div className="h-2 w-2/5 rounded bg-neutral-300/50 dark:bg-neutral-700/50" />
                </div>
              </div>
              {/* Description field (skeleton) */}
              <div>
                <div className="h-3 w-24 mb-1 rounded bg-neutral-300/70 dark:bg-neutral-600/60" />
                <div className="h-16 rounded-md border border-neutral-300/70 dark:border-neutral-600/60 bg-white/80 dark:bg-neutral-700/50 p-3 space-y-2">
                  <div className="h-2.5 w-4/5 rounded bg-neutral-300/70 dark:bg-neutral-500/70" />
                  <div className="h-2 w-3/4 rounded bg-neutral-300/60 dark:bg-neutral-600/60" />
                  <div className="h-2 w-1/2 rounded bg-neutral-300/60 dark:bg-neutral-600/60" />
                </div>
              </div>
              {/* Time + toggle condensed */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-9 rounded-md border border-neutral-300/70 dark:border-neutral-600/60 bg-white/80 dark:bg-neutral-700/50 flex items-center px-3 gap-2">
                  <div className="h-3 w-1/3 rounded bg-neutral-300/70 dark:bg-neutral-500/70" />
                  <div className="h-3 w-8 rounded bg-neutral-300/50 dark:bg-neutral-600/60" />
                </div>
              </div>
              
              {/* Group: Options */}
              <div className="flex items-center justify-between mt-0.5">
                <div className="text-[11px] font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">Options</div>
                <div className="flex items-center gap-1">
                  <div className="h-5 w-5 rounded-md border border-neutral-300/70 dark:border-neutral-600/60 bg-white/70 dark:bg-neutral-700/50 flex items-center justify-center text-neutral-500 text-[11px]">+</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Option A','Option B','Option C'].map((label,i)=>(
                  <div key={i} className="h-10 rounded-md border border-neutral-300/70 dark:border-neutral-600/60 bg-white/80 dark:bg-neutral-700/50 flex items-center px-2">
                    <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 truncate">{label}</span>
                  </div>
                ))}
              </div>
              {/* Group: Voters */}
              <div className="flex items-center justify-between mt-2">
                <div className="text-[11px] font-semibold tracking-wide text-neutral-700 dark:text-neutral-300 uppercase">Voters</div>
                <div className="flex items-center gap-1">
                  <div className="h-5 w-5 rounded-md border border-neutral-300/70 dark:border-neutral-600/60 bg-white/70 dark:bg-neutral-700/50 flex items-center justify-center text-neutral-500 text-[11px]">+</div>
                </div>
              </div>
              <div className="mt-1 grid grid-cols-3 gap-2">
                {['alice@example.com','bob@example.com','carol@example.com'].map(e => (
                  <div key={e} className="rounded-md border border-neutral-300/60 dark:border-neutral-600/60 bg-white/70 dark:bg-neutral-700/50 px-2 py-1 flex items-center">
                    <span className="text-[10px] truncate text-neutral-600 dark:text-neutral-300">{e}</span>
                  </div>
                ))}
              </div>
              {/* Action buttons skeleton */}
              <div className="mt-auto pt-2 flex justify-center gap-3 w-full">
                <div className="h-9 w-20 rounded-md border border-neutral-300/70  dark:border-neutral-600/60 bg-neutral-600 text-white dark:bg-neutral-700/50 flex items-center justify-center text-sm" >Create</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pane 2: Secure Email & Voting (visual left for alternation) */}
  <section className="relative overflow-hidden rounded-3xl border border-[#4E74A9] dark:border-neutral-700/40 backdrop-blur-2xl bg-white/25 dark:bg-neutral-900/25 px-8 py-10 flex flex-col md:flex-row-reverse items-stretch gap-10 shadow-lg shadow-neutral-900/5 dark:shadow-none">
          <div className="pointer-events-none absolute -top-14 -right-24 h-60 w-60 bg-gradient-to-br from-emerald-400/30 via-teal-400/25 to-transparent blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 bg-gradient-to-tr from-teal-500/30 via-emerald-400/20 to-transparent blur-3xl" />
          <div className="md:w-5/12 relative z-10 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-4">Secure voter delivery</h3>
            <p className="text-neutral-700 dark:text-neutral-300 mb-3 text-sm sm:text-base">Unique access links sent to every authorized voter ensure one‑voter‑one‑vote integrity.</p>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Tokenized invitations, open / closed modes and automatic restriction against duplicate ballots.</p>
          </div>
          {/* Email mock (left on desktop via row-reverse) */}
          <div className="relative z-10 md:flex-1 grid place-items-center">
            <div className="w-full max-w-md aspect-[5/4] rounded-2xl border border-neutral-300/60 dark:border-neutral-700/50 bg-white/60 dark:bg-neutral-800/40 backdrop-blur-xl p-5 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <div className="h-3 w-3 rounded-full bg-teal-400/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-300/70" />
                <div className="ml-auto h-3 w-16 rounded bg-neutral-300/70 dark:bg-neutral-600/60" />
              </div>
              <div className="space-y-2 overflow-hidden">
                {Array.from({length:7}).map((_,i)=>(
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-neutral-300/60 dark:border-neutral-600/50 bg-white/70 dark:bg-neutral-700/40 px-3 py-2">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-emerald-400/70 to-teal-400/70 flex items-center justify-center text-[10px] font-medium text-white/90">
                      {i===0 ? 'BG' : ''}
                    </div>
                    <div className="flex-1 py-0.5 space-y-1.5">
                      {i===0 ? (
                        <>
                          <div className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Ballotguard</div>
                          <div className="text-[11px] text-neutral-600 dark:text-neutral-400">Your vote is requested</div>
                        </>
                      ) : (
                        <>
                          <div className="h-2 w-2/3 rounded bg-neutral-300/80 dark:bg-neutral-500/70" />
                          <div className="h-1.5 w-1/2 rounded bg-neutral-300/60 dark:bg-neutral-600/60" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pane 3: Results */}
  <section className="relative overflow-hidden rounded-3xl border border-[#4E74A9] dark:border-neutral-700/40 backdrop-blur-2xl bg-white/25 dark:bg-neutral-900/25 px-8 py-10 flex flex-col md:flex-row items-stretch gap-10 shadow-lg shadow-neutral-900/5 dark:shadow-none">
          <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 bg-gradient-to-br from-fuchsia-400/30 via-violet-400/25 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 bg-gradient-to-tr from-violet-500/30 via-fuchsia-400/20 to-transparent blur-3xl" />
          <div className="md:w-5/12 relative z-10 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-4">Transparent results & auditability</h3>
            <p className="text-neutral-700 dark:text-neutral-300 mb-3 text-sm sm:text-base">Live vote counts, ranked option distribution and automatic sharing of final tallies with every voter.</p>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">Post‑election, voter and option lists let participants verify no outsider cast a ballot.</p>
          </div>
          {/* Results mock */}
          <div className="relative z-10 md:flex-1 grid place-items-center">
            <div className="w-full max-w-md aspect-[5/4] rounded-2xl border border-neutral-300/60 dark:border-neutral-700/50 bg-white/60 dark:bg-neutral-800/40 backdrop-blur-xl p-5 shadow-sm flex flex-col">
              <div className="relative flex items-start gap-3 mb-4">
                <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-fuchsia-500/70 to-violet-500/70" />
                <div className="min-w-0">
                  <h4 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">Results</h4>
                  <div className="text-[11px] opacity-70 text-neutral-600 dark:text-neutral-400">Election name</div>
                </div>
                <div className="ml-auto shrink-0 inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-neutral-900/40 px-3 py-1.5">
                  <span className="text-[11px] opacity-70">Votes</span>
                  <span className="text-xs font-medium">128</span>
                  <span className="opacity-40">/</span>
                  <span className="text-[11px] opacity-70">Voters</span>
                  <span className="text-xs font-medium">128</span>
                </div>
              </div>
              <ul className="space-y-3 relative">
                {Array.from({length:5}).map((_,i)=>{
                  const pct = 78 - i*11;
                  return (
                    <li key={i} className="group rounded-xl border border-neutral-300/60 dark:border-neutral-600/50 bg-white/70 dark:bg-neutral-700/40 backdrop-blur p-3">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">Option {i+1}</div>
                        <div className="shrink-0 text-xs opacity-80 tabular-nums text-neutral-600 dark:text-neutral-400">{Math.max(pct-5,0)} • {pct}%</div>
                      </div>
                      <div className="h-3 rounded-full bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-600 overflow-hidden">
                        <div style={{width:`${pct}%`}} className="h-full rounded-full bg-gradient-to-r from-fuchsia-400/80 via-violet-500/80 to-fuchsia-500/80" />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-auto pt-4 grid grid-cols-3 gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
                <div className="text-center">
                  <div className="font-medium text-neutral-700 dark:text-neutral-200 text-xs">128</div>
                  <div>Votes</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-neutral-700 dark:text-neutral-200 text-xs">100%</div>
                  <div>Turnout</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-neutral-700 dark:text-neutral-200 text-xs">5</div>
                  <div>Options</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

     
  {/* CTA Section */}
      <div className="text-center py-8">
        <div className="p-8">
          <h2 className="text-3xl font-semibold mb-4 text-neutral-900 dark:text-white">
            Ready to start your first election?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            Join thousands of organizations using Ballotguard for secure, transparent voting.
          </p>
          <HeroAuthButtons variant="cta" />
        </div>
      </div>
    </div>
  );
}
