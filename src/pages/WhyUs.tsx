import { motion } from 'motion/react';
import { ShieldCheck, Zap, Users, BarChart3, ArrowRight, MinusSquare, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WhyUs() {
  return (
    <div className="pt-32 pb-20">
      <section className="section-padding text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-brand-accent text-xs font-bold uppercase tracking-widest">
           The NEXO Edge
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Why Businesses <span className="text-gradient">Trust Us</span></h1>
        <p className="text-slate-400 text-[18px] max-w-2xl mx-auto leading-relaxed">
          We don't just provide HR. We build the architecture of growth. See how we transform traditional HR into a strategic advantage.
        </p>
      </section>

      {/* Comparison Section */}
      <section className="section-padding">
        <div className="grid md:grid-cols-2 gap-8">
           <div className="glass p-12 rounded-[3.5rem] bg-slate-900/50 border-red-500/10">
              <div className="flex items-center gap-3 mb-8 text-red-500">
                 <MinusSquare size={32} />
                 <h3 className="text-2xl font-bold uppercase tracking-tight">Traditional HR</h3>
              </div>
              <ul className="space-y-6">
                 {[
                   'Reactive recruiting based on immediate fire-fighting.',
                   'Manual payroll processes prone to errors.',
                   'Static compliance checks often missing new regulations.',
                   'High overhead costs for in-house HR infrastructure.',
                   'Low employee engagement and weak culture tracking.'
                 ].map((point, i) => (
                   <li key={i} className="flex gap-4 text-slate-500 text-sm italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/30 mt-2 flex-shrink-0" />
                      <span>{point}</span>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="glass p-12 rounded-[3.5rem] bg-gradient-to-br from-brand-accent/20 via-brand-blue to-blue-500/5 border-brand-accent/30 ring-1 ring-brand-accent/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 blur-3xl" />
              <div className="flex items-center gap-3 mb-8 text-brand-accent">
                 <ShieldCheck size={32} />
                 <h3 className="text-2xl font-bold uppercase tracking-tight">The NEXO Way</h3>
              </div>
              <ul className="space-y-6">
                 {[
                   'Proactive pipeline management and behavioral headhunting.',
                   'Automated, zero-error digital payroll disbursement.',
                   '100% legal safety net with real-time statutory updates.',
                   'Fractional pricing: Enterprise-grade HR for an SME budget.',
                   'Data-driven engagement strategy culture-building.'
                 ].map((point, i) => (
                   <li key={i} className="flex gap-4 text-slate-200 font-bold group">
                      <CheckCircle2 size={18} className="text-brand-accent mt-0.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                      <span>{point}</span>
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </section>

      {/* Visual Stats */}
      <section className="section-padding bg-slate-950/40 border-y border-white/5">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
           {[
             { val: '40%', label: 'Avg. Reduction in Hiring Time', icon: Zap },
             { val: '0', label: 'Statutory Penalty Incidents', icon: ShieldCheck },
             { val: '10+', label: 'Industry Expertise Verticals', icon: BarChart3 },
             { val: '5k+', label: 'Employees Managed Monthly', icon: Users }
           ].map((stat, i) => (
             <div key={i} className="space-y-3 group">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-brand-accent mx-auto mb-4 group-hover:scale-110 transition-transform">
                   <stat.icon size={24} />
                </div>
                <p className="text-5xl font-black text-white">{stat.val}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed px-10">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Storytelling Grid */}
      <section className="section-padding">
        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 glass rounded-[3rem] overflow-hidden group">
              <div className="grid md:grid-cols-2 h-full">
                 <div className="p-12 space-y-6 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-white uppercase tracking-tight">Chennai's Local <br/> SME Experts</h3>
                    <p className="text-slate-400 text-[15px] leading-relaxed">
                       We understand the unique labor landscape of Chennai and Tamil Nadu. Our team navigates local liaisoning and cultural nuances that global platforms often miss.
                    </p>
                    <Link to="/contact" className="inline-flex items-center gap-2 text-brand-accent font-bold hover:gap-4 transition-all">
                       Work with local experts <ArrowRight size={18} />
                    </Link>
                 </div>
                 <div className="relative h-64 md:h-auto overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                      alt="Local Expertise" 
                      className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                 </div>
              </div>
           </div>
           
           <div className="glass p-12 rounded-[3.5rem] flex flex-col justify-center bg-gradient-to-t from-brand-primary/10 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Cost vs. Value</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                 Hiring a Senior HR Manager costs ~₹12L/year. NEXO provides a multi-skilled HR team, software tools, and compliance audits for a fraction of that cost. 
              </p>
              <div className="space-y-4">
                 <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">In-house Cost</span>
                    <span className="text-lg font-bold text-red-500">₹₹₹</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">NEXO Managed</span>
                    <span className="text-lg font-bold text-brand-accent">₹</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Experience the transformation</h2>
        <Link to="/contact" className="btn-primary px-10 py-5 text-[16px] uppercase tracking-[0.2em]">
          Schedule Free Audit Session
        </Link>
      </section>
    </div>
  );
}
