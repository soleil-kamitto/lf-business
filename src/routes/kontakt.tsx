import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Contacto } from "@/components/sections";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt | LF Marketing & Business Consulting" },
      { name: "description", content: "Kontaktieren Sie LF Marketing & Business Consulting in Teufen. Kostenlose Erstberatung für Unternehmen, Selbstständige und Gründer." },
      { property: "og:title", content: "Kontakt | LF Marketing & Business Consulting" },
    ],
    links: [{ rel: "canonical", href: "/kontakt" }],
  }),
  component: Kontakt,
});

function Kontakt() {
  return (
    <PageShell>
      <Contacto />
    </PageShell>
  );
}
