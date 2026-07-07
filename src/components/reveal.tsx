import { motion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-3xl mb-16`}>
      <Reveal>
        <p className="text-[11px] tracking-[0.5em] uppercase text-gold mb-4">{eyebrow}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-foreground">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.2}>
          <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.3}>
        <div className="hairline mx-auto mt-8 w-24" />
      </Reveal>
    </div>
  );
}
