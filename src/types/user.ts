export interface User {
  id: number;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  id_number: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface UserUpdate {
  full_name?: string | null;
  phone_number?: string | null;
  id_number?: string | null;
  address?: string | null;
}
