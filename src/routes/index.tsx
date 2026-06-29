import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import heroImg from "@/assets/hero.jpg";
import madresImg from "@/assets/madres.jpg";
import pequenosImg from "@/assets/pequenos.jpg";
import neuroImg from "@/assets/neuro.jpg";
import servicesImg from "@/assets/services.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LF Marketing & Business Consulting | Consultoría para emprendedores" },
      { name: "description", content: "Mejoramos los servicios de empresas y emprendedores con consultoría, marketing digital, branding y neuromarketing. Desde Teufen, Suiza." },
      { property: "og:title", content: "LF Marketing & Business Consulting" },
      { property: "og:description", content: "Juntos podemos imaginar, inspirar y transformar su negocio." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const NAV = [
  { label: "Inicio", href: "#inicio" },
  { label: "Quiénes Somos", href: "#about" },
  { label: "Consultoría", href: "#consultorias" },
  { label: "Neuromarketing", href: "#neuromarketing" },
  { label: "Servicios", href: "#servicios" },
  { label: "Branding", href: "#branding" },
  { label: "Clientes", href: "#clientes" },
  { label: "Contacto", href: "#contacto" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Consultorias />
      <Neuromarketing />
      <Servicios />
      <Branding />
      <Clientes />
      <Contacto />
      <Footer />
    </div>
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
          Hablemos →
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
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
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

  const phrase = "Juntos podemos imaginar, inspirar y transformar su negocio";
  const words = phrase.split(" ");

  return (
    <section id="inicio" ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-black">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={heroImg} alt="" className="w-full h-full object-cover opacity-70" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />
      </motion.div>

      {/* floating shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[18%] left-[8%] w-40 h-40 rounded-full bg-amber-warm/20 blur-3xl float-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-56 h-56 rounded-full bg-gold/20 blur-3xl float-slow" style={{ animationDelay: "-4s" }} />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-gold/30 rounded-full float-slow" style={{ animationDelay: "-2s" }} />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-xs uppercase tracking-[0.2em] mb-8 backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-warm animate-pulse" />
          Teufen · Suiza
        </motion.div>

        <h1 className="font-display font-bold leading-[1.05] text-5xl sm:text-7xl lg:text-8xl max-w-5xl">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block mr-3 ${
                ["imaginar,", "inspirar", "transformar"].includes(w) ? "text-gradient-warm italic" : ""
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
          Consultoría gratuita para emprendedores. Atención al cliente, marketing digital,
          branding y neuromarketing — para que tu negocio se diferencie de verdad.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.85, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton href="#contacto" primary>
            Empezar ahora
          </MagneticButton>
          <MagneticButton href="#consultorias">Ver consultorías</MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-3"
      >
        Scroll
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
          <SectionLabel>¿Quiénes somos?</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-display font-bold leading-tight">
            Estrategia, diseño y <span className="text-gradient-warm">neurociencia</span> al servicio de tu negocio.
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-7 text-muted-foreground text-lg leading-relaxed space-y-5">
          <p>
            En <strong className="text-foreground">LF Marketing & Business Consulting</strong> ayudamos a
            empresas existentes y futuras a mejorar la atención al cliente y a diferenciarse en el mercado.
          </p>
          <p>
            Combinamos consultoría estratégica, marketing digital, branding y neuromarketing para construir
            negocios con identidad propia, foco humano y resultados medibles.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-6">
            {[
              { n: "10+", l: "Años de experiencia" },
              { n: "60+", l: "Marcas acompañadas" },
              { n: "100%", l: "Foco en personas" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl font-display font-bold text-gradient-warm">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- CONSULTORIAS ---------- */
function Consultorias() {
  const items = [
    {
      title: "Madres Emprendedoras",
      phrase: "Emprender no tiene que ser un camino solitario y ser mamá no es un impedimento.",
      img: madresImg,
    },
    {
      title: "Pequeños Negocios",
      phrase: "Un negocio exitoso son días de trabajo, pasión y sacrificio.",
      img: pequenosImg,
    },
  ];
  return (
    <section id="consultorias" className="py-32 px-6 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel>Consultorías</SectionLabel>
          <h2 className="text-4xl sm:text-6xl font-display font-bold">Acompañamos cada etapa.</h2>
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
                      Conocer más <span>→</span>
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

/* ---------- NEUROMARKETING ---------- */
function Neuromarketing() {
  const cursos = [
    { t: "Redes Sociales", d: "Aprende a identificar tu perfil de cliente y descubre la forma de vender en redes." },
    { t: "Diseño", d: "Diseña como un profesional usando neuromarketing para atraer miradas y cerrar ventas." },
    { t: "Comunicación", d: "Comunica de forma empática y asertiva para influir en las personas." },
    { t: "Marketing", d: "Identifica las estrategias on-line y off-line que llevarán tu marca al éxito." },
  ];
  return (
    <section id="neuromarketing" className="relative py-32 px-6 bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30 animated-gradient" style={{ background: "radial-gradient(circle at 20% 20%, oklch(0.7 0.17 50 / 0.4), transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.82 0.15 75 / 0.3), transparent 50%)" }} />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <Reveal>
            <SectionLabel>Neuromarketing</SectionLabel>
            <h2 className="text-4xl sm:text-6xl font-display font-bold leading-tight">
              Cómo la <span className="text-gradient-warm">neurociencia</span> aliada al diseño influye en los consumidores.
            </h2>
            <p className="mt-6 text-white/70 text-lg max-w-lg">
              Aumenta el enganchamiento de tu marca con técnicas que conectan a nivel emocional y cognitivo.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Card3D>
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10">
                <img src={neuroImg} alt="Neuromarketing" loading="lazy" width={1400} height={1200} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-amber-warm/10" />
              </div>
            </Card3D>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cursos.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8, rotateX: 4 }}
                className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-warm/50 transition-colors group"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="w-10 h-10 rounded-lg grid place-items-center bg-amber-warm/20 text-amber-warm font-display font-bold mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  0{i + 1}
                </div>
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
    { t: "Marketing Digital", d: "Estrategias data-driven para captar y convertir." },
    { t: "Diseño", d: "Identidad visual con propósito y emoción." },
    { t: "Publicidad", d: "Campañas que convierten miradas en clientes." },
  ];
  return (
    <section id="servicios" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 mb-16 items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel>Servicios de Marketing</SectionLabel>
            <h2 className="text-4xl sm:text-6xl font-display font-bold">Todo lo que tu marca necesita, en un solo lugar.</h2>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-5 text-muted-foreground text-lg">
            Soluciones integradas para crecer con identidad, claridad y resultados sostenibles.
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {s.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -10 }}
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
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="relative h-72 rounded-3xl overflow-hidden">
            <img src={servicesImg} alt="" loading="lazy" width={1400} height={1200} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center px-10">
              <div className="text-white max-w-xl">
                <h3 className="text-3xl font-display font-bold mb-3">¿Listo para crecer?</h3>
                <p className="text-white/80 mb-6">Cuéntanos tu proyecto y armemos juntos la estrategia.</p>
                <MagneticButton href="#contacto" primary>Solicitar consultoría</MagneticButton>
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
            No hacemos solo anuncios. Construimos <span className="text-gradient-warm">marcas con alma</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-background/70 text-lg leading-relaxed max-w-3xl mx-auto">
            Analizamos tu empresa en su conjunto: qué necesita tu público, las tendencias actuales y hacia
            dónde quieres evolucionar. Elaboramos el paquete adecuado — creación de contenidos (texto,
            imagen y vídeo), gestión de campañas y community management.
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
          <SectionLabel>Clientes & Partners</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-display font-bold">Marcas que ya confían.</h2>
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
            <div
              key={i}
              className="h-28 w-56 shrink-0 rounded-2xl border border-border bg-card grid place-items-center font-display font-semibold text-xl text-muted-foreground hover:text-foreground hover:border-amber-warm hover:scale-105 transition-all"
            >
              {l}
            </div>
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
          <SectionLabel>Contacto</SectionLabel>
          <h2 className="text-4xl sm:text-6xl font-display font-bold leading-tight mb-8">
            Hablemos de tu <span className="text-gradient-warm">próximo paso</span>.
          </h2>
          <div className="space-y-5 text-muted-foreground">
            <ContactRow icon="📍" label="Gfell 1002, 9053 Teufen · Suiza" />
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
            <Field label="Nombre" name="name" />
            <Field label="Email" name="email" type="email" />
            <Field label="Cuéntanos tu proyecto" name="msg" textarea />
            <button
              type="submit"
              disabled={status !== "idle"}
              className="w-full py-4 rounded-full bg-foreground text-background font-medium relative overflow-hidden hover:bg-amber-warm transition-colors shimmer disabled:opacity-80"
            >
              {status === "idle" && "Enviar mensaje"}
              {status === "loading" && "Enviando..."}
              {status === "ok" && "¡Mensaje enviado ✓"}
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
          © {new Date().getFullYear()} · Teufen, Suiza
        </div>
      </div>
    </footer>
  );
}
