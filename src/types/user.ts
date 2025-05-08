export interface User {
  id: string; // Guid từ backend sẽ được xử lý dưới dạng string trong TypeScript
  fullName: string;
  email: string;
  phone?: string | null;
  birthDate?: string | null; // DateTime từ backend trả về dạng string (ISO format)
  profileImage?: string | null;
  role: string;
  createdAt: string; // DateTime từ backend trả về dạng string
  ipAddress?: string | null;
  deviceName?: string | null;
  googleId?: string | null;
  isGoogleAccount: boolean;
}

// DTO để tạo người dùng (dựa trên CreateUserDto)
export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  birthDate?: string;
  role: string;
}

// DTO để cập nhật người dùng (dựa trên UpdateUserDto)
export interface UpdateUserDto {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  profileImage?: string | null;
  role?: string | null;
}

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  birthDate?: string | null;
  profileImage: null;
  role: string;
  createdAt: string;
  ipAddress: string | null;
  deviceName: string | null;
  googleId?: string | null;
  isGoogleAccount: boolean;
}
