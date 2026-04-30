import api from './api';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  lastLogin?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post('/auth/login', payload);
    if (data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
    }
    return data.data as { user: AdminUser; accessToken: string };
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.data.user as AdminUser;
  },

  async forgotPassword(email: string) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data.message as string;
  },

  async resetPassword(token: string, password: string, confirmPassword: string) {
    const { data } = await api.patch(`/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    });
    return data.message as string;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await api.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return data.message as string;
  },
};
