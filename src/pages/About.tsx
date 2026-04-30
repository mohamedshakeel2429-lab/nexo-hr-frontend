import { motion } from 'motion/react';
import { Target, Eye, Gem, Award, Users2, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';

export default function About() {
  const { about, global: g } = useSiteContent();

  return (
    <div className="pt-24 md:pt-32 pb-20">
      {/* Header */}
      <section className="section-padding text-center space-y-4 md:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-brand-accent text-xs font-bold uppercase tracking-widest"
        >
          Our Story
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-7xl font-bold text-white"
        >
          {about.heading.split(' ').slice(0, 2).join(' ')}{' '}
          <span className="text-gradient">{about.heading.split(' ').slice(2).join(' ')}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto"
        >
          {about.story}
        </motion.p>
      </section>

      {/* Grid Content */}
      <section className="section-padding">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden glass p-3 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
                alt="Office Meeting"
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 glass p-5 md:p-8 rounded-full border-brand-accent/40 animate-bounce [animation-duration:3s]">
              <p className="text-2xl md:text-4xl font-bold text-brand-accent leading-none">{g.experience}</p>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Years of<br />Practice
              </p>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 mt-6 lg:mt-0">
            <h2 className="text-2xl md:text-4xl font-bold text-white">Who We Are</h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Founded in Chennai, NEXO HR Solutions emerged from a single vision: to provide growing businesses with the same caliber of HR expertise often reserved for Fortune 500 companies.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              We don't just "offer services"—we integrate into your ecosystem. Whether you're a 10-person startup or a 500-employee manufacturing unit, our approach is always human-centric, data-driven, and compliance-first.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: Target, title: 'Mission', desc: about.mission },
                { icon: Eye, title: 'Vision', desc: about.vision },
              ].map((item, i) => (
                <div key={i} className="glass p-5 md:p-6 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                    <item.icon size={20} />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-white">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-slate-900/30">
        <div className="text-center mb-10 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Our Core Commitments</h2>
          <p className="text-slate-400 text-sm md:text-base">The pillars that define every NEXO partnership.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8">
          {[
            {
              icon: Gem,
              title: 'Integrity First',
              desc: "Transparent payroll and ethical recruitment aren't just goals—they are our starting point.",
            },
            {
              icon: Award,
              title: 'Compliance Excellence',
              desc: "Stay 100% legal. We handle the paperwork, audits, and statutory headaches so you don't have to.",
            },
            {
              icon: Users2,
              title: 'Empathetic Strategy',
              desc: 'HR should serve both business goals and human needs. We strike that delicate balance every day.',
            },
          ].map((value, i) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={i}
              className="glass p-6 md:p-10 rounded-3xl text-center space-y-3 md:space-y-4 hover:border-brand-accent/50 transition-colors sm:last:col-span-2 md:last:col-span-1"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-brand-accent/20 to-blue-500/10 flex items-center justify-center text-brand-accent mx-auto mb-3 md:mb-4 border border-white/10">
                <value.icon size={24} />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white">{value.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promise */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto glass p-6 sm:p-10 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center space-y-6 md:space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 blur-3xl" />
          <Building2 size={40} className="mx-auto text-brand-accent opacity-50 mb-2 md:mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold text-white">Our Promise to You</h3>
          <p className="text-base md:text-xl text-slate-300 italic">
            "We treat your business as our own. Your growth is the only metric of our success. We don't just solve
            problems; we build the future of your workplace."
          </p>
          <div className="h-px w-20 bg-brand-accent mx-auto" />
          <Link
            to="/contact"
            className="inline-block text-brand-accent font-bold uppercase tracking-widest hover:text-white transition-colors text-sm md:text-base"
          >
            Discuss partnership →
          </Link>
        </div>
      </section>
    </div>
  );
}
