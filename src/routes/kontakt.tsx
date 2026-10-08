import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Contacto } from "@/components/sections";
import { getContent } from "@/lib/content";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/kontakt")({
  loader: () => getContent(),
  head: () => ({
    meta: [
      { title: "Kontakt | LF Marketing & Business Consulting" },
      { name: "description", content: "Kontaktieren Sie LF Marketing & Business Consulting in Teufen. Kostenlose Erstberatung für Unternehmen, Selbstständige und Gründer." },
      { property: "og:title", content: "Kontakt | LF Marketing & Business Consulting" },
    ],
    links: [{ rel: "canonical", href: canonical("/kontakt") }],
  }),
  component: Kontakt,
});

function Kontakt() {
  const content = Route.useLoaderData();
  return (
    <PageShell>
      <Contacto content={content.contact} heading={content.contactoHeading} />
    </PageShell>
  );
}
