import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Briefcase, Clock, Search, ArrowRight, CheckCircle2, Upload, X, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobsService, type Job } from '../services/jobs.service';
import { applicationService } from '../services/application.service';
import type { AxiosError } from 'axios';

interface AppForm {
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
  resume: File | null;
}

type AppState = 'idle' | 'submitting' | 'success' | 'error';

export default function Careers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [appState, setAppState] = useState<AppState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState<AppForm>({
    name: '', email: '', phone: '', experience: '', coverLetter: '', resume: null,
  });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await jobsService.getPublicJobs({ limit: 50 });
        setJobs(result.data);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      jobsService.getPublicJobs({ search: searchTerm || undefined, limit: 50 })
        .then((r) => setJobs(r.data))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are accepted');
      return;
    }
    setForm((prev) => ({ ...prev, resume: file }));
    setErrorMsg('');
  };

  const openModal = (job: Job) => {
    setSelectedJob(job);
    setAppState('idle');
    setErrorMsg('');
    setForm({ name: '', email: '', phone: '', experience: '', coverLetter: '', resume: null });
  };

  const closeModal = () => setSelectedJob(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setAppState('submitting');
    setErrorMsg('');

    try {
      await applicationService.submit(selectedJob._id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        experience: parseFloat(form.experience),
        coverLetter: form.coverLetter || undefined,
        resume: form.resume || undefined,
      });
      setAppState('success');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setErrorMsg(axiosErr.response?.data?.message || 'Submission failed. Please try again.');
      setAppState('error');
    }
  };

  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="pt-24 md:pt-32 pb-20">
      <section className="section-padding text-center space-y-4 md:space-y-6">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white">
          Join the <span className="text-gradient">Ecosystem</span>
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
          Explore current opportunities with NEXO and our partner companies. We help top talent find their next career milestone.
        </p>
      </section>

      {/* Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center glass p-3 md:p-4 rounded-2xl">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by role or category..."
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 md:pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent transition-colors text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Job List */}
      <section className="section-padding pt-0 min-h-[400px]">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="text-brand-accent animate-spin" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={job._id}
                    className="glass p-5 md:p-8 rounded-2xl md:rounded-3xl hover:border-brand-accent/50 transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg md:text-2xl font-bold text-white group-hover:text-brand-accent transition-colors leading-tight">
                          {job.title}
                        </h3>
                        <span className="px-2 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-[9px] md:text-[10px] font-black uppercase tracking-widest flex-shrink-0">
                          {job.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 md:gap-6 text-xs md:text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5"><MapPin size={14} className="text-brand-accent" /> {job.location}</div>
                        <div className="flex items-center gap-1.5"><Briefcase size={14} className="text-brand-accent" /> {job.category}</div>
                        <div className="flex items-center gap-1.5"><Clock size={14} className="text-brand-accent" /> {formatDate(job.createdAt)}</div>
                      </div>
                      {job.experienceRange && (
                        <p className="text-xs text-slate-600">
                          {job.experienceRange.min}+ yrs experience required
                          {job.experienceRange.max ? ` (up to ${job.experienceRange.max} yrs)` : ''}
                        </p>
                      )}
                    </div>
                    <div className="mt-5 md:mt-8 pt-4 md:pt-6 border-t border-white/5 flex justify-between items-center">
                      <span className="text-xs text-slate-600">{job.applicationsCount} applicant{job.applicationsCount !== 1 ? 's' : ''}</span>
                      <button
                        onClick={() => openModal(job)}
                        className="btn-primary text-xs md:text-sm uppercase tracking-widest"
                      >
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 glass rounded-[2rem] md:rounded-[3rem]">
                  <p className="text-slate-500 text-base md:text-lg">No matching roles found. Try a different search term.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              className="relative w-full sm:max-w-2xl glass p-5 sm:p-8 md:p-12 rounded-t-[2rem] sm:rounded-[2.5rem] overflow-y-auto max-h-[92vh]"
            >
              <button onClick={closeModal} className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-white p-1">
                <X size={22} />
              </button>

              {appState === 'success' ? (
                <div className="py-8 md:py-12 text-center space-y-5 md:space-y-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent mx-auto">
                    <CheckCircle2 size={32} className="md:hidden" />
                    <CheckCircle2 size={40} className="hidden md:block" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Application Sent!</h2>
                    <p className="text-slate-400 text-sm md:text-base">
                      Our recruitment team will review your profile and get back to you within 48 hours for the{' '}
                      <span className="text-brand-accent font-bold">{selectedJob.title}</span> role.
                    </p>
                  </div>
                  <button onClick={closeModal} className="btn-secondary px-8 py-3">Done</button>
                </div>
              ) : (
                <div className="space-y-6 md:space-y-8">
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-brand-accent font-black text-xs uppercase tracking-widest">Application Form</p>
                    <h2 className="text-xl md:text-3xl font-bold text-white leading-tight">
                      Apply for {selectedJob.title}
                    </h2>
                  </div>

                  {appState === 'error' && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-red-400 text-sm">
                      <AlertCircle size={16} className="shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                      <input
                        name="name" required value={form.name} onChange={handleChange}
                        type="text"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                      <input
                        name="email" required value={form.email} onChange={handleChange}
                        type="email"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone Number</label>
                      <input
                        name="phone" required value={form.phone} onChange={handleChange}
                        type="tel"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Experience (Years)</label>
                      <input
                        name="experience" required value={form.experience} onChange={handleChange}
                        type="number" min="0" max="60" step="0.5"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-full">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cover Letter (optional)</label>
                      <textarea
                        name="coverLetter" value={form.coverLetter} onChange={handleChange}
                        rows={3}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent transition-all placeholder:text-slate-700 text-sm"
                        placeholder="Tell us why you'd be a great fit..."
                      />
                    </div>
                    <div className="space-y-1.5 col-span-full">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resume (PDF only)</label>
                      <input ref={fileRef} type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full border-2 border-dashed border-white/10 rounded-2xl p-4 md:p-6 text-center cursor-pointer hover:bg-white/5 transition-all group"
                      >
                        <Upload className="mx-auto text-slate-600 group-hover:text-brand-accent transition-colors mb-2" size={20} />
                        {form.resume ? (
                          <p className="text-sm text-brand-accent font-bold">{form.resume.name}</p>
                        ) : (
                          <p className="text-sm text-slate-500 group-hover:text-slate-300">
                            Tap to <span className="text-brand-accent font-bold underline">browse files</span>
                          </p>
                        )}
                      </button>
                      {errorMsg && appState !== 'error' && (
                        <p className="text-red-400 text-xs">{errorMsg}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={appState === 'submitting'}
                      className="col-span-full btn-primary text-base uppercase tracking-widest mt-2 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {appState === 'submitting' ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        'Submit Profile'
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <section className="section-padding text-center">
        <div className="glass p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] max-w-4xl mx-auto space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-3xl font-bold text-white uppercase tracking-tighter">Don't see your fit?</h2>
          <p className="text-slate-400 text-sm md:text-base">
            Send us your CV anyway at <br />
            <a href="mailto:nexo.hrsolutions@gmail.com" className="text-brand-accent font-bold text-base md:text-lg hover:underline">
              nexo.hrsolutions@gmail.com
            </a>{' '}
            <br />
            and become part of our talent database for future opportunities.
          </p>
          <div className="flex justify-center pt-2 md:pt-4">
            <Link
              to="/contact"
              className="px-6 py-3 md:px-8 md:py-4 rounded-xl glass border-white/5 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all uppercase tracking-widest text-xs md:text-sm"
            >
              Inquire about internships <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
