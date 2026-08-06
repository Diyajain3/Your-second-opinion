import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, LogOut, Menu, X } from 'lucide-react'
import Logo from './Logo'

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/90 backdrop-blur-xl"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8"><Logo /><button className="rounded-full p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={20} /> : <Menu size={20} />}</button><nav className={`${open ? 'flex' : 'hidden'} absolute inset-x-4 top-16 flex-col gap-2 rounded-2xl border border-ink/10 bg-cream p-3 shadow-xl md:static md:flex md:flex-row md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>{user ? <><Link onClick={close} className="nav-link" to="/review">Review a product</Link><Link onClick={close} className="nav-link" to="/compare">Compare products</Link><button onClick={onLogout} className="nav-link flex items-center gap-2 text-left"><LogOut size={15} /> Sign out</button></> : <><Link onClick={close} className="nav-link" to="/login">Log in</Link><Link onClick={close} className="button button-dark" to="/signup">Get started <ArrowRight size={16} /></Link></>}</nav></div></header>
}
