import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { checkAdminAuth, loginAdmin, logoutAdmin } from "@/lib/adminAuth";
import { getContent, saveContent, uploadImage, type SiteContent, type ImageSlot } from "@/lib/content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Inhalte bearbeiten | LF Business Consulting" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

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
    if (r.ok) {
      setAuthed(true);
    } else {
      setLoginError(true);
    }
  }

  async function handleSave() {
    if (!content) return;
    setStatus("saving");
    try {
      await saveContent({ data: content });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  }

  if (authed === null) {
    return <div style={styles.page} />;
  }

  if (!authed) {
    return (
      <div style={styles.page}>
        <form onSubmit={handleLogin} style={styles.loginCard}>
          <h1 style={styles.h1}>Inhalte bearbeiten</h1>
          <p style={styles.hint}>Passwort eingeben, um die Texte der Website zu bearbeiten.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            style={styles.input}
            autoFocus
          />
          {loginError && <p style={styles.error}>Falsches Passwort.</p>}
          <button type="submit" style={styles.primaryButton}>
            Anmelden
          </button>
        </form>
      </div>
    );
  }

  if (!content) {
    return <div style={styles.page} />;
  }

  return (
    <div style={styles.page}>
      <div style={styles.toolbar}>
        <h1 style={styles.h1}>Inhalte bearbeiten</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {status === "saved" && <span style={styles.savedTag}>Gespeichert ✓</span>}
          {status === "error" && <span style={styles.error}>Fehler beim Speichern</span>}
          <button onClick={handleSave} disabled={status === "saving"} style={styles.primaryButton}>
            {status === "saving" ? "Speichert…" : "Speichern"}
          </button>
          <button
            onClick={() => logoutAdmin().then(() => setAuthed(false))}
            style={styles.secondaryButton}
          >
            Abmelden
          </button>
        </div>
      </div>

      <Section title="Startseite (Hero)">
        <Field label="Badge (unter dem Logo)" value={content.hero.badge} onChange={(v) => setContent({ ...content, hero: { ...content.hero, badge: v } })} preview="badge" />
        <Field label="Titel" value={content.hero.title} onChange={(v) => setContent({ ...content, hero: { ...content.hero, title: v } })} textarea preview="hero-title" />
        <Field label="Untertitel" value={content.hero.subtitle} onChange={(v) => setContent({ ...content, hero: { ...content.hero, subtitle: v } })} textarea preview="body-dark" />
      </Section>

      <Section title="Über uns">
        <Field label="Absatz 1" value={content.about.paragraph1} onChange={(v) => setContent({ ...content, about: { ...content.about, paragraph1: v } })} textarea preview="body-light" />
        <Field label="Absatz 2" value={content.about.paragraph2} onChange={(v) => setContent({ ...content, about: { ...content.about, paragraph2: v } })} textarea preview="body-light" />
      </Section>

      <Section title="Liza Fässler">
        <ImageField
          label="Foto von Liza"
          slot="lizaPortrait"
          value={content.images.lizaPortrait}
          onChange={(url) => setContent({ ...content, images: { ...content.images, lizaPortrait: url } })}
        />
        <Field label="Unterzeile" value={content.liza.subheading} onChange={(v) => setContent({ ...content, liza: { ...content.liza, subheading: v } })} preview="eyebrow" />
        <Field label="Biografie, Absatz 1" value={content.liza.bio1} onChange={(v) => setContent({ ...content, liza: { ...content.liza, bio1: v } })} textarea preview="body-light" />
        <Field label="Biografie, Absatz 2" value={content.liza.bio2} onChange={(v) => setContent({ ...content, liza: { ...content.liza, bio2: v } })} textarea preview="body-light" />

        <h3 style={styles.h3}>Werdegang (Zeitleiste)</h3>
        {content.liza.journey.map((j, i) => (
          <div key={i} style={styles.subCard}>
            <Field
              label="Jahr / Ort"
              value={j.year}
              onChange={(v) => {
                const journey = [...content.liza.journey];
                journey[i] = { ...journey[i], year: v };
                setContent({ ...content, liza: { ...content.liza, journey } });
              }}
              preview="card-title"
            />
            <Field
              label="Beschreibung"
              value={j.text}
              onChange={(v) => {
                const journey = [...content.liza.journey];
                journey[i] = { ...journey[i], text: v };
                setContent({ ...content, liza: { ...content.liza, journey } });
              }}
              textarea
              preview="card-text"
            />
          </div>
        ))}

        <h3 style={styles.h3}>Expertise-Karten</h3>
        {content.liza.expertise.map((ex, i) => (
          <div key={i} style={styles.subCard}>
            <Field
              label="Titel"
              value={ex.title}
              onChange={(v) => {
                const expertise = [...content.liza.expertise];
                expertise[i] = { ...expertise[i], title: v };
                setContent({ ...content, liza: { ...content.liza, expertise } });
              }}
              preview="card-title"
            />
            <Field
              label="Text"
              value={ex.text}
              onChange={(v) => {
                const expertise = [...content.liza.expertise];
                expertise[i] = { ...expertise[i], text: v };
                setContent({ ...content, liza: { ...content.liza, expertise } });
              }}
              textarea
              preview="card-text"
            />
          </div>
        ))}
      </Section>

      <Section title="Beratung (Consultorias)">
        {content.consultorias.map((c, i) => (
          <div key={i} style={styles.subCard}>
            <ImageField
              label={`Bild Karte ${i + 1}`}
              slot={i === 0 ? "consultoria1" : "consultoria2"}
              value={i === 0 ? content.images.consultoria1 : content.images.consultoria2}
              onChange={(url) =>
                setContent({
                  ...content,
                  images: { ...content.images, [i === 0 ? "consultoria1" : "consultoria2"]: url },
                })
              }
            />
            <Field
              label="Titel"
              value={c.title}
              onChange={(v) => {
                const consultorias = [...content.consultorias];
                consultorias[i] = { ...consultorias[i], title: v };
                setContent({ ...content, consultorias });
              }}
              preview="card-title-dark"
            />
            <Field
              label="Satz"
              value={c.phrase}
              onChange={(v) => {
                const consultorias = [...content.consultorias];
                consultorias[i] = { ...consultorias[i], phrase: v };
                setContent({ ...content, consultorias });
              }}
              textarea
              preview="card-text-dark"
            />
          </div>
        ))}
      </Section>

      <Section title="Leistungen">
        <ImageField
          label="Bild Neuromarketing"
          slot="neuromarketing"
          value={content.images.neuromarketing}
          onChange={(url) => setContent({ ...content, images: { ...content.images, neuromarketing: url } })}
        />
        <ImageField
          label={`Banner-Bild ("Bereit zu wachsen?")`}
          slot="serviciosBanner"
          value={content.images.serviciosBanner}
          onChange={(url) => setContent({ ...content, images: { ...content.images, serviciosBanner: url } })}
        />
        <Field label="Überschrift" value={content.servicios.heading} onChange={(v) => setContent({ ...content, servicios: { ...content.servicios, heading: v } })} preview="heading" />
        <Field label="Unterzeile" value={content.servicios.subheading} onChange={(v) => setContent({ ...content, servicios: { ...content.servicios, subheading: v } })} textarea preview="body-light" />

        <h3 style={styles.h3}>Kernleistungen</h3>
        {content.servicios.services.map((s, i) => (
          <div key={i} style={styles.subCard}>
            <Field
              label="Titel"
              value={s.title}
              onChange={(v) => {
                const services = [...content.servicios.services];
                services[i] = { ...services[i], title: v };
                setContent({ ...content, servicios: { ...content.servicios, services } });
              }}
              preview="card-title"
            />
            <Field
              label="Text"
              value={s.text}
              onChange={(v) => {
                const services = [...content.servicios.services];
                services[i] = { ...services[i], text: v };
                setContent({ ...content, servicios: { ...content.servicios, services } });
              }}
              textarea
              preview="card-text"
            />
          </div>
        ))}

        <h3 style={styles.h3}>Spezialgebiete</h3>
        {content.servicios.spezial.map((s, i) => (
          <div key={i} style={styles.subCard}>
            <Field
              label="Titel"
              value={s.title}
              onChange={(v) => {
                const spezial = [...content.servicios.spezial];
                spezial[i] = { ...spezial[i], title: v };
                setContent({ ...content, servicios: { ...content.servicios, spezial } });
              }}
              preview="card-title"
            />
            <Field
              label="Text"
              value={s.text}
              onChange={(v) => {
                const spezial = [...content.servicios.spezial];
                spezial[i] = { ...spezial[i], text: v };
                setContent({ ...content, servicios: { ...content.servicios, spezial } });
              }}
              textarea
              preview="card-text"
            />
          </div>
        ))}
      </Section>

      <Section title="Branding">
        <Field label="Text" value={content.branding.paragraph} onChange={(v) => setContent({ ...content, branding: { ...content.branding, paragraph: v } })} textarea preview="body-cream" />
      </Section>

      <Section title="Kontakt">
        <Field label="Adresse" value={content.contact.address} onChange={(v) => setContent({ ...content, contact: { ...content.contact, address: v } })} preview="small" />
        <Field label="E-Mail" value={content.contact.email} onChange={(v) => setContent({ ...content, contact: { ...content.contact, email: v } })} preview="small" />
        <Field label="Telefon" value={content.contact.phone} onChange={(v) => setContent({ ...content, contact: { ...content.contact, phone: v } })} preview="small" />
      </Section>

      <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem 0 3rem" }}>
        <button onClick={handleSave} disabled={status === "saving"} style={styles.primaryButton}>
          {status === "saving" ? "Speichert…" : "Speichern"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>{title}</h2>
      {children}
    </section>
  );
}

function ImageField({
  label,
  slot,
  value,
  onChange,
}: {
  label: string;
  slot: ImageSlot;
  value: string | null;
  onChange: (url: string) => void;
}) {
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
    <div style={{ ...styles.field, marginBottom: "1rem" }}>
      <span style={styles.label}>{label}</span>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <div
          style={{
            width: 96,
            height: 72,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #ddd8cc",
            background: "#eee",
            flexShrink: 0,
          }}
        >
          {value ? (
            <img src={value} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: "0.65rem", color: "#999", textAlign: "center", padding: 4 }}>
              Standardbild
            </div>
          )}
        </div>
        <div>
          <label style={{ ...styles.secondaryButton, display: "inline-block", cursor: "pointer" }}>
            {status === "uploading" ? "Lädt hoch…" : value ? "Bild ersetzen" : "Bild hochladen"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={status === "uploading"}
              style={{ display: "none" }}
            />
          </label>
          {errorMsg && <p style={{ ...styles.error, marginTop: "0.4rem" }}>{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
}

type PreviewKind =
  | "hero-title"
  | "badge"
  | "body-dark"
  | "body-light"
  | "body-cream"
  | "eyebrow"
  | "heading"
  | "card-title"
  | "card-text"
  | "card-title-dark"
  | "card-text-dark"
  | "small";

const HERO_HIGHLIGHT_WORDS = ["vor,", "inspirieren", "gestalten"];

function Field({
  label,
  value,
  onChange,
  textarea,
  preview,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  preview?: PreviewKind;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 sm:gap-5 mb-4 items-start">
      <label style={{ ...styles.field, marginBottom: 0 }}>
        <span style={styles.label}>{label}</span>
        {textarea ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={styles.textarea} />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} style={styles.input} />
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
    <div
      className={`rounded-xl overflow-hidden border ${
        wrapperDark || wrapperOverlay ? "border-black/20" : "border-border"
      }`}
    >
      <div
        className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 font-sans"
        style={{
          background: wrapperDark || wrapperOverlay ? "#00000030" : "#00000008",
          color: wrapperDark || wrapperOverlay ? "#ffffffa0" : "#00000060",
        }}
      >
        Vorschau
      </div>
      <div
        className={`p-4 min-h-[3.5rem] flex items-center ${
          wrapperDark
            ? "bg-[#15151c]"
            : wrapperOverlay
              ? "bg-[#1a1a1a]"
              : wrapperCream
                ? "bg-cream"
                : "bg-background"
        }`}
      >
        {kind === "hero-title" ? (
          <h1 className="font-display font-bold text-2xl leading-[1.1] text-white">
            {text.split(" ").map((w, i) => (
              <span key={i} className={`inline-block mr-1.5 ${HERO_HIGHLIGHT_WORDS.includes(w) ? "text-gradient-warm italic" : ""}`}>
                {w}
              </span>
            ))}
          </h1>
        ) : kind === "badge" ? (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/25 bg-white/10 text-[11px] uppercase tracking-[0.2em] text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-warm" />
            {text}
          </span>
        ) : kind === "body-dark" ? (
          <p className="text-white/75 text-base leading-relaxed">{text}</p>
        ) : kind === "body-light" || kind === "body-cream" ? (
          <p className="text-muted-foreground text-base leading-relaxed">{text}</p>
        ) : kind === "eyebrow" ? (
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{text}</p>
        ) : kind === "heading" ? (
          <h2 className="font-display font-bold text-xl text-foreground leading-tight">{text}</h2>
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

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f7f5f0",
    color: "#1a1a1a",
    fontFamily: "system-ui, sans-serif",
    padding: "2rem 1.5rem 4rem",
  },
  toolbar: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 760,
    margin: "0 auto 1rem",
    background: "#f7f5f0",
    paddingBottom: "1rem",
    borderBottom: "1px solid #ddd8cc",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  loginCard: {
    maxWidth: 360,
    margin: "5rem auto",
    background: "#fff",
    borderRadius: 16,
    padding: "2rem",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  },
  h1: { fontSize: "1.3rem", margin: 0, fontWeight: 700 },
  h2: { fontSize: "1.05rem", margin: "0 0 1rem", fontWeight: 700 },
  h3: { fontSize: "0.85rem", margin: "1.25rem 0 0.5rem", color: "#8a6a3a", textTransform: "uppercase", letterSpacing: "0.05em" },
  hint: { fontSize: "0.85rem", color: "#666", margin: 0 },
  section: {
    maxWidth: 760,
    margin: "0 auto 1.5rem",
    background: "#fff",
    borderRadius: 14,
    padding: "1.5rem",
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  },
  subCard: {
    background: "#f7f5f0",
    borderRadius: 10,
    padding: "1rem",
    marginBottom: "0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  field: { display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "0.8rem" },
  label: { fontSize: "0.75rem", color: "#666", fontWeight: 600 },
  input: {
    border: "1px solid #ddd8cc",
    borderRadius: 8,
    padding: "0.55rem 0.7rem",
    fontSize: "0.9rem",
    fontFamily: "inherit",
  },
  textarea: {
    border: "1px solid #ddd8cc",
    borderRadius: 8,
    padding: "0.55rem 0.7rem",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    resize: "vertical",
  },
  primaryButton: {
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    padding: "0.6rem 1.4rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryButton: {
    background: "transparent",
    color: "#666",
    border: "1px solid #ddd8cc",
    borderRadius: 999,
    padding: "0.6rem 1.2rem",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  savedTag: { color: "#3a8a4a", fontSize: "0.85rem", fontWeight: 600 },
  error: { color: "#c0392b", fontSize: "0.85rem", margin: 0 },
};
