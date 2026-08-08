import { motion } from "framer-motion";
import { Navigate, useNavigate } from "react-router-dom";
import { ComparisonResult, ReviewResult } from "../components/ResultCards";

export default function ResultPage({ result }) {
  const navigate = useNavigate();
  if (!result) return <Navigate to="/review" replace />;
  const { data, type } = result;
  const isComparison = type === "comparison";
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="display mt-4 text-5xl">
              Here’s the clearer picture.
            </h1>
          </div>
          <button
            onClick={() => navigate(isComparison ? "/compare" : "/review")}
            className="button button-light self-start"
          >
            Start again
          </button>
        </div>
        {isComparison ? (
          <ComparisonResult data={data} />
        ) : (
          <ReviewResult data={data} score={data.fakeReviewScore} />
        )}
      </motion.div>
    </main>
  );
}
