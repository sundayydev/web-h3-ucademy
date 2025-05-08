export interface User {
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordData {
  email: string;
  resetCode: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface SearchResult {
  courses: { id: string; title: string }[];
  posts: { id: string; title: string; user?: { fullName: string } }[];
}
