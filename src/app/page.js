import Link from "next/link";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ColorfulButton } from "../components/ui/ColorfulButton";

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
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/auth/signup">
            <ColorfulButton variant="secondary" width="160px">Get Started</ColorfulButton>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" className="bg-neutral-800 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 min-w-[140px]">Login</Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
    <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <div className="mb-4 flex justify-center text-neutral-800 dark:text-neutral-200"><BallotIcon /></div>
          <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-white">Create Elections</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Set up elections with custom options, voter lists, and time schedules.</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">Design single or multi-choice polls, configure start/end times, and manage participants efficiently.</p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="mb-4 flex justify-center text-neutral-800 dark:text-neutral-200"><LockIcon /></div>
          <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-white">Secure Voting</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">End-to-end encryption ensures vote privacy and election integrity.</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">Authenticated voters only, auditable results, and protection against tampering or duplicate votes.</p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="mb-4 flex justify-center text-neutral-800 dark:text-neutral-200"><ChartIcon /></div>
          <h3 className="text-lg font-medium mb-2 text-neutral-900 dark:text-white">Real-time Results</h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">View live results and detailed analytics as votes are cast.</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">Export summaries, share results securely, and analyze turnout and option popularity.</p>
        </Card>
      </div>

      {/* How it works */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-medium mb-2">1. Create</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Define election details, options, and eligible voters in minutes.</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-medium mb-2">2. Invite</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Share secure links with voters to cast their vote from any device.</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-medium mb-2">3. Track</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Monitor turnout in real-time and publish results instantly.</p>
        </Card>
      </section>

      {/* CTA Section */}
      <div className="text-center py-8">
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">
            Ready to start your first election?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            Join thousands of organizations using Ballotguard for secure, transparent voting.
          </p>
          <Link href="/auth/signup">
            <ColorfulButton variant="secondary" width="240px">Create Free Account</ColorfulButton>
          </Link>
        </Card>
      </div>
    </div>
  );
}
