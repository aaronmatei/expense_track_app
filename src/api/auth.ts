import axios from 'axios';

import type { Token } from '@/types/auth';

export async function login(email: string, password: string): Promise<Token> {
  const body = new URLSearchParams({
    username: email,
    password: password,
  }).toString();

  const { data } = await axios.post<Token>(
    `${import.meta.env.VITE_API_URL}/auth/login`,
    body,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );
  return data;
}
