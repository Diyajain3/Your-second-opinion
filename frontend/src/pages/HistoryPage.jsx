import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { History, FileText, Scale, ArrowRight, Calendar, Sparkles, Search, X, Users, User } from "lucide-react";
import { getUserReviews } from "../api/review";
import { getUserComparisons } from "../api/comparisons";
import { Workspace } from "../components/RouteParts";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatWinnerName } from "../components/ResultCards";

export default function HistoryPage({ setResult }) {
  const [tab, setTab] = useState("all"); // "all" | "reviews" | "comparisons"
  const [scope, setScope] = useState("my"); // "my" | "all"
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
          getUserReviews(scope).catch(() => []),
          getUserComparisons(scope).catch(() => []),
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
  }, [scope]);

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
      eyebrow="SAVED ANALYSIS & DECISIONS"
      title={scope === "my" ? "Your second thoughts, remembered." : "Community decision feed."}
      description={
        scope === "my"
          ? "Revisit all single product reviews and head-to-head comparisons you have previously analyzed."
          : "Explore real product analyses and comparisons created across the entire community."
      }
    >
      {/* Scope Selector: My Decisions vs All Community Reviews */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-amber-50/70 p-3 border border-amber-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScope("my")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              scope === "my"
                ? "bg-brown text-cream shadow-sm"
                : "bg-white/80 text-ink/70 hover:bg-white hover:text-ink border border-ink/10"
            }`}
          >
            <User size={14} /> My Saved Decisions
          </button>
          <button
            type="button"
            onClick={() => setScope("all")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              scope === "all"
                ? "bg-brown text-cream shadow-sm"
                : "bg-white/80 text-ink/70 hover:bg-white hover:text-ink border border-ink/10"
            }`}
          >
            <Users size={14} /> All Community Reviews
          </button>
        </div>

        <span className="text-xs font-medium text-ink/65">
          {scope === "my" ? "Showing your private saved decisions" : "Showing all public community reviews & comparisons"}
        </span>
      </div>

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

        {/* Live Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name..."
            className="w-full rounded-2xl border border-ink/15 bg-white py-2 pl-9 pr-8 text-xs text-ink placeholder:text-ink/40 focus:border-amber focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-16 text-center">
          <LoadingSpinner label="Retrieving your decision history..." />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="paper-card border-red-200 bg-red-50 text-red-700 text-center py-8">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Main Content Feed */}
      {!loading && !error && (
        <div className="space-y-10">
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
                      <FileText size={20} />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-ink">No reviews found</h3>
                    <p className="mt-1 text-xs text-ink/65 max-w-sm">
                      {searchQuery
                        ? `No saved reviews match "${searchQuery}".`
                        : "Analyze your first product review to see it here."}
                    </p>
                  </div>
                )
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredReviews.map((item) => (
                    <motion.div
                      key={`review-${item.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleSelectReview(item)}
                      className="paper-card group cursor-pointer transition-all hover:-translate-y-1 hover:border-amber/40 hover:shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-ink/10 pb-3">
                          <span className="eyebrow !text-[10px]">Review</span>
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
                      <Scale size={20} />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-ink">No comparisons found</h3>
                    <p className="mt-1 text-xs text-ink/65 max-w-sm">
                      {searchQuery
                        ? `No saved comparisons match "${searchQuery}".`
                        : "Compare two products to build your first head-to-head brief."}
                    </p>
                  </div>
                )
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredComparisons.map((item) => (
                    <motion.div
                      key={`comp-${item.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleSelectComparison(item)}
                      className="paper-card group cursor-pointer transition-all hover:-translate-y-1 hover:border-amber/40 hover:shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-ink/10 pb-3">
                          <span className="eyebrow !text-[10px]">Comparison</span>
                          {item.winner && (
                            <span className="rounded-full bg-brown px-2.5 py-0.5 text-[10px] font-semibold text-cream max-w-[180px] truncate" title={formatWinnerName(item.winner, item.productAName || item.productA?.name, item.productBName || item.productB?.name)}>
                              Verdict: {formatWinnerName(item.winner, item.productAName || item.productA?.name, item.productBName || item.productB?.name)}
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
              <h3 className="font-serif text-2xl font-semibold text-ink">
                {scope === "my" ? "Your history is empty" : "No community reviews found yet"}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink/65 max-w-md">
                {scope === "my"
                  ? "When you run reviews or comparisons, your saved decision briefs will automatically appear here."
                  : "As users analyze reviews and compare products, all community briefs will appear here."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/review")}
                  className="button button-amber !py-2.5 !px-5 !text-xs"
                >
                  Analyze a review
                </button>
                <button
                  onClick={() => navigate("/compare")}
                  className="button button-dark !py-2.5 !px-5 !text-xs"
                >
                  Compare products
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Workspace>
  );
}
