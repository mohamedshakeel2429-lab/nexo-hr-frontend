import api from './api';

export interface ContactPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  services: string[];
  message: string;
}

export interface Contact {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  services: string[];
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Closed';
  adminNotes: string;
  createdAt: string;
}

export const contactService = {
  async submit(payload: ContactPayload): Promise<{ _id: string; name: string }> {
    const { data } = await api.post('/contacts', payload);
    return data.data.contact;
  },

  async adminList(params?: Record<string, string>): Promise<{ data: Contact[]; pagination: object }> {
    const query = new URLSearchParams(params).toString();
    const { data } = await api.get(`/contacts/admin?${query}`);
    return data;
  },

  async adminGet(id: string): Promise<Contact> {
    const { data } = await api.get(`/contacts/admin/${id}`);
    return data.data.contact;
  },

  async adminUpdateStatus(id: string, status: string, adminNotes?: string): Promise<Contact> {
    const { data } = await api.patch(`/contacts/admin/${id}/status`, { status, adminNotes });
    return data.data.contact;
  },

  async adminGetStats(): Promise<object> {
    const { data } = await api.get('/contacts/admin/stats');
    return data.data;
  },
};
