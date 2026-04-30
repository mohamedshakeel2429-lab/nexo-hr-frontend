import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Why Us', path: '/why-us' },
    { name: 'Careers', path: '/careers' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'h-[72px] glass shadow-2xl bg-slate-900/80' : 'h-[88px] bg-transparent'
      } flex items-center`}
    >
      <div className="max-w-7xl mx-auto px-12 w-full flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:rotate-12 transition-transform duration-500">
              <path d="M25 75C25 75 35 35 50 50C65 65 75 25 75 25" stroke="url(#logo_grad)" strokeWidth="12" strokeLinecap="round" />
              <circle cx="25" cy="75" r="8" fill="#6366f1" />
              <circle cx="75" cy="25" r="8" fill="#10b981" />
              <circle cx="50" cy="50" r="6" fill="#4f46e5" />
              <defs>
                <linearGradient id="logo_grad" x1="25" y1="75" x2="75" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tighter uppercase logo bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">
            NEXO <span className="font-light">HR</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[15px] font-medium hover:text-brand-accent transition-colors ${
                location.pathname === link.path ? 'text-brand-accent' : 'text-slate-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            to="/contact" 
            className="btn-primary px-6 py-2.5 text-[15px] flex items-center gap-2"
          >
            Book Free Consultation
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-slate-300 hover:text-brand-teal"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center py-4"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
