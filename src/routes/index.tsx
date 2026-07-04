import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf,
  Camera,
  Bot,
  CloudSun,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Languages,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";
import farmerPhone from "@/assets/farmer-phone.jpg";
import logo from "@/assets/krishi-logo.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Showcase />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-4 inset-x-4 z-50 flex justify-center pointer-events-none">
      <div className="glass shadow-soft pointer-events-auto flex items-center gap-6 rounded-full px-4 py-2 max-w-5xl w-full">
        <Link to="/" className="flex items-center gap-2 pr-2">
          <img src={logo} alt="KrishiAI" className="w-8 h-8" />
          <span className="font-display font-bold text-lg">KrishiAI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground ml-4">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/auth"
            className="text-sm font-medium px-3 py-1.5 rounded-full hover:bg-muted"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className="text-sm font-medium px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 shadow-glow"
          >
            Try KrishiAI
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroFarm}
          alt=""
          className="w-full h-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
      </div>

      {/* Floating leaves */}
      <Leaf
        className="absolute top-32 right-20 w-10 h-10 text-primary/40 animate-floaty"
        strokeWidth={1.2}
      />
      <Leaf
        className="absolute bottom-40 left-20 w-14 h-14 text-primary-glow/50 animate-floaty"
        style={{ animationDelay: "1.5s" }}
        strokeWidth={1}
      />
      <Sparkles
        className="absolute top-1/3 left-1/3 w-6 h-6 text-sun animate-floaty"
        style={{ animationDelay: "2.5s" }}
      />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI-powered • RAG • Computer Vision
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05]">
            Your intelligent
            <br />
            <span className="text-gradient">farming companion</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Detect crop diseases instantly, chat with an AI agronomist in your language,
            forecast yield, plan fertilizer, and track markets — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth">
              <Button size="lg" className="rounded-full shadow-glow px-7 h-12 text-base gap-2">
                <Camera className="w-4 h-4" /> Try AI Diagnosis
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-7 h-12 text-base gap-2 backdrop-blur-md"
              >
                <Bot className="w-4 h-4" /> Ask the AI
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Stat label="Farmers helped" value="12K+" />
            <Stat label="Diseases detected" value="98%" />
            <Stat label="Languages" value="8+" />
          </div>
        </div>

        <div className="hidden lg:flex justify-end">
          <div className="relative">
            <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative glass rounded-3xl p-3 shadow-glow rotate-2">
              <img
                src={farmerPhone}
                alt="Farmer scanning crop with KrishiAI"
                className="rounded-2xl w-[380px] object-cover"
                width={1024}
                height={1024}
              />
            </div>
            <div className="absolute -bottom-6 -left-8 glass rounded-2xl p-4 shadow-card -rotate-6 animate-floaty">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Detected</div>
                  <div className="font-semibold text-sm">Early Blight · 96%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChevronDown className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-6 text-muted-foreground animate-bounce" />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display font-bold text-2xl text-foreground">{value}</div>
      <div className="text-xs uppercase tracking-wider">{label}</div>
    </div>
  );
}

const FEATURES = [
  {
    icon: Camera,
    title: "Disease Detection",
    desc: "Snap a leaf. Our CNN + Gemini vision agent spots blight, rust, mildew and more in seconds.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Bot,
    title: "AI Farmer Chat",
    desc: "A ChatGPT-style assistant grounded in agricultural knowledge and government schemes.",
    color: "from-sky/30 to-sky/5",
  },
  {
    icon: CloudSun,
    title: "Weather Intelligence",
    desc: "7-day forecast plus AI recommendations on when to spray, sow, or harvest.",
    color: "from-sun/30 to-sun/5",
  },
  {
    icon: TrendingUp,
    title: "Yield Prediction",
    desc: "ML models estimate tonnage and profit from soil, rainfall, and area inputs.",
    color: "from-earth/25 to-earth/5",
  },
  {
    icon: Leaf,
    title: "Fertilizer Planner",
    desc: "Personalized NPK schedules with organic alternatives and cost estimates.",
    color: "from-primary-glow/30 to-primary-glow/5",
  },
  {
    icon: Languages,
    title: "Speaks Your Language",
    desc: "English, Hindi, Punjabi, Tamil, Marathi, Bhojpuri and more — voice or text.",
    color: "from-accent to-accent/20",
  },
];

