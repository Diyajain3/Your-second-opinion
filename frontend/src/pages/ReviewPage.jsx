import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ReviewForm from "../components/ReviewForm";
import { AnalysisOverlay, Workspace } from "../components/RouteParts";

export default function ReviewPage({ setResult }) {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  function complete(data) {
    setResult({ type: "review", data });
    navigate("/result");
  }

  return (
    <Workspace
      title="Let’s look at this one together."
      description="Paste the review that made you hesitate. We’ll separate the useful signal from the marketing fog."
    >
      <ReviewForm onComplete={complete} onBusyChange={setBusy} />
      <AnimatePresence>
        {busy && <AnalysisOverlay label="Reading every signal" />}
      </AnimatePresence>
    </Workspace>
  );
}
