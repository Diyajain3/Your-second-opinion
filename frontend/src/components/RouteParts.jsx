import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

export function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

export function Workspace({ eyebrow = "SECOND OPINION", title, description, children }) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-16">
      <div className="mb-8 max-w-2xl">
        {eyebrow && (
          <p className="eyebrow">
            <span className="eyebrow-dot" /> {eyebrow}
          </p>
        )}
        <h1 className="display mt-3 text-4xl sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 text-base leading-relaxed text-ink/65 sm:text-lg">
            {description}
          </p>
        )}
      </div>
      {children}
    </main>
  );
}

const analysisSteps = [
  "Reading review text & operational details...",
  "Evaluating genuine signal vs promotional noise...",
  "Synthesizing key pros, cons & decision brief...",
];

export function AnalysisOverlay({ label = "Analyzing signals" }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 16 }}
        className="paper-card flex w-full max-w-md flex-col items-center gap-6 py-8 px-6 text-center shadow-2xl"
      >
        <LoadingSpinner />
        
        <div>
          <span className="eyebrow justify-center">
            <Sparkles size={13} className="text-amber" /> Evidence Analysis
          </span>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">{label}</h2>
        </div>

        <div className="w-full space-y-2.5 rounded-2xl bg-cream/70 p-4 border border-ink/10 text-left">
          {analysisSteps.map((stepText, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs font-semibold transition-all duration-300 ${
                  isDone
                    ? "text-brown"
                    : isCurrent
                    ? "text-amber font-bold scale-[1.01]"
                    : "text-ink/35"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={16} className="text-amber shrink-0" />
                ) : isCurrent ? (
                  <span className="size-2 rounded-full bg-amber animate-ping shrink-0" />
                ) : (
                  <span className="size-2 rounded-full bg-ink/20 shrink-0" />
                )}
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>

        <p className="flex items-center justify-center gap-1.5 text-xs text-ink/50 font-medium">
          <ShieldCheck size={14} className="text-brown/70" />
          Evaluating authentic buyer feedback objectively
        </p>
      </motion.div>
    </motion.div>
  );
}
