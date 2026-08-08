import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Scale } from "lucide-react";
import { compareProducts } from "../api/comparisons";
import ProductPanel from "../components/ProductPanel";
import { AnalysisOverlay, Workspace } from "../components/RouteParts";

const emptyProduct = { name: "", link: "", reviewText: "" };
const emptyForm = { a: emptyProduct, b: emptyProduct };

export default function ComparePage({ setResult }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  function update(side, key, value) {
    setForm({ ...form, [side]: { ...form[side], [key]: value } });
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
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Workspace
      title="Two options. One clearer answer."
      description="Give both products an honest read. We’ll put their strengths side by side and help you find the better fit."
    >
      <form onSubmit={submit} className="grid gap-5 lg:grid-cols-2">
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
        <div className="flex flex-col gap-3 lg:col-span-2">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="button button-light"
            >
              Reset both
            </button>
            <button disabled={busy} className="button button-dark">
              {busy ? "Comparing..." : "Compare products"} <Scale size={17} />
            </button>
          </div>
        </div>
      </form>
      <AnimatePresence>
        {busy && <AnalysisOverlay label="Finding the better fit" />}
      </AnimatePresence>
    </Workspace>
  );
}
