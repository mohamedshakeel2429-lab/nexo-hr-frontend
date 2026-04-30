import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export default function Footer() {
  const { global: g } = useSiteContent();

  return (
    <footer className="relative bg-slate-950 pt-20 pb-10 border-t border-white/5 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt={g.companyName}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">{g.tagline}</p>
          <div className="flex gap-4">
            {[
              { Icon: Linkedin, href: g.linkedin },
              { Icon: Twitter, href: g.twitter },
              { Icon: Facebook, href: g.facebook },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-brand-accent hover:border-brand-accent/50 transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-white font-bold mb-6">Explore</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link to="/about" className="hover:text-brand-accent transition-colors">Who We Are</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent transition-colors">Our Services</Link></li>
            <li><Link to="/why-us" className="hover:text-brand-accent transition-colors">Why Choose Us</Link></li>
            <li><Link to="/careers" className="hover:text-brand-accent transition-colors">Careers</Link></li>
            <li><Link to="/admin" className="hover:text-brand-accent transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-bold mb-6">Services</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link to="/services" className="hover:text-brand-accent transition-colors">Recruitment</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent transition-colors">Payroll Management</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent transition-colors">Statutory Compliance</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent transition-colors">HR Advisory</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-6">Get In Touch</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-brand-accent flex-shrink-0" />
              <a href={`tel:${g.phone}`} className="hover:text-brand-accent transition-colors">{g.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-brand-accent flex-shrink-0" />
              <a href={`mailto:${g.email}`} className="hover:text-brand-accent transition-colors">{g.email}</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
              <span>{g.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium uppercase tracking-widest">
        <p>© {new Date().getFullYear()} {g.companyName}. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-brand-accent transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-accent transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
