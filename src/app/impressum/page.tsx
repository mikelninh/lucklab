import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Impressum — Kairos Lab",
  description: "Anbieterkennzeichnung gemäß § 5 TMG.",
};

export default function ImpressumPage() {
  return (
    <>
      <Nav />
      <article className="max-w-2xl mx-auto px-6 py-16 md:py-24 prose-kairos">
        <div className="eyebrow mb-4">legal</div>
        <h1 className="font-display text-[40px] md:text-[48px] leading-[1.1] font-light mb-4">
          Impressum
        </h1>
        <p className="font-mono text-[11px] text-[var(--text-subtle)] tracking-wider mb-12">
          ANGABEN GEMÄSS § 5 TMG
        </p>

        <h2>Verantwortlich</h2>
        <p>
          Michael Ninh<br />
          Kairos Lab<br />
          Boxhagener Str. 94<br />
          10245 Berlin, Deutschland
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail:{" "}
          <a href="mailto:mikel_ninh@yahoo.de">mikel_ninh@yahoo.de</a>
        </p>
        <p className="text-[13px] text-[var(--text-subtle)] italic">
          Gemäß § 5 Abs. 1 Nr. 2 TMG genügt eine E-Mail-Adresse als
          elektronischer Kontaktweg, sofern die Anfrage innerhalb einer
          angemessenen Frist (i.d.R. 48 Stunden) beantwortet wird.
        </p>

        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:
          <br />
          <em className="text-[var(--text-subtle)]">
            Noch nicht vergeben — Kleinunternehmerregelung gemäß § 19 UStG.
          </em>
        </p>

        <h2>Haftungshinweis</h2>
        <p>
          Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt.
          Der Anbieter übernimmt jedoch keine Gewähr für die Richtigkeit,
          Vollständigkeit und Aktualität der bereitgestellten Inhalte.
        </p>
        <p>
          Kairos Lab bietet Reflexions- und Bildungswerkzeuge an, die auf
          Weisheitstraditionen und psychologischer Forschung basieren. Die
          Inhalte stellen keine medizinische, psychologische, finanzielle oder
          rechtliche Beratung dar.
        </p>

        <h2>Streitbeilegung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
          <br />
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <div className="mt-16 pt-8 border-t border-[var(--border)] flex gap-4 flex-wrap">
          <Link href="/privacy" className="btn btn-ghost text-[12px] !py-2 !px-4">
            Privacy Policy →
          </Link>
          <Link href="/terms" className="btn btn-ghost text-[12px] !py-2 !px-4">
            Terms →
          </Link>
          <Link href="/contact" className="btn btn-ghost text-[12px] !py-2 !px-4">
            Contact →
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
