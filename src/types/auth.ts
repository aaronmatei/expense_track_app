export interface Token {
  access_token: string;
  token_type: string;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  full_name?: string;
  phone_number?: string;
  id_number?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}
