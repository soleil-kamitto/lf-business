import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Consultorias, Servicios, Neuromarketing, Branding, KontaktCTA } from "@/components/sections";

export const Route = createFileRoute("/leistungen")({
  head: () => ({
    meta: [
      { title: "Leistungen | LF Marketing & Business Consulting" },
      { name: "description", content: "Digitales Marketing, Design, Werbung, Geschäftsstrategie, Kursdesign, Fundraising, Neuromarketing und Branding. Dazu KI und Software für Unternehmen im Appenzellerland." },
      { property: "og:title", content: "Leistungen | LF Marketing & Business Consulting" },
    ],
    links: [{ rel: "canonical", href: "/leistungen" }],
  }),
  component: Leistungen,
});

function Leistungen() {
  return (
    <PageShell>
      <div className="pt-16">
        <Consultorias />
      </div>
      <Servicios />
      <Neuromarketing />
      <Branding />
      <KontaktCTA />
    </PageShell>
  );
}
