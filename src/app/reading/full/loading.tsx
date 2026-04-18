import { TycheSigil } from "@/components/TycheSigil";

/**
 * Loading state for /reading/full — shown while Claude generates the Reading.
 * This is the most anxious moment in the funnel. Beautiful loading = trust.
 *
 * Next.js App Router shows this automatically while the server component
 * renders (which includes the Claude API call, 5-30s).
 */

export default function ReadingLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 starfield opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[var(--tyche)] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

      <TycheSigil size={120} className="mb-10" />

      <div className="eyebrow eyebrow-tyche mb-6 pulse-slow">
        tyche is preparing your reading
      </div>

      {/* Animated progress messages */}
      <div className="space-y-3 text-center mb-10">
        <p className="font-display text-[20px] md:text-[24px] text-[var(--text)] animate-fade-in">
          Weaving your pattern through twelve traditions&hellip;
        </p>
        <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider animate-fade-in" style={{ animationDelay: "1s" }}>
          THIS TAKES 15-30 SECONDS · YOUR READING IS UNIQUE
        </p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-3 mb-12">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--tyche)] pulse-slow"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      {/* Trust signals while waiting */}
      <div className="max-w-md text-center space-y-4">
        <p className="text-[14px] text-[var(--text-muted)] italic font-display animate-fade-in" style={{ animationDelay: "3s" }}>
          &ldquo;Chance favours the prepared mind.&rdquo;
        </p>
        <p className="font-mono text-[10px] text-[var(--text-subtle)] tracking-wider animate-fade-in" style={{ animationDelay: "3.5s" }}>
          &mdash; LOUIS PASTEUR
        </p>
      </div>
    </div>
  );
}
