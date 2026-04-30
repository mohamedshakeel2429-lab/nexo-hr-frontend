import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export default function Footer() {
  const { global: g } = useSiteContent();

  return (
    <footer className="relative bg-slate-950 pt-12 md:pt-20 pb-8 md:pb-10 border-t border-white/5 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1 space-y-5">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt={g.companyName}
              className="h-8 md:h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{g.tagline}</p>
          <div className="flex gap-3">
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
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-brand-accent hover:border-brand-accent/50 transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">Explore</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><Link to="/about" className="hover:text-brand-accent transition-colors">Who We Are</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent transition-colors">Our Services</Link></li>
            <li><Link to="/why-us" className="hover:text-brand-accent transition-colors">Why Choose Us</Link></li>
            <li><Link to="/careers" className="hover:text-brand-accent transition-colors">Careers</Link></li>
            <li><Link to="/admin" className="hover:text-brand-accent transition-colors">Admin</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">Services</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><Link to="/services" className="hover:text-brand-accent transition-colors">Recruitment</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent transition-colors">Payroll</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent transition-colors">Compliance</Link></li>
            <li><Link to="/services" className="hover:text-brand-accent transition-colors">HR Advisory</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 sm:col-span-1">
          <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">Get In Touch</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2.5">
              <Phone size={14} className="text-brand-accent flex-shrink-0" />
              <a href={`tel:${g.phone}`} className="hover:text-brand-accent transition-colors">{g.phone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={14} className="text-brand-accent flex-shrink-0" />
              <a href={`mailto:${g.email}`} className="hover:text-brand-accent transition-colors break-all">{g.email}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="text-brand-accent flex-shrink-0 mt-0.5" />
              <span>{g.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 md:pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 font-medium uppercase tracking-widest">
        <p>© {new Date().getFullYear()} {g.companyName}. All rights reserved.</p>
        <div className="flex gap-5 md:gap-8">
          <a href="#" className="hover:text-brand-accent transition-colors">Privacy</a>
          <a href="#" className="hover:text-brand-accent transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
