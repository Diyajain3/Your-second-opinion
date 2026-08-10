import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Search, Scale, FileText, Zap } from "lucide-react";

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="paper-card flex flex-col justify-between transition-all hover:-translate-y-1">
      <div>
        <div className="size-12 rounded-2xl bg-amber/15 text-amber flex items-center justify-center mb-4">
          <Icon size={22} />
        </div>
        <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">{text}</p>
      </div>
    </div>
  );
}

function SimpleStep({ number, title, text }) {
  return (
    <div className="paper-card relative overflow-hidden transition-all hover:-translate-y-1">
      <span className="inline-block rounded-full bg-amber/15 px-3 py-1 text-xs font-bold text-amber mb-3">
        STEP {number}
      </span>
      <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/75">{text}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:pb-20 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3.5 py-1 text-xs font-bold text-amber mb-4">
            <Sparkles size={14} /> AI Product Review & Fake Review Analyzer
          </div>

          <h1 className="display max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Know if a product is worth buying — <em>before</em> you pay.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/75 sm:text-lg">
            Shopping online can be confusing. Fake 5-star reviews and paid promotions hide real product flaws. <strong>Second Opinion</strong> uses AI to read customer reviews, spot fake feedback, give you true pros & cons, and compare products side-by-side.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link className="button button-dark !py-3.5 !px-7 text-sm font-semibold" to="/signup">
              Try It Free Now <ArrowRight size={17} />
            </Link>
            <a className="button button-light !py-3.5 !px-6 text-sm" href="#how-it-works">
              See How It Works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 text-xs text-ink/70 border-t border-ink/10 pt-5">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={16} className="text-amber" /> Detects Fake Reviews
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={16} className="text-amber" /> Real Pros & Cons
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={16} className="text-amber" /> Side-by-Side Comparison
            </span>
          </div>
        </motion.div>

        {/* Interactive Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative"
        >
          <div className="hero-note shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="eyebrow !text-amber">Live AI Analysis Preview</span>
              <span className="rounded-full bg-cream/20 px-3 py-0.5 text-xs text-cream font-semibold">
                Authenticity: 88% Real
              </span>
            </div>

            <div className="space-y-3 text-xs text-cream/90">
              <div className="rounded-xl bg-white/10 p-3">
                <span className="font-bold text-amber block mb-1">👍 Genuine Pros:</span>
                <p>• Clear sound quality & strong noise cancellation on metro trains.</p>
                <p>• Lightweight frame comfortable for 8+ hours daily wear.</p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <span className="font-bold text-red-300 block mb-1">👎 Real Trade-offs:</span>
                <p>• Charging case lacks battery percentage display.</p>
                <p>• Mic picks up outside wind noise during phone calls.</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-semibold text-cream/90">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-amber" /> Instant AI Verdict
              </span>
              <Link to="/signup" className="underline underline-offset-2 hover:text-amber">
                Try with your own product →
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* What We Do Section */}
      <section className="mx-auto max-w-6xl border-t border-ink/10 px-5 py-14 lg:px-8 lg:py-20">
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="eyebrow justify-center">What Second Opinion Does</span>
          <h2 className="display mt-2 text-3xl sm:text-4xl font-bold">
            3 ways we help you buy smarter
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={Search}
            title="1. Spot Fake Reviews"
            text="AI analyzes customer review text to detect fake 5-star ratings, bot patterns, and paid promotional hype."
          />
          <FeatureCard
            icon={FileText}
            title="2. Extract True Pros & Cons"
            text="Get a quick 1-minute summary of real buyer complaints and main highlights without reading hundreds of comments."
          />
          <FeatureCard
            icon={Scale}
            title="3. Compare Two Products"
            text="Can't choose between two items? Paste both reviews to get a head-to-head winner recommendation."
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="mx-auto max-w-6xl scroll-mt-20 border-t border-ink/10 px-5 py-14 lg:px-8 lg:py-20"
      >
        <div className="mb-10 max-w-xl">
          <span className="eyebrow">How Simple It Is</span>
          <h2 className="display mt-2 text-3xl sm:text-4xl font-bold">
            Get your answer in 3 easy steps
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <SimpleStep
            number="1"
            title="Paste Product Review or Text"
            text="Copy customer reviews from Amazon, Flipkart, or any online shopping website and paste them here."
          />
          <SimpleStep
            number="2"
            title="Click Analyze"
            text="Our AI instantly scans the review text to check authenticity, sentiment, and category scores."
          />
          <SimpleStep
            number="3"
            title="Get Clear Decision"
            text="See an easy-to-read summary with fake review score, top pros, cons, and buying recommendation."
          />
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="mx-auto max-w-6xl px-5 pb-16 lg:px-8 lg:pb-20">
        <div className="rounded-3xl bg-brown px-8 py-10 text-cream sm:px-12 lg:flex lg:items-center lg:justify-between shadow-2xl">
          <div>
            <span className="eyebrow !text-amber">Stop Wasting Money On Bad Products</span>
            <h2 className="mt-2 max-w-xl font-serif text-3xl font-semibold sm:text-4xl text-cream">
              Get an honest Second Opinion before you order.
            </h2>
          </div>
          <Link
            className="button button-amber mt-6 inline-flex self-start lg:mt-0 !py-3.5 !px-7 text-sm font-bold"
            to="/signup"
          >
            Start For Free <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
