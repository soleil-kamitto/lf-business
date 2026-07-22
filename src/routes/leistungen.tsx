import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Consultorias, Servicios, Neuromarketing, Branding, KontaktCTA } from "@/components/sections";
import { getContent } from "@/lib/content";

export const Route = createFileRoute("/leistungen")({
  loader: () => getContent(),
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
  const content = Route.useLoaderData();
  return (
    <PageShell>
      <div className="pt-16">
        <Consultorias content={content.consultorias} images={[content.images.consultoria1, content.images.consultoria2]} />
      </div>
      <Servicios content={content.servicios} bannerImage={content.images.serviciosBanner} />
      <Neuromarketing image={content.images.neuromarketing} />
      <Branding content={content.branding} />
      <KontaktCTA />
    </PageShell>
  );
}
