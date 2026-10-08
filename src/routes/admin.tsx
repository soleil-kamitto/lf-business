import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { checkAdminAuth, loginAdmin, logoutAdmin } from "@/lib/adminAuth";
import { getContent, saveContent, uploadImage, type SiteContent, type ImageSlot } from "@/lib/content";
import { Highlight } from "@/lib/highlight";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Inhalte bearbeiten | LF Business Consulting" }],
  }),
  component: AdminPage,
});

// Brand tokens
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
};

function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    checkAdminAuth().then((r) => setAuthed(r.authed));
  }, []);

  useEffect(() => {
    if (authed) getContent().then(setContent);
  }, [authed]);

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
          <h1 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>
            Inhalte bearbeiten
          </h1>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          {status === "saved" && (
            <span style={{ color: "#7ed4a0", fontSize: "0.82rem", fontWeight: 600 }}>Gespeichert ✓</span>
          )}
          {status === "error" && (
            <span style={{ color: "#f87171", fontSize: "0.82rem" }}>Fehler beim Speichern</span>
          )}
          <button onClick={handleSave} disabled={status === "saving"} style={S.primaryBtn}>
            {status === "saving" ? "Speichert…" : "Speichern"}
          </button>
          <button onClick={() => logoutAdmin().then(() => setAuthed(false))} style={S.ghostBtn}>
            Abmelden
          </button>
        </div>
      </header>

      {/* ── Split body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left: website iframe */}
        <div style={{ width: "50%", flexShrink: 0, borderRight: `1px solid ${B.border}`, background: B.dark, position: "relative" }}>
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

            <EditorSection title="Über uns">
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
              <ImageField label="Foto von Liza" slot="lizaPortrait" value={content.images.lizaPortrait}
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
              {content.consultorias.map((c, i) => (
                <div key={i} style={S.subCard}>
                  <ImageField label={`Bild Karte ${i + 1}`} slot={i === 0 ? "consultoria1" : "consultoria2"}
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
              <ImageField label="Bild Neuromarketing" slot="neuromarketing" value={content.images.neuromarketing}
                onChange={(url) => setContent({ ...content, images: { ...content.images, neuromarketing: url } })} />
              <ImageField label={`Banner-Bild ("Bereit zu wachsen?")`} slot="serviciosBanner" value={content.images.serviciosBanner}
                onChange={(url) => setContent({ ...content, images: { ...content.images, serviciosBanner: url } })} />
              <Field label="Überschrift" value={content.servicios.heading} onChange={(v) => setContent({ ...content, servicios: { ...content.servicios, heading: v } })} preview="heading" />
              <Field label="Unterzeile" value={content.servicios.subheading} onChange={(v) => setContent({ ...content, servicios: { ...content.servicios, subheading: v } })} textarea preview="body-light" />

              <SubGroupLabel>Kernleistungen</SubGroupLabel>
              {content.servicios.services.map((s, i) => (
                <div key={i} style={S.subCard}>
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

            <EditorSection title="Neuromarketing">
              <Field label="Überschrift" value={content.neuroContent?.heading || ""} onChange={(v) => setContent({ ...content, neuroContent: { ...content.neuroContent!, heading: v } })} textarea preview="heading" />
              <Field label="Beschreibung" value={content.neuroContent?.description || ""} onChange={(v) => setContent({ ...content, neuroContent: { ...content.neuroContent!, description: v } })} textarea preview="body-light" />
              <SubGroupLabel>Karten</SubGroupLabel>
              {(content.neuroContent?.cards || []).map((c, i) => (
                <div key={i} style={S.subCard}>
                  <Field label="Titel" value={c.title}
                    onChange={(v) => { const cards = [...(content.neuroContent?.cards || [])]; cards[i] = { ...cards[i], title: v }; setContent({ ...content, neuroContent: { ...content.neuroContent!, cards } }); }}
                    preview="card-title" />
                  <Field label="Text" value={c.text}
                    onChange={(v) => { const cards = [...(content.neuroContent?.cards || [])]; cards[i] = { ...cards[i], text: v }; setContent({ ...content, neuroContent: { ...content.neuroContent!, cards } }); }}
                    textarea preview="card-text" />
                </div>
              ))}
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
            </EditorSection>

            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
              <button onClick={handleSave} disabled={status === "saving"} style={S.primaryBtnLarge}>
                {status === "saving" ? "Speichert…" : "Änderungen speichern"}
              </button>
            </div>
          </div>
        </div>
      </div>
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

function ImageField({ label, slot, value, onChange }: { label: string; slot: ImageSlot; value: string | null; onChange: (url: string) => void }) {
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

  return (
    <div style={{ marginBottom: "1rem" }}>
      <span style={S.label}>{label}</span>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.35rem" }}>
        <div style={{ width: 96, height: 72, borderRadius: 10, overflow: "hidden", border: `1px solid ${B.border}`, background: B.creamDeep, flexShrink: 0 }}>
          {value ? (
            <img src={value} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: "0.6rem", color: B.muted, textAlign: "center", padding: 4 }}>
              Standardbild
            </div>
          )}
        </div>
        <div>
          <label style={{ ...S.ghostBtn, display: "inline-block", cursor: "pointer" }}>
            {status === "uploading" ? "Lädt hoch…" : value ? "Bild ersetzen" : "Bild hochladen"}
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} disabled={status === "uploading"} style={{ display: "none" }} />
          </label>
          {errorMsg && <p style={{ color: B.error, fontSize: "0.8rem", marginTop: "0.4rem" }}>{errorMsg}</p>}
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
