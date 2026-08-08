import { useState } from "react";
import { Check, AlertCircle, Star, Send, ShieldCheck, Info, ChevronDown, ChevronUp, Sparkles, HelpCircle } from "lucide-react";
import { sendFeedback } from "../api/feedback";

export function Insight({ title, items = [], tone }) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        tone === "good"
          ? "border-brown/20 bg-brown text-cream shadow-md"
          : "border-ink/10 bg-white/75 text-ink"
      }`}
    >
      <h3 className="font-serif text-xl font-semibold flex items-center gap-2">
        {tone === "good" ? <Check size={18} className="text-amber" /> : <AlertCircle size={18} className="text-brown/70" />}
        {title}
      </h3>
      <ul className="mt-3.5 flex flex-col gap-2.5 text-sm leading-relaxed opacity-90">
        {(items.length ? items : ["No conclusive details reported."]).map((item, i) => (
          <li key={i} className="flex gap-2.5 items-start">
            <span className={`mt-1.5 size-1.5 rounded-full shrink-0 ${tone === "good" ? "bg-amber" : "bg-brown/60"}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
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

  return (
    <div className="paper-card flex flex-col gap-5">
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

      {pros.length > 0 && (
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber flex items-center gap-1.5">
            <Check size={14} /> Genuine Pros
          </h4>
          <ul className="mt-2.5 flex flex-col gap-2 text-sm leading-relaxed text-ink/80">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 size-1.5 rounded-full bg-amber shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {cons.length > 0 && (
        <div className="border-t border-ink/10 pt-3">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-brown/70 flex items-center gap-1.5">
            <AlertCircle size={14} /> Trade-offs (Cons)
          </h4>
          <ul className="mt-2.5 flex flex-col gap-2 text-sm leading-relaxed text-ink/70">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 size-1.5 rounded-full bg-brown/50 shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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
    "Balanced perspective",
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
    <div className="paper-card">
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
              {score ?? data.fakeReviewScore ?? "—"}
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

      {/* Genuine Pros vs Cons Matrix */}
      <div className="grid gap-4 md:grid-cols-2">
        <Insight
          title="What feels genuine"
          items={data.genuinePros}
          tone="good"
        />
        <Insight
          title="Worth keeping in mind"
          items={data.genuineCons}
          tone="soft"
        />
      </div>

      {/* Read at a glance & Red flags */}
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

      {/* What to consider before buying checklist */}
      <div className="rounded-2xl border border-ink/10 bg-cream/60 p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} className="text-brown" />
          <h3 className="font-serif text-lg font-semibold text-ink">What to consider before deciding</h3>
        </div>
        <ul className="grid gap-2 text-xs leading-relaxed text-ink/70 sm:grid-cols-3">
          <li className="rounded-xl bg-white/70 p-3 border border-ink/5">
            <strong className="block text-ink font-semibold mb-0.5">1. Match your use case</strong>
            Ensure the stated genuine pros align directly with your primary daily requirements.
          </li>
          <li className="rounded-xl bg-white/70 p-3 border border-ink/5">
            <strong className="block text-ink font-semibold mb-0.5">2. Evaluate trade-offs</strong>
            Consider if the noted cons are minor annoyances or dealbreakers for you.
          </li>
          <li className="rounded-xl bg-white/70 p-3 border border-ink/5">
            <strong className="block text-ink font-semibold mb-0.5">3. Price vs Value</strong>
            Weigh the authentic consensus against competitor alternatives in this category.
          </li>
        </ul>
      </div>

      <FeedbackSection reviewId={data.id} />
    </div>
  );
}

export function ComparisonResult({ data }) {
  return (
    <div className="result-stack">
      {/* Verdict Hero */}
      <div className="result-hero flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <span className="eyebrow !text-cream/70">Comparison Brief</span>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-cream sm:text-3xl">
            {data.winner ? `Verdict: ${data.winner}` : "Product Comparison Brief"}
          </h2>
          {data.comparisonSummary && (
            <p className="mt-2 text-sm leading-relaxed text-cream/90 max-w-2xl sm:text-base">
              {data.comparisonSummary}
            </p>
          )}
        </div>
        <div className="score shrink-0">
          <span>decision</span>
          <strong>✓</strong>
        </div>
      </div>

      {/* Short version card */}
      <div className="paper-card">
        <h3 className="font-serif text-xl font-semibold">The Short Version</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/75 sm:text-base">
          {data.comparisonSummary ||
            "Both products have a case to make. Use the details below to decide what matters most to you."}
        </p>
      </div>

      {/* Side-by-side Cards */}
      <div className="grid gap-5 md:grid-cols-2">
        <ProductComparisonCard
          defaultLabel="Option A"
          name={data.productAName || data.productA?.name || "Product A"}
          resultData={data.productAResult}
        />
        <ProductComparisonCard
          defaultLabel="Option B"
          name={data.productBName || data.productB?.name || "Product B"}
          resultData={data.productBResult}
        />
      </div>

      <FeedbackSection comparisonId={data.id} />
    </div>
  );
}
