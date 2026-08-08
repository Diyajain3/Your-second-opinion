import { useState } from "react";
import { Check, AlertCircle, Star, Send } from "lucide-react";
import { sendFeedback } from "../api/feedback";

export function Insight({ title, items = [], tone }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        tone === "good" ? "border-brown/20 bg-brown text-cream" : "border-ink/10 bg-white/65"
      }`}
    >
      <h3 className="font-serif text-xl font-semibold">{title}</h3>
      <ul className="mt-3 flex flex-col gap-2.5 text-sm leading-relaxed opacity-85">
        {(items.length ? items : ["Nothing conclusive here."]).map((item, i) => (
          <li key={i} className="flex gap-2.5 items-start">
            <Check size={16} className="mt-1 shrink-0 text-amber" />
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
          <h3 className="mt-1 font-serif text-xl font-semibold">
            {name || defaultLabel}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {sentiment && (
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold capitalize text-brown">
              {sentiment}
            </span>
          )}
          {score !== null && score !== undefined && (
            <div className="flex items-center gap-1 rounded-xl bg-amber px-3 py-1.5 text-white">
              <span className="text-[10px] uppercase tracking-wider opacity-80">Signal:</span>
              <strong className="font-serif text-base">{score}%</strong>
            </div>
          )}
        </div>
      </div>

      {summaryText && (
        <p className="text-sm leading-relaxed text-ink/75">{summaryText}</p>
      )}

      {pros.length > 0 && (
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-amber">
            Genuine Pros
          </h4>
          <ul className="mt-2.5 flex flex-col gap-2 text-sm leading-relaxed text-ink/80">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check size={15} className="mt-0.5 shrink-0 text-amber" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {cons.length > 0 && (
        <div className="border-t border-ink/10 pt-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-brown/70">
            Worth Keeping in Mind (Cons)
          </h4>
          <ul className="mt-2.5 flex flex-col gap-2 text-sm leading-relaxed text-ink/70">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-brown/60" />
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
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await sendFeedback({ reviewId, comparisonId, rating, comment });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit feedback.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="paper-card text-center py-6">
        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-amber/20 text-amber text-sm font-bold">
          ✓
        </div>
        <h3 className="font-serif text-xl font-semibold">Thank you for your feedback!</h3>
        <p className="mt-1 text-xs text-ink/65">
          Your thoughts help make Second Opinion clearer for everyone.
        </p>
      </div>
    );
  }

  return (
    <div className="paper-card">
      <div className="mb-4">
        <span className="eyebrow">Your opinion</span>
        <h3 className="mt-1 font-serif text-xl font-semibold">
          Was this analysis helpful?
        </h3>
        <p className="mt-0.5 text-xs text-ink/60">
          Rate this response to help us refine our second thoughts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-0.5 text-amber transition-transform hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={20}
                className={star <= rating ? "fill-amber" : "text-ink/20"}
              />
            </button>
          ))}
          <span className="ml-2 text-xs font-semibold text-ink/60">
            {rating} / 5 Stars
          </span>
        </div>

        <label className="field">
          Additional comments <span className="font-normal text-ink/40">(optional)</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what stood out or what could be better..."
            rows={2}
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button disabled={busy} className="button button-dark !py-2 !px-4 !text-xs">
            {busy ? "Submitting..." : "Send feedback"} <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}

export function ReviewResult({ data, score }) {
  const sentiment = data.overallSentiment || "mixed";
  return (
    <div className="result-stack">
      <div className="result-hero flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <span className="eyebrow !text-cream/60">
            Product Review
          </span>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-cream sm:text-3xl">
            {data.productName || "Product Review"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/90 max-w-2xl sm:text-base">
            {data.honestSummary || "A thoughtful read on this product."}
          </p>
        </div>
        <div className="score shrink-0">
          <span>signal</span>
          <strong>
            {score ?? data.fakeReviewScore ?? "—"}
            <small>%</small>
          </strong>
        </div>
      </div>

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

      <div className="paper-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-serif text-xl font-semibold">
            The read at a glance
          </h3>
          <span className="rounded-full bg-cream px-3 py-1 text-xs capitalize text-brown">
            {sentiment} sentiment
          </span>
        </div>
        {data.fakeReviewReasoning && (
          <p className="mt-3 text-sm leading-relaxed text-ink/75 sm:text-base">
            {data.fakeReviewReasoning}
          </p>
        )}
        {data.redFlags?.length > 0 && (
          <div className="mt-4 border-t border-ink/10 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-amber">
              Signals to notice
            </p>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink/70">
              {data.redFlags.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <FeedbackSection reviewId={data.id} />
    </div>
  );
}

export function ComparisonResult({ data }) {
  return (
    <div className="result-stack">
      <div className="result-hero flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <span className="eyebrow !text-cream/60">Comparison Result</span>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-cream sm:text-3xl">
            {data.winner ? `Verdict: ${data.winner}` : "Product Comparison"}
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

      <div className="paper-card">
        <h3 className="font-serif text-xl font-semibold">The short version</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/75 sm:text-base">
          {data.comparisonSummary ||
            "Both products have a case to make. Use the details below to decide what matters most to you."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProductComparisonCard
          defaultLabel="Product A"
          name={data.productAName || data.productA?.name || "Product A"}
          resultData={data.productAResult}
        />
        <ProductComparisonCard
          defaultLabel="Product B"
          name={data.productBName || data.productB?.name || "Product B"}
          resultData={data.productBResult}
        />
      </div>

      <FeedbackSection comparisonId={data.id} />
    </div>
  );
}