function Features() {
  return (
    <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="max-w-2xl mb-16">
        <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
          Everything you need
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold">
          One assistant. <span className="text-gradient">Every farming decision.</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className={`group rounded-3xl p-8 bg-gradient-to-br ${f.color} border border-border/50 shadow-soft hover:shadow-card transition-all hover:-translate-y-1 duration-300`}
          >
            <div className="w-12 h-12 rounded-2xl bg-background/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Snap or Ask", d: "Upload a crop photo or type your question in any language." },
    { n: "02", t: "Agents Collaborate", d: "Vision, Disease, Weather, Knowledge & Market agents analyze in parallel." },
    { n: "03", t: "Get a Plan", d: "Receive a clear diagnosis, treatment, and next-step recommendation." },
  ];
  return (
    <section id="how" className="py-32 px-6 bg-gradient-to-b from-transparent via-secondary/30 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
            How it works
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            From leaf to action in <span className="text-gradient">under 10 seconds</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="text-7xl font-display font-bold text-primary/20">{s.n}</div>
              <h3 className="text-2xl font-display font-bold mt-4">{s.t}</h3>
              <p className="text-muted-foreground mt-2">{s.d}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-8 -right-6 w-6 h-6 text-primary/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="rounded-[2.5rem] overflow-hidden relative shadow-glow" style={{ background: "var(--gradient-hero)" }}>
        <div className="grid lg:grid-cols-2 items-center gap-8 p-10 md:p-16">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              A premium dashboard,
              <br /> built for the field.
            </h2>
            <p className="mt-4 text-white/80 text-lg max-w-md">
              Beautiful cards, animated weather, live disease scans and voice-first chat — a
              product farmers actually want to open every morning.
            </p>
            <Link to="/auth">
              <Button
                size="lg"
                variant="secondary"
                className="mt-8 rounded-full h-12 px-7 gap-2 bg-white text-primary hover:bg-white/90"
              >
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { i: Camera, l: "Disease Scan", v: "96% conf." },
              { i: CloudSun, l: "Weather", v: "28°C" },
              { i: TrendingUp, l: "Yield", v: "4.6 t" },
              { i: Leaf, l: "Fertilizer", v: "NPK 20-20" },
            ].map((c) => (
              <div key={c.l} className="glass-dark rounded-2xl p-5 text-white">
                <c.i className="w-6 h-6 mb-3" />
                <div className="text-xs opacity-80">{c.l}</div>
                <div className="font-display font-bold text-2xl">{c.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { n: "Amit Sharma", l: "Wheat farmer, Punjab", q: "Saved my crop from rust — the AI spotted it before I even could." },
  { n: "Lakshmi Devi", l: "Paddy farmer, Tamil Nadu", q: "The Tamil voice chat feels like talking to our village agronomist." },
  { n: "Ravi Patil", l: "Tomato grower, Maharashtra", q: "The fertilizer plan cut my costs by 22% this season." },
];

function Testimonials() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="max-w-2xl mb-16">
        <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
          Loved by farmers
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold">
          Trusted across <span className="text-gradient">Indian farms</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div key={t.n} className="rounded-3xl p-8 bg-card border shadow-soft">
            <div className="text-5xl text-primary/30 font-display">"</div>
            <p className="text-lg leading-relaxed -mt-4">{t.q}</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary">
                {t.n[0]}
              </div>
              <div>
                <div className="font-semibold text-sm">{t.n}</div>
                <div className="text-xs text-muted-foreground">{t.l}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Is KrishiAI free to use?", a: "Yes — core features including disease detection and AI chat are free for individual farmers." },
    { q: "Which languages are supported?", a: "English, Hindi, Punjabi, Marathi, Tamil, Telugu, Bhojpuri and more via speech and text." },
    { q: "How accurate is the disease detection?", a: "Our vision agent combines a CNN classifier with a Gemini-based verifier — averaging 96% accuracy on 40+ common Indian crop diseases." },
    { q: "Does it work offline?", a: "Cached recommendations are available offline; live AI features need connectivity." },
    { q: "Is my data private?", a: "Your images and reports are private to you. We never sell farmer data." },
  ];
  return (
    <section id="faq" className="py-32 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
          FAQ
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold">
          Questions, <span className="text-gradient">answered</span>
        </h2>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {items.map((i, idx) => (
          <AccordionItem
            key={idx}
            value={`i-${idx}`}
            className="rounded-2xl border bg-card px-6 shadow-soft"
          >
            <AccordionTrigger className="text-left font-semibold hover:no-underline">
              {i.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{i.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-transparent to-secondary/30">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="KrishiAI" className="w-8 h-8" />
          <div>
            <div className="font-display font-bold">KrishiAI</div>
            <div className="text-xs text-muted-foreground">
              Your intelligent farming companion, anytime, anywhere.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Data private
          </span>
          <span>© {new Date().getFullYear()} KrishiAI</span>
        </div>
      </div>
    </footer>
  );
}
