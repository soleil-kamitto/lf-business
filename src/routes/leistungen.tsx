import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Consultorias, Servicios, Branding, KontaktCTA } from "@/components/sections";
import { getContent } from "@/lib/content";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/leistungen")({
  loader: () => getContent(),
  head: () => ({
    meta: [
      { title: "Leistungen | LF Marketing & Business Consulting" },
      { name: "description", content: "Digitales Marketing, Design, Werbung, Geschäftsstrategie, Kursdesign und Branding. Dazu KI und Software für Unternehmen im Appenzellerland." },
      { property: "og:title", content: "Leistungen | LF Marketing & Business Consulting" },
    ],
    links: [{ rel: "canonical", href: canonical("/leistungen") }],
  }),
  component: Leistungen,
});

function Leistungen() {
  const content = Route.useLoaderData();
  return (
    <PageShell>
      <div className="pt-16">
        <Consultorias content={content.consultorias} heading={content.consultoriasHeading} text={content.consultoriasText} images={[content.images.consultoria1, content.images.consultoria2]} positions={[content.imagePositions?.consultoria1, content.imagePositions?.consultoria2]} />
      </div>
      <Servicios
        content={content.servicios}
        bannerVideo={content.images.bannerVideo}
        images={[content.images.service1, content.images.service2, content.images.service3]}
        positions={[content.imagePositions?.service1, content.imagePositions?.service2, content.imagePositions?.service3]}
        spezialImages={[content.images.spezial1, content.images.spezial2, content.images.spezial3, content.images.spezial4]}
        spezialPositions={[content.imagePositions?.spezial1, content.imagePositions?.spezial2, content.imagePositions?.spezial3, content.imagePositions?.spezial4]}
      />
      <Branding content={content.branding} />
      <KontaktCTA content={content.kontaktCta} />
    </PageShell>
  );
}
