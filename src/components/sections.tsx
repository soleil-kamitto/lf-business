import { Link, useLocation } from "@tanstack/react-router";
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
import logoFullWhite from "@/assets/logo-full-white.png";
import logoFullDark from "@/assets/logo-full-dark.png";
import lizaEscribiendo from "@/assets/liza/liza_escribiendo.jpg";
import videoAi from "@/assets/video-ai.mp4";
// The hero plays this purely as a darkened background loop, so it is encoded
// small (720p, no audio): it loads for every visitor and bandwidth is the
// tightest budget on the plan. The full-quality file above is only fetched when
// someone actually presses play further down the page.
import videoAiHero from "@/assets/video-ai-hero.mp4";
import marcasDoTempoImg from "@/assets/brands/marcas-do-tempo.jpeg";
import miniMintweltImg from "@/assets/brands/minimintwelt.jpeg";
import puraVidaImg from "@/assets/brands/pura-vida.jpeg";
import teufenImg from "@/assets/brands/teufen.jpeg";
import type { SiteContent } from "@/lib/content";
import { Highlight } from "@/lib/highlight";

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
  const { pathname } = useLocation();
  const onDark = pathname === "/" && !scrolled;
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
        <Link to="/" className="relative block h-11 sm:h-14 w-[260px] sm:w-[320px] shrink-0 hover:scale-[1.04] transition-transform" aria-label="LF Business Consulting & Marketing">
          <img src={logoFullDark} alt="LF Business Consulting & Marketing" className="absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-500" style={{ opacity: onDark ? 0 : 1 }} />
          <img src={logoFullWhite} alt="" aria-hidden className="absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-500" style={{ opacity: onDark ? 1 : 0 }} />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: onDark ? "text-white font-semibold" : "text-foreground font-semibold" }}
              inactiveProps={{ className: onDark ? "text-white/75" : "text-foreground/70" }}
              className={`relative text-sm transition-colors group ${onDark ? "hover:text-white" : "hover:text-foreground"}`}
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
            className={`absolute h-0.5 w-6 transition-colors duration-500 ${onDark ? "bg-white" : "bg-foreground"}`}
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className={`absolute h-0.5 w-6 transition-colors duration-500 ${onDark ? "bg-white" : "bg-foreground"}`}
          />
          <motion.span
            animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
            className={`absolute h-0.5 w-6 transition-colors duration-500 ${onDark ? "bg-white" : "bg-foreground"}`}
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
export function Hero({ content }: { content: SiteContent["hero"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const words = content.title.split(" ");
  const highlight = ["vor,", "inspirieren", "gestalten"];

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
    >
      <video
        src={videoAiHero}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />
      <div
        className="absolute inset-0 mix-blend-overlay opacity-60"
        style={{ background: "radial-gradient(circle at 25% 20%, oklch(0.7 0.17 50 / 0.5), transparent 55%)" }}
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 w-full"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-md text-xs uppercase tracking-[0.2em] text-white/90 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-warm animate-pulse" />
            {content.badge}
          </motion.div>

          <h1 className="font-display font-bold leading-[1.05] text-4xl sm:text-6xl lg:text-8xl max-w-5xl text-white">
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
            className="mt-8 max-w-xl text-white/75 text-lg"
          >
            {content.subtitle}
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
            <MagneticButton href="/leistungen" onDark>Beratung entdecken</MagneticButton>
            <span className="inline-flex items-center gap-2 text-sm text-white/75 self-center">
              <span className="text-amber-warm font-bold">✓</span> Kostenlose Erstberatung
            </span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs uppercase tracking-[0.3em] hidden lg:flex flex-col items-center gap-3"
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

export function MagneticButton({
  href,
  children,
  primary,
  onDark,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
  onDark?: boolean;
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
          : onDark
            ? "border border-white/30 text-white hover:border-white"
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
export function About({ content }: { content: SiteContent["about"] }) {
  return (
    <section id="about" className="py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-5">
          <SectionLabel>Über uns</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-display font-bold leading-tight">
            <Highlight text={content.heading} />
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-7 text-muted-foreground text-lg leading-relaxed space-y-5">
          <p>{content.paragraph1}</p>
          <p>{content.paragraph2}</p>
          <div className="grid grid-cols-3 gap-6 pt-6">
            {(content.counters || []).map((c, i) => (
              <Counter key={i} to={c.value} suffix={c.suffix} label={c.label} />
            ))}
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
export function LizaPortrait({ src }: { src?: string | null }) {
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
          src={src || lizaEscribiendo}
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

// Clearing every field of a card in /admin is how Liza deletes it. Without this
// the emptied card still renders as a blank box.
export const filled = <T extends object>(items: T[] = []) =>
  items.filter((it) => Object.values(it).some((v) => typeof v === "string" && v.trim() !== ""));

export function Liza({ content, portraitSrc }: { content: SiteContent["liza"]; portraitSrc?: string | null }) {
  const expertise = filled(content.expertise);
  const journey = filled(content.journey);
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
                {content.subheading}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 text-muted-foreground text-lg leading-relaxed">{content.bio1}</p>
              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">{content.bio2}</p>
            </Reveal>
            <div className="mt-10 space-y-0">
              {journey.map((j, i) => (
                <Reveal key={j.year} delay={0.2 + i * 0.12}>
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
                    <div className="font-display font-bold text-lg">{j.year}</div>
                    <p className="text-sm text-muted-foreground mt-1">{j.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.2}>
              <LizaPortrait src={portraitSrc} />
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {expertise.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.1} className="h-full">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="relative h-full p-7 rounded-2xl bg-card border border-border hover:border-amber-warm/50 shadow-sm hover:shadow-2xl hover:shadow-amber-warm/15 transition-[border-color,box-shadow] duration-500 group overflow-hidden"
              >
                <div className="shine-sweep rounded-2xl" />
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-warm to-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                <h3 className="font-display font-semibold text-xl mb-3">{e.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{e.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONSULTORIAS ---------- */
const CONSULTORIAS_IMAGES = [gruenderImg, kleinunternehmenImg];

export function Consultorias({
  content,
  heading,
  images,
}: {
  content: SiteContent["consultorias"];
  heading?: string;
  images?: (string | null)[];
}) {
  const items = filled(content).map((it, i) => ({ ...it, img: images?.[i] || CONSULTORIAS_IMAGES[i] }));
  return (
    <section id="consultorias" className="py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel>Beratung</SectionLabel>
          <h2 className="text-4xl sm:text-6xl font-display font-bold"><Highlight text={heading || "Wir begleiten jede Phase."} /></h2>
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
export function Neuromarketing({ image, content }: { image?: string | null; content?: SiteContent["neuroContent"] }) {
  const cards = content?.cards || [
    { title: "Social Media", text: "Erkennen Sie Ihr Kundenprofil und entdecken Sie, wie man in sozialen Netzwerken verkauft." },
    { title: "Design", text: "Gestalten Sie wie eine Fachperson. Nutzen Sie Neuromarketing, das Blicke einfängt und Verkäufe abschliesst." },
    { title: "Kommunikation", text: "Kommunizieren Sie empathisch und überzeugend, um Menschen wirklich zu erreichen." },
    { title: "Marketing", text: "Erkennen Sie die digitalen und klassischen Strategien, die Ihre Marke zum Erfolg führen." },
  ];
  return (
    <section id="neuromarketing" className="relative py-32 px-6 bg-background overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <Reveal>
            <SectionLabel>Neuromarketing</SectionLabel>
            <h2 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
              <Highlight text={content?.heading || "Wie *Neurowissenschaft* und Design Konsumenten beeinflussen."} />
            </h2>
            <p className="mt-6 text-muted-foreground text-lg max-w-lg">
              {content?.description || "Steigern Sie die Bindung Ihrer Marke mit Techniken, die emotional und kognitiv verbinden."}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Card3D>
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-border shadow-2xl shadow-amber-warm/10 group">
                <motion.img
                  src={image || neuroImg}
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
          {filled(cards).map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
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
                <h3 className="font-display font-semibold text-xl mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICE CARDS (shared home + leistungen) ---------- */
export function ServiceCards({ services }: { services: SiteContent["servicios"]["services"] }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {filled(services).map((it, i) => (
        <Reveal key={it.title} delay={i * 0.1}>
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
              <h3 className="text-2xl font-display font-bold mb-2 capitalize">{it.title}</h3>
              <p className="text-muted-foreground text-sm">{it.text}</p>
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
export function LeistungenTeaser({ services, content }: { services: SiteContent["servicios"]["services"]; content?: SiteContent["leistungenTeaser"] }) {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 mb-16 items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>Leistungen</SectionLabel>
            <h2 className="text-4xl sm:text-6xl font-display font-bold"><Highlight text={content?.heading || "Alles, was Ihre Marke braucht."} /></h2>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-5 text-muted-foreground text-lg">
            {content?.description || "Von digitalem Marketing bis Geschäftsstrategie: integrierte Lösungen für nachhaltiges Wachstum."}
          </Reveal>
        </div>

        <ServiceCards services={services} />

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
export function Servicios({ content, bannerImage }: { content: SiteContent["servicios"]; bannerImage?: string | null }) {
  return (
    <section id="servicios" className="py-32 px-6 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 mb-16 items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>Leistungen</SectionLabel>
            <h2 className="text-4xl sm:text-6xl font-display font-bold"><Highlight text={content.heading} /></h2>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-5 text-muted-foreground text-lg">
            {content.subheading}
          </Reveal>
        </div>

        <div className="mb-16">
          <ServiceCards services={content.services} />
        </div>

        <div className="mb-16">
          <Reveal className="mb-10">
            <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-amber-warm font-medium mb-3">
              <span className="w-8 h-px bg-amber-warm" />
              Spezialgebiete
            </div>
            <h3 className="text-2xl sm:text-4xl font-display font-bold"><Highlight text={content.spezialHeading || "Beratung, die über Marketing hinausgeht."} /></h3>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filled(content.spezial).map((it, i) => (
              <Reveal key={it.title} delay={i * 0.1} className="h-full">
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
                  <h4 className="font-display font-semibold text-lg mb-2">{it.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{it.text}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="relative rounded-3xl overflow-hidden">
            <img src={bannerImage || servicesImg} alt="" loading="lazy" width={1400} height={1200} className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative min-h-72 bg-gradient-to-r from-black/75 via-black/40 to-transparent flex items-center px-6 sm:px-10 py-10">
              <div className="text-white max-w-xl">
                <h3 className="text-3xl font-display font-bold mb-3">{content.bannerHeading || "Bereit zu wachsen?"}</h3>
                <p className="text-white/80 mb-6">{content.bannerText || "Erzählen Sie uns von Ihrem Projekt. Wir entwickeln gemeinsam die passende Strategie."}</p>
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
export function KiSoftware({ content }: { content?: SiteContent["kiContent"] }) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <section id="ki-software" className="py-32 px-6 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <SectionLabel>KI & Software</SectionLabel>
          <h2 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
            <Highlight text={content?.heading || "Die *digitale Zukunft* für Unternehmen im Appenzellerland."} />
          </h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">
            {content?.description || "Wir bringen künstliche Intelligenz und moderne Software zu Unternehmen in Appenzell und der Ostschweiz. Sehen Sie im Video, wie wir Ideen mit Technologie verbinden."}
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
export function Branding({ content }: { content: SiteContent["branding"] }) {
  return (
    <section id="branding" className="py-32 px-6 bg-cream relative overflow-hidden">
      <div className="relative max-w-5xl mx-auto text-center">
        <Reveal>
          <SectionLabel>Branding</SectionLabel>
          <h2 className="text-4xl sm:text-7xl font-display font-bold leading-[1.05] mb-10">
            <Highlight text={content.heading || "Wir gestalten nicht nur Anzeigen. Wir bauen *Marken mit Seele*."} />
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">{content.paragraph}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- CLIENTES ---------- */
export function Clientes({ heading }: { heading?: string }) {
  const brands = [
    {
      key: "minimint",
      bg: "#f4f4f6",
      el: <img src={miniMintweltImg} alt="miniMINTwelt" className="w-full h-full object-cover" />,
    },
    {
      key: "marcas",
      bg: "#dcae83",
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
  const row = [...brands, ...brands, ...brands];
  return (
    <section id="clientes" className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <Reveal>
          <SectionLabel>Kunden & Partner</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-display font-bold"><Highlight text={heading || "Marken, die uns bereits vertrauen."} /></h2>
        </Reveal>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
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
export function KontaktCTA({ content }: { content?: SiteContent["kontaktCta"] }) {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-warm via-gold to-amber-warm animated-gradient" />
      <div className="relative max-w-4xl mx-auto text-center text-black">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.35em] font-medium mb-6 text-black/70">
            {content?.label || "Bereit für den nächsten Schritt?"}
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] mb-10">
            {content?.heading || "Lassen Sie uns über Ihr Unternehmen sprechen."}
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
export function Contacto({ content, heading }: { content: SiteContent["contact"]; heading?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok">("idle");
  return (
    <section id="contacto" className="pt-44 pb-32 px-6 bg-secondary/40">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        <Reveal>
          <SectionLabel>Kontakt</SectionLabel>
          <h1 className="text-4xl sm:text-6xl font-display font-bold leading-tight mb-8">
            <Highlight text={heading || "Sprechen wir über Ihren *nächsten Schritt*."} />
          </h1>
          <div className="space-y-5 text-muted-foreground">
            <ContactRow icon="📍" label={content.address} />
            <ContactRow icon="✉" label={content.email} href={`mailto:${content.email}`} />
            <ContactRow icon="☎" label={content.phone} href={`tel:${content.phone.replace(/\s+/g, "")}`} />
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
        <img src={logoFullWhite} alt="LF Business Consulting & Marketing" className="h-12 sm:h-14 w-auto logo-on-dark" />
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
