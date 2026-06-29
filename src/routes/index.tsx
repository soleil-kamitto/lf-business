import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
import heroImg from "@/assets/hero.jpg";
import madresImg from "@/assets/madres.jpg";
import pequenosImg from "@/assets/pequenos.jpg";
import neuroImg from "@/assets/neuro.jpg";
import servicesImg from "@/assets/services.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LF Marketing & Business Consulting | Beratung für Unternehmer" },
      { name: "description", content: "Kostenlose Beratung für Unternehmerinnen und kleine Unternehmen: Kundenservice, digitales Marketing, Branding und Neuromarketing. Aus Teufen, Schweiz." },
      { property: "og:title", content: "LF Marketing & Business Consulting" },
      { property: "og:description", content: "Gemeinsam stellen wir uns Ihr Unternehmen vor, inspirieren und gestalten es neu." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const NAV = [
  { label: "Start", href: "#inicio" },
  { label: "Über uns", href: "#about" },
  { label: "Beratung", href: "#consultorias" },
  { label: "Neuromarketing", href: "#neuromarketing" },
  { label: "Leistungen", href: "#servicios" },
  { label: "Branding", href: "#branding" },
  { label: "Kunden", href: "#clientes" },
  { label: "Kontakt", href: "#contacto" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <CursorFollower />
      <Navbar />
      <Hero />
      <About />
      <Consultorias />
      <Marquee />
      <Neuromarketing />
      <Servicios />
      <Branding />
      <Clientes />
      <Contacto />
      <Footer />
    </div>
  );
}

/* ---------- SCROLL PROGRESS BAR ---------- */
function ScrollProgress() {
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
function CursorFollower() {
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
function Navbar() {
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
        <motion.a
          href="#inicio"
          whileHover={{ scale: 1.04, rotate: -2 }}
          className="flex items-center gap-2 font-display font-bold tracking-tight"
        >
          <span className="grid place-items-center w-9 h-9 rounded-md bg-foreground text-background text-sm">LF</span>
          <span className="text-sm sm:text-base">LF Business Consulting</span>
        </motion.a>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="relative text-sm text-foreground/80 hover:text-foreground transition-colors group"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-amber-warm group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        <a
          href="#contacto"
          className="hidden lg:inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium hover:bg-amber-warm transition-colors"
        >
          Gespräch starten →
        </a>

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
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 220, damping: 22 }}
                  className="text-foreground/90 text-lg"
                >
                  {n.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 80, damping: 20 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 80, damping: 20 });

  const phrase = "Gemeinsam stellen wir uns Ihr Unternehmen vor, inspirieren und gestalten es neu";
  const words = phrase.split(" ");
  const highlight = ["vor,", "inspirieren", "gestalten"];

  return (
    <section
      id="inicio"
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={heroImg} alt="" className="w-full h-full object-cover opacity-70" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />
      </motion.div>

      {/* floating shapes */}
      <motion.div
        style={{ x: useTransform(mx, [-0.5, 0.5], [-30, 30]), y: useTransform(my, [-0.5, 0.5], [-20, 20]) }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-[18%] left-[8%] w-40 h-40 rounded-full bg-amber-warm/20 blur-3xl float-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-56 h-56 rounded-full bg-gold/20 blur-3xl float-slow" style={{ animationDelay: "-4s" }} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-1/4 w-24 h-24 border border-gold/30 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-1/3 w-16 h-16 border border-amber-warm/40 rounded-full"
        />
      </motion.div>

      <motion.div
        style={{ opacity, rotateX: tiltX, rotateY: tiltY, transformPerspective: 1400 }}
        className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-white"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-xs uppercase tracking-[0.2em] mb-8 backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-warm animate-pulse" />
          Teufen · Schweiz
        </motion.div>

        <h1 className="font-display font-bold leading-[1.05] text-5xl sm:text-7xl lg:text-8xl max-w-5xl">
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
          className="mt-8 max-w-xl text-white/70 text-lg"
        >
          Kostenlose Beratung für Unternehmer. Kundenservice, digitales Marketing,
          Branding und Neuromarketing — damit sich Ihr Unternehmen wirklich abhebt.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.85, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton href="#contacto" primary>
            Jetzt starten
          </MagneticButton>
          <MagneticButton href="#consultorias">Beratung entdecken</MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-3"
      >
        Scrollen
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="block w-px h-10 bg-white/40"
        />
      </motion.div>
    </section>
  );
}

function MagneticButton({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
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
          ? "bg-amber-warm text-black shadow-[0_0_40px_-10px_oklch(0.7_0.17_50)] hover:shadow-[0_0_60px_-5px_oklch(0.7_0.17_50)]"
          : "border border-white/30 text-white hover:border-white"
      } transition-shadow`}
    >
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
    </motion.a>
  );
}

/* ---------- Section helper ---------- */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-amber-warm font-medium mb-6">
      <span className="w-8 h-px bg-amber-warm" />
      {children}
    </div>
  );
}

/* ---------- ABOUT ---------- */
function About() {
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
            Unternehmen, ihren Kundenservice zu verbessern und sich auf dem Markt zu differenzieren.
          </p>
          <p>
            Wir verbinden strategische Beratung, digitales Marketing, Branding und Neuromarketing, um Unternehmen
            mit eigener Identität, menschlichem Fokus und messbaren Resultaten aufzubauen.
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
function Counter({ to, suffix = "", label }: { to: number; suffix?: string; label: string }) {
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

/* ---------- CONSULTORIAS ---------- */
function Consultorias() {
  const items = [
    {
      title: "Unternehmerinnen & Mütter",
      phrase: "Unternehmen aufbauen muss kein einsamer Weg sein — und Mutter zu sein ist kein Hindernis.",
      img: madresImg,
    },
    {
      title: "Kleine Unternehmen",
      phrase: "Ein erfolgreiches Geschäft entsteht aus Tagen voller Arbeit, Leidenschaft und Hingabe.",
      img: pequenosImg,
    },
  ];
  return (
    <section id="consultorias" className="py-32 px-6 bg-secondary/40">
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
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-[1.2s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <div className="text-xs uppercase tracking-[0.3em] text-amber-warm mb-3">0{i + 1}</div>
                    <h3 className="text-3xl sm:text-4xl font-display font-bold mb-3">{it.title}</h3>
                    <p className="text-white/80 max-w-md mb-6">{it.phrase}</p>
                    <a href="#contacto" className="inline-flex items-center gap-2 text-sm font-medium border-b border-amber-warm pb-1 self-start group-hover:gap-4 transition-all">
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

function Card3D({ children }: { children: React.ReactNode }) {
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
function Marquee() {
  const words = ["Strategie", "•", "Branding", "•", "Neuromarketing", "•", "Design", "•", "Werbung", "•", "Wachstum", "•"];
  const row = [...words, ...words, ...words];
  return (
    <section className="py-12 bg-black text-white overflow-hidden border-y border-white/10">
      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        className="flex gap-10 w-max whitespace-nowrap font-display text-5xl sm:text-7xl font-bold tracking-tight"
      >
        {row.map((w, i) => (
          <span key={i} className={i % 2 === 0 ? "text-gradient-warm" : "text-white/20"}>
            {w}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------- NEUROMARKETING ---------- */
function Neuromarketing() {
  const cursos = [
    { t: "Social Media", d: "Erkennen Sie Ihr Kundenprofil und entdecken Sie, wie man in sozialen Netzwerken verkauft." },
    { t: "Design", d: "Gestalten Sie wie ein Profi — mit Neuromarketing, das Blicke einfängt und Verkäufe abschliesst." },
    { t: "Kommunikation", d: "Kommunizieren Sie empathisch und überzeugend, um Menschen wirklich zu erreichen." },
    { t: "Marketing", d: "Identifizieren Sie die Online- und Offline-Strategien, die Ihre Marke zum Erfolg führen." },
  ];
  return (
    <section id="neuromarketing" className="relative py-32 px-6 bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30 animated-gradient" style={{ background: "radial-gradient(circle at 20% 20%, oklch(0.7 0.17 50 / 0.4), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.82 0.15 75 / 0.3), transparent 50%)" }} />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <Reveal>
            <SectionLabel>Neuromarketing</SectionLabel>
            <h2 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
              Wie <span className="text-gradient-warm">Neurowissenschaft</span> und Design Konsumenten beeinflussen.
            </h2>
            <p className="mt-6 text-white/70 text-lg max-w-lg">
              Steigern Sie die Bindung Ihrer Marke mit Techniken, die emotional und kognitiv verbinden.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Card3D>
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10">
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
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-amber-warm/10" />
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
                className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-warm/50 transition-colors group"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="w-10 h-10 rounded-lg grid place-items-center bg-amber-warm/20 text-amber-warm font-display font-bold mb-4"
                >
                  0{i + 1}
                </motion.div>
                <h3 className="font-display font-semibold text-xl mb-2">{c.t}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{c.d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICIOS ---------- */
function Servicios() {
  const s = [
    { t: "Digitales Marketing", d: "Datengetriebene Strategien, um Kunden zu gewinnen und zu überzeugen." },
    { t: "Design", d: "Visuelle Identität mit Zweck und Emotion." },
    { t: "Werbung", d: "Kampagnen, die Aufmerksamkeit in Kunden verwandeln." },
  ];
  return (
    <section id="servicios" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 mb-16 items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>Marketing-Leistungen</SectionLabel>
            <h2 className="text-4xl sm:text-6xl font-display font-bold">Alles, was Ihre Marke braucht — an einem Ort.</h2>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-5 text-muted-foreground text-lg">
            Integrierte Lösungen für Wachstum mit Identität, Klarheit und nachhaltigen Resultaten.
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {s.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -12, rotateX: 3 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                className="relative h-72 p-7 rounded-2xl bg-card border border-border overflow-hidden group hover:shadow-2xl hover:shadow-amber-warm/10 transition-shadow"
              >
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

        <Reveal>
          <div className="relative h-72 rounded-3xl overflow-hidden">
            <img src={servicesImg} alt="" loading="lazy" width={1400} height={1200} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center px-10">
              <div className="text-white max-w-xl">
                <h3 className="text-3xl font-display font-bold mb-3">Bereit zu wachsen?</h3>
                <p className="text-white/80 mb-6">Erzählen Sie uns von Ihrem Projekt — wir entwickeln gemeinsam die Strategie.</p>
                <MagneticButton href="#contacto" primary>Beratung anfragen</MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- BRANDING ---------- */
function Branding() {
  return (
    <section id="branding" className="py-32 px-6 bg-foreground text-background relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-amber-warm/10 blur-3xl float-slow" />
      <div className="absolute -bottom-20 -right-20 w-[28rem] h-[28rem] rounded-full bg-gold/10 blur-3xl float-slow" style={{ animationDelay: "-5s" }} />
      <div className="relative max-w-5xl mx-auto text-center">
        <Reveal>
          <SectionLabel>Branding</SectionLabel>
          <h2 className="text-4xl sm:text-7xl font-display font-bold leading-[1.05] mb-10">
            Wir gestalten nicht nur Anzeigen. Wir bauen <span className="text-gradient-warm">Marken mit Seele</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-background/70 text-lg leading-relaxed max-w-3xl mx-auto">
            Wir analysieren Ihr Unternehmen als Ganzes: was Ihre Zielgruppe braucht, aktuelle Trends und wohin
            Sie sich entwickeln möchten. Wir stellen das passende Paket zusammen — Content-Erstellung (Text, Bild
            und Video), Kampagnen-Management und Community-Management.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- CLIENTES ---------- */
function Clientes() {
  const logos = ["Anabe", "Veterinaria", "Rojo & Negro", "Studio LF", "Marca 5", "Marca 6", "Marca 7", "Marca 8"];
  const row = [...logos, ...logos];
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
          {row.map((l, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="h-28 w-56 shrink-0 rounded-2xl border border-border bg-card grid place-items-center font-display font-semibold text-xl text-muted-foreground hover:text-foreground hover:border-amber-warm hover:scale-105 transition-all"
            >
              {l}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- CONTACTO ---------- */
function Contacto() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok">("idle");
  return (
    <section id="contacto" className="py-32 px-6 bg-secondary/40">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        <Reveal>
          <SectionLabel>Kontakt</SectionLabel>
          <h2 className="text-4xl sm:text-6xl font-display font-bold leading-tight mb-8">
            Sprechen wir über Ihren <span className="text-gradient-warm">nächsten Schritt</span>.
          </h2>
          <div className="space-y-5 text-muted-foreground">
            <ContactRow icon="📍" label="Gfell 1002, 9053 Teufen · Schweiz" />
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
            <Field label="E-Mail" name="email" type="email" />
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
function Footer() {
  return (
    <footer className="bg-black text-white/70 py-14 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-9 h-9 rounded-md bg-amber-warm text-black text-sm font-bold">LF</span>
          <span className="font-display">LF Marketing & Business Consulting</span>
        </div>
        <div className="text-xs uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} · Teufen, Schweiz
        </div>
      </div>
    </footer>
  );
}
