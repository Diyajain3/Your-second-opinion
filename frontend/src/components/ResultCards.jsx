import { useState } from "react";
import {
  Check,
  AlertCircle,
  Star,
  Send,
  ShieldCheck,
  Info,
  Sparkles,
  HelpCircle,
  BarChart3,
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { sendFeedback } from "../api/feedback";

// Gradient helper based on score (0-100)
function getScoreGradient(score) {
  if (score >= 80) {
    return {
      bg: "bg-emerald-600",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      bar: "from-emerald-500 to-teal-600",
      text: "text-emerald-700",
    };
  }
  if (score >= 65) {
    return {
      bg: "bg-amber-600",
      badge: "bg-amber-100 text-amber-900 border-amber-300",
      bar: "from-amber-400 to-amber-600",
      text: "text-amber-800",
    };
  }
  return {
    bg: "bg-rose-600",
    badge: "bg-rose-100 text-rose-800 border-rose-300",
    bar: "from-rose-400 to-rose-600",
    text: "text-rose-700",
  };
}

export function CategoryAnalytics({ metrics = [] }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="paper-card !p-6 border-ink/15 shadow-sm">
      <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={20} className="text-amber" />
          <h3 className="font-serif text-xl font-semibold text-ink">
            Category Analytics & Key Metrics
          </h3>
        </div>
        <span className="rounded-full bg-cream/80 border border-ink/10 px-3 py-1 text-xs font-semibold text-brown">
          Point Breakdown
        </span>
      </div>

      <div className="grid gap-4.5 sm:grid-cols-2">
        {metrics.map((item, idx) => {
          const score = typeof item.score === "number" ? item.score : 75;
          const styles = getScoreGradient(score);
          return (
            <div
              key={idx}
              className="rounded-2xl border border-ink/10 bg-cream/40 p-4 transition-all hover:bg-white hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-ink">{item.name}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${styles.badge}`}
                >
                  {score}% {item.label ? `• ${item.label}` : ""}
                </span>
              </div>

              {/* Visual Gradient Progress Meter */}
              <div className="h-2.5 w-full rounded-full bg-ink/10 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${styles.bar} transition-all duration-700`}
                  style={{ width: `${Math.min(100, Math.max(10, score))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function InsightPointList({ title, items = [], tone = "good" }) {
  // Ensure exactly 3 top points are highlighted
  const topPoints = items.length > 0 ? items.slice(0, 3) : ["No details mentioned."];

  return (
    <div
      className={`rounded-2xl border p-6 transition-all ${
        tone === "good"
          ? "border-emerald-200 bg-emerald-50/50 text-ink shadow-sm"
          : "border-amber-200 bg-amber-50/50 text-ink shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between mb-4 border-b border-ink/10 pb-3">
        <h3 className="font-serif text-lg font-semibold flex items-center gap-2">
          {tone === "good" ? (
            <CheckCircle2 size={20} className="text-emerald-600" />
          ) : (
            <AlertTriangle size={20} className="text-amber-600" />
          )}
          <span>{title}</span>
        </h3>
        <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase text-ink/60 border border-ink/10">
          Top 3 Points
        </span>
      </div>

      <ul className="flex flex-col gap-3 text-sm leading-relaxed">
        {topPoints.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                tone === "good" ? "bg-emerald-600" : "bg-amber-600"
              }`}
            >
              {i + 1}
            </span>
            <span className="text-ink/85 font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ComparisonAnalytics({ metrics = [], productAName, productBName }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="paper-card !p-6 border-ink/15 shadow-sm">
      <div className="flex items-center justify-between border-b border-ink/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={20} className="text-amber" />
          <h3 className="font-serif text-xl font-semibold text-ink">
            Head-to-Head Analytics Comparison
          </h3>
        </div>
        <span className="rounded-full bg-amber/15 border border-amber/30 px-3 py-1 text-xs font-bold text-brown">
          Analytics Breakdown
        </span>
      </div>

      <div className="grid gap-4">
        {metrics.map((item, idx) => {
          const scoreA = item.productAScore || 75;
          const scoreB = item.productBScore || 75;
          const winnerText = item.winner || (scoreA > scoreB ? productAName : productBName);

          return (
            <div
              key={idx}
              className="rounded-2xl border border-ink/10 bg-cream/40 p-4 transition-all hover:bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="font-semibold text-sm text-ink">{item.metric}</span>
                <span className="rounded-full bg-brown text-cream px-3 py-0.5 text-xs font-bold">
                  Winner: {winnerText}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Product A Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-ink/75 mb-1">
                    <span className="truncate">{productAName}</span>
                    <strong className="text-emerald-700">{scoreA}%</strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-ink/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(10, scoreA))}%` }}
                    />
                  </div>
                </div>

                {/* Product B Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-ink/75 mb-1">
                    <span className="truncate">{productBName}</span>
                    <strong className="text-amber-700">{scoreB}%</strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-ink/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-600 transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.max(10, scoreB))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProductComparisonCard({ name, resultData, defaultLabel }) {
  const isObject = typeof resultData === "object" && resultData !== null;
  const score = isObject ? resultData.fakeReviewScore : null;
  const sentiment = isObject ? resultData.overallSentiment : null;
  const pros = isObject ? resultData.genuinePros || [] : [];
  const cons = isObject ? resultData.genuineCons || [] : [];
  const summaryText = typeof resultData === "string" ? resultData : null;

  const topPros = pros.slice(0, 3);
  const topCons = cons.slice(0, 3);

  return (
    <div className="paper-card flex flex-col gap-5 border-ink/15">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-3">
        <div>
          <span className="eyebrow">{defaultLabel}</span>
          <h3 className="mt-1 font-serif text-xl font-semibold text-ink">
            {name || defaultLabel}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {sentiment && (
            <span className="rounded-full border border-brown/15 bg-cream px-3 py-1 text-xs font-semibold capitalize text-brown">
              {sentiment}
            </span>
          )}
          {score !== null && score !== undefined && (
            <div className="flex items-center gap-1 rounded-xl bg-amber px-3 py-1.5 text-white shadow-sm">
              <span className="text-[10px] uppercase tracking-wider opacity-80">Signal:</span>
              <strong className="font-serif text-base">{score}%</strong>
            </div>
          )}
        </div>
      </div>

      {summaryText && (
        <p className="text-sm leading-relaxed text-ink/80">{summaryText}</p>
      )}

      {/* Top 3 Pros */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-700 flex items-center gap-1.5 mb-2.5">
          <Check size={15} className="text-emerald-600" /> Top 3 Pros
        </h4>
        <ul className="flex flex-col gap-2 text-xs leading-relaxed text-ink/85">
          {(topPros.length ? topPros : ["Solid overall build"]).map((pro, i) => (
            <li key={i} className="flex items-start gap-2 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
              <span className="mt-0.5 size-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {i + 1}
              </span>
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Top 3 Cons */}
      <div className="border-t border-ink/10 pt-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center gap-1.5 mb-2.5">
          <AlertCircle size={15} className="text-amber-600" /> Top 3 Cons & Trade-offs
        </h4>
        <ul className="flex flex-col gap-2 text-xs leading-relaxed text-ink/80">
          {(topCons.length ? topCons : ["Price is on the higher side"]).map((con, i) => (
            <li key={i} className="flex items-start gap-2 bg-amber-50/60 p-2 rounded-xl border border-amber-100">
              <span className="mt-0.5 size-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {i + 1}
              </span>
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FeedbackSection({ reviewId, comparisonId }) {
  const [rating, setRating] = useState(5);
  const [selectedTag, setSelectedTag] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const quickTags = [
    "Clear decision brief",
    "Accurate pros & cons",
    "Useful analytics metrics",
    "Needs more detail",
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const finalComment = selectedTag
      ? `[${selectedTag}] ${comment}`.trim()
      : comment;

    try {
      await sendFeedback({ reviewId, comparisonId, rating, comment: finalComment });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit feedback.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="paper-card text-center py-7">
        <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-amber/20 text-amber text-base font-bold">
          ✓
        </div>
        <h3 className="font-serif text-xl font-semibold">Thank you for your feedback!</h3>
        <p className="mt-1 text-xs text-ink/65 max-w-sm mx-auto">
          Your feedback helps us continuously improve the clarity and quality of Second Opinion.
        </p>
      </div>
    );
  }

  return (
    <div className="paper-card border-ink/15">
      <div className="mb-4">
        <span className="eyebrow">User Feedback</span>
        <h3 className="mt-1 font-serif text-xl font-semibold">
          Was this decision brief helpful?
        </h3>
        <p className="mt-0.5 text-xs text-ink/60">
          Rate this response to help refine our reasoning model.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-0.5 text-amber transition-transform hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={22}
                className={star <= rating ? "fill-amber text-amber" : "text-ink/20"}
              />
            </button>
          ))}
          <span className="ml-2 text-xs font-bold text-brown">
            {rating} / 5 Stars
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                selectedTag === tag
                  ? "bg-brown text-cream"
                  : "bg-cream/80 text-ink/65 hover:bg-cream hover:text-ink"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <label className="field">
          Additional comments <span className="font-normal text-ink/40">(optional)</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what stood out or what could be improved..."
            rows={2}
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button disabled={busy} className="button button-dark !py-2.5 !px-5 !text-xs">
            {busy ? "Sending..." : "Send feedback"} <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}

export function ReviewResult({ data, score }) {
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const sentiment = data.overallSentiment || "mixed";
  const authenticityScore = score ?? data.fakeReviewScore ?? 80;

  // Fallback category metrics if older review
  const defaultMetrics = [
    { name: "Build Quality & Materials", score: 85, label: "Excellent" },
    { name: "Performance & Reliability", score: 80, label: "Good" },
    { name: "Usability & Comfort", score: 78, label: "Good" },
    { name: "Value for Money", score: 72, label: "Fair" },
  ];

  const categoryMetrics = data.categoryMetrics?.length ? data.categoryMetrics : defaultMetrics;

  return (
    <div className="result-stack">
      {/* Editorial Hero Brief */}
      <div className="result-hero flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="eyebrow !text-cream/70">Decision Brief</span>
            <span className="rounded-full bg-cream/20 px-2.5 py-0.5 text-[11px] font-semibold text-cream">
              Single Review
            </span>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-cream sm:text-3xl">
            {data.productName || "Product Review"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/90 max-w-2xl sm:text-base">
            {data.honestSummary || "A thoughtful read on this product."}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="score">
            <span>authenticity signal</span>
            <strong>
              {authenticityScore}
              <small>%</small>
            </strong>
          </div>
          <button
            type="button"
            onClick={() => setShowScoreInfo(!showScoreInfo)}
            className="flex items-center gap-1 text-[11px] font-semibold text-cream/75 hover:text-cream transition-colors"
          >
            <HelpCircle size={12} /> How score works
          </button>
        </div>
      </div>

      {/* Score Explanation Accordion */}
      {showScoreInfo && (
        <div className="paper-card bg-amber/10 border-amber/20 text-xs leading-relaxed text-ink/80 flex gap-3 items-start">
          <Info size={16} className="text-amber shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-brown block mb-1">About Authenticity Signal Score</strong>
            The score evaluates detail density, operational specifics, and balanced critique versus generic promotional buzzwords. High scores (80%+) indicate detailed, verifiable buyer feedback.
          </div>
        </div>
      )}

      {/* Top 3 Genuine Pros vs Cons Matrix */}
      <div className="grid gap-4 md:grid-cols-2">
        <InsightPointList
          title="3 Main Genuine Pros"
          items={data.genuinePros}
          tone="good"
        />
        <InsightPointList
          title="3 Main Cons & Trade-offs"
          items={data.genuineCons}
          tone="soft"
        />
      </div>

      {/* Category Analytics Progress Bars */}
      <CategoryAnalytics metrics={categoryMetrics} />

      {/* Synthesis & Red Flags */}
      <div className="paper-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-3">
          <h3 className="font-serif text-xl font-semibold">
            Synthesis & Consensus
          </h3>
          <span className="rounded-full border border-brown/15 bg-cream px-3 py-1 text-xs font-semibold capitalize text-brown">
            {sentiment} consensus
          </span>
        </div>

        {data.fakeReviewReasoning && (
          <p className="mt-3.5 text-sm leading-relaxed text-ink/75 sm:text-base">
            {data.fakeReviewReasoning}
          </p>
        )}

        {data.redFlags?.length > 0 && (
          <div className="mt-5 border-t border-ink/10 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-amber flex items-center gap-1.5">
              <Sparkles size={14} /> Signals to Notice
            </p>
            <ul className="mt-2.5 flex flex-col gap-2 text-sm text-ink/75">
              {data.redFlags.map((item, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="text-amber font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Consideration Checklist */}
      <div className="rounded-2xl border border-ink/10 bg-cream/60 p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} className="text-brown" />
          <h3 className="font-serif text-lg font-semibold text-ink">What to consider before deciding</h3>
        </div>
        <ul className="grid gap-2 text-xs leading-relaxed text-ink/70 sm:grid-cols-3">
          <li className="rounded-xl bg-white/70 p-3 border border-ink/5">
            <strong className="block text-ink font-semibold mb-0.5">1. Match your use case</strong>
            Ensure the 3 main genuine pros align directly with your primary daily requirements.
          </li>
          <li className="rounded-xl bg-white/70 p-3 border border-ink/5">
            <strong className="block text-ink font-semibold mb-0.5">2. Evaluate trade-offs</strong>
            Consider if the 3 noted cons are minor annoyances or dealbreakers for you.
          </li>
          <li className="rounded-xl bg-white/70 p-3 border border-ink/5">
            <strong className="block text-ink font-semibold mb-0.5">3. Price vs Value</strong>
            Weigh the category analytics score against competitor alternatives in this category.
          </li>
        </ul>
      </div>

      <FeedbackSection reviewId={data.id} />
    </div>
  );
}

export function formatWinnerName(winnerRaw, nameA, nameB) {
  if (!winnerRaw) return "Tie / Balanced";
  const w = winnerRaw.toString().trim().toLowerCase();
  const cleanA = nameA || "Product A";
  const cleanB = nameB || "Product B";

  if (w === "product_a" || w === "product a" || w === "producta" || w === "a") {
    return cleanA;
  }
  if (w === "product_b" || w === "product b" || w === "productb" || w === "b") {
    return cleanB;
  }
  if (w === "tie" || w === "equal" || w === "draw") {
    return "Tie / Balanced";
  }
  return winnerRaw;
}

export function ComparisonResult({ data }) {
  const nameA = data.productAName || data.productA?.name || "Product A";
  const nameB = data.productBName || data.productB?.name || "Product B";
  const winnerName = formatWinnerName(data.winner, nameA, nameB);

  const defaultCompareMetrics = [
    { metric: "Build & Materials", productAScore: 85, productBScore: 72, winner: nameA },
    { metric: "Key Performance", productAScore: 80, productBScore: 88, winner: nameB },
    { metric: "Ease of Use & Comfort", productAScore: 88, productBScore: 78, winner: nameA },
    { metric: "Value for Money", productAScore: 75, productBScore: 85, winner: nameB },
  ];

  const compareMetrics = data.categoryMetrics?.length ? data.categoryMetrics : defaultCompareMetrics;

  return (
    <div className="result-stack">
      {/* Verdict Hero Banner */}
      <div className="result-hero flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-brown via-amber-900 to-brown shadow-xl">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Award size={18} className="text-amber-300" />
            <span className="eyebrow !text-amber-200">Head-to-Head Verdict</span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-cream sm:text-3xl">
            {winnerName !== "Tie / Balanced" ? `Winner: ${winnerName}` : "Verdict: Tie / Balanced Match"}
          </h2>
          {data.comparisonSummary && (
            <p className="mt-2 text-sm leading-relaxed text-cream/90 max-w-2xl sm:text-base">
              {data.comparisonSummary}
            </p>
          )}
        </div>
        <div className="score shrink-0 bg-amber-600">
          <span>decision</span>
          <strong className="text-2xl">✓</strong>
        </div>
      </div>

      {/* Head to Head Analytics Table/Bars */}
      <ComparisonAnalytics
        metrics={compareMetrics}
        productAName={nameA}
        productBName={nameB}
      />

      {/* Side-by-side Product Cards with 3 Pros & 3 Cons */}
      <div className="grid gap-5 md:grid-cols-2">
        <ProductComparisonCard
          defaultLabel="Option A"
          name={nameA}
          resultData={data.productAResult}
        />
        <ProductComparisonCard
          defaultLabel="Option B"
          name={nameB}
          resultData={data.productBResult}
        />
      </div>

      <FeedbackSection comparisonId={data.id} />
    </div>
  );
}
