import { createFileRoute } from "@tanstack/react-router";
import { PageShell, About, Liza, KontaktCTA } from "@/components/sections";
import { getContent } from "@/lib/content";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/ueber-uns")({
  loader: () => getContent(),
  head: () => ({
    meta: [
      { title: "Über uns & Liza Fässler | LF Marketing & Business Consulting" },
      { name: "description", content: "Lernen Sie LF Marketing & Business Consulting und Gründerin Liza Fässler kennen: internationale Unternehmerin und Strategin zwischen Lateinamerika und Europa." },
      { property: "og:title", content: "Über uns | LF Marketing & Business Consulting" },
    ],
    links: [{ rel: "canonical", href: canonical("/ueber-uns") }],
  }),
  component: UeberUns,
});

function UeberUns() {
  const content = Route.useLoaderData();
  return (
    <PageShell>
      <div className="pt-16">
        <About content={content.about} />
      </div>
      <Liza content={content.liza} portraitSrc={content.images.lizaPortrait} portraitPosition={content.imagePositions?.lizaPortrait} />
      <KontaktCTA content={content.kontaktCta} />
    </PageShell>
  );
}
