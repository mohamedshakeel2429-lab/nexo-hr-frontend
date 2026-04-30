import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Calendar, Users, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { contactService } from '../services/contact.service';
import type { AxiosError } from 'axios';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  services: string[];
  message: string;
}

const SERVICE_OPTIONS = [
  { id: 'Recruitment', icon: Users, label: 'Recruitment' },
  { id: 'Payroll', icon: Calendar, label: 'Payroll' },
  { id: 'Compliance', icon: ShieldCheck, label: 'Compliance' },
  { id: 'Advisory', icon: MessageSquare, label: 'Advisory' },
];

export default function Contact() {
  const { global: g } = useSiteContent();
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState<FormData>({
    name: '', company: '', email: '', phone: '', services: [], message: '',
  });

  const toggleService = (id: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setErrorMsg('');

    try {
      await contactService.submit(form);
      setFormState('success');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setErrorMsg(axiosErr.response?.data?.message || 'Something went wrong. Please try again.');
      setFormState('error');
    }
  };

  const resetForm = () => {
    setForm({ name: '', company: '', email: '', phone: '', services: [], message: '' });
    setFormState('idle');
    setErrorMsg('');
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 blur-[150px] -z-10 rounded-full" />

      <section className="section-padding text-center space-y-4 md:space-y-6">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight uppercase">
          Let's Talk <span className="text-gradient underline decoration-brand-accent/20">HR</span>
        </h1>
        <p className="text-slate-400 text-base md:text-[18px] max-w-2xl mx-auto leading-relaxed">
          Scale your business securely. Book a free consultation with our advisory team and discover the NEXO advantage.
        </p>
      </section>

      <section className="section-padding pt-0">
        <div className="grid lg:grid-cols-5 gap-6 md:gap-12">
          {/* Info Side */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-6 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-8 md:space-y-12 h-full flex flex-col justify-between">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Direct Channels</h3>
                <div className="space-y-8">
                  {[
                    { icon: Phone, label: 'Call us directly', val: g.phone, link: `tel:${g.phone}` },
                    { icon: Mail, label: 'Email support', val: g.email, link: `mailto:${g.email}` },
                    { icon: MapPin, label: 'Visit our office', val: g.address, link: '#' },
                  ].map((item, i) => (
                    <a key={i} href={item.link} className="flex items-center gap-6 group">
                      <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-blue transition-all shadow-lg border-white/5">
                        <item.icon size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-white font-bold group-hover:text-brand-accent transition-colors">{item.val}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Office Hours</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Mon – Fri</span>
                  <span className="text-white font-bold text-xs px-3 py-1 glass rounded-lg border-white/10">
                    {g.officeHours.split('·')[1]?.trim() ?? '9 AM – 6 PM'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm opacity-60">
                  <span className="text-slate-300">Sat – Sun</span>
                  <span className="text-white font-bold text-xs">CLOSED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-3">
            <div className="glass p-5 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] relative overflow-hidden h-full">
              <AnimatePresence mode="wait">
                {formState === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12 px-6"
                  >
                    <div className="w-24 h-24 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent mb-8 animate-bounce transition-all [animation-duration:3s]">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 uppercase tracking-tighter">Request Received!</h3>
                    <p className="text-slate-400 text-lg max-w-sm mb-10 leading-relaxed">
                      Our HR expert will reach out to you within the next 4 working hours to schedule a specialized discovery call.
                    </p>
                    <button onClick={resetForm} className="btn-secondary px-8 py-3">
                      Submit another request
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-10"
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">Book Free Consultation</h3>
                      <p className="text-slate-500 text-sm italic">Tell us about your requirements and we will build a roadmap for you.</p>
                    </div>

                    {formState === 'error' && (
                      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 text-red-400 text-sm">
                        <AlertCircle size={18} className="shrink-0" />
                        {errorMsg}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Full Name</label>
                        <input
                          name="name" required value={form.name} onChange={handleChange}
                          type="text"
                          className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-accent transition-all placeholder:text-slate-700"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Company Name</label>
                        <input
                          name="company" required value={form.company} onChange={handleChange}
                          type="text"
                          className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-accent transition-all placeholder:text-slate-700"
                          placeholder="Acme Inc."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Email</label>
                        <input
                          name="email" required value={form.email} onChange={handleChange}
                          type="email"
                          className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-accent transition-all placeholder:text-slate-700"
                          placeholder="john@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Phone</label>
                        <input
                          name="phone" required value={form.phone} onChange={handleChange}
                          type="tel"
                          className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-accent transition-all placeholder:text-slate-700"
                          placeholder="+91 00000 00000"
                        />
                      </div>

                      <div className="col-span-full space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Service of Interest</label>
                        <div className="flex flex-wrap gap-2">
                          {SERVICE_OPTIONS.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => toggleService(s.id)}
                              className={`px-4 py-2 rounded-xl glass border text-xs font-bold transition-all flex items-center gap-2 ${
                                form.services.includes(s.id)
                                  ? 'bg-brand-accent text-brand-blue border-brand-accent'
                                  : 'text-slate-400 border-white/5 hover:border-white/20'
                              }`}
                            >
                              <s.icon size={14} /> {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Brief Message</label>
                        <textarea
                          name="message" value={form.message} onChange={handleChange}
                          rows={4}
                          className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-accent transition-all placeholder:text-slate-700"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formState === 'submitting'}
                        className="col-span-full btn-primary text-base md:text-lg uppercase tracking-widest flex items-center justify-center gap-4 disabled:opacity-50"
                      >
                        {formState === 'submitting' ? (
                          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Send Request <Send size={20} /></>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
