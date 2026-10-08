import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Hero, Marquee, LeistungenTeaser, Clientes, KontaktCTA } from "@/components/sections";
import { getContent } from "@/lib/content";
import { localBusinessJsonLd } from "@/lib/structuredData";

export const Route = createFileRoute("/")({
  loader: () => getContent(),
  head: ({ loaderData }) => ({
    scripts: loaderData
      ? [{ type: "application/ld+json", children: localBusinessJsonLd(loaderData) }]
      : [],
    meta: [
      { title: "LF Marketing & Business Consulting | Beratung für Unternehmer" },
      { name: "description", content: "Kostenlose Beratung für Unternehmen, Selbstständige und Gründer. Digitales Marketing, Branding, Neuromarketing, Geschäftsstrategie und Kursdesign. Aus Teufen in der Schweiz." },
      { property: "og:title", content: "LF Marketing & Business Consulting" },
      { property: "og:description", content: "Gemeinsam stellen wir uns Ihr Unternehmen vor, inspirieren und gestalten es neu." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const content = Route.useLoaderData();
  return (
    <PageShell>
      <Hero content={content.hero} />
      <Marquee />
      <LeistungenTeaser services={content.servicios.services} content={content.leistungenTeaser} />
      <Clientes heading={content.clientesHeading} />
      <KontaktCTA content={content.kontaktCta} />
    </PageShell>
  );
}
