import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Hero, Marquee, LeistungenTeaser, Clientes, KontaktCTA } from "@/components/sections";
import { getContent } from "@/lib/content";
import { localBusinessJsonLd } from "@/lib/structuredData";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: () => getContent(),
  head: ({ loaderData }) => ({
    scripts: loaderData
      ? [{ type: "application/ld+json", children: localBusinessJsonLd(loaderData) }]
      : [],
    meta: [
      { title: "LF Marketing & Business Consulting | Beratung für Unternehmer" },
      { name: "description", content: "Kostenlose Beratung für Unternehmen, Selbstständige und Gründer. Digitales Marketing, Branding, Geschäftsstrategie und Kursdesign. Aus Teufen in der Schweiz." },
      { property: "og:title", content: "LF Marketing & Business Consulting" },
      { property: "og:description", content: "Gemeinsam stellen wir uns Ihr Unternehmen vor, inspirieren und gestalten es neu." },
    ],
    links: [{ rel: "canonical", href: canonical("/") }],
  }),
  component: Index,
});

function Index() {
  const content = Route.useLoaderData();
  return (
    <PageShell labels={content.sectionLabels}>
      <Hero content={content.hero} />
      <Marquee />
      <LeistungenTeaser
        services={content.servicios.services}
        content={content.leistungenTeaser}
        images={[content.images.service1, content.images.service2, content.images.service3]}
        positions={[content.imagePositions?.service1, content.imagePositions?.service2, content.imagePositions?.service3]}
      />
      <Clientes heading={content.clientesHeading} text={content.clientesText} />
      <KontaktCTA content={content.kontaktCta} />
    </PageShell>
  );
}
