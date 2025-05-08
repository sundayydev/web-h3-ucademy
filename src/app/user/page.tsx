'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getUserById } from '@/api/userApi';
import { getUserInfo } from '@/api/authApi'; // Import hàm getUserInfo
import { User } from '@/types/user';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Lấy thông tin người dùng từ localStorage
        const storedUser = localStorage.getItem('user');
        let userId: string | null = null;
        let userEmail: string | null = null;

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          userId = parsedUser.id;
          userEmail = parsedUser.email;
        }

        // Nếu không có ID trong localStorage, gọi getUserInfo
        if (!userId && userEmail) {
          const userInfo = await getUserInfo(userEmail);
          userId = userInfo.id; // Giả định API trả về id
          localStorage.setItem('user', JSON.stringify(userInfo)); // Cập nhật localStorage
        }

        if (!userId) {
          throw new Error('Không tìm thấy ID người dùng');
        }

        // Gọi API để lấy chi tiết người dùng
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Lỗi: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không có dữ liệu người dùng
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative w-16 h-16">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt="Ảnh đại diện"
                fill
                sizes="64px"
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                H3
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold">
              {user.fullName || 'Người dùng'}
            </h1>
            <p className="text-gray-600">
              {user.email || 'lehoaihuan@gmail.com'}
            </p>
            <p className="text-sm text-gray-500">Vai trò: {user.role}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {user.phone || 'Chưa cung cấp'}
          </p>
          <p>
            <strong>Ngày sinh:</strong>{' '}
            {user.birthDate
              ? new Date(user.birthDate).toLocaleDateString('vi-VN')
              : 'Chưa cung cấp'}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{' '}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleString('vi-VN')
              : 'Chưa cung cấp'}
          </p>
          <p>
            <strong>Địa chỉ IP:</strong> {user.ipAddress || 'Chưa cung cấp'}
          </p>
          <p>
            <strong>Tên thiết bị:</strong> {user.deviceName || 'Chưa cung cấp'}
          </p>
          <p>
            <strong>Google ID:</strong> {user.googleId || 'Chưa liên kết'}
          </p>
          <p>
            <strong>Tài khoản Google:</strong>{' '}
            {user.isGoogleAccount ? 'Có' : 'Không'}
          </p>
        </div>
        <div className="mt-4">
          <Link href="/user/edit-profile">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Chỉnh sửa thông tin
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
