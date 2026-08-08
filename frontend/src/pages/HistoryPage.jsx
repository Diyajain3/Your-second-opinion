import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { History, FileText, Scale, ArrowRight, Calendar, Sparkles, Search, X } from "lucide-react";
import { getUserReviews } from "../api/review";
import { getUserComparisons } from "../api/comparisons";
import { Workspace } from "../components/RouteParts";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HistoryPage({ setResult }) {
  const [tab, setTab] = useState("all"); // "all" | "reviews" | "comparisons"
  const [searchQuery, setSearchQuery] = useState("");
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
          getUserComparisons().catch(() => []),
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

  const filteredReviews = reviews.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.productName || "").toLowerCase().includes(q) ||
      (item.honestSummary || "").toLowerCase().includes(q)
    );
  });

  const filteredComparisons = comparisons.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const nameA = item.productAName || item.productA?.name || "";
    const nameB = item.productBName || item.productB?.name || "";
    const summary = item.comparisonSummary || "";
    return (
      nameA.toLowerCase().includes(q) ||
      nameB.toLowerCase().includes(q) ||
      summary.toLowerCase().includes(q)
    );
  });

  const totalCount = reviews.length + comparisons.length;

  return (
    <Workspace
      eyebrow="SAVED ANALYSIS"
      title="Your second thoughts, remembered."
      description="Revisit all single product reviews and head-to-head comparisons you have previously analyzed."
    >
      {/* Controls & Filter bar */}
      <div className="mb-8 flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-cream/70 p-1.5 border border-ink/10">
          <button
            onClick={() => setTab("all")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              tab === "all" ? "bg-brown text-cream shadow-sm" : "text-ink/65 hover:text-ink"
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              tab === "reviews" ? "bg-brown text-cream shadow-sm" : "text-ink/65 hover:text-ink"
            }`}
          >
            <FileText size={14} /> Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setTab("comparisons")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              tab === "comparisons" ? "bg-brown text-cream shadow-sm" : "text-ink/65 hover:text-ink"
            }`}
          >
            <Scale size={14} /> Comparisons ({comparisons.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved analysis..."
            className="w-full rounded-full border border-ink/15 bg-white/70 pl-9 pr-8 py-1.5 text-xs outline-none focus:border-amber focus:ring-2 focus:ring-amber/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
            >
              <X size={13} />
            </button>
          )}
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
      ) : (
        <div className="space-y-8">
          {/* Reviews Section */}
          {(tab === "all" || tab === "reviews") && (
            <div>
              {tab === "all" && reviews.length > 0 && (
                <h2 className="mb-4 font-serif text-2xl font-semibold text-ink flex items-center gap-2">
                  <FileText size={18} className="text-amber" /> Single Reviews
                </h2>
              )}

              {filteredReviews.length === 0 ? (
                tab === "reviews" && (
                  <div className="paper-card flex flex-col items-center py-14 text-center">
                    <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-amber/20 text-amber">
                      <History size={22} />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold">No reviews is done</h3>
                    <p className="mt-1.5 max-w-sm text-xs text-ink/60">
                      Analyze customer reviews to build your saved decision history.
                    </p>
                    <button
                      onClick={() => navigate("/review")}
                      className="button button-dark mt-5 !py-2.5 !px-5"
                    >
                      Analyze a review <ArrowRight size={15} />
                    </button>
                  </div>
                )
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredReviews.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleSelectReview(item)}
                      className="paper-card group cursor-pointer transition-all hover:-translate-y-1 hover:border-amber/40 hover:shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-ink/10 pb-3">
                          <span className="eyebrow !text-[10px]">Product Review</span>
                          {item.fakeReviewScore !== undefined && (
                            <span className="flex items-center gap-1 rounded-lg bg-amber px-2 py-0.5 text-xs font-bold text-white">
                              <Sparkles size={11} /> {item.fakeReviewScore}%
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 font-serif text-xl font-semibold group-hover:text-amber transition-colors">
                          {item.productName || "Product Review"}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-ink/75 line-clamp-3">
                          {item.honestSummary || "Click to view full decision brief."}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 text-[11px] font-semibold text-brown">
                        <span className="flex items-center gap-1 text-ink/40">
                          <Calendar size={12} />
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                        <span>View brief →</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comparisons Section */}
          {(tab === "all" || tab === "comparisons") && (
            <div>
              {tab === "all" && comparisons.length > 0 && (
                <h2 className="mb-4 mt-6 font-serif text-2xl font-semibold text-ink flex items-center gap-2">
                  <Scale size={18} className="text-amber" /> Head-to-Head Comparisons
                </h2>
              )}

              {filteredComparisons.length === 0 ? (
                tab === "comparisons" && (
                  <div className="paper-card flex flex-col items-center py-14 text-center">
                    <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-amber/20 text-amber">
                      <Scale size={22} />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold">There is no comparison</h3>
                    <p className="mt-1.5 max-w-sm text-xs text-ink/60">
                      Compare two products side by side to get evidence-based verdict briefs.
                    </p>
                    <button
                      onClick={() => navigate("/compare")}
                      className="button button-dark mt-5 !py-2.5 !px-5"
                    >
                      Compare products <ArrowRight size={15} />
                    </button>
                  </div>
                )
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredComparisons.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleSelectComparison(item)}
                      className="paper-card group cursor-pointer transition-all hover:-translate-y-1 hover:border-amber/40 hover:shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-ink/10 pb-3">
                          <span className="eyebrow !text-[10px]">Comparison</span>
                          {item.winner && (
                            <span className="rounded-full bg-brown px-2.5 py-0.5 text-[10px] font-semibold text-cream">
                              Verdict: {item.winner}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 font-serif text-xl font-semibold group-hover:text-amber transition-colors">
                          {item.productAName || item.productA?.name || "Product A"} vs{" "}
                          {item.productBName || item.productB?.name || "Product B"}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-ink/75 line-clamp-3">
                          {item.comparisonSummary || "Click to view full comparison brief."}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 text-[11px] font-semibold text-brown">
                        <span className="flex items-center gap-1 text-ink/40">
                          <Calendar size={12} />
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                        </span>
                        <span>View brief →</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty state when zero total history */}
          {totalCount === 0 && (
            <div className="paper-card flex flex-col items-center py-16 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-amber/20 text-amber">
                <History size={24} />
              </div>
              <h3 className="font-serif text-2xl font-semibold">No reviews is done</h3>
              <p className="mt-2 max-w-md text-xs text-ink/60">
                Start by analyzing a product review or comparing two products to build your decision history.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => navigate("/review")} className="button button-dark !py-2.5 !px-5">
                  Review a product <ArrowRight size={15} />
                </button>
                <button onClick={() => navigate("/compare")} className="button button-light !py-2.5 !px-5">
                  Compare options <Scale size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Workspace>
  );
}
