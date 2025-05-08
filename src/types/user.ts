export type UserRole = 'Instructor' | 'Student' | 'Admin';

export interface User {
  profileImage: string;
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  birthDate?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  createdAt: string;
  ipAddress?: string | null;
  deviceName?: string | null;
  googleId?: string | null;
  isGoogleAccount: boolean;
}

export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
  phone?: string | null;
  birthDate?: string | null;
}
