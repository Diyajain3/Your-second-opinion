export default function ProductPanel({ label, values, update }) {
  return (
    <div className="paper-card flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="eyebrow !mb-0">{label}</span>
        <span className="rounded-full bg-cream px-3 py-1 text-xs text-ink/45">
          required
        </span>
      </div>
      <label className="field">
        Product name
        <input
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Product name"
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
        Review text
        <textarea
          required
          minLength={10}
          value={values.reviewText}
          onChange={(e) => update("reviewText", e.target.value)}
          placeholder="Paste a review..."
        />
      </label>
    </div>
  );
}
