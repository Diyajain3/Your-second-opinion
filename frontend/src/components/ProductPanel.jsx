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

      <label className="field">
        Product name <span className="text-amber">*</span>
        <input
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Ergonomic Mesh Chair"
        />
      </label>

      <label className="field">
        Product link <span className="font-normal text-ink/40">(optional)</span>
        <input
          type="url"
          value={values.link}
          onChange={(e) => update("link", e.target.value)}
          placeholder="https://..."
        />
      </label>

      <label className="field">
        <div className="flex items-center justify-between">
          <span>
            Review text <span className="text-amber">*</span>
          </span>
          <span className="text-xs font-normal text-ink/50">
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
      </label>
    </div>
  );
}
