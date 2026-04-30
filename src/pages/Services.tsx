import { motion } from 'motion/react';
import { SERVICES } from '../constants';
import { ArrowRight, CheckCircle, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Services() {
  const [activeTab, setActiveTab] = useState(SERVICES[0].id);
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);

  return (
    <div className="pt-24 md:pt-32 pb-20">
      {/* Header */}
      <section className="section-padding text-center space-y-4 md:space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-brand-accent text-xs font-bold uppercase tracking-widest">
           Expert Solutions
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white">
          Our Strategic <span className="text-gradient">HR Suite</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
          Comprehensive, compliant, and scalable services tailored to the unique pulse of your organization.
        </p>
      </section>

      {/* Tabs Navigation */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-10 md:mb-20">
        <div className="flex flex-wrap justify-center gap-2 p-2 glass rounded-2xl">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActiveTab(s.id); setExpandedPillar(null); }}
              className={`px-3 py-2 md:px-6 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 md:gap-2 ${
                activeTab === s.id
                ? 'bg-brand-primary text-white shadow-lg scale-105'
                : 'text-slate-400 hover:text-white'
              }`}
            >
              <s.icon size={15} /> {s.title}
            </button>
          ))}
        </div>
      </section>

      {/* Detailed Content */}
      <section className="section-padding pt-0">
        <div className="glass p-5 sm:p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />

           {SERVICES.map((service) => (
             activeTab === service.id && (
               <motion.div
                 key={service.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start"
               >
                 <div className="space-y-6 md:space-y-8">
                   <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-brand-primary flex items-center justify-center text-white shadow-2xl">
                     <service.icon size={28} className="md:hidden" />
                     <service.icon size={40} className="hidden md:block" />
                   </div>
                   <div className="space-y-3 md:space-y-4">
                     <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">{service.title}</h2>
                     <p className="text-slate-400 text-base md:text-lg leading-relaxed">{service.description}</p>
                   </div>

                   <div className="grid gap-3 md:gap-4">
                      {[
                        { label: 'Strategic Process', val: service.process, icon: Sparkles },
                        { label: 'Core Benefit', val: service.benefit, icon: CheckCircle }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5">
                           <div className="text-brand-accent mt-0.5 flex-shrink-0"><item.icon size={18}/></div>
                           <div>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                             <p className="text-white font-bold text-sm md:text-base">{item.val}</p>
                           </div>
                        </div>
                      ))}
                   </div>

                   <Link to="/contact" className="inline-flex items-center gap-2 text-brand-accent font-extrabold text-base md:text-lg hover:gap-4 transition-all uppercase tracking-widest">
                      Book this service <ArrowRight size={18} />
                   </Link>
                 </div>

                 <div className="space-y-4 md:space-y-6">
                    <div className="glass p-5 md:p-8 rounded-2xl md:rounded-3xl bg-slate-900/40">
                       <h4 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Service Breakdown</h4>
                       <ul className="space-y-1">
                          {service.pillars.map((pillar, i) => (
                            <li key={i} className="border-b border-white/5 last:border-0">
                              <button
                                onClick={() => setExpandedPillar(expandedPillar === i ? null : i)}
                                className="w-full flex justify-between items-center py-3 group text-left"
                              >
                                <span className="text-slate-400 group-hover:text-white transition-colors text-sm font-medium pr-2">{pillar.title}</span>
                                <ChevronDown size={14} className={`text-brand-accent flex-shrink-0 transition-transform duration-200 ${expandedPillar === i ? 'rotate-180' : ''}`} />
                              </button>
                              {expandedPillar === i && (
                                <p className="text-slate-500 text-xs leading-relaxed pb-3 pr-4">{pillar.detail}</p>
                              )}
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="italic text-slate-500 text-sm pl-4 border-l-2 border-brand-accent">
                      * All services are customizable based on team size and industry (Manufacturing, IT, Retail, Healthcare).
                    </div>
                 </div>
               </motion.div>
             )
           ))}
        </div>
      </section>

      {/* Accordion List */}
      <section className="section-padding bg-slate-950/40">
        <div className="max-w-4xl mx-auto space-y-4">
           {SERVICES.map((s) => (
             <div key={s.id} className="glass rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
                <button
                  onClick={() => setActiveTab(s.id)}
                  className="w-full p-4 md:p-6 flex justify-between items-center text-left"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                     <s.icon className={`transition-colors flex-shrink-0 ${activeTab === s.id ? 'text-brand-accent' : 'text-slate-500'}`} size={20} />
                     <span className={`font-bold text-sm md:text-base transition-colors ${activeTab === s.id ? 'text-white' : 'text-slate-400'}`}>{s.title} Overview</span>
                  </div>
                  <ChevronDown className={`flex-shrink-0 ml-2 transition-transform duration-300 ${activeTab === s.id ? 'rotate-180 text-brand-accent' : 'text-slate-600'}`} />
                </button>
                {activeTab === s.id && (
                  <div className="px-4 sm:px-8 md:px-16 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4 md:pt-6">
                    Detailed technical explanation of the {s.title} workflow. This includes how NEXO handles the initial intake, the ongoing management phase, and the quarterly audit checks. We ensure that every document is logged and every process is scalable for your business growth.
                  </div>
                )}
             </div>
           ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Need a custom plan?</h2>
        <p className="text-slate-400 mb-8 md:mb-10 max-w-xl mx-auto">
          We specialize in creating bespoke HR engagement models that optimize costs while maximizing talent retention.
        </p>
        <Link to="/contact" className="btn-primary uppercase tracking-widest text-[14px] md:text-[16px]">
          Build My Custom HR Strategy
        </Link>
      </section>
    </div>
  );
}
