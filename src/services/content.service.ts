import api from './api';

export interface ContentBlock {
  key: string;
  label: string;
  data: Record<string, unknown>;
  updatedAt?: string;
}

export interface HeroContent {
  heading: string;
  gradientText: string;
  subtitle: string;
  cta: { primary: string; secondary: string };
}

export interface GlobalContent {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  officeHours: string;
  experience: string;
  linkedin: string;
  twitter: string;
  facebook: string;
}

export interface AboutContent {
  heading: string;
  story: string;
  mission: string;
  vision: string;
}

export const contentService = {
  async getAll(): Promise<ContentBlock[]> {
    const { data } = await api.get('/content');
    return (data.data?.contents ?? []) as ContentBlock[];
  },

  async getByKey(key: string): Promise<ContentBlock> {
    const { data } = await api.get(`/content/${key}`);
    return data.data.content as ContentBlock;
  },

  async update(key: string, payload: { data: Record<string, unknown>; label?: string }): Promise<ContentBlock> {
    const { data } = await api.put(`/content/${key}`, payload);
    return data.data.content as ContentBlock;
  },
};
