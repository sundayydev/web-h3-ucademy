'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {getUserById, updateUser} from '@/api/userApi';
import { getUserInfo, logout } from '@/api/authApi';
import { User, UpdateUserDto } from '@/types/user';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';

export default function EditProfile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UpdateUserDto>({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        profileImage: '',
        role: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);

                const authToken = Cookies.get('auth_token');
                const userEmail = Cookies.get('userEmail');

                if (!authToken || !userEmail) {
                    setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    setLoading(false);
                    return;
                }

                const userInfo = await getUserInfo(userEmail);
                if (!userInfo?.id) {
                    setError('Không xác định được người dùng. Vui lòng đăng nhập lại.');
                    setLoading(false);
                    return;
                }

                const userData = await getUserById(userInfo.id);
                if (!userData?.id) {
                    setError('Không tìm thấy thông tin người dùng.');
                    setLoading(false);
                    return;
                }

                setUser(userData);
                setFormData({
                    fullName: userData.fullName ?? '',
                    email: userData.email ?? '',
                    phone: userData.phone ?? '',
                    birthDate: userData.birthDate ?? '',
                    profileImage: userData.profileImage ?? '',
                    role: userData.role ?? '',
                });

                setLoading(false);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Lỗi không xác định.';
                setError(`Đã xảy ra lỗi: ${message}`);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []); // ✅ không cần [router]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            // Lấy email từ cookie để gọi getUserInfo
            const userEmail = document.cookie
                .split('; ')
                .find((row) => row.startsWith('userEmail='))
                ?.split('=')[1];
            console.log('User email from cookie (submit):', userEmail); // Debug email

            if (!userEmail) {
                setError('Không tìm thấy email người dùng trong cookie. Vui lòng đăng nhập lại.');
                return;
            }

            const userInfo = await getUserInfo(userEmail);
            if (!userInfo?.id) {
                setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
                return;
            }

            const updatedUserData = await updateUser(userInfo.id, formData);
            setSuccess('Cập nhật hồ sơ thành công!');
            setTimeout(() => router.push('/user'), 1500); // Chuyển hướng sau 1.5 giây
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.';
            setError(errorMessage);
        }
    };

    const handleRetryLogin = () => {
        router.push('/login');
    };

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
                {error}
                <button
                    onClick={handleRetryLogin}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Đăng nhập lại
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Không có dữ liệu người dùng.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa hồ sơ</h1>
                {success && (
                    <div className="mb-4 text-green-500">{success}</div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName ?? ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email ?? ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone ?? ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={
                                formData.birthDate
                                    ? new Date(formData.birthDate).toISOString().split('T')[0]
                                    : ''
                            }
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ảnh đại diện (URL)</label>
                        <input
                            type="text"
                            name="profileImage"
                            value={formData.profileImage ?? ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role ?? ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Cập nhật hồ sơ
                    </button>
                </form>
            </div>
        </div>
    );
}