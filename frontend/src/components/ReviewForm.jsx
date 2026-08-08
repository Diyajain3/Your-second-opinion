import { useState } from "react";
import { ArrowRight, Sparkles, RotateCcw, FileText, Info } from "lucide-react";
import { analyzeReview } from "../api/review";

const initialForm = { productName: "", productLink: "", reviewText: "" };

const sampleReview = {
  productName: "Sony WH-1000XM5 Wireless Headphones",
  productLink: "https://example.com/headphones",
  reviewText: `I bought the Sony WH-1000XM5 noise-canceling headphones 6 months ago for daily work calls and commuting.

Pros:
- The active noise cancellation (ANC) is outstanding and cuts out engine noise on flights completely.
- 30-hour battery life easily lasts me 3 to 4 days of heavy usage without needing a recharge.
- Sound quality is rich with great bass clarity and clear vocal audio for podcasts.
- Extremely lightweight and comfortable for 8+ hour workdays.

Cons:
- The carrying case is noticeably bulkier than the XM4 and doesn't fold down as small.
- Microphone quality is decent indoors, but picks up noticeable wind noise when walking outside.
- Price is on the higher side compared to competitors.

Overall, despite the bulkier case and high price tag, these are the best daily driver noise-canceling headphones I have used. Highly recommended!`,
};

export default function ReviewForm({ onComplete, onBusyChange }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function loadSample() {
    setForm(sampleReview);
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    try {
      onComplete(await analyzeReview(form));
    } catch (err) {
      setError(err.message || "Failed to analyze review. Please try again.");
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }

  const charCount = form.reviewText.length;

  return (
    <form onSubmit={submit} className="paper-card flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
        <div>
          <span className="eyebrow">Input Review Details</span>
          <h2 className="mt-1 font-serif text-2xl font-semibold">Paste customer review text</h2>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-3.5 py-1.5 text-xs font-semibold text-amber transition-colors hover:bg-amber/20"
        >
          <Sparkles size={14} /> Try a sample review
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">
          Product name
          <input
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            placeholder="e.g. Sony WH-1000XM5 Headphones"
          />
        </label>

        <label className="field">
          Product link <span className="font-normal text-ink/40">(optional)</span>
          <input
            type="url"
            value={form.productLink}
            onChange={(e) => setForm({ ...form, productLink: e.target.value })}
            placeholder="https://..."
          />
        </label>
      </div>

      <label className="field">
        <div className="flex items-center justify-between">
          <span>
            Review text <span className="text-amber">*</span>
          </span>
          <span className="text-xs font-normal text-ink/50">
            {charCount > 0 ? `${charCount} characters` : "Minimum 10 characters"}
          </span>
        </div>
        <textarea
          required
          minLength={10}
          value={form.reviewText}
          onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
          placeholder="Paste the full customer review or user experience here..."
          className="min-h-[160px]"
        />
      </label>

      <div className="flex items-center gap-2 text-xs text-ink/60 rounded-xl bg-cream/70 p-3 border border-ink/10">
        <Info size={16} className="text-amber shrink-0" />
        <span>
          Tip: Pasting detailed user experiences yields the highest signal quality and clearest pro/con trade-offs.
        </span>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:justify-between sm:items-center">
        <button
          type="button"
          onClick={() => setForm(initialForm)}
          className="button button-light !py-2.5"
        >
          <RotateCcw size={15} /> Reset
        </button>
        <button disabled={busy} className="button button-dark !py-3 !px-6">
          {busy ? "Reading the review..." : "Analyze review"}{" "}
          <ArrowRight size={17} />
        </button>
      </div>
    </form>
  );
}
