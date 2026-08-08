import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Scale, Sparkles, ArrowRightLeft, RotateCcw } from "lucide-react";
import { compareProducts } from "../api/comparisons";
import ProductPanel from "../components/ProductPanel";
import { AnalysisOverlay, Workspace } from "../components/RouteParts";

const emptyProduct = { name: "", link: "", reviewText: "" };
const emptyForm = { a: emptyProduct, b: emptyProduct };

const sampleComparison = {
  a: {
    name: "Ergonomic Mesh Chair",
    link: "https://example.com/mesh-chair",
    reviewText: "Outstanding lumbar support and breathable mesh material that stays cool. Easy 20-minute assembly. Armrest padding could be slightly softer, but long-term back comfort is superior to leather chairs.",
  },
  b: {
    name: "Executive Leather Chair",
    link: "https://example.com/leather-chair",
    reviewText: "Plush initial seating comfort and sleek executive aesthetic. However, synthetic leather starts peeling after 8 months of daily use and traps heat during warm summer days.",
  },
};

export default function ComparePage({ setResult }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function update(side, key, value) {
    setForm({ ...form, [side]: { ...form[side], [key]: value } });
  }

  function loadSample() {
    setForm(sampleComparison);
    setError("");
  }

  function swapProducts() {
    setForm({ a: form.b, b: form.a });
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await compareProducts({ productA: form.a, productB: form.b });
      setResult({ type: "comparison", data });
      navigate("/result");
    } catch (err) {
      setError(err.message || "Failed to complete comparison. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Workspace
      eyebrow="PRODUCT COMPARISON"
      title="Two options. One clearer answer."
      description="Compare two products side by side. We’ll evaluate authentic customer consensus, weight trade-offs, and declare a clear verdict."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brown">
          Enter reviews for both options
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swapProducts}
            className="flex items-center gap-1.5 rounded-full border border-ink/15 bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink/75 transition-colors hover:bg-white"
            title="Swap Product A & B"
          >
            <ArrowRightLeft size={13} /> Swap A & B
          </button>
          <button
            type="button"
            onClick={loadSample}
            className="flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-3.5 py-1.5 text-xs font-semibold text-amber transition-colors hover:bg-amber/20"
          >
            <Sparkles size={13} /> Try sample comparison
          </button>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
        <ProductPanel
          label="Product A"
          values={form.a}
          update={(key, value) => update("a", key, value)}
        />
        <ProductPanel
          label="Product B"
          values={form.b}
          update={(key, value) => update("b", key, value)}
        />
        <div className="flex flex-col gap-4 lg:col-span-2">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <p className="font-semibold">{error}</p>
            </div>
          )}
          <div className="flex flex-col-reverse gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:justify-between sm:items-center">
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="button button-light !py-2.5"
            >
              <RotateCcw size={15} /> Reset both
            </button>
            <button disabled={busy} className="button button-dark !py-3 !px-6">
              {busy ? "Comparing..." : "Compare products"} <Scale size={17} />
            </button>
          </div>
        </div>
      </form>
      <AnimatePresence>
        {busy && <AnalysisOverlay label="Side-by-side trade-off evaluation" />}
      </AnimatePresence>
    </Workspace>
  );
}
