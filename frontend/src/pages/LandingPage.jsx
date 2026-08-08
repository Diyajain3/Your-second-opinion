import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Eye, Award } from "lucide-react";

function Step({ number, title, text }) {
  return (
    <div className="paper-card relative overflow-hidden transition-all hover:-translate-y-1">
      <span className="font-mono text-xs font-bold tracking-[.2em] text-amber">
        STEP {number}
      </span>
      <h3 className="mt-4 font-serif text-2xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{text}</p>
    </div>
  );
}

function TrustPillar({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="size-10 rounded-2xl bg-amber/15 text-amber flex items-center justify-center shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-serif text-lg font-semibold text-ink">{title}</h4>
        <p className="mt-1 text-xs leading-relaxed text-ink/65">{text}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow">
            <span className="eyebrow-dot" /> Your Thoughtful Buying Companion
          </p>
          <h1 className="display mt-4 max-w-3xl">
            The review <em>behind</em> the review.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
            Second Opinion helps you see past sponsored hype and 5-star noise. Understand what is genuine, what trade-offs exist, and whether a product fits your daily life.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link className="button button-dark !py-3.5 !px-7 text-sm" to="/signup">
              Get your second opinion <ArrowRight size={17} />
            </Link>
            <a className="button button-light !py-3.5 !px-6 text-sm" href="#how-it-works">
              See methodology
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-xs text-ink/60 border-t border-ink/10 pt-5">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={15} className="text-amber" /> 100% Unbiased Analysis
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={15} className="text-amber" /> No Sponsored Affiliate Links
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative"
        >
          <div className="hero-note">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <span className="eyebrow !text-cream">Decision Brief</span>
              <span className="rounded-full bg-cream/20 px-3 py-0.5 text-xs text-cream font-semibold">
                Authentic Signal
              </span>
            </div>
            <div className="flex items-end gap-5">
              <div>
                <span className="text-[10px] uppercase tracking-[.2em] text-cream/70 font-bold">
                  Authenticity Signal
                </span>
                <div className="mt-1 font-serif text-5xl text-cream font-semibold sm:text-6xl">
                  84<span className="text-2xl">%</span>
                </div>
              </div>
              <div className="h-14 w-px bg-white/20" />
              <p className="text-xs leading-relaxed text-cream/90">
                &ldquo;High operational detail density. Cons focus on realistic bulk rather than defects.&rdquo;
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-semibold text-cream/90">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-cream" /> Clear Verdict & Trade-offs
              </span>
              <span className="underline underline-offset-2">View sample</span>
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2.5 text-xs font-semibold text-ink shadow-xl backdrop-blur-md sm:-left-6">
            <Sparkles size={15} className="text-amber" /> Thoughtful decision making
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="mx-auto max-w-6xl scroll-mt-20 border-t border-ink/10 px-5 py-16 lg:px-8 lg:py-24"
      >
        <div className="mb-12 max-w-xl">
          <p className="eyebrow">Clear Methodology</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">
            Good decisions need <em>context.</em>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Step
            number="01"
            title="Bring the question"
            text="Paste a review, a product link, or two products you cannot decide between."
          />
          <Step
            number="02"
            title="We read closer"
            text="Our reasoning engine filters out marketing jargon, fake score anomalies, and superficial praise."
          />
          <Step
            number="03"
            title="Clear Decision Brief"
            text="Receive a structured verdict highlighting genuine pros, realistic trade-offs, and considerations."
          />
        </div>
      </section>

      {/* Trust Manifesto */}
      <section className="mx-auto max-w-6xl border-t border-ink/10 px-5 py-16 lg:px-8 lg:py-20">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <p className="eyebrow justify-center">Built For Customers First</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">
            Why trust <em>Second Opinion?</em>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <TrustPillar
            icon={Eye}
            title="100% Neutral & Unbiased"
            text="We do not accept sponsored placements or rank products based on affiliate commissions."
          />
          <TrustPillar
            icon={ShieldCheck}
            title="Evidence-Driven Reasoning"
            text="Every pro and con is extracted directly from verified buyer operational experiences."
          />
          <TrustPillar
            icon={Award}
            title="Focus on Trade-offs"
            text="No product is perfect. We highlight what you give up so you can decide with confidence."
          />
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="mx-auto max-w-6xl px-5 pb-16 lg:px-8 lg:pb-24">
        <div className="rounded-3xl bg-brown px-8 py-12 text-cream sm:px-12 lg:flex lg:items-center lg:justify-between shadow-2xl">
          <div>
            <span className="eyebrow !text-amber">Start With One Question</span>
            <h2 className="mt-3 max-w-xl font-serif text-3xl font-semibold sm:text-4xl text-cream">
              A second thought can save you from the wrong first choice.
            </h2>
          </div>
          <Link
            className="button button-amber mt-8 inline-flex self-start lg:mt-0 !py-3.5 !px-7 text-sm"
            to="/signup"
          >
            Get your second opinion <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
