const TOKEN_KEY = 'expense_tracker_access_token';

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
