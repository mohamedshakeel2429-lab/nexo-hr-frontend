import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings, Users, Briefcase, Layout, MessageSquare,
  Plus, Edit2, Trash2, Save, X, BarChart3,
  FileText, Search, Bell, Shield, Database, Globe,
  Loader2, AlertCircle, LogOut, TrendingUp, TrendingDown, Minus,
  Lock, User, CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jobsService, type Job } from '../services/jobs.service';
import { dashboardService } from '../services/dashboard.service';
import { contactService, type Contact } from '../services/contact.service';
import { applicationService, type Application } from '../services/application.service';
import { authService } from '../services/auth.service';
import { contentService } from '../services/content.service';
import type { AxiosError } from 'axios';

type AdminTab = 'overview' | 'recruitment' | 'applications' | 'inquiries' | 'content' | 'settings';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md glass p-10 rounded-[2.5rem] space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Login</h1>
          <p className="text-slate-500 text-sm">NEXO HR Solutions · Secure Area</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-all"
              placeholder="admin@nexohr.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full btn-primary py-4 text-base uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, growth, color }: {
  icon: React.ElementType; label: string; value: string | number; growth?: number; color: string;
}) {
  return (
    <div className="glass p-6 rounded-3xl space-y-4">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon size={24} />
        </div>
        {growth !== undefined && (
          <span className={`text-xs font-bold flex items-center gap-1 ${
            growth > 0 ? 'text-emerald-400' : growth < 0 ? 'text-red-400' : 'text-slate-500'
          }`}>
            {growth > 0 ? <TrendingUp size={12} /> : growth < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            {Math.abs(growth)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const [dashStats, setDashStats] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobForm, setJobForm] = useState({ title: '', location: '', type: 'Full-time', category: '', description: '', status: 'Draft' });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const [heroForm, setHeroForm] = useState({ heading: '', gradientText: '', subtitle: '' });
  const [globalForm, setGlobalForm] = useState({ email: '', phone: '', address: '' });
  const [contentLoading, setContentLoading] = useState(false);
  const [contentSavingKey, setContentSavingKey] = useState<string | null>(null);
  const [contentMsg, setContentMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadDashboard = useCallback(async () => {
    setDataLoading(true);
    try {
      const [stats, jobsRes, appsRes, contactsRes] = await Promise.all([
        dashboardService.getStats(),
        jobsService.adminGetJobs({ limit: '50' } as any),
        applicationService.adminList({ limit: '20' }),
        contactService.adminList({ limit: '20' }),
      ]);
      setDashStats(stats);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
      setContacts(contactsRes.data);
    } catch {
      /* handled silently */
    } finally {
      setDataLoading(false);
    }
  }, []);

  const loadContent = useCallback(async () => {
    setContentLoading(true);
    try {
      const [heroBlock, globalBlock] = await Promise.all([
        contentService.getByKey('hero'),
        contentService.getByKey('global'),
      ]);
      const h = heroBlock.data as Record<string, string>;
      const g = globalBlock.data as Record<string, string>;
      setHeroForm({ heading: h.heading ?? '', gradientText: h.gradientText ?? '', subtitle: h.subtitle ?? '' });
      setGlobalForm({ email: g.email ?? '', phone: g.phone ?? '', address: g.address ?? '' });
    } catch { /* keep form defaults */ } finally {
      setContentLoading(false);
    }
  }, []);

  const handleSaveHero = async () => {
    setContentSavingKey('hero');
    setContentMsg(null);
    try {
      await contentService.update('hero', { data: { ...heroForm }, label: 'Homepage Hero Section' });
      setContentMsg({ type: 'success', text: 'Hero section saved successfully' });
    } catch {
      setContentMsg({ type: 'error', text: 'Failed to save hero section' });
    } finally {
      setContentSavingKey(null);
    }
  };

  const handleSaveGlobal = async () => {
    setContentSavingKey('global');
    setContentMsg(null);
    try {
      await contentService.update('global', { data: { ...globalForm }, label: 'Global Site Settings' });
      setContentMsg({ type: 'success', text: 'Global settings saved successfully' });
    } catch {
      setContentMsg({ type: 'error', text: 'Failed to save global settings' });
    } finally {
      setContentSavingKey(null);
    }
  };

  useEffect(() => {
    if (user) loadDashboard();
  }, [user, loadDashboard]);

  useEffect(() => {
    if (user && activeTab === 'content') loadContent();
  }, [user, activeTab, loadContent]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="text-brand-primary animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError('New passwords do not match');
      return;
    }
    if (pwForm.newPw.length < 8) {
      setPwError('Password must be at least 8 characters');
      return;
    }
    setPwLoading(true);
    try {
      await authService.changePassword(pwForm.current, pwForm.newPw);
      setPwSuccess(true);
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setPwError(axiosErr.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const openCreate = () => {
    setEditingJob(null);
    setJobForm({ title: '', location: '', type: 'Full-time', category: '', description: '', status: 'Draft' });
    setActionError('');
    setShowJobModal(true);
  };

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      location: job.location,
      type: job.type,
      category: job.category,
      description: job.description,
      status: job.status,
    });
    setActionError('');
    setShowJobModal(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setActionError('');
    try {
      if (editingJob) {
        await jobsService.adminUpdateJob(editingJob._id, jobForm);
      } else {
        await jobsService.adminCreateJob(jobForm);
      }
      setShowJobModal(false);
      loadDashboard();
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setActionError(axiosErr.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      await jobsService.adminDeleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch {
      alert('Failed to delete job');
    }
  };

  const handleToggleJobStatus = async (job: Job) => {
    try {
      const updated = await jobsService.adminToggleStatus(job._id);
      setJobs((prev) => prev.map((j) => (j._id === updated._id ? updated : j)));
    } catch {
      alert('Failed to update status');
    }
  };

  const handleUpdateAppStatus = async (id: string, status: string) => {
    try {
      const updated = await applicationService.adminUpdateStatus(id, status);
      setApplications((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
    } catch {
      alert('Failed to update status');
    }
  };

  const handleUpdateContactStatus = async (id: string, status: string) => {
    try {
      const updated = await contactService.adminUpdateStatus(id, status);
      setContacts((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    } catch {
      alert('Failed to update status');
    }
  };

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const NAV_ITEMS: { id: AdminTab; name: string; icon: React.ElementType }[] = [
    { id: 'overview', name: 'Dashboard', icon: BarChart3 },
    { id: 'recruitment', name: 'Job Listings', icon: Briefcase },
    { id: 'applications', name: 'Applications', icon: Users },
    { id: 'inquiries', name: 'Inquiries', icon: MessageSquare },
    { id: 'content', name: 'Page Content', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const STATUS_COLORS: Record<string, string> = {
    Active: 'bg-emerald-500/10 text-emerald-400',
    Draft: 'bg-slate-500/10 text-slate-400',
    Closed: 'bg-red-500/10 text-red-400',
    Pending: 'bg-yellow-500/10 text-yellow-400',
    Reviewing: 'bg-blue-500/10 text-blue-400',
    Shortlisted: 'bg-indigo-500/10 text-indigo-400',
    Interview: 'bg-purple-500/10 text-purple-400',
    Offered: 'bg-emerald-500/10 text-emerald-400',
    Rejected: 'bg-red-500/10 text-red-400',
    New: 'bg-yellow-500/10 text-yellow-400',
    Contacted: 'bg-blue-500/10 text-blue-400',
    Converted: 'bg-emerald-500/10 text-emerald-400',
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="lg:w-64 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-semibold text-sm">{item.name}</span>
            </button>
          ))}

          <div className="pt-8 mt-8 border-t border-white/5 px-4 space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-semibold"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white capitalize">{activeTab}</h1>
              <p className="text-slate-500 text-sm">Manage your data and site content.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-brand-primary transition-all w-56"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={loadDashboard}
                className="relative w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-white"
                title="Refresh"
              >
                {dataLoading ? <Loader2 size={18} className="animate-spin" /> : <Bell size={18} />}
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {/* ── OVERVIEW ─────────────────────────────── */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {dataLoading && !dashStats ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" size={36} /></div>
                ) : dashStats ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <StatCard icon={MessageSquare} label="Monthly Inquiries" value={dashStats.overview.contacts.thisMonth} growth={dashStats.overview.contacts.growth} color="bg-blue-500/10 text-blue-400" />
                      <StatCard icon={Briefcase} label="Active Positions" value={dashStats.overview.jobs.active} color="bg-emerald-500/10 text-emerald-400" />
                      <StatCard icon={Users} label="Total Applications" value={dashStats.overview.applications.total} growth={dashStats.overview.applications.growth} color="bg-purple-500/10 text-purple-400" />
                    </div>

                    <div className="glass rounded-3xl overflow-hidden">
                      <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white">Recent Applications</h3>
                        <button onClick={() => setActiveTab('applications')} className="text-xs font-bold text-brand-primary hover:underline">View all</button>
                      </div>
                      <div className="divide-y divide-white/5">
                        {dashStats.recent.applications.map((app: any) => (
                          <div key={app._id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                <Users size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{app.name}</p>
                                <p className="text-xs text-slate-500">{app.job?.title || 'Unknown role'}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${STATUS_COLORS[app.status] || 'text-slate-400'}`}>
                              {app.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass rounded-3xl overflow-hidden">
                      <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white">Recent Inquiries</h3>
                        <button onClick={() => setActiveTab('inquiries')} className="text-xs font-bold text-brand-primary hover:underline">View all</button>
                      </div>
                      <div className="divide-y divide-white/5">
                        {dashStats.recent.contacts.map((c: any) => (
                          <div key={c._id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                <MessageSquare size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{c.name}</p>
                                <p className="text-xs text-slate-500">{c.company}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${STATUS_COLORS[c.status] || 'text-slate-400'}`}>
                              {c.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="glass rounded-3xl p-12 text-center text-slate-500">
                    <AlertCircle className="mx-auto mb-4" size={32} />
                    <p>Failed to load dashboard data. <button onClick={loadDashboard} className="text-brand-primary underline">Retry</button></p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── RECRUITMENT ──────────────────────────── */}
            {activeTab === 'recruitment' && (
              <motion.div key="recruitment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-sm text-slate-400 font-medium">{filteredJobs.length} job(s)</p>
                  <button onClick={openCreate} className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
                    <Plus size={16} /> Add Role
                  </button>
                </div>

                <div className="overflow-hidden glass rounded-3xl border border-white/5">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5">
                        {['Role', 'Category', 'Applications', 'Status', 'Actions'].map((h) => (
                          <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {filteredJobs.map((job) => (
                        <tr key={job._id} className="hover:bg-white/[0.02] transition-all">
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{job.title}</p>
                            <p className="text-[10px] text-slate-500">{job.location} · {job.type}</p>
                          </td>
                          <td className="px-6 py-4 text-sm">{job.category}</td>
                          <td className="px-6 py-4 text-sm font-mono">{job.applicationsCount}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleJobStatus(job)}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer ${STATUS_COLORS[job.status] || 'text-slate-400'}`}
                            >
                              {job.status}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEdit(job)} className="p-2 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg transition-colors"><Edit2 size={16} /></button>
                              <button onClick={() => handleDeleteJob(job._id)} className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredJobs.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No jobs found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── APPLICATIONS ─────────────────────────── */}
            {activeTab === 'applications' && (
              <motion.div key="applications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="overflow-hidden glass rounded-3xl border border-white/5">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5">
                        {['Applicant', 'Role', 'Experience', 'Status', 'Date', 'Actions'].map((h) => (
                          <th key={h} className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {applications.filter((a) =>
                        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.email.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((app) => (
                        <tr key={app._id} className="hover:bg-white/[0.02] transition-all">
                          <td className="px-5 py-4">
                            <p className="font-bold text-white">{app.name}</p>
                            <p className="text-[10px] text-slate-500">{app.email}</p>
                          </td>
                          <td className="px-5 py-4 text-sm">{app.job?.title || '—'}</td>
                          <td className="px-5 py-4 text-sm">{app.experience}y</td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${STATUS_COLORS[app.status] || 'text-slate-400'}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-500">
                            {new Date(app.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {app.resume?.url && (
                                <a
                                  href={app.resume.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={app.resume.originalName || 'View Resume'}
                                  className="p-2 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-colors text-slate-400"
                                >
                                  <FileText size={16} />
                                </a>
                              )}
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateAppStatus(app._id, e.target.value)}
                                className="bg-slate-800 border border-white/10 rounded-lg text-xs text-white px-2 py-1 focus:outline-none"
                                style={{ colorScheme: 'dark' }}
                              >
                                {['Pending', 'Reviewing', 'Shortlisted', 'Interview', 'Offered', 'Rejected'].map((s) => (
                                  <option key={s} value={s} className="bg-slate-800">{s}</option>
                                ))}
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {applications.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No applications yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── INQUIRIES ─────────────────────────────── */}
            {activeTab === 'inquiries' && (
              <motion.div key="inquiries" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="overflow-hidden glass rounded-3xl border border-white/5">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5">
                        {['Contact', 'Company', 'Services', 'Status', 'Date', 'Actions'].map((h) => (
                          <th key={h} className="px-5 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {contacts.filter((c) =>
                        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.company.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((c) => (
                        <tr key={c._id} className="hover:bg-white/[0.02] transition-all">
                          <td className="px-5 py-4">
                            <p className="font-bold text-white">{c.name}</p>
                            <p className="text-[10px] text-slate-500">{c.email}</p>
                          </td>
                          <td className="px-5 py-4 text-sm">{c.company}</td>
                          <td className="px-5 py-4 text-xs text-slate-400">{c.services.join(', ') || '—'}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${STATUS_COLORS[c.status] || 'text-slate-400'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-500">
                            {new Date(c.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={c.status}
                              onChange={(e) => handleUpdateContactStatus(c._id, e.target.value)}
                              className="bg-slate-800 border border-white/10 rounded-lg text-xs text-white px-2 py-1 focus:outline-none"
                              style={{ colorScheme: 'dark' }}
                            >
                              {['New', 'Contacted', 'In Progress', 'Converted', 'Closed'].map((s) => (
                                <option key={s} value={s} className="bg-slate-800">{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                      {contacts.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No inquiries yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── CONTENT ──────────────────────────────── */}
            {activeTab === 'content' && (
              <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                {contentMsg && (
                  <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-sm border ${
                    contentMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    <AlertCircle size={16} /> {contentMsg.text}
                  </div>
                )}

                {contentLoading ? (
                  <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-primary" size={32} /></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Homepage Hero */}
                    <div className="glass p-8 rounded-[2rem] space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary"><Layout size={20} /></div>
                        <h3 className="text-xl font-bold text-white">Homepage Hero</h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'Heading Line 1', key: 'heading', type: 'text' },
                          { label: 'Gradient Text', key: 'gradientText', type: 'text' },
                        ].map((f) => (
                          <div key={f.key} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">{f.label}</label>
                            <input
                              type={f.type}
                              value={(heroForm as Record<string, string>)[f.key]}
                              onChange={(e) => setHeroForm((p) => ({ ...p, [f.key]: e.target.value }))}
                              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-primary outline-none transition-colors"
                            />
                          </div>
                        ))}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Subtitle</label>
                          <textarea
                            rows={3}
                            value={heroForm.subtitle}
                            onChange={(e) => setHeroForm((p) => ({ ...p, subtitle: e.target.value }))}
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-primary outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleSaveHero}
                          disabled={contentSavingKey === 'hero'}
                          className="btn-primary px-6 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                          {contentSavingKey === 'hero' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                          Save Hero
                        </button>
                      </div>
                    </div>

                    {/* Global Settings */}
                    <div className="glass p-8 rounded-[2rem] space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400"><Globe size={20} /></div>
                        <h3 className="text-xl font-bold text-white">Global Settings</h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'Contact Email', key: 'email', type: 'email' },
                          { label: 'Contact Phone', key: 'phone', type: 'tel' },
                          { label: 'Office Address', key: 'address', type: 'text' },
                        ].map((f) => (
                          <div key={f.key} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">{f.label}</label>
                            <input
                              type={f.type}
                              value={(globalForm as Record<string, string>)[f.key]}
                              onChange={(e) => setGlobalForm((p) => ({ ...p, [f.key]: e.target.value }))}
                              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:border-brand-primary outline-none transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleSaveGlobal}
                          disabled={contentSavingKey === 'global'}
                          className="btn-primary px-6 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                          {contentSavingKey === 'global' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                          Save Settings
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── SETTINGS ─────────────────────────────── */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                {/* Account Profile */}
                <div className="glass p-8 rounded-3xl space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <User size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Account Profile</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label: 'Full Name', value: user.name },
                      { label: 'Email Address', value: user.email },
                      { label: 'Role', value: user.role },
                      { label: 'Last Login', value: user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'This session' },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/5 rounded-2xl px-5 py-4 border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-white font-semibold text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change Password */}
                <div className="glass p-8 rounded-3xl space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                      <Lock size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Change Password</h3>
                  </div>

                  {pwSuccess && (
                    <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3 text-emerald-400 text-sm">
                      <CheckCircle size={16} /> Password updated successfully
                    </div>
                  )}
                  {pwError && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-red-400 text-sm">
                      <AlertCircle size={16} /> {pwError}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {[
                      { label: 'Current Password', key: 'current', value: pwForm.current },
                      { label: 'New Password', key: 'newPw', value: pwForm.newPw },
                      { label: 'Confirm New Password', key: 'confirm', value: pwForm.confirm },
                    ].map((f) => (
                      <div key={f.key} className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{f.label}</label>
                        <input
                          type="password"
                          required
                          value={f.value}
                          onChange={(e) => { setPwForm((p) => ({ ...p, [f.key]: e.target.value })); setPwSuccess(false); setPwError(''); }}
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                    ))}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={pwLoading}
                        className="btn-primary px-8 py-3 text-sm uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                      >
                        {pwLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {pwLoading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="glass p-8 rounded-3xl space-y-4 border border-red-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                      <Shield size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Session</h3>
                  </div>
                  <p className="text-slate-500 text-sm">Sign out from all devices by logging out. Your session will be invalidated immediately.</p>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-bold uppercase tracking-widest"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Job Modal */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowJobModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl glass p-8 rounded-[2rem] overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setShowJobModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white"><X size={22} /></button>
              <h2 className="text-2xl font-bold text-white mb-6">{editingJob ? 'Edit Job' : 'New Job Listing'}</h2>

              {actionError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mb-4">
                  <AlertCircle size={16} /> {actionError}
                </div>
              )}

              <form onSubmit={handleSaveJob} className="space-y-5">
                {[
                  { label: 'Job Title', name: 'title', type: 'text' },
                  { label: 'Location', name: 'location', type: 'text' },
                  { label: 'Category', name: 'category', type: 'text' },
                ].map((f) => (
                  <div key={f.name} className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{f.label}</label>
                    <input
                      type={f.type} required
                      value={(jobForm as any)[f.name]}
                      onChange={(e) => setJobForm((p) => ({ ...p, [f.name]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</label>
                    <select value={jobForm.type} onChange={(e) => setJobForm((p) => ({ ...p, type: e.target.value }))}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                      style={{ colorScheme: 'dark' }}>
                      {['Full-time', 'Part-time', 'Contract', 'Hybrid', 'Remote', 'Internship'].map((t) => (
                        <option key={t} value={t} className="bg-slate-800">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
                    <select value={jobForm.status} onChange={(e) => setJobForm((p) => ({ ...p, status: e.target.value }))}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                      style={{ colorScheme: 'dark' }}>
                      {['Active', 'Draft', 'Closed'].map((s) => (
                        <option key={s} value={s} className="bg-slate-800">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea rows={4} value={jobForm.description} onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <button type="submit" disabled={saving}
                  className="w-full btn-primary py-3 text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> {editingJob ? 'Update' : 'Create'} Job</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
