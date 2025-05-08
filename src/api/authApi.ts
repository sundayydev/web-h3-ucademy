import { LoginData, RegisterData, ResetPasswordData } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to get JWT token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set user data in localStorage
const setUserData = (email: string, token: string) => {
  localStorage.setItem('userEmail', email);
  localStorage.setItem('token', token);
};

// Helper function to clear user data from localStorage
const clearUserData = () => {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('token');
};

export const register = async (data: RegisterData) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng ký thất bại');
  }

  const result = await response.json();
  // Store email and token in localStorage
  if (result.email && result.token) {
    setUserData(result.email, result.token);
  }

  return result;
};

export const login = async (data: LoginData) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng nhập thất bại');
  }

  const result = await response.json();
  // Store email and token in localStorage
  if (result.email && result.token) {
    setUserData(result.email, result.token);
  }

  return result;
};

export const getProfile = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const response = await fetch(`${API_URL}/api/auth/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Không thể lấy thông tin người dùng');
  }

  return response.json();
};

export const forgotPassword = async (email: string) => {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Gửi yêu cầu thất bại');
  }

  return response.json();
};

export const resetPassword = async (data: ResetPasswordData) => {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đặt lại mật khẩu thất bại');
  }

  return response.json();
};

export const search = async (query: string) => {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/api/search/all?keyword=${encodeURIComponent(query)}`,
    {
      method: 'GET',
      headers,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Tìm kiếm thất bại');
  }

  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng xuất thất bại');
  }

  // Clear localStorage on logout
  clearUserData();
  return response.json();
};