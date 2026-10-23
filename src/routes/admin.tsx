import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { checkAdminAuth, loginAdmin, logoutAdmin } from "@/lib/adminAuth";
import { getContent, saveContent, uploadImage, type SiteContent, type ImageSlot } from "@/lib/content";
import { getAnalytics, type AnalyticsView } from "@/lib/analytics";
import { Highlight } from "@/lib/highlight";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Inhalte bearbeiten | LF Business Consulting" }],
  }),
  component: AdminPage,
});

// Brand tokens
// A failed save used to lose everything typed since the last good one. The
// browser keeps a copy so the work survives a server error or a closed tab.
const DRAFT_KEY = "lf_admin_draft";

const B = {
  dark: "#15151c",
  amber: "#c2893f",
  amberLight: "#f0e0c8",
  cream: "#f7f5ef",
  creamDeep: "#ede9e0",
  white: "#ffffff",
  border: "#e5dfd4",
  borderDark: "#d4ccc0",
  text: "#1a1a1a",
  muted: "#6b6355",
  error: "#c0392b",
  success: "#2e7d4f",
  // Darker than the brand amber so bars clear 3:1 against the cream surface.
  bar: "#a8702c",
};

function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [tab, setTab] = useState<"inhalte" | "statistiken">("inhalte");
  const [stats, setStats] = useState<AnalyticsView | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const draftRef = useRef<SiteContent | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    checkAdminAuth().then((r) => setAuthed(r.authed));
  }, []);

  useEffect(() => {
    if (!authed) return;
    getContent().then((server) => {
      // A draft that differs from the server is unsaved work from a failed
      // save or a closed tab, so offer it back instead of silently dropping it.
      let draft: SiteContent | null = null;
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw && raw !== JSON.stringify(server)) draft = JSON.parse(raw) as SiteContent;
      } catch { /* private mode or corrupt draft */ }
      setHasDraft(!!draft);
      draftRef.current = draft;
      setContent(server);
    });
  }, [authed]);

  // Keep a local copy of every edit, so a failed save is recoverable.
  useEffect(() => {
    if (!content) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(content)); } catch { /* private mode */ }
  }, [content]);

  // Loading here also refreshes the archive, so it keeps filling even if the
  // daily cron stops running.
  useEffect(() => {
    if (authed && tab === "statistiken" && !stats) getAnalytics().then(setStats);
  }, [authed, tab, stats]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(false);
    const r = await loginAdmin({ data: { password } });
    if (r.ok) setAuthed(true);
    else setLoginError(true);
  }

  async function handleSave() {
    if (!content) return;
    setStatus("saving");
    try {
      await saveContent({ data: content });
      // Only drop the local copy once the server confirms it has the text.
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* private mode */ }
      setStatus("saved");
      iframeRef.current?.contentWindow?.location.reload();
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  // Takes effect immediately (not gated behind "Änderungen speichern") since
  // going into/out of maintenance is a one-click, time-sensitive action.
  async function togglePublished() {
    if (!content) return;
    const next = { ...content, published: !content.published };
    setContent(next);
    setStatus("saving");
    try {
      await saveContent({ data: next });
      setStatus("saved");
      iframeRef.current?.contentWindow?.location.reload();
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  if (authed === null) return <div style={{ minHeight: "100vh", background: B.cream }} />;

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: B.cream, display: "grid", placeItems: "center" }}>
        <form onSubmit={handleLogin} style={S.loginCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.amber, display: "inline-block" }} />
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: B.muted, fontFamily: "'Space Grotesk', sans-serif" }}>
              LF Business Consulting
            </span>
          </div>
          <h1 style={S.h1}>Inhalte bearbeiten</h1>
          <p style={{ fontSize: "0.85rem", color: B.muted, margin: 0 }}>
            Passwort eingeben, um die Texte der Website zu bearbeiten.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            style={S.input}
            autoFocus
          />
          {loginError && <p style={{ color: B.error, fontSize: "0.85rem", margin: 0 }}>Falsches Passwort.</p>}
          <button type="submit" style={S.primaryBtn}>Anmelden</button>
        </form>
      </div>
    );
  }

  if (!content) return <div style={{ minHeight: "100vh", background: B.cream }} />;

  const siteOrigin = typeof window !== "undefined" ? window.location.origin : "";

  const focus = (slot: ImageSlot) => ({
    position: content.imagePositions?.[slot],
    onPosition: (p: string) =>
      setContent({ ...content, imagePositions: { ...content.imagePositions, [slot]: p } }),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Header ── */}
      <header style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.amber }} />
          <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", fontFamily: "'Space Grotesk', sans-serif" }}>
            LF Business
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 0.25rem" }}>·</span>
          <nav style={{ display: "flex", gap: "0.25rem" }}>
            <button onClick={() => setTab("inhalte")} style={tab === "inhalte" ? S.tabOn : S.tabOff}>
              Inhalte
            </button>
            <button onClick={() => setTab("statistiken")} style={tab === "statistiken" ? S.tabOn : S.tabOff}>
              Statistiken
            </button>
          </nav>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <button
            onClick={togglePublished}
            disabled={status === "saving"}
            title={
              content.published
                ? "Website ist veröffentlicht – klicken, um den Wartungsmodus zu aktivieren"
                : "Website ist im Wartungsmodus – klicken, um sie zu veröffentlichen"
            }
            style={{
              ...S.ghostBtn,
              color: content.published ? "#7ed4a0" : "#fbbf24",
              borderColor: content.published ? "rgba(126,212,160,0.35)" : "rgba(251,191,36,0.4)",
              fontWeight: 600,
            }}
          >
            {content.published ? "● Veröffentlicht" : "● Wartungsmodus"}
          </button>
          {tab === "inhalte" && (
            <>
              {status === "saved" && (
                <span style={{ color: "#7ed4a0", fontSize: "0.82rem", fontWeight: 600 }}>Gespeichert ✓</span>
              )}
              {status === "error" && (
                <span style={{ color: "#f87171", fontSize: "0.82rem", fontWeight: 700 }}>Nicht gespeichert</span>
              )}
              <button onClick={handleSave} disabled={status === "saving"} style={S.primaryBtn}>
                {status === "saving" ? "Speichert…" : "Speichern"}
              </button>
            </>
          )}
          <button onClick={() => logoutAdmin().then(() => setAuthed(false))} style={S.ghostBtn}>
            Abmelden
          </button>
        </div>
      </header>

      {status === "error" && (
        <div style={S.alertBad}>
          <strong>Die Änderungen wurden nicht gespeichert.</strong> Ihre Texte sind noch da und gehen nicht
          verloren — auch wenn Sie die Seite schliessen. Bitte nochmals auf Speichern tippen. Klappt es wieder
          nicht, geben Sie Soleil Bescheid.
          <button onClick={handleSave} style={{ ...S.primaryBtn, marginLeft: "0.75rem" }}>Nochmals speichern</button>
        </div>
      )}

      {hasDraft && (
        <div style={S.alertWarn}>
          Es gibt ungespeicherte Änderungen von einem früheren Besuch.
          <button
            onClick={() => { if (draftRef.current) setContent(draftRef.current); setHasDraft(false); }}
            style={{ ...S.primaryBtn, marginLeft: "0.75rem" }}
          >
            Wiederherstellen
          </button>
          <button
            onClick={() => { try { localStorage.removeItem(DRAFT_KEY); } catch { /* private mode */ } setHasDraft(false); }}
            style={{ ...S.ghostBtnLight, marginLeft: "0.5rem" }}
          >
            Verwerfen
          </button>
        </div>
      )}

      {tab === "statistiken" && <AnalyticsPanel stats={stats} onReload={() => setStats(null)} />}

      {/* ── Split body ── */}
      {tab === "inhalte" && (
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left: website iframe */}
        {/* On a phone two half-width panes are unusable, so the preview drops
            away and the editor takes the full screen. */}
        <div
          className="hidden lg:block"
          style={{ width: "50%", flexShrink: 0, borderRight: `1px solid ${B.border}`, background: B.dark, position: "relative" }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1, padding: "0.45rem 0.75rem", background: "rgba(21,21,28,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em" }}>Vorschau</span>
            <span style={{ flex: 1, fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {siteOrigin}
            </span>
            <button
              onClick={() => iframeRef.current?.contentWindow?.location.reload()}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.75rem", padding: "0 0.25rem" }}
              title="Seite neu laden"
            >
              ↺
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src={siteOrigin + "/"}
            style={{ width: "100%", height: "100%", border: "none", paddingTop: "2rem" }}
            title="Website-Vorschau"
          />
        </div>

        {/* Right: editor */}
        <div style={{ flex: 1, overflowY: "auto", background: B.cream }}>
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1.5rem 4rem" }}>

            <div style={S.hintBox}>
              <strong style={{ color: B.amber }}>Tipp</strong> · Text zwischen Sternchen erscheint in der goldenen
              Akzentfarbe. Beispiel: Wir bauen <code style={S.code}>*Marken mit Seele*</code>.
            </div>

            <EditorSection title="Startseite (Hero)">
              <Field label="Badge (unter dem Logo)" value={content.hero.badge} onChange={(v) => setContent({ ...content, hero: { ...content.hero, badge: v } })} preview="badge" />
              <Field label="Titel" value={content.hero.title} onChange={(v) => setContent({ ...content, hero: { ...content.hero, title: v } })} textarea preview="hero-title" />
              <Field label="Untertitel" value={content.hero.subtitle} onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtitle: v } })} textarea preview="body-dark" />
            </EditorSection>

            <EditorSection title="Über mich">
              <Field label="Überschrift" value={content.about.heading || ""} onChange={(v) => setContent({ ...content, about: { ...content.about, heading: v } })} textarea preview="heading" />
              <Field label="Absatz 1" value={content.about.paragraph1} onChange={(v) => setContent({ ...content, about: { ...content.about, paragraph1: v } })} textarea preview="body-light" />
              <Field label="Absatz 2" value={content.about.paragraph2} onChange={(v) => setContent({ ...content, about: { ...content.about, paragraph2: v } })} textarea preview="body-light" />
              <SubGroupLabel>Zahlen / Kennzahlen</SubGroupLabel>
              {(content.about.counters || []).map((c, i) => (
                <div key={i} style={S.subCard}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <span style={S.label}>Wert</span>
                      <input type="number" value={c.value} onChange={(e) => { const counters = [...content.about.counters]; counters[i] = { ...counters[i], value: Number(e.target.value) }; setContent({ ...content, about: { ...content.about, counters } }); }} style={S.input} />
                    </label>
                    <label style={{ width: 60, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <span style={S.label}>Suffix</span>
                      <input value={c.suffix} onChange={(e) => { const counters = [...content.about.counters]; counters[i] = { ...counters[i], suffix: e.target.value }; setContent({ ...content, about: { ...content.about, counters } }); }} style={S.input} />
                    </label>
                  </div>
                  <Field label="Bezeichnung" value={c.label} onChange={(v) => { const counters = [...content.about.counters]; counters[i] = { ...counters[i], label: v }; setContent({ ...content, about: { ...content.about, counters } }); }} preview="small" />
                </div>
              ))}
            </EditorSection>

            <EditorSection title="Liza Fässler">
              <ImageField {...focus("lizaPortrait")} label="Foto von Liza" slot="lizaPortrait" value={content.images.lizaPortrait}
                onChange={(url) => setContent({ ...content, images: { ...content.images, lizaPortrait: url } })} />
              <Field label="Unterzeile" value={content.liza.subheading} onChange={(v) => setContent({ ...content, liza: { ...content.liza, subheading: v } })} preview="eyebrow" />
              <Field label="Biografie, Absatz 1" value={content.liza.bio1} onChange={(v) => setContent({ ...content, liza: { ...content.liza, bio1: v } })} textarea preview="body-light" />
              <Field label="Biografie, Absatz 2" value={content.liza.bio2} onChange={(v) => setContent({ ...content, liza: { ...content.liza, bio2: v } })} textarea preview="body-light" />

              <SubGroupLabel>Werdegang (Zeitleiste)</SubGroupLabel>
              {content.liza.journey.map((j, i) => (
                <div key={i} style={S.subCard}>
                  <Field label="Ort / Etappe" value={j.year}
                    onChange={(v) => { const journey = [...content.liza.journey]; journey[i] = { ...journey[i], year: v }; setContent({ ...content, liza: { ...content.liza, journey } }); }}
                    preview="card-title" />
                  <Field label="Beschreibung" value={j.text}
                    onChange={(v) => { const journey = [...content.liza.journey]; journey[i] = { ...journey[i], text: v }; setContent({ ...content, liza: { ...content.liza, journey } }); }}
                    textarea preview="card-text" />
                </div>
              ))}

              <SubGroupLabel>Expertise-Karten</SubGroupLabel>
              {content.liza.expertise.map((ex, i) => (
                <div key={i} style={S.subCard}>
                  <Field label="Titel" value={ex.title}
                    onChange={(v) => { const expertise = [...content.liza.expertise]; expertise[i] = { ...expertise[i], title: v }; setContent({ ...content, liza: { ...content.liza, expertise } }); }}
                    preview="card-title" />
                  <Field label="Text" value={ex.text}
                    onChange={(v) => { const expertise = [...content.liza.expertise]; expertise[i] = { ...expertise[i], text: v }; setContent({ ...content, liza: { ...content.liza, expertise } }); }}
                    textarea preview="card-text" />
                </div>
              ))}
            </EditorSection>

            <EditorSection title="Beratung (Consultorias)">
              <Field label="Überschrift" value={content.consultoriasHeading || ""} onChange={(v) => setContent({ ...content, consultoriasHeading: v })} textarea preview="heading" />
              <Field label="Untertitel" value={content.consultoriasText || ""} onChange={(v) => setContent({ ...content, consultoriasText: v })} preview="body-light" />
              {content.consultorias.map((c, i) => (
                <div key={i} style={S.subCard}>
                  <ImageField {...focus(i === 0 ? "consultoria1" : "consultoria2")} label={`Bild Karte ${i + 1}`} slot={i === 0 ? "consultoria1" : "consultoria2"}
                    value={i === 0 ? content.images.consultoria1 : content.images.consultoria2}
                    onChange={(url) => setContent({ ...content, images: { ...content.images, [i === 0 ? "consultoria1" : "consultoria2"]: url } })} />
                  <Field label="Titel" value={c.title}
                    onChange={(v) => { const consultorias = [...content.consultorias]; consultorias[i] = { ...consultorias[i], title: v }; setContent({ ...content, consultorias }); }}
                    preview="card-title-dark" />
                  <Field label="Satz" value={c.phrase}
                    onChange={(v) => { const consultorias = [...content.consultorias]; consultorias[i] = { ...consultorias[i], phrase: v }; setContent({ ...content, consultorias }); }}
                    textarea preview="card-text-dark" />
                </div>
              ))}
            </EditorSection>

            <EditorSection title="Leistungen">
              <ImageField {...focus("serviciosBanner")} label={`Banner-Bild ("Bereit zu wachsen?")`} slot="serviciosBanner" value={content.images.serviciosBanner}
                onChange={(url) => setContent({ ...content, images: { ...content.images, serviciosBanner: url } })} />
              <Field label="Überschrift" value={content.servicios.heading} onChange={(v) => setContent({ ...content, servicios: { ...content.servicios, heading: v } })} preview="heading" />
              <Field label="Unterzeile" value={content.servicios.subheading} onChange={(v) => setContent({ ...content, servicios: { ...content.servicios, subheading: v } })} textarea preview="body-light" />

              <SubGroupLabel>Kernleistungen</SubGroupLabel>
              {content.servicios.services.map((s, i) => (
                <div key={i} style={S.subCard}>
                  {i < 3 && (
                    <ImageField
                      label="Hintergrundbild (erscheint beim Darüberfahren)"
                      slot={(["service1", "service2", "service3"] as const)[i]}
                      {...focus((["service1", "service2", "service3"] as const)[i])}
                      value={content.images[(["service1", "service2", "service3"] as const)[i]]}
                      onChange={(url) =>
                        setContent({
                          ...content,
                          images: { ...content.images, [(["service1", "service2", "service3"] as const)[i]]: url },
                        })
                      }
                    />
                  )}
                  <Field label="Titel" value={s.title}
                    onChange={(v) => { const services = [...content.servicios.services]; services[i] = { ...services[i], title: v }; setContent({ ...content, servicios: { ...content.servicios, services } }); }}
                    preview="card-title" />
                  <Field label="Text" value={s.text}
                    onChange={(v) => { const services = [...content.servicios.services]; services[i] = { ...services[i], text: v }; setContent({ ...content, servicios: { ...content.servicios, services } }); }}
                    textarea preview="card-text" />
                </div>
              ))}

              <SubGroupLabel>Spezialgebiete</SubGroupLabel>
              <Field label="Überschrift Spezialgebiete" value={content.servicios.spezialHeading || ""} onChange={(v) => setContent({ ...content, servicios: { ...content.servicios, spezialHeading: v } })} preview="heading" />
              {content.servicios.spezial.map((s, i) => (
                <div key={i} style={S.subCard}>
                  {i < 4 && (
                    <ImageField
                      label="Hintergrundbild (erscheint beim Darüberfahren)"
                      slot={(["spezial1", "spezial2", "spezial3", "spezial4"] as const)[i]}
                      {...focus((["spezial1", "spezial2", "spezial3", "spezial4"] as const)[i])}
                      value={content.images[(["spezial1", "spezial2", "spezial3", "spezial4"] as const)[i]]}
                      onChange={(url) =>
                        setContent({
                          ...content,
                          images: { ...content.images, [(["spezial1", "spezial2", "spezial3", "spezial4"] as const)[i]]: url },
                        })
                      }
                    />
                  )}
                  <Field label="Titel" value={s.title}
                    onChange={(v) => { const spezial = [...content.servicios.spezial]; spezial[i] = { ...spezial[i], title: v }; setContent({ ...content, servicios: { ...content.servicios, spezial } }); }}
                    preview="card-title" />
                  <Field label="Text" value={s.text}
                    onChange={(v) => { const spezial = [...content.servicios.spezial]; spezial[i] = { ...spezial[i], text: v }; setContent({ ...content, servicios: { ...content.servicios, spezial } }); }}
                    textarea preview="card-text" />
                </div>
              ))}
              <SubGroupLabel>Banner ("Bereit zu wachsen?")</SubGroupLabel>
              <Field label="Überschrift Banner" value={content.servicios.bannerHeading || ""} onChange={(v) => setContent({ ...content, servicios: { ...content.servicios, bannerHeading: v } })} preview="card-title" />
              <Field label="Text Banner" value={content.servicios.bannerText || ""} onChange={(v) => setContent({ ...content, servicios: { ...content.servicios, bannerText: v } })} textarea preview="card-text" />
            </EditorSection>

            <EditorSection title="KI & Software">
              <Field label="Überschrift" value={content.kiContent?.heading || ""} onChange={(v) => setContent({ ...content, kiContent: { ...content.kiContent!, heading: v } })} textarea preview="heading" />
              <Field label="Beschreibung" value={content.kiContent?.description || ""} onChange={(v) => setContent({ ...content, kiContent: { ...content.kiContent!, description: v } })} textarea preview="body-light" />
            </EditorSection>

            <EditorSection title="Branding">
              <Field label="Überschrift" value={content.branding.heading || ""} onChange={(v) => setContent({ ...content, branding: { ...content.branding, heading: v } })} textarea preview="heading" />
              <Field label="Text" value={content.branding.paragraph} onChange={(v) => setContent({ ...content, branding: { ...content.branding, paragraph: v } })} textarea preview="body-cream" />
            </EditorSection>

            <EditorSection title="Kunden & Partner">
              <Field label="Überschrift" value={content.clientesHeading || ""} onChange={(v) => setContent({ ...content, clientesHeading: v })} preview="heading" />
              <Field label="Text" value={content.clientesText || ""} onChange={(v) => setContent({ ...content, clientesText: v })} textarea preview="body-light" />
            </EditorSection>

            <EditorSection title="Startseite – Leistungen-Teaser">
              <Field label="Überschrift" value={content.leistungenTeaser?.heading || ""} onChange={(v) => setContent({ ...content, leistungenTeaser: { ...content.leistungenTeaser!, heading: v } })} preview="heading" />
              <Field label="Beschreibung" value={content.leistungenTeaser?.description || ""} onChange={(v) => setContent({ ...content, leistungenTeaser: { ...content.leistungenTeaser!, description: v } })} textarea preview="body-light" />
            </EditorSection>

            <EditorSection title="Kontakt-Banner (CTA)">
              <Field label="Unterzeile" value={content.kontaktCta?.label || ""} onChange={(v) => setContent({ ...content, kontaktCta: { ...content.kontaktCta!, label: v } })} preview="small" />
              <Field label="Überschrift" value={content.kontaktCta?.heading || ""} onChange={(v) => setContent({ ...content, kontaktCta: { ...content.kontaktCta!, heading: v } })} textarea preview="heading" />
            </EditorSection>

            <EditorSection title="Kontakt">
              <Field label="Überschrift" value={content.contactoHeading || ""} onChange={(v) => setContent({ ...content, contactoHeading: v })} textarea preview="heading" />
              <Field label="Adresse" value={content.contact.address} onChange={(v) => setContent({ ...content, contact: { ...content.contact, address: v } })} preview="small" />
              <Field label="E-Mail" value={content.contact.email} onChange={(v) => setContent({ ...content, contact: { ...content.contact, email: v } })} preview="small" />
              <Field label="Telefon" value={content.contact.phone} onChange={(v) => setContent({ ...content, contact: { ...content.contact, phone: v } })} preview="small" />
              <Field label="Instagram-Link (leer lassen = Symbol ausblenden)" value={content.contact.instagram || ""} onChange={(v) => setContent({ ...content, contact: { ...content.contact, instagram: v } })} preview="small" />
              <Field label="LinkedIn-Link (leer lassen = Symbol ausblenden)" value={content.contact.linkedin || ""} onChange={(v) => setContent({ ...content, contact: { ...content.contact, linkedin: v } })} preview="small" />
            </EditorSection>

            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
              <button onClick={handleSave} disabled={status === "saving"} style={S.primaryBtnLarge}>
                {status === "saving" ? "Speichert…" : "Änderungen speichern"}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

const DE = new Intl.NumberFormat("de-CH");

const STATUS_NOTE: Record<AnalyticsView["status"], string | null> = {
  ok: null,
  "no-data": "Noch keine Daten. Vercel sammelt die ersten Besuche; in einigen Minuten erscheinen sie hier.",
  "no-token": "Der Zugang zu den Zahlen ist nicht eingerichtet. Bitte Soleil Bescheid geben.",
  "token-invalid": "Der Zugang ist abgelaufen. Die unten gezeigten Zahlen stammen aus dem Archiv und werden gerade nicht aktualisiert.",
  error: "Die Zahlen konnten nicht frisch geladen werden. Unten steht der zuletzt gespeicherte Stand.",
};

function AnalyticsPanel({ stats, onReload }: { stats: AnalyticsView | null; onReload: () => void }) {
  if (!stats) {
    return (
      <div style={S.statsWrap}>
        <p style={{ color: B.muted, fontSize: "0.9rem" }}>Zahlen werden geladen…</p>
      </div>
    );
  }

  const note = STATUS_NOTE[stats.status];
  const chartDays = stats.days.slice(-30);

  return (
    <div style={S.statsWrap}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
          <h2 style={{ ...S.h2, fontSize: "1.1rem" }}>Wie viele Menschen besuchen die Website</h2>
          <button onClick={onReload} style={S.ghostBtnLight}>Aktualisieren</button>
        </div>

        {note && (
          <div style={{ ...S.hintBox, background: stats.status === "no-data" ? B.amberLight : "#fdecea", borderColor: stats.status === "no-data" ? `${B.amber}40` : "#f5c6c0" }}>
            {note}
            {stats.message && stats.status !== "no-data" && (
              <div style={{ marginTop: "0.4rem", fontSize: "0.68rem", color: B.muted, fontFamily: "ui-monospace, monospace", wordBreak: "break-all" }}>
                {stats.message}
              </div>
            )}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <StatTile label="Besucher, 30 Tage" value={stats.last30.visitors} big />
          <StatTile label="Seitenaufrufe, 30 Tage" value={stats.last30.pageviews} />
          <StatTile label="Besucher insgesamt" value={stats.totals.visitors} />
          <StatTile label="Seitenaufrufe insgesamt" value={stats.totals.pageviews} />
        </div>

        {chartDays.length > 0 && <DailyChart days={chartDays} />}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem", marginTop: "1.25rem" }}>
          <RankedList title="Meistbesuchte Seiten" rows={stats.topPages} />
          <RankedList title="Länder" rows={stats.topCountries} />
          <RankedList title="Woher die Besucher kommen" rows={stats.topReferrers} />
        </div>

        <p style={{ fontSize: "0.72rem", color: B.muted, marginTop: "1.25rem", lineHeight: 1.6 }}>
          Ein Besucher ist eine Person, ein Seitenaufruf ist eine geöffnete Seite. Eine Person, die drei Seiten
          anschaut, zählt als ein Besucher und drei Aufrufe. Besuche im Bearbeitungsbereich werden nicht gezählt.
          {stats.lastImport && ` Zuletzt aktualisiert: ${new Date(stats.lastImport).toLocaleString("de-CH")}.`}
        </p>
      </div>
    </div>
  );
}

function StatTile({ label, value, big }: { label: string; value: number; big?: boolean }) {
  return (
    <div style={S.tile}>
      <div style={{ fontSize: big ? "2rem" : "1.5rem", fontWeight: 800, color: big ? B.bar : B.text, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 }}>
        {DE.format(value)}
      </div>
      <div style={{ fontSize: "0.7rem", color: B.muted, marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
    </div>
  );
}

function DailyChart({ days }: { days: { date: string; pageviews: number; visitors: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...days.map((d) => d.visitors), 1);
  const fmt = (iso: string) =>
    new Date(iso + "T00:00:00Z").toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit" });

  return (
    <div style={S.card}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.9rem" }}>
        <h3 style={{ ...S.h2, fontSize: "0.85rem" }}>Besucher pro Tag</h3>
        <span style={{ fontSize: "0.7rem", color: B.muted }}>Höchstwert {DE.format(max)}</span>
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 150, borderBottom: `1px solid ${B.border}` }}>
          {days.map((d, i) => (
            <div
              key={d.date}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end", cursor: "default" }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${Math.max((d.visitors / max) * 100, d.visitors > 0 ? 2 : 0)}%`,
                  background: hover === i ? B.text : B.bar,
                  borderRadius: "4px 4px 0 0",
                  transition: "background 0.12s",
                }}
              />
            </div>
          ))}
        </div>

        {hover !== null && (
          <div style={S.tooltip}>
            <strong>{fmt(days[hover].date)}</strong> · {DE.format(days[hover].visitors)} Besucher ·{" "}
            {DE.format(days[hover].pageviews)} Aufrufe
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: B.muted, marginTop: "0.4rem" }}>
        <span>{fmt(days[0].date)}</span>
        <span>{fmt(days[days.length - 1].date)}</span>
      </div>
    </div>
  );
}

function RankedList({ title, rows }: { title: string; rows: { name: string; pageviews: number; visitors: number }[] }) {
  const max = Math.max(...rows.map((r) => r.pageviews), 1);
  return (
    <div style={S.card}>
      <h3 style={{ ...S.h2, fontSize: "0.85rem", marginBottom: "0.75rem" }}>{title}</h3>
      {rows.length === 0 ? (
        <p style={{ fontSize: "0.8rem", color: B.muted, margin: 0 }}>Noch keine Daten.</p>
      ) : (
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {rows.slice(0, 7).map((r) => (
            <li key={r.name}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", fontSize: "0.8rem", marginBottom: 3 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.name}>
                  {r.name === "" ? "Direkt" : r.name}
                </span>
                <strong style={{ flexShrink: 0 }}>{DE.format(r.pageviews)}</strong>
              </div>
              <div style={{ height: 4, background: B.creamDeep, borderRadius: 2 }}>
                <div style={{ width: `${(r.pageviews / max) * 100}%`, height: "100%", background: B.bar, borderRadius: 2 }} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={S.section}>
      <div style={S.sectionHeader}>
        <span style={S.sectionDot} />
        <h2 style={S.h2}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SubGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", color: B.amber, fontWeight: 700, margin: "1.25rem 0 0.5rem", fontFamily: "'Space Grotesk', sans-serif" }}>
      {children}
    </p>
  );
}

// A photo is cropped to fill its card, so the interesting part can fall outside.
// These nine presets move the visible window without touching the file.
const FOCUS = [
  ["links oben", "left top"], ["oben", "center top"], ["rechts oben", "right top"],
  ["links", "left center"], ["Mitte", "center center"], ["rechts", "right center"],
  ["links unten", "left bottom"], ["unten", "center bottom"], ["rechts unten", "right bottom"],
] as const;

function ImageField({ label, slot, value, onChange, position, onPosition }: { label: string; slot: ImageSlot; value: string | null; onChange: (url: string | null) => void; position?: string; onPosition?: (p: string) => void }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slot", slot);
      const res = await uploadImage({ data: formData });
      onChange(res.url);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    }
  }

  // Three states, not two: a custom image, the built-in default, or none at all.
  // Liza asked to be able to clear the default too, so "" means "show nothing".
  const removed = value === "";

  return (
    <div style={{ marginBottom: "1rem" }}>
      <span style={S.label}>{label}</span>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.35rem" }}>
        <div style={{ width: 96, height: 72, borderRadius: 10, overflow: "hidden", border: `1px solid ${B.border}`, background: B.creamDeep, flexShrink: 0 }}>
          {value ? (
            <img src={value} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: "0.6rem", color: B.muted, textAlign: "center", padding: 4 }}>
              {removed ? "Kein Bild" : "Standardbild"}
            </div>
          )}
        </div>
        <div>
          {/* ghostBtn is white-on-dark for the header; on this white card it was invisible. */}
          <label style={{ ...S.ghostBtnLight, display: "inline-block", cursor: "pointer" }}>
            {status === "uploading" ? "Lädt hoch…" : value ? "Bild ersetzen" : "Bild hochladen"}
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} disabled={status === "uploading"} style={{ display: "none" }} />
          </label>
          {removed ? (
            <button
              onClick={() => onChange(null)}
              style={{ ...S.ghostBtnLight, marginLeft: "0.5rem" }}
            >
              Standardbild zurückholen
            </button>
          ) : (
            <button
              onClick={() => {
                const back = value ? "Es erscheint dann wieder das Standardbild." : "An dieser Stelle erscheint dann kein Bild mehr.";
                if (window.confirm(`"${label}" wirklich entfernen? ${back}`)) {
                  onChange(value ? null : "");
                }
              }}
              title="Bild entfernen"
              aria-label={`${label} entfernen`}
              style={{ ...S.ghostBtnLight, marginLeft: "0.5rem", color: B.error, borderColor: "#f5c6c0" }}
            >
              🗑 Entfernen
            </button>
          )}
          {errorMsg && <p style={{ color: B.error, fontSize: "0.8rem", marginTop: "0.4rem" }}>{errorMsg}</p>}
          {onPosition && !removed && (
            <div style={{ marginTop: "0.6rem" }}>
              <span style={{ ...S.label, display: "block", marginBottom: "0.3rem" }}>Bildausschnitt</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 26px)", gap: 3 }}>
                {FOCUS.map(([title, pos]) => {
                  const active = (position || "center center") === pos;
                  return (
                    <button
                      key={pos}
                      onClick={() => onPosition(pos)}
                      title={title}
                      aria-label={title}
                      style={{
                        width: 26, height: 26, borderRadius: 5, cursor: "pointer",
                        border: `1px solid ${active ? B.amber : B.border}`,
                        background: active ? B.amber : B.white,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type PreviewKind = "hero-title" | "badge" | "body-dark" | "body-light" | "body-cream" | "eyebrow" | "heading" | "card-title" | "card-text" | "card-title-dark" | "card-text-dark" | "small";
const HERO_HIGHLIGHT_WORDS = ["vor,", "inspirieren", "gestalten"];

function Field({ label, value, onChange, textarea, preview }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; preview?: PreviewKind }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 items-start">
      <label style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <span style={S.label}>{label}</span>
        {textarea ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={S.textarea} />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} style={S.input} />
        )}
      </label>
      {preview && <LivePreview kind={preview} text={value} />}
    </div>
  );
}

function LivePreview({ kind, text }: { kind: PreviewKind; text: string }) {
  const wrapperDark = kind === "hero-title" || kind === "badge" || kind === "body-dark";
  const wrapperCream = kind === "body-cream" || kind === "heading";
  const wrapperOverlay = kind === "card-title-dark" || kind === "card-text-dark";

  return (
    <div className={`rounded-xl overflow-hidden border ${wrapperDark || wrapperOverlay ? "border-black/20" : "border-border"}`}>
      <div className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 font-sans"
        style={{ background: wrapperDark || wrapperOverlay ? "#00000030" : "#00000008", color: wrapperDark || wrapperOverlay ? "#ffffffa0" : "#00000060" }}>
        Vorschau
      </div>
      <div className={`p-4 min-h-[3.5rem] flex items-center ${wrapperDark ? "bg-[#15151c]" : wrapperOverlay ? "bg-[#1a1a1a]" : wrapperCream ? "bg-cream" : "bg-background"}`}>
        {kind === "hero-title" ? (
          <h1 className="font-display font-bold text-2xl leading-[1.1] text-white">
            {text.split(" ").map((w, i) => (
              <span key={i} className={`inline-block mr-1.5 ${HERO_HIGHLIGHT_WORDS.includes(w) ? "text-gradient-warm italic" : ""}`}>{w}</span>
            ))}
          </h1>
        ) : kind === "badge" ? (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/25 bg-white/10 text-[11px] uppercase tracking-[0.2em] text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-warm" />{text}
          </span>
        ) : kind === "body-dark" ? (
          <p className="text-white/75 text-base leading-relaxed">{text}</p>
        ) : kind === "body-light" || kind === "body-cream" ? (
          <p className="text-muted-foreground text-base leading-relaxed">{text}</p>
        ) : kind === "eyebrow" ? (
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{text}</p>
        ) : kind === "heading" ? (
          <h2 className="font-display font-bold text-xl text-foreground leading-tight"><Highlight text={text} /></h2>
        ) : kind === "card-title" ? (
          <h3 className="font-display font-semibold text-lg text-foreground">{text}</h3>
        ) : kind === "card-text" ? (
          <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
        ) : kind === "card-title-dark" ? (
          <h3 className="font-display font-bold text-xl text-white">{text}</h3>
        ) : kind === "card-text-dark" ? (
          <p className="text-sm text-white/80 leading-relaxed">{text}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 1.25rem",
    height: "52px",
    background: B.dark,
    flexShrink: 0,
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  loginCard: {
    width: "100%",
    maxWidth: 380,
    background: B.white,
    borderRadius: 18,
    padding: "2.25rem",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    border: `1px solid ${B.border}`,
  },
  section: {
    background: B.white,
    borderRadius: 14,
    padding: "1.25rem 1.5rem",
    marginBottom: "1rem",
    border: `1px solid ${B.border}`,
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "1rem",
    paddingBottom: "0.75rem",
    borderBottom: `1px solid ${B.border}`,
  },
  tabOn: {
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "0.35rem 0.8rem",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  tabOff: {
    background: "transparent",
    color: "rgba(255,255,255,0.5)",
    border: "none",
    borderRadius: 7,
    padding: "0.35rem 0.8rem",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  statsWrap: {
    flex: 1,
    overflowY: "auto" as const,
    background: B.cream,
    padding: "1.5rem",
  },
  tile: {
    background: B.white,
    border: `1px solid ${B.border}`,
    borderRadius: 12,
    padding: "1rem",
  },
  card: {
    background: B.white,
    border: `1px solid ${B.border}`,
    borderRadius: 14,
    padding: "1.1rem 1.25rem",
  },
  tooltip: {
    position: "absolute" as const,
    top: -6,
    left: "50%",
    transform: "translate(-50%, -100%)",
    background: B.dark,
    color: "#fff",
    fontSize: "0.72rem",
    padding: "0.35rem 0.6rem",
    borderRadius: 7,
    whiteSpace: "nowrap" as const,
    pointerEvents: "none" as const,
  },
  ghostBtnLight: {
    background: "transparent",
    color: B.muted,
    border: `1px solid ${B.border}`,
    borderRadius: 999,
    padding: "0.35rem 0.9rem",
    fontSize: "0.78rem",
    cursor: "pointer",
  },
  alertBad: {
    background: "#fdecea",
    borderBottom: "2px solid #e74c3c",
    color: "#7f1d1d",
    padding: "0.85rem 1.25rem",
    fontSize: "0.88rem",
    lineHeight: 1.5,
  },
  alertWarn: {
    background: B.amberLight,
    borderBottom: `2px solid ${B.amber}`,
    color: B.text,
    padding: "0.75rem 1.25rem",
    fontSize: "0.85rem",
  },
  hintBox: {
    background: B.amberLight,
    border: `1px solid ${B.amber}40`,
    borderRadius: 10,
    padding: "0.7rem 0.9rem",
    marginBottom: "1rem",
    fontSize: "0.8rem",
    color: B.text,
    lineHeight: 1.5,
  },
  code: {
    background: "#ffffff",
    border: `1px solid ${B.border}`,
    borderRadius: 4,
    padding: "0.1rem 0.3rem",
    fontFamily: "ui-monospace, monospace",
    fontSize: "0.75rem",
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: B.amber,
    flexShrink: 0,
  },
  subCard: {
    background: B.cream,
    borderRadius: 10,
    padding: "1rem",
    marginBottom: "0.75rem",
    border: `1px solid ${B.border}`,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  h1: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: 800,
    color: B.text,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  h2: {
    margin: 0,
    fontSize: "0.9rem",
    fontWeight: 700,
    color: B.text,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  label: {
    fontSize: "0.72rem",
    color: B.muted,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  input: {
    border: `1px solid ${B.border}`,
    borderRadius: 8,
    padding: "0.55rem 0.75rem",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    background: B.white,
    color: B.text,
    outline: "none",
    transition: "border-color 0.15s",
  },
  textarea: {
    border: `1px solid ${B.border}`,
    borderRadius: 8,
    padding: "0.55rem 0.75rem",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    resize: "vertical" as const,
    background: B.white,
    color: B.text,
    outline: "none",
  },
  primaryBtn: {
    background: B.amber,
    color: B.white,
    border: "none",
    borderRadius: 999,
    padding: "0.5rem 1.2rem",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "0.02em",
  },
  primaryBtnLarge: {
    background: B.amber,
    color: B.white,
    border: "none",
    borderRadius: 999,
    padding: "0.65rem 1.6rem",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  ghostBtn: {
    background: "transparent",
    color: "rgba(255,255,255,0.55)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 999,
    padding: "0.5rem 1rem",
    fontSize: "0.82rem",
    cursor: "pointer",
  },
};
