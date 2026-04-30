import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { useSiteContent } from '../context/SiteContentContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Home() {
  const { hero, global: g } = useSiteContent();

  return (
    <div className="relative overflow-hidden pt-20 transition-colors duration-500">
      <div className="fixed inset-0 gradient-overlay -z-20" />

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center section-padding">
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="text-[12px] font-bold text-brand-accent uppercase tracking-[2px] mb-2 px-1">
              Chennai's Premier SME Partner
            </div>

            <h1 className="text-[52px] font-extrabold leading-[1.1] text-white m-0">
              {hero.heading} <br />
              <span className="text-gradient">{hero.gradientText}</span>
            </h1>

            <p className="subtext text-[18px] text-slate-400 max-w-xl leading-[1.6]">
              {hero.subtitle}
            </p>

            <div className="flex gap-4 pt-2">
              <Link to="/contact" className="btn-primary px-8 py-3 text-[15px]">
                {hero.cta.primary}
              </Link>
              <Link to="/services" className="btn-secondary px-8 py-3 text-[15px]">
                {hero.cta.secondary}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="lg:col-span-4 hidden lg:block"
          >
            <div className="glass p-8 rounded-[24px] space-y-2 border-brand-glass-border">
              <div className="text-[48px] font-extrabold text-brand-primary">{g.experience}</div>
              <div className="text-[18px] font-semibold text-white">Years of Expertise</div>
              <div className="text-[14px] text-slate-500 leading-relaxed">
                Cross-industry HR excellence serving Chennai and beyond.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white/5 border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-gradient">{g.experience}</span>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Years of Cross-Industry<br />HR Expertise
            </p>
          </div>
          <div className="h-10 w-px bg-white/10 hidden md:block" />
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-gradient">100%</span>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Compliance Driven<br />Framework
            </p>
          </div>
          <div className="h-10 w-px bg-white/10 hidden md:block" />
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-gradient">Fast</span>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              SME-Focused<br />Accountability
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding py-[60px]" id="services">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const iconColors = ['#6366f1', '#10b981', '#8b5cf6', '#f43f5e'];
            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-[16px] h-[240px] flex flex-col justify-between transition-all duration-300 border backdrop-blur-sm ${
                  service.featured
                    ? 'bg-brand-primary/10 border-brand-primary shadow-[0_0_30px_rgba(99,102,241,0.1)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-6"
                    style={{ backgroundColor: service.featured ? '#6366f1' : iconColors[index % 4] }}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <h4 className="text-[18px] font-bold text-white mb-2">{service.title}</h4>
                  <p className="text-slate-400 text-[13px] leading-relaxed">
                    {service.description.split('.')[0]}.
                  </p>
                </div>
                <div className="text-[12px] font-bold text-brand-accent uppercase tracking-widest flex items-center gap-2">
                  {service.featured
                    ? 'Hire Top Talent →'
                    : index === 1
                    ? 'Automated Flow'
                    : index === 2
                    ? 'Risk-Free'
                    : 'Strategic Arm'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Banner */}
      <section className="h-[60px] flex justify-around items-center glass-dark border-y border-white/10">
        {[
          { label: 'Expertise', val: 'Industry Standard' },
          { label: 'Focus', val: 'SME Specialists' },
          { label: 'Pricing', val: 'Cost Effective' },
          { label: 'Delivery', val: 'Process Driven' },
        ].map((item, i) => (
          <div key={i} className="text-center group cursor-default">
            <span className="text-[13px] text-slate-500 font-medium group-hover:text-brand-accent transition-colors">
              {item.label}
            </span>
            <div className="text-[15px] font-bold text-white group-hover:text-brand-primary transition-colors">
              {item.val}
            </div>
          </div>
        ))}
      </section>

      {/* Process Section */}
      <section className="section-padding">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-blue-400 font-bold uppercase tracking-[0.2em] text-sm">How we work</h2>
          <h3 className="text-4xl font-bold text-white">Our Strategic Roadmap</h3>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 hidden lg:block" />
          <div className="grid lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discover', desc: 'Understanding your culture and bottlenecks.' },
              { step: '02', title: 'Plan', desc: 'Crafting a bespoke HR strategy that fits your budget.' },
              { step: '03', title: 'Execute', desc: 'Rolling out systems with minimal disruption.' },
              { step: '04', title: 'Optimize', desc: 'Continuous feedback and data-driven upgrades.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative z-10 text-center space-y-4 p-8 glass rounded-3xl lg:p-0 lg:bg-transparent lg:border-none lg:backdrop-blur-none"
              >
                <div className="w-16 h-16 bg-brand-blue border-2 border-brand-teal rounded-full flex items-center justify-center mx-auto text-2xl font-black text-brand-teal shadow-[0_0_20px_rgba(20,184,166,0.3)] mb-4">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-white">{item.title}</h4>
                <p className="text-slate-400 text-sm max-w-[200px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="relative glass p-12 md:p-20 rounded-[3rem] overflow-hidden text-center space-y-10 group">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-teal/20 via-transparent to-blue-500/20 -z-10 group-hover:opacity-100 transition-opacity" />

          <h2 className="text-4xl md:text-6xl font-bold text-white max-w-3xl mx-auto">
            Ready to Build a <br />
            <span className="text-gradient">Powerhouse Workplace?</span>
          </h2>

          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto">
            Focus on your business. Let us handle the people. Schedule your free discovery session today.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6 pt-4">
            <Link to="/contact" className="btn-primary text-xl px-12 py-6">
              Book Free Consultation
            </Link>
            <div className="text-left space-y-1 flex flex-col justify-center px-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center md:text-left">
                Immediate Support
              </p>
              <a
                href={`tel:${g.phone}`}
                className="text-white font-display font-medium text-xl hover:text-brand-teal transition-colors text-center md:text-left"
              >
                {g.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
