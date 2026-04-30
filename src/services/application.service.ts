import api from './api';

export interface ApplicationPayload {
  name: string;
  email: string;
  phone: string;
  experience: number;
  coverLetter?: string;
  resume?: File;
}

export interface Application {
  _id: string;
  job: { _id: string; title: string; category: string };
  name: string;
  email: string;
  phone: string;
  experience: number;
  coverLetter?: string;
  resume?: { url: string; originalName: string };
  status: 'Pending' | 'Reviewing' | 'Shortlisted' | 'Interview' | 'Offered' | 'Rejected' | 'Withdrawn';
  adminNotes: string;
  createdAt: string;
}

export const applicationService = {
  async submit(jobId: string, payload: ApplicationPayload): Promise<{ _id: string }> {
    const form = new FormData();
    form.append('name', payload.name);
    form.append('email', payload.email);
    form.append('phone', payload.phone);
    form.append('experience', String(payload.experience));
    if (payload.coverLetter) form.append('coverLetter', payload.coverLetter);
    if (payload.resume) form.append('resume', payload.resume);

    const { data } = await api.post(`/jobs/${jobId}/apply`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.application;
  },

  async adminList(params?: Record<string, string>): Promise<{ data: Application[]; pagination: object }> {
    const query = new URLSearchParams(params).toString();
    const { data } = await api.get(`/admin/applications?${query}`);
    return data;
  },

  async adminGet(id: string): Promise<Application> {
    const { data } = await api.get(`/admin/applications/${id}`);
    return data.data.application;
  },

  async adminUpdateStatus(id: string, status: string, adminNotes?: string): Promise<Application> {
    const { data } = await api.patch(`/admin/applications/${id}/status`, { status, adminNotes });
    return data.data.application;
  },

  async adminGetStats(): Promise<object> {
    const { data } = await api.get('/admin/applications/stats');
    return data.data;
  },
};
