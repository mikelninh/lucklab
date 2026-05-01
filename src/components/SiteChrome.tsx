"use client";

import { usePathname } from "next/navigation";
import { LuckLayer } from "@/components/LuckLayer";
import { StickyCTA } from "@/components/StickyCTA";

export function SiteChrome() {
  const pathname = usePathname();
  const inReadingFlow = pathname.startsWith("/reading");

  return (
    <>
      {!inReadingFlow && <LuckLayer />}
      {!inReadingFlow && <StickyCTA />}
    </>
  );
}
