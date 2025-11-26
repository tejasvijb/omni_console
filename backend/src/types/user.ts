export type JwtUserPayload = PersistedUser;

export interface LoginUserBody {
  email: string;
  password: string;
}

export interface PersistedUser {
  email: string;
  id: string;
  role: UserRole;
}

export interface RegisterUserBody {
  email: string;
  password: string;
  role?: UserRole;
}

export type UserRole = "admin" | "analyst" | "viewer";
