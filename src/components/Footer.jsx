"use client";

export function Footer() {
  return (
  <footer className="mt-16">
      <div
    className="border border-neutral-200/40 dark:border-neutral-700/40 px-4 py-6 text-sm text-neutral-700 dark:text-neutral-300"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(228,218,253,0.10), rgba(228,218,253,0.05))",
          backgroundColor: "rgba(228,218,253,0.06)",
          backdropFilter: "blur(1px)",
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3">
            <a className="hover:underline" href="mailto:ballotguard@gmail.com">Contact Us</a>
            <span className="text-neutral-400">|</span>
            <a className="hover:underline" href="https://github.com/ballotguard" target="_blank" rel="noreferrer">Development Repositories</a>
          </div>
          <div className="text-xs">© {new Date().getFullYear()} Ballotguard | All rights reserved</div>
        </div>
      </div>
    </footer>
  );
}
