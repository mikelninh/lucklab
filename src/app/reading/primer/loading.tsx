import { TycheSigil } from "@/components/TycheSigil";

export default function PrimerLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
      <TycheSigil size={80} className="mb-8" />
      <div className="eyebrow eyebrow-tyche mb-4 pulse-slow">
        preparing your primer
      </div>
      <p className="font-display text-[18px] text-[var(--text-muted)] animate-fade-in">
        Mapping your six levers&hellip;
      </p>
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-[var(--gold)] pulse-slow" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>
    </div>
  );
}
