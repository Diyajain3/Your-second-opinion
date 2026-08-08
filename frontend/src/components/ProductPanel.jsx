export default function ProductPanel({ label, values, update }) {
  const charCount = (values.reviewText || "").length;

  return (
    <div className="paper-card flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-ink/10 pb-3">
        <span className="eyebrow !mb-0">{label}</span>
        <span className="rounded-full border border-amber/20 bg-amber/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber">
          Option Details
        </span>
      </div>

      <div className="field">
        <div className="flex items-center justify-between font-bold text-xs text-ink/75 mb-1.5">
          <span className="flex items-center gap-1">
            Product name <span className="text-amber font-bold">*</span>
          </span>
        </div>
        <input
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Ergonomic Mesh Chair"
        />
      </div>

      <div className="field">
        <div className="flex items-center justify-between font-bold text-xs text-ink/75 mb-1.5">
          <span>Product link</span>
          <span className="font-normal text-ink/40">(optional)</span>
        </div>
        <input
          type="url"
          value={values.link}
          onChange={(e) => update("link", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="field">
        <div className="flex items-center justify-between font-bold text-xs text-ink/75 mb-1.5">
          <span className="flex items-center gap-1">
            Review text <span className="text-amber font-bold">*</span>
          </span>
          <span className="font-normal text-ink/40">
            {charCount > 0 ? `${charCount} chars` : "Min 10 chars"}
          </span>
        </div>
        <textarea
          required
          minLength={10}
          value={values.reviewText}
          onChange={(e) => update("reviewText", e.target.value)}
          placeholder="Paste user reviews or key product feedback..."
          className="min-h-[140px]"
        />
      </div>
    </div>
  );
}
