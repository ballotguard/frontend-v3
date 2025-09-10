import { Sidebar } from "@/components/Sidebar";

export default function ElectionLayout({ children, params }) {
  const { id } = params || {};
  return (
    <div className="flex gap-6 px-4 sm:px-6">
      <aside className="w-64 shrink-0 hidden sm:block">
        <Sidebar electionId={id} />
      </aside>
      <div className="flex-1 min-w-0">
        {/* Ensure consistent content width and alignment across all tabs */}
        <div className="w-full max-w-3xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
