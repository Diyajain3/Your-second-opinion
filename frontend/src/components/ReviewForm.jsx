import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { analyzeReview } from "../api/review";

const initialForm = { productName: "", productLink: "", reviewText: "" };

export default function ReviewForm({ onComplete, onBusyChange }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    onBusyChange?.(true);
    setError("");
    try {
      onComplete(await analyzeReview(form));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }
  return (
    <form onSubmit={submit} className="paper-card flex flex-col gap-5">
      <label className="field">
        Product name
        <input
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          placeholder="e.g. Everyday Carry Backpack"
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
      <label className="field">
        Review text
        <textarea
          required
          minLength={10}
          value={form.reviewText}
          onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
          placeholder="Paste the full review here..."
        />
      </label>
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setForm(initialForm)}
          className="button button-light"
        >
          Reset
        </button>
        <button disabled={busy} className="button button-dark">
          {busy ? "Reading the review..." : "Analyze review"}{" "}
          <ArrowRight size={17} />
        </button>
      </div>
    </form>
  );
}
