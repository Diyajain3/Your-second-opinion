import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { History, FileText, Scale, ArrowRight, Calendar, Sparkles } from "lucide-react";
import { getUserReviews } from "../api/review";
import { getUserComparisons } from "../api/comparisons";
import { Workspace } from "../components/RouteParts";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HistoryPage({ setResult }) {
  const [tab, setTab] = useState("reviews"); // "reviews" | "comparisons"
  const [reviews, setReviews] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [revRes, compRes] = await Promise.all([
          getUserReviews().catch(() => []),
          getUserComparisons().catch(() => [])
        ]);
        setReviews(revRes || []);
        setComparisons(compRes || []);
      } catch (err) {
        setError(err.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function handleSelectReview(item) {
    setResult({ type: "review", data: item });
    navigate("/result");
  }

  function handleSelectComparison(item) {
    setResult({ type: "comparison", data: item });
    navigate("/result");
  }

  return (
    <Workspace
      title="Your second thoughts, remembered."
      description="Review all products and comparisons you have previously analyzed. Click any card to re-open the full decision brief."
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
        <div className="flex items-center gap-2 rounded-2xl bg-cream/70 p-1 border border-ink/10">
          <button
            onClick={() => setTab("reviews")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              tab === "reviews"
                ? "bg-brown text-cream shadow-md"
                : "text-ink/65 hover:text-ink"
            }`}
          >
            <FileText size={16} /> Single Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setTab("comparisons")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              tab === "comparisons"
                ? "bg-brown text-cream shadow-md"
                : "text-ink/65 hover:text-ink"
            }`}
          >
            <Scale size={16} /> Comparisons ({comparisons.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="paper-card flex flex-col items-center justify-center py-16 text-center">
          <LoadingSpinner />
          <p className="mt-4 text-sm font-semibold text-ink/60">Fetching your decision history...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 p-6 text-center text-red-700">
          <p>{error}</p>
        </div>
      ) : tab === "reviews" ? (
        reviews.length === 0 ? (
          <div className="paper-card flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-amber/20 text-amber">
              <History size={24} />
            </div>
            <h3 className="font-serif text-2xl font-semibold">No reviews is done</h3>
            <p className="mt-2 max-w-md text-sm text-ink/60">
              When you analyze product reviews, they will show up here so you can revisit them anytime.
            </p>
            <button
              onClick={() => navigate("/review")}
              className="button button-dark mt-6"
            >
              Analyze a review <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleSelectReview(item)}
                className="paper-card group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="eyebrow">Product Review</span>
                      {item.createdAt && (
                        <span className="flex items-center gap-1 text-xs text-ink/40">
                          <Calendar size={13} />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-serif text-2xl font-semibold group-hover:text-amber">
                      {item.productName || "Product Review"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.fakeReviewScore !== undefined && (
                      <div className="flex items-center gap-1 rounded-xl bg-amber px-3 py-1.5 text-cream">
                        <Sparkles size={14} />
                        <span className="font-serif text-lg font-semibold">{item.fakeReviewScore}%</span>
                      </div>
                    )}
                    <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold capitalize text-brown">
                      {item.overallSentiment || "mixed"}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-ink/70 line-clamp-2">
                  {item.honestSummary || "Click to view full decision brief."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-xs font-semibold text-brown">
                  <span>View full brief & details →</span>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : comparisons.length === 0 ? (
        <div className="paper-card flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-amber/20 text-amber">
            <Scale size={24} />
          </div>
          <h3 className="font-serif text-2xl font-semibold">There is no comparison</h3>
          <p className="mt-2 max-w-md text-sm text-ink/60">
            Compare two products to get side-by-side signal briefs saved right here.
          </p>
          <button
            onClick={() => navigate("/compare")}
            className="button button-dark mt-6"
          >
            Compare products <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {comparisons.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleSelectComparison(item)}
              className="paper-card group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="eyebrow">Comparison</span>
                    {item.createdAt && (
                      <span className="flex items-center gap-1 text-xs text-ink/40">
                        <Calendar size={13} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-serif text-2xl font-semibold group-hover:text-amber">
                    {item.productAName || item.productA?.name || "Product A"} vs{" "}
                    {item.productBName || item.productB?.name || "Product B"}
                  </h3>
                </div>
                {item.winner && (
                  <span className="rounded-full bg-brown px-3 py-1.5 text-xs font-semibold text-cream">
                    Verdict: {item.winner}
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-6 text-ink/70 line-clamp-2">
                {item.comparisonSummary || "Click to view full comparison details."}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-xs font-semibold text-brown">
                <span>View full comparison brief →</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Workspace>
  );
}
