import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useInView,
  animate,
} from "framer-motion";
import gruenderImg from "@/assets/gruender-desk.jpg";
import kleinunternehmenImg from "@/assets/kleinunternehmen-tools.jpg";
import neuroImg from "@/assets/neuro.jpg";
import servicesImg from "@/assets/services.jpg";
import logo from "@/assets/logo.png";
import logoWhite from "@/assets/logo-white.png";
import logoIcon from "@/assets/logo-icon.png";
import lizaEscribiendo from "@/assets/liza/liza_escribiendo.jpg";
import videoAi from "@/assets/video-ai.mp4";
import marcasDoTempoImg from "@/assets/brands/marcas-do-tempo.jpeg";
import miniMintweltImg from "@/assets/brands/minimintwelt.jpeg";
import puraVidaImg from "@/assets/brands/pura-vida.jpeg";
import teufenImg from "@/assets/brands/teufen.jpeg";

const NAV = [
  { label: "Start", to: "/" },
  { label: "Über uns", to: "/ueber-uns" },
  { label: "Leistungen", to: "/leistungen" },
  { label: "Kontakt", to: "/kontakt" },
];

/* ---------- PAGE SHELL ---------- */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <CursorFollower />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

/* ---------- SCROLL PROGRESS BAR ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-amber-warm via-gold to-amber-warm"
    />
  );
}

/* ---------- CUSTOM CURSOR ---------- */
export function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;
      setHover(!!el.closest("a,button,[data-cursor='hover']"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[70] mix-blend-difference hidden md:block"
    >
      <motion.div
        animate={{ scale: hover ? 2.4 : 1, opacity: hover ? 0.6 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="-translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white"
      />
    </motion.div>
  );
}

/* ---------- NAVBAR ---------- */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold tracking-tight hover:scale-[1.04] transition-transform">
          <span className="relative block w-9 h-9 shrink-0">
            <img src={logoIcon} alt="LF Business Consulting & Marketing" className="absolute inset-0 w-full h-full object-contain" />
          </span>
          <span className="text-sm sm:text-base">LF Business Consulting</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-foreground font-semibold" }}
              inactiveProps={{ className: "text-foreground/70" }}
              className="relative text-sm hover:text-foreground transition-colors group"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-amber-warm group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        <Link
          to="/kontakt"
          className="hidden lg:inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium hover:bg-amber-warm transition-colors"
        >
          Kontaktieren →
        </Link>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden relative w-10 h-10 grid place-items-center"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
            className="absolute h-0.5 w-6 bg-foreground"
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className="absolute h-0.5 w-6 bg-foreground"
          />
          <motion.span
            animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
            className="absolute h-0.5 w-6 bg-foreground"
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 220, damping: 22 }}
                >
                  <Link to={n.to} onClick={() => setOpen(false)} className="text-foreground/90 text-lg">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ---------- HERO ---------- */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const phrase = "Gemeinsam stellen wir uns Ihr Unternehmen vor, inspirieren und gestalten es neu";
  const words = phrase.split(" ");
  const highlight = ["vor,", "inspirieren", "gestalten"];

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-cream via-background to-background"
    >
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 w-full"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <img src={logo} alt="LF Business Consulting & Marketing" className="h-14 sm:h-16 lg:h-20 w-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/70 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-warm animate-pulse" />
            Teufen, Schweiz
          </motion.div>

          <h1 className="font-display font-bold leading-[1.05] text-4xl sm:text-6xl lg:text-8xl max-w-5xl">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, rotateX: -30 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block mr-3 ${
                  highlight.includes(w) ? "text-gradient-warm italic" : ""
                }`}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="mt-8 max-w-xl text-muted-foreground text-lg"
          >
            Kostenlose Beratung für Unternehmer. Wir kümmern uns um Kundenservice,
            digitales Marketing, Branding und Neuromarketing, damit sich Ihr Unternehmen wirklich abhebt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.85, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <MagneticButton href="/kontakt" primary>
              Jetzt starten
            </MagneticButton>
            <MagneticButton href="/leistungen">Beratung entdecken</MagneticButton>
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground self-center">
              <span className="text-amber-warm font-bold">✓</span> Kostenlose Erstberatung
            </span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground text-xs uppercase tracking-[0.3em] hidden lg:flex flex-col items-center gap-3"
      >
        Scrollen
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="block w-px h-10 bg-foreground/30"
        />
      </motion.div>
    </section>
  );
}

export function MagneticButton({
  href,
  children,
  primary,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        setPos({ x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium overflow-hidden group ${
        primary
          ? "bg-amber-warm text-black shimmer shadow-[0_0_40px_-10px_oklch(0.7_0.17_50)] hover:shadow-[0_0_60px_-5px_oklch(0.7_0.17_50)]"
          : "border border-foreground/25 text-foreground hover:border-foreground"
      } transition-shadow`}
    >
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
    </motion.a>
  );
}

