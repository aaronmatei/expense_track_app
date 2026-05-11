import { apiClient } from '@/lib/api-client';
import type { RegisterUserRequest } from '@/types/auth';
import type { User } from '@/types/user';

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/users/me');
  return data;
}

export async function updateCurrentUser(
  userData: Partial<User>,
): Promise<User> {
  const { data } = await apiClient.put<User>('/users/me', userData);
  return data;
}

export async function registerUser(
  payload: RegisterUserRequest,
): Promise<User> {
  const { data } = await apiClient.post<User>('/users', payload);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/users/me');
  return data;
}
