import { motion } from 'framer-motion'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

export function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />
}

export function Workspace({ eyebrow, title, description, children }) {
  return <main className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-20"><div className="mb-10 max-w-2xl"><p className="eyebrow">{eyebrow}</p><h1 className="display mt-4 text-5xl">{title}</h1><p className="mt-5 text-base leading-7 text-ink/60">{description}</p></div>{children}</main>
}

export function AnalysisOverlay({ label }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 p-5 backdrop-blur-md"><motion.div initial={{ scale: .92, y: 12 }} animate={{ scale: 1, y: 0 }} className="paper-card flex w-full max-w-sm flex-col items-center gap-5 py-10 text-center"><div className="analysis-spinner"><span /></div><div><p className="eyebrow justify-center">A moment to think</p><h2 className="mt-3 font-serif text-2xl font-semibold">{label}</h2><p className="mt-2 text-sm leading-6 text-ink/55">We&apos;re looking past the obvious signals.</p></div></motion.div></motion.div>
}
