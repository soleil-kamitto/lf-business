import { createFileRoute } from "@tanstack/react-router";
import { PageShell, About, Liza, KontaktCTA } from "@/components/sections";

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({
    meta: [
      { title: "Über uns & Liza Fässler | LF Marketing & Business Consulting" },
      { name: "description", content: "Lernen Sie LF Marketing & Business Consulting und Gründerin Liza Fässler kennen: internationale Unternehmerin und Strategin zwischen Lateinamerika und Europa." },
      { property: "og:title", content: "Über uns | LF Marketing & Business Consulting" },
    ],
    links: [{ rel: "canonical", href: "/ueber-uns" }],
  }),
  component: UeberUns,
});

function UeberUns() {
  return (
    <PageShell>
      <div className="pt-16">
        <About />
      </div>
      <Liza />
      <KontaktCTA />
    </PageShell>
  );
}