/* ---------- Section helpers ---------- */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-amber-warm font-medium mb-6">
      <span className="w-8 h-px bg-amber-warm" />
      {children}
    </div>
  );
}

/* ---------- ABOUT ---------- */
export function About() {
  return (
    <section id="about" className="py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-5">
          <SectionLabel>Über uns</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-display font-bold leading-tight">
            Strategie, Design und <span className="text-gradient-warm">Neurowissenschaft</span> im Dienst Ihres Unternehmens.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-7 text-muted-foreground text-lg leading-relaxed space-y-5">
          <p>
            Bei <strong className="text-foreground">LF Marketing & Business Consulting</strong> helfen wir bestehenden und zukünftigen
            Unternehmen, ihren Kundenservice zu verbessern und sich von anderen Anbietern abzuheben.
          </p>
          <p>
            Wir verbinden strategische Beratung, digitales Marketing, Branding und Neuromarketing, um Unternehmen
            mit eigener Identität, menschlichem Fokus und messbaren Ergebnissen aufzubauen.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-6">
            <Counter to={10} suffix="+" label="Jahre Erfahrung" />
            <Counter to={60} suffix="+" label="Begleitete Marken" />
            <Counter to={100} suffix="%" label="Menschlicher Fokus" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- ANIMATED COUNTER ---------- */
export function Counter({ to, suffix = "", label }: { to: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <div ref={ref}>
      <div className="text-3xl sm:text-4xl font-display font-bold text-gradient-warm tabular-nums">
        {val}
        {suffix}
      </div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

/* ---------- LIZA FÄSSLER ---------- */
export function LizaPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto">
      <motion.div
        ref={ref}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          setT({ rx: -y * 6, ry: x * 8 });
        }}
        onMouseLeave={() => setT({ rx: 0, ry: 0 })}
        animate={{ rotateX: t.rx, rotateY: t.ry }}
        transition={{ type: "spring", stiffness: 150, damping: 18 }}
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
        className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-2xl shadow-amber-warm/25 bg-card group"
      >
        <img
          src={lizaEscribiendo}
          alt="Liza Fässler bei der strategischen Planung"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-700 ease-out"
          width={1280}
          height={1600}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <div className="shine-sweep rounded-3xl" />
        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-medium tracking-wide text-foreground shadow-md">
          Strategie & Planung
        </div>
      </motion.div>
    </div>
  );
}

