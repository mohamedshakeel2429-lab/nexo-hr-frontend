import api from './api';

export interface Job {
  _id: string;
  title: string;
  slug: string;
  location: string;
  type: string;
  category: string;
  department?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: 'Active' | 'Draft' | 'Closed';
  applicationsCount: number;
  experienceRange?: { min: number; max?: number };
  salaryRange?: { min?: number; max?: number; currency: string; visible: boolean };
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedJobs {
  data: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  type?: string;
  status?: string;
}

export const jobsService = {
  async getPublicJobs(filters: JobFilters = {}): Promise<PaginatedJobs> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    const { data } = await api.get(`/jobs?${params}`);
    return data;
  },

  async getPublicJob(id: string): Promise<Job> {
    const { data } = await api.get(`/jobs/${id}`);
    return data.data.job;
  },

  async getCategories(): Promise<string[]> {
    const { data } = await api.get('/jobs/categories');
    return data.data.categories;
  },

  async adminGetJobs(filters: JobFilters = {}): Promise<PaginatedJobs> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    const { data } = await api.get(`/jobs/admin/all?${params}`);
    return data;
  },

  async adminGetJob(id: string): Promise<Job> {
    const { data } = await api.get(`/jobs/admin/${id}`);
    return data.data.job;
  },

  async adminCreateJob(payload: Partial<Job>): Promise<Job> {
    const { data } = await api.post('/jobs/admin', payload);
    return data.data.job;
  },

  async adminUpdateJob(id: string, payload: Partial<Job>): Promise<Job> {
    const { data } = await api.put(`/jobs/admin/${id}`, payload);
    return data.data.job;
  },

  async adminDeleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/admin/${id}`);
  },

  async adminToggleStatus(id: string, status?: string): Promise<Job> {
    const { data } = await api.patch(`/jobs/admin/${id}/status`, status ? { status } : {});
    return data.data.job;
  },
};
