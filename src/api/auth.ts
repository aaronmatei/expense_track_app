import { apiClient } from '@/lib/api-client';
import type { Token } from '@/types/auth';

export async function login(email: string, password: string): Promise<Token> {
  // The backend's /auth/login uses OAuth2 password flow, which requires form-encoded data
  // (not JSON). The OAuth2 spec calls the email field "username".
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  const { data } = await apiClient.post<Token>('/auth/login', {
    body: formData,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return data;
}

export async function register(userData: {
  email: string;
  password: string;
  full_name?: string;
  phone_number?: string;
  id_number?: string;
  address?: string;
}): Promise<void> {
  await apiClient.post('/auth/register', userData);
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
