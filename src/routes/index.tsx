import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { IntroOverlay } from "@/components/intro-overlay";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Reveal, SectionHeading } from "@/components/reveal";
import { BookingForm } from "@/components/booking-form";

export const Route = createFileRoute("/")({
  component: Home,
});

const services = [
  { title: "Luxury Weddings", desc: "Timeless ceremonies and receptions curated with singular precision — from silk-draped mandaps to grand ballroom soirées.", icon: "❦" },
  { title: "Corporate Galas", desc: "Executive dinners, brand launches and industry summits engineered for immaculate impression.", icon: "◆" },
  { title: "Private Celebrations", desc: "Milestone birthdays, anniversaries and intimate gatherings, choreographed with quiet elegance.", icon: "❋" },
  { title: "Destination Events", desc: "Coastal villas, mountain châteaux, historic estates — we produce end-to-end worldwide.", icon: "⌘" },
  { title: "Décor & Design", desc: "Custom floral installations, bespoke tablescapes and immersive lighting design.", icon: "❈" },
  { title: "Full-Service Production", desc: "Catering, entertainment, cinematography and guest concierge — held together by one dedicated director.", icon: "✦" },
];

const portfolio = [
  { title: "The Chateaux Wedding", tag: "Wedding · Provence", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" },
  { title: "Aurum Product Launch", tag: "Corporate · New York", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80" },
  { title: "Golden Hour Gala", tag: "Fundraiser · London", img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80" },
  { title: "Solstice Anniversary", tag: "Private · Amalfi", img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80" },
  { title: "Maison Debut", tag: "Brand Launch · Paris", img: "https://images.unsplash.com/photo-1470753937643-efeb931202a9?w=1200&q=80" },
  { title: "Silver Serpent Ball", tag: "Charity · Dubai", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80" },
];

const testimonials = [
  { quote: "The Function Junction produced the most exquisite wedding weekend. Every detail was intentional — every guest felt seen.", author: "Isabella & James M.", role: "Provence, 2025" },
  { quote: "Our launch gala was executed to perfection. Guests still talk about the tablescape.", author: "R. Whitmore", role: "CMO, Aurum Watches" },
  { quote: "Quiet, precise, deeply talented. They deliver luxury without spectacle for its own sake.", author: "Lady C. Ashcroft", role: "Foundation Chair" },
];

const packages = [
  {
    name: "Atelier",
    price: "From $15,000",
    ideal: "Intimate celebrations up to 60 guests",
    features: ["Dedicated planner", "Vendor curation", "Design direction", "Day-of coordination", "Timeline management"],
  },
  {
    name: "Signature",
    price: "From $45,000",
    ideal: "Full-scale weddings & galas",
    features: ["Everything in Atelier", "Bespoke floral & décor", "Full production", "Guest concierge", "Cinematography partner", "Rehearsal management"],
    featured: true,
  },
  {
    name: "Maison",
    price: "By consultation",
    ideal: "Multi-day & destination productions",
    features: ["Everything in Signature", "Multi-day programming", "International logistics", "Custom-built installations", "Private travel coordination", "24/7 concierge"],
  },
];

function Home() {
  return <HydratedHome />;
}

function HydratedHome() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <IntroOverlay />
      <SiteHeader />

      <section id="home" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&q=85"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] tracking-[0.5em] uppercase text-gold mb-6"
          >
            Luxury Event Management
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02] text-foreground"
          >
            Turning Every Celebration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="font-script text-4xl md:text-6xl gold-gradient-text mt-4"
          >
            into an experience
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-12 flex flex-wrap gap-4 justify-center"
          >
            <a
              href="#booking"
              className="border border-gold bg-gold text-primary-foreground px-10 py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-transparent hover:text-gold transition-all"
            >
              Plan Your Event
            </a>
            <a
              href="#portfolio"
              className="border border-foreground/40 px-10 py-4 text-[11px] tracking-[0.3em] uppercase text-foreground hover:border-gold hover:text-gold transition-all"
            >
              View Portfolio
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      <div id="services" className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Signature Services"
          title="Crafted with precision, designed for impact."
          center={false}
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <div className="rounded-none border border-border/70 bg-card/70 p-8 backdrop-blur-sm">
                <p className="text-2xl text-gold">{service.icon}</p>
                <h3 className="mt-4 font-display text-xl text-foreground">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{service.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div id="portfolio" className="border-y border-border/70 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:px-12">
          <SectionHeading
            eyebrow="Portfolio"
            title="A collection of unforgettable settings."
            center={false}
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {portfolio.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div className="group overflow-hidden border border-border/70 bg-background">
                  <img src={item.img} alt={item.title} className="h-60 w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="p-6">
                    <p className="text-[11px] tracking-[0.3em] uppercase text-gold">{item.tag}</p>
                    <h3 className="mt-3 font-display text-xl text-foreground">{item.title}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div id="booking" className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Booking"
          title="Let’s plan something extraordinary."
          center={false}
        />
        <Reveal>
          <BookingForm />
        </Reveal>
      </div>

      <div id="about" className="border-y border-border/70 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:px-12">
          <SectionHeading
            eyebrow="About"
            title="A discreet studio for extraordinary occasions."
            center={false}
          />
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-start">
            <Reveal>
              <p className="text-base md:text-lg leading-8 text-muted-foreground">
                The Function Junction is a luxury event management house crafting weddings, galas, and private celebrations with warmth, precision, and a deeply personal point of view. We orchestrate every part of the experience — from the first concept to the final toast.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-none border border-border/70 bg-background p-8">
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold">Our approach</p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Intimate planning, elevated standards, and a calm hand on every detail.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div id="packages" className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Packages"
          title="Flexible offerings for intimate to grand-scale productions."
          center={false}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((pkg, index) => (
            <Reveal key={pkg.name} delay={index * 0.06}>
              <div className={`rounded-none border p-8 ${pkg.featured ? "border-gold bg-card/80" : "border-border/70 bg-card/40"}`}>
                <p className="text-[11px] tracking-[0.3em] uppercase text-gold">{pkg.name}</p>
                <p className="mt-4 font-display text-3xl text-foreground">{pkg.price}</p>
                <p className="mt-3 text-sm text-muted-foreground">{pkg.ideal}</p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="text-gold">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div id="testimonials" className="border-y border-border/70 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:px-12">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by clients who value calm, precision, and beauty."
            center={false}
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <Reveal key={item.author} delay={index * 0.06}>
                <div className="rounded-none border border-border/70 bg-background p-8">
                  <p className="text-base leading-8 text-muted-foreground">“{item.quote}”</p>
                  <div className="mt-6">
                    <p className="font-display text-lg text-foreground">{item.author}</p>
                    <p className="text-sm text-gold">{item.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div id="contact" className="mx-auto max-w-7xl px-6 py-24 md:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Contact"
          title="Begin with a private consultation."
          center={false}
        />
        <Reveal>
          <div className="rounded-none border border-border/70 bg-card/40 p-10 md:p-12">
            <p className="text-base leading-8 text-muted-foreground max-w-2xl">
              Share the vision for your celebration and we’ll arrange a personal conversation about the experience you want to create.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="mailto:hello@thefunctionjunction.com" className="border border-gold px-6 py-3 text-[11px] tracking-[0.3em] uppercase text-gold hover:bg-gold hover:text-primary-foreground transition-all">
                hello@thefunctionjunction.com
              </a>
              <a href="tel:+15550100100" className="border border-border px-6 py-3 text-[11px] tracking-[0.3em] uppercase text-foreground hover:border-gold hover:text-gold transition-all">
                +1 (555) 010-0100
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <SiteFooter />
    </div>
  );
}
