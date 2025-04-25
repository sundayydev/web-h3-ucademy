import { LoginData, RegisterData, ResetPasswordData} from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Đăng ký
export const register = async (data: RegisterData) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng ký thất bại');
  }
  return response.json();
};

// Đăng nhập
export const login = async (data: LoginData) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng nhập thất bại');
  }
  return response.json();
};

// Lấy thông tin người dùng
export const getUserInfo = async (email: string) => {
  const response = await fetch(`${API_URL}/api/auth/profile?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy thông tin người dùng thất bại');
  }
  return response.json();
};

// Quên mật khẩu
export const forgotPassword = async (email: string) => {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gửi yêu cầu thất bại');
  }
  return response.json();
};

// Đặt lại mật khẩu
export const resetPassword = async (data: ResetPasswordData) => {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đặt lại mật khẩu thất bại');
  }
  return response.json();
};

// Tìm kiếm
export const search = async (query: string) => {
  const response = await fetch(`${API_URL}/api/search/all?keyword=${encodeURIComponent(query)}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Tìm kiếm thất bại');
  }
  return response.json();
};

// Đăng xuất
export const logout = async () => {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng xuất thất bại');
  }
  return response.json();
};