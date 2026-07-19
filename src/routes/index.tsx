import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Hero, Marquee, LeistungenTeaser, KiSoftware, Clientes, KontaktCTA } from "@/components/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LF Marketing & Business Consulting | Beratung für Unternehmer" },
      { name: "description", content: "Kostenlose Beratung für Unternehmen, Selbstständige und Gründer. Digitales Marketing, Branding, Neuromarketing, Geschäftsstrategie, Kursdesign und Fundraising. Aus Teufen in der Schweiz." },
      { property: "og:title", content: "LF Marketing & Business Consulting" },
      { property: "og:description", content: "Gemeinsam stellen wir uns Ihr Unternehmen vor, inspirieren und gestalten es neu." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <Hero />
      <Marquee />
      <LeistungenTeaser />
      <KiSoftware />
      <Clientes />
      <KontaktCTA />
    </PageShell>
  );
}
