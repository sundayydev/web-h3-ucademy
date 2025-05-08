import { User, CreateUserDto, UpdateUserDto } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = () => {
  return localStorage.getItem('token');
};

export const getUserInfo = async (): Promise<User> => {
  const token = getToken();
  if (!token) {
    throw new Error('Không có token, vui lòng đăng nhập lại');
  }

  const response = await fetch(`${API_URL}/api/auth/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Lấy thông tin người dùng thất bại (Status: ${response.status})`);
  }

  const userData = await response.json();
  if (!userData?.id) {
    throw new Error('Dữ liệu người dùng không hợp lệ: Thiếu ID');
  }

  return userData;
};

// Các hàm khác giữ nguyên
export const getUserById = async (id: string): Promise<User> => {
  const token = getToken();
  if (!token) {
    throw new Error('Không có token, vui lòng đăng nhập lại');
  }

  const response = await fetch(`${API_URL}/api/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Không tìm thấy người dùng (Status: ${response.status})`);
  }

  const userData = await response.json();
  if (!userData?.id) {
    throw new Error('Dữ liệu người dùng không hợp lệ: Thiếu ID');
  }

  return userData;
};

export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const token = getToken();
  if (!token) {
    throw new Error('Không có token, vui lòng đăng nhập lại');
  }

  const response = await fetch(`${API_URL}/api/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Tạo người dùng thất bại (Status: ${response.status})`);
  }

  return response.json();
};

export const updateUserInfo = async (id: string, userData: UpdateUserDto): Promise<User> => {
  const token = getToken();
  if (!token) {
    throw new Error('Không có token, vui lòng đăng nhập lại');
  }

  const response = await fetch(`${API_URL}/api/user/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Cập nhật người dùng thất bại (Status: ${response.status})`);
  }

  return response.json();
};

export const uploadProfileImage = async (file: File): Promise<{ profileImage: string }> => {
  const token = getToken();
  if (!token) {
    throw new Error('Không có token, vui lòng đăng nhập lại');
  }

  const formData = new FormData();
  formData.append('profileImage', file);

  const response = await fetch(`${API_URL}/api/user/profile-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Tải ảnh lên thất bại (Status: ${response.status})`);
  }

  return response.json();
};

export const deleteUser = async (id: string): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error('Không có token, vui lòng đăng nhập lại');
  }

  const response = await fetch(`${API_URL}/api/user/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Xóa người dùng thất bại (Status: ${response.status})`);
  }
};