export function Liza() {
  const expertise = [
    {
      t: "Strategie & Transformation",
      d: "Nachhaltige Geschäftsmodelle für Unternehmer, Startups und KMU. Expertin für Markenpositionierung und klare Differenzierung im Wettbewerb.",
    },
    {
      t: "Projekte mit Wirkung",
      d: "Führung multidisziplinärer Projekte, von Bildungsinnovation mit miniMINTwelt bis zu kollaborativen Arbeitsräumen wie Coworking Teufen.",
    },
    {
      t: "Strategische Kommunikation",
      d: "Narrative, die Emotionen mit Resultaten verbinden. Zuhause in lateinamerikanischen und europäischen Märkten.",
    },
    {
      t: "Netzwerke & Allianzen",
      d: "Aufbau von Ökosystemen der Zusammenarbeit zwischen Bildung, Technologie und Industrie.",
    },
  ];
  const journey = [
    { y: "Brasilien", d: "Leitung kultureller Events und erste unternehmerische Schritte." },
    { y: "Schweiz", d: "Aufbau der eigenen Praxis als unabhängige Beraterin für Unternehmen und Gründer." },
    { y: "Heute", d: "Gründerin von miniMINTwelt und strategische Begleiterin für Wachstum und Nachhaltigkeit." },
  ];
  return (
    <section id="liza" className="py-32 px-6 bg-secondary/40 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionLabel>Die Gründerin</SectionLabel>
              <h2 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
                Liza <span className="text-gradient-warm">Fässler</span>
              </h2>
              <p className="mt-3 text-sm uppercase tracking-[0.25em] text-muted-foreground">
                Internationale Unternehmerin · Strategin
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 text-muted-foreground text-lg leading-relaxed">
                Liza verwandelt seit über zehn Jahren Ideen in Projekte mit Wirkung. Sie arbeitet
                strategisch zwischen Lateinamerika und Europa und verbindet strategisches Marketing,
                Geschäftsentwicklung und die Führung komplexer Projekte.
              </p>
              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
                Sie führt Unternehmen von der ersten Idee bis zur Skalierung. Ihre Initiativen schaffen
                heute echten Wert: von innovativen Räumen für gemeinsames Arbeiten bis zu
                Bildungsplattformen für MINT, die ganze Gemeinschaften erreichen. Ihr Gespür für starke
                Marken, kluge Verhandlungen und strategische Netzwerke zeichnet sie aus.
              </p>
            </Reveal>
            <div className="mt-10 space-y-0">
              {journey.map((j, i) => (
                <Reveal key={j.y} delay={0.2 + i * 0.12}>
                  <div className="relative pl-8 pb-8 last:pb-0">
                    {i < journey.length - 1 && (
                      <span className="absolute left-[5px] top-4 bottom-0 w-px bg-gradient-to-b from-amber-warm/60 to-border" />
                    )}
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.3 + i * 0.12 }}
                      className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full bg-amber-warm shadow-[0_0_12px_oklch(0.7_0.17_50/0.6)]"
                    />
                    <div className="font-display font-bold text-lg">{j.y}</div>
                    <p className="text-sm text-muted-foreground mt-1">{j.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.2}>
              <LizaPortrait />
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {expertise.map((e, i) => (
            <Reveal key={e.t} delay={i * 0.1} className="h-full">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative h-full p-7 rounded-2xl bg-card border border-border hover:border-amber-warm/50 shadow-sm hover:shadow-2xl hover:shadow-amber-warm/15 transition-[border-color,box-shadow] duration-500 group overflow-hidden"
              >
                <div className="shine-sweep rounded-2xl" />
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-warm to-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <h3 className="font-display font-semibold text-xl mb-3">{e.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{e.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONSULTORIAS ---------- */
export function Consultorias() {
  const items = [
    {
      title: "Gründer & Selbstständige",
      phrase: "Ein Unternehmen aufzubauen muss kein einsamer Weg sein. Wir begleiten Sie von der Idee bis zum Wachstum.",
      img: gruenderImg,
    },
    {
      title: "Kleine Unternehmen",
      phrase: "Ein erfolgreiches Geschäft entsteht aus Tagen voller Arbeit, Leidenschaft und Hingabe.",
      img: kleinunternehmenImg,
    },
  ];
  return (
    <section id="consultorias" className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel>Beratung</SectionLabel>
          <h2 className="text-4xl sm:text-6xl font-display font-bold">Wir begleiten jede Phase.</h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.15}>
              <Card3D>
                <div className="relative h-[480px] rounded-3xl overflow-hidden bg-foreground group">
                  <img
                    src={it.img}
                    alt={it.title}
                    loading="lazy"
                    width={1200}
                    height={1400}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1.2s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                  <div className="shine-sweep rounded-3xl" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <div className="text-xs uppercase tracking-[0.3em] text-amber-warm mb-3">0{i + 1}</div>
                    <h3 className="text-3xl sm:text-4xl font-display font-bold mb-3">{it.title}</h3>
                    <p className="text-white/80 max-w-md mb-6">{it.phrase}</p>
                    <a href="/kontakt" className="inline-flex items-center gap-2 text-sm font-medium border-b border-amber-warm pb-1 self-start group-hover:gap-4 transition-all">
                      Mehr erfahren <span>→</span>
                    </a>
                  </div>
                </div>
              </Card3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Card3D({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        setT({ rx: -y * 10, ry: x * 12 });
      }}
      onMouseLeave={() => setT({ rx: 0, ry: 0 })}
      animate={{ rotateX: t.rx, rotateY: t.ry }}
      transition={{ type: "spring", stiffness: 150, damping: 18 }}
      style={{ transformStyle: "preserve-3d", perspective: 1200 }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- MARQUEE TEXT BAND ---------- */
export function Marquee() {
  const words = ["Strategie", "•", "Branding", "•", "Neuromarketing", "•", "Design", "•", "Werbung", "•", "Wachstum", "•"];
  const row = [...words, ...words, ...words];
  return (
    <section className="py-12 bg-cream overflow-hidden border-y border-border">
      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        className="flex gap-10 w-max whitespace-nowrap font-display text-5xl sm:text-7xl font-bold tracking-tight"
      >
        {row.map((w, i) => (
          <span key={i} className={i % 2 === 0 ? "text-gradient-warm" : "text-foreground/15"}>
            {w}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------- NEUROMARKETING ---------- */
export function Neuromarketing() {
  const cursos = [
    { t: "Social Media", d: "Erkennen Sie Ihr Kundenprofil und entdecken Sie, wie man in sozialen Netzwerken verkauft." },
    { t: "Design", d: "Gestalten Sie wie eine Fachperson. Nutzen Sie Neuromarketing, das Blicke einfängt und Verkäufe abschliesst." },
    { t: "Kommunikation", d: "Kommunizieren Sie empathisch und überzeugend, um Menschen wirklich zu erreichen." },
    { t: "Marketing", d: "Erkennen Sie die digitalen und klassischen Strategien, die Ihre Marke zum Erfolg führen." },
  ];
  return (
    <section id="neuromarketing" className="relative py-32 px-6 bg-background overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <Reveal>
            <SectionLabel>Neuromarketing</SectionLabel>
            <h2 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
              Wie <span className="text-gradient-warm">Neurowissenschaft</span> und Design Konsumenten beeinflussen.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg max-w-lg">
              Steigern Sie die Bindung Ihrer Marke mit Techniken, die emotional und kognitiv verbinden.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Card3D>
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-border shadow-2xl shadow-amber-warm/10 group">
                <motion.img
                  src={neuroImg}
                  alt="Neuromarketing"
                  loading="lazy"
                  width={1400}
                  height={1200}
                  initial={{ scale: 1.3 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-amber-warm/10" />
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 pointer-events-none mix-blend-overlay"
                  style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.82 0.15 75 / 0.5), transparent 60%)" }}
                />
              </div>
            </Card3D>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cursos.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -10, rotateX: 6, rotateY: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative h-full p-6 rounded-2xl bg-card border border-border hover:border-amber-warm/60 shadow-sm hover:shadow-2xl hover:shadow-amber-warm/15 transition-[border-color,box-shadow] duration-500 group overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="shine-sweep rounded-2xl" />
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-warm to-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-10 h-10 rounded-lg grid place-items-center bg-amber-warm/15 text-amber-warm font-display font-bold mb-4"
                >
                  0{i + 1}
                </motion.div>
                <h3 className="font-display font-semibold text-xl mb-2">{c.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICE CARDS (shared home + leistungen) ---------- */
const SERVICES = [
  { t: "Digitales Marketing", d: "Wirkungsvolle Strategien, um Kunden zu gewinnen und zu überzeugen." },
  { t: "Design", d: "Visuelle Identität mit Zweck und Emotion." },
  { t: "Werbung", d: "Kampagnen, die Aufmerksamkeit in Kunden verwandeln." },
];

export function ServiceCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {SERVICES.map((it, i) => (
        <Reveal key={it.t} delay={i * 0.1}>
          <motion.div
            whileHover={{ y: -12, rotateX: 3 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            className="relative h-72 p-7 rounded-2xl bg-card border border-border overflow-hidden group hover:border-amber-warm/50 hover:shadow-2xl hover:shadow-amber-warm/15 transition-[border-color,box-shadow] duration-500"
          >
            <div className="shine-sweep rounded-2xl" />
            <div className="text-6xl font-display font-bold text-muted/70 group-hover:text-amber-warm transition-colors">
              0{i + 1}
            </div>
            <div className="absolute bottom-7 left-7 right-7">
              <h3 className="text-2xl font-display font-bold mb-2 capitalize">{it.t}</h3>
              <p className="text-muted-foreground text-sm">{it.d}</p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-warm to-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute -inset-x-10 -top-10 h-40 bg-gradient-to-r from-transparent via-amber-warm/10 to-transparent rotate-12 blur-2xl" />
            </div>
          </motion.div>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------- LEISTUNGEN TEASER (home) ---------- */
export function LeistungenTeaser() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 mb-16 items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>Leistungen</SectionLabel>
            <h2 className="text-4xl sm:text-6xl font-display font-bold">Alles, was Ihre Marke braucht.</h2>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-5 text-muted-foreground text-lg">
            Von digitalem Marketing bis Geschäftsstrategie: integrierte Lösungen für nachhaltiges Wachstum.
          </Reveal>
        </div>

        <ServiceCards />

        <Reveal className="mt-14 text-center">
          <MagneticButton href="/leistungen" primary>
            Alle Leistungen entdecken
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- SERVICIOS (full, leistungen page) ---------- */
export function Servicios() {
  const spezial = [
    {
      t: "Geschäftsstrategie",
      d: "Wir analysieren Ihr Geschäft, erkennen Potenziale und zeigen Ihnen, auf welche Produkte Sie sich konzentrieren sollten und wie Sie mehr verkaufen. Vom Handwerksbetrieb bis zum jungen Unternehmen.",
    },
    {
      t: "Kursdesign",
      d: "Sie sind Experte auf Ihrem Gebiet und möchten Ihr Wissen weitergeben? Wir entwickeln die Strategie und den Aufbau Ihres Kurses, angepasst an Sie und Ihr Publikum.",
    },
    {
      t: "Fundraising",
      d: "Wir wissen, wie man Projekte überzeugend präsentiert. So gewinnen wir Mittel und Ressourcen für Ihr Vorhaben.",
    },
    {
      t: "Chinesische Medizin",
      d: "Fundiertes Fachwissen in Traditioneller Chinesischer Medizin. Beratung und Begleitung in diesem besonderen Bereich.",
    },
  ];
  return (
    <section id="servicios" className="py-32 px-6 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 mb-16 items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>Leistungen</SectionLabel>
            <h2 className="text-4xl sm:text-6xl font-display font-bold">Alles, was Ihre Marke braucht, an einem Ort.</h2>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-5 text-muted-foreground text-lg">
            Integrierte Lösungen für Wachstum mit Identität, Klarheit und nachhaltigen Ergebnissen.
          </Reveal>
        </div>

        <div className="mb-16">
          <ServiceCards />
        </div>

        <div className="mb-16">
          <Reveal className="mb-10">
            <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-amber-warm font-medium mb-3">
              <span className="w-8 h-px bg-amber-warm" />
              Spezialgebiete
            </div>
            <h3 className="text-2xl sm:text-4xl font-display font-bold">Beratung, die über Marketing hinausgeht.</h3>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {spezial.map((it, i) => (
              <Reveal key={it.t} delay={i * 0.1} className="h-full">
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="relative h-full p-6 rounded-2xl bg-card border border-border hover:border-amber-warm/50 shadow-sm hover:shadow-2xl hover:shadow-amber-warm/15 transition-[border-color,box-shadow] duration-500 group overflow-hidden"
                >
                  <div className="shine-sweep rounded-2xl" />
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-warm to-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                  <div className="w-10 h-10 rounded-lg grid place-items-center bg-amber-warm/15 text-amber-warm font-display font-bold mb-4">
                    0{i + 4}
                  </div>
                  <h4 className="font-display font-semibold text-lg mb-2">{it.t}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{it.d}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="relative rounded-3xl overflow-hidden">
            <img src={servicesImg} alt="" loading="lazy" width={1400} height={1200} className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative min-h-72 bg-gradient-to-r from-black/75 via-black/40 to-transparent flex items-center px-6 sm:px-10 py-10">
              <div className="text-white max-w-xl">
                <h3 className="text-3xl font-display font-bold mb-3">Bereit zu wachsen?</h3>
                <p className="text-white/80 mb-6">Erzählen Sie uns von Ihrem Projekt. Wir entwickeln gemeinsam die passende Strategie.</p>
                <MagneticButton href="/kontakt" primary>Beratung anfragen</MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- KI & SOFTWARE (video) ---------- */
export function KiSoftware() {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <section id="ki-software" className="py-32 px-6 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <SectionLabel>KI & Software</SectionLabel>
          <h2 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
            Die <span className="text-gradient-warm">digitale Zukunft</span> für Unternehmen im Appenzellerland.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">
            Wir bringen künstliche Intelligenz und moderne Software zu Unternehmen in Appenzell
            und der Ostschweiz. Sehen Sie im Video, wie wir Ideen mit Technologie verbinden.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl shadow-amber-warm/20 bg-black group">
            <video
              ref={vidRef}
              src={videoAi}
              controls={playing}
              preload="metadata"
              playsInline
              onPlay={() => setPlaying(true)}
              className="w-full h-auto"
            />
            {!playing && (
              <button
                aria-label="Video abspielen"
                onClick={() => vidRef.current?.play()}
                className="absolute inset-0 grid place-items-center bg-black/10 hover:bg-black/0 transition-colors"
              >
                <span className="relative grid place-items-center">
                  <motion.span
                    animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-24 h-24 rounded-full bg-amber-warm/40"
                  />
                  <span className="relative w-20 h-20 rounded-full bg-white/95 backdrop-blur grid place-items-center shadow-2xl hover:scale-110 transition-transform">
                    <span className="ml-1.5 text-2xl text-foreground">▶</span>
                  </span>
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- BRANDING ---------- */
export function Branding() {
  return (
    <section id="branding" className="py-32 px-6 bg-cream relative overflow-hidden">
      <div className="relative max-w-5xl mx-auto text-center">
        <Reveal>
          <SectionLabel>Branding</SectionLabel>
          <h2 className="text-4xl sm:text-7xl font-display font-bold leading-[1.05] mb-10">
            Wir gestalten nicht nur Anzeigen. Wir bauen <span className="text-gradient-warm">Marken mit Seele</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            Wir betrachten Ihr Unternehmen als Ganzes. Dabei prüfen wir, was Ihre Zielgruppe braucht, welche
            Trends wichtig sind und wohin Sie sich entwickeln möchten. So stellen wir das passende Paket für Sie
            zusammen, mit Texten, Bildern und Videos, mit der Planung von Kampagnen und mit der Pflege Ihrer
            Gemeinschaft in den sozialen Netzwerken.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- CLIENTES ---------- */
export function Clientes() {
  const brands = [
    {
      key: "liz",
      bg: "#8a5a33",
      el: (
        <div className="text-center">
          <div className="font-serif font-black text-3xl leading-none tracking-wide" style={{ color: "#160f08" }}>LIZ</div>
          <div className="text-[9px] font-bold tracking-[0.25em] mt-1" style={{ color: "#241505" }}>MÓVEIS RÚSTICOS</div>
        </div>
      ),
    },
    {
      key: "anabe",
      bg: "#ffffff",
      el: (
        <div className="text-center">
          <div className="font-serif font-bold text-3xl leading-none" style={{ color: "#5c6670" }}>
            anabe<span style={{ color: "#7fcbbf" }}>.</span>
          </div>
          <div className="text-[10px] tracking-wider mt-1" style={{ color: "#8fd0c6" }}>terapias integrativas</div>
        </div>
      ),
    },
    {
      key: "catty",
      bg: "#ffffff",
      el: (
        <div className="text-center">
          <div className="text-xs font-bold tracking-[0.3em]" style={{ color: "#f2a71b" }}>TAMALES</div>
          <div className="font-serif italic font-bold text-3xl leading-none" style={{ color: "#e2571b" }}>Catty</div>
        </div>
      ),
    },
    {
      key: "catlover",
      bg: "#f7ece4",
      el: (
        <div className="text-center">
          <div className="font-serif italic text-2xl leading-none" style={{ color: "#6b4a2f" }}>cat lover</div>
          <div className="text-[9px] tracking-[0.3em] mt-1.5" style={{ color: "#6b4a2f" }}>VETERINARIA</div>
        </div>
      ),
    },
    {
      key: "planeta",
      bg: "#1e3a6e",
      el: (
        <div className="text-center">
          <div className="font-display font-bold text-3xl leading-none text-white">Planeta</div>
          <div className="text-[10px] font-bold tracking-[0.3em] mt-1" style={{ color: "#ff5964" }}>IDIOMAS</div>
        </div>
      ),
    },
    {
      key: "chifa",
      bg: "#d5281f",
      el: (
        <div className="font-serif italic font-bold text-2xl leading-tight text-center" style={{ color: "#1c1c1c" }}>
          Chifa Wong
        </div>
      ),
    },
    {
      key: "minimint",
      bg: "#f4f4f6",
      el: <img src={miniMintweltImg} alt="miniMINTwelt" className="w-full h-full object-cover" />,
    },
    {
      key: "marcas",
      bg: "#c89b6a",
      el: <img src={marcasDoTempoImg} alt="Marcas do Tempo, Möbel und Dekoration" className="w-full h-full object-cover" />,
    },
    {
      key: "teufen",
      bg: "#f4f4f6",
      el: <img src={teufenImg} alt="Coworking Teufen schafft" className="w-full h-full object-cover" />,
    },
    {
      key: "puravida",
      bg: "#ffffff",
      el: <img src={puraVidaImg} alt="Pura Vida, Deutschkurse" className="w-full h-full object-cover" />,
    },
  ];
  const row = [...brands, ...brands];
  return (
    <section id="clientes" className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <Reveal>
          <SectionLabel>Kunden & Partner</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-display font-bold">Marken, die uns bereits vertrauen.</h2>
        </Reveal>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          className="flex gap-6 w-max"
        >
          {row.map((b, i) => (
            <motion.div
              key={`${b.key}-${i}`}
              whileHover={{ scale: 1.06, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="h-28 w-56 shrink-0 rounded-2xl border border-border grid place-items-center overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-warm/60 transition-[border-color,box-shadow]"
              style={{ backgroundColor: b.bg }}
            >
              {b.el}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- KONTAKT CTA ---------- */
export function KontaktCTA() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-warm via-gold to-amber-warm animated-gradient" />
      <div className="relative max-w-4xl mx-auto text-center text-black">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.35em] font-medium mb-6 text-black/70">
            Bereit für den nächsten Schritt?
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-10">
            Lassen Sie uns über Ihr Unternehmen sprechen.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <motion.a
            href="/kontakt"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="inline-flex items-center gap-3 rounded-full bg-black text-white px-10 py-5 text-lg font-medium shimmer shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] group"
          >
            Kontaktieren Sie uns
            <span className="transition-transform group-hover:translate-x-1.5">→</span>
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- CONTACTO ---------- */
export function Contacto() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok">("idle");
  return (
    <section id="contacto" className="pt-44 pb-32 px-6 bg-secondary/40">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        <Reveal>
          <SectionLabel>Kontakt</SectionLabel>
          <h1 className="text-4xl sm:text-6xl font-display font-bold leading-tight mb-8">
            Sprechen wir über Ihren <span className="text-gradient-warm">nächsten Schritt</span>.
          </h1>
          <div className="space-y-5 text-muted-foreground">
            <ContactRow icon="📍" label="Gfell 1002, 9053 Teufen, Schweiz" />
            <ContactRow icon="✉" label="info@lf-business-consulting.com" href="mailto:info@lf-business-consulting.com" />
            <ContactRow icon="☎" label="+41 77 471 70 06" href="tel:+41774717006" />
          </div>
          <div className="flex gap-3 mt-10">
            {[{ n: "IG", u: "#" }, { n: "in", u: "#" }].map((s) => (
              <a key={s.n} href={s.u} className="w-11 h-11 rounded-full border border-border grid place-items-center text-sm hover:bg-foreground hover:text-background hover:scale-110 transition-all">
                {s.n}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStatus("loading");
              setTimeout(() => setStatus("ok"), 1200);
            }}
            className="bg-card p-8 rounded-3xl border border-border space-y-6"
          >
            <Field label="Name" name="name" />
            <Field label="Mailadresse" name="email" type="email" />
            <Field label="Erzählen Sie uns von Ihrem Projekt" name="msg" textarea />
            <button
              type="submit"
              disabled={status !== "idle"}
              className="w-full py-4 rounded-full bg-foreground text-background font-medium relative overflow-hidden hover:bg-amber-warm transition-colors shimmer disabled:opacity-80"
            >
              {status === "idle" && "Nachricht senden"}
              {status === "loading" && "Wird gesendet..."}
              {status === "ok" && "Nachricht gesendet ✓"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function ContactRow({ icon, label, href }: { icon: string; label: string; href?: string }) {
  const Tag: any = href ? "a" : "div";
  return (
    <Tag href={href} className="flex items-center gap-4 group">
      <span className="w-10 h-10 grid place-items-center rounded-full bg-foreground text-background group-hover:bg-amber-warm group-hover:text-black transition-colors">
        {icon}
      </span>
      <span className="group-hover:text-foreground transition-colors">{label}</span>
    </Tag>
  );
}

function Field({ label, name, type = "text", textarea }: { label: string; name: string; type?: string; textarea?: boolean }) {
  const [focused, setFocused] = useState(false);
  const [val, setVal] = useState("");
  const active = focused || val.length > 0;
  const Input: any = textarea ? "textarea" : "input";
  return (
    <div className="relative">
      <label
        className={`absolute left-0 pointer-events-none transition-all ${
          active ? "top-0 text-xs text-amber-warm" : "top-4 text-base text-muted-foreground"
        }`}
      >
        {label}
      </label>
      <Input
        type={type}
        name={name}
        required
        rows={textarea ? 4 : undefined}
        value={val}
        onChange={(e: any) => setVal(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pt-6 pb-2 bg-transparent border-b border-border focus:outline-none focus:border-amber-warm transition-colors resize-none"
      />
    </div>
  );
}

/* ---------- FOOTER ---------- */
export function Footer() {
  return (
    <footer className="bg-black text-white/70 py-14 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <img src={logoWhite} alt="LF Business Consulting & Marketing" className="h-12 sm:h-14 w-auto logo-on-dark" />
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-white transition-colors">
              {n.label}
            </Link>
          ))}
        </div>
        <div className="text-xs uppercase tracking-[0.2em]">
          © {new Date().getFullYear()}, Teufen, Schweiz
        </div>
      </div>
    </footer>
  );
}
