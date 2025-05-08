'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaBirthdayCake, FaCamera, FaEdit, FaTimes } from 'react-icons/fa';
import { getUserInfo, updateUserInfo, uploadProfileImage } from '@/api/userApi';
import { User, UpdateUserDto } from '@/types/user';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserDto & { profileImage: File | null }>({
    fullName: '',
    email: '',
    birthDate: '',
    password: '',
    profileImage: null,
    phone: '',
    role: undefined,
    ipAddress: '',
    deviceName: '',
    googleId: '',
    isGoogleAccount: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Không có token, vui lòng đăng nhập lại');
        }

        const userData = await getUserInfo();
        setUser(userData);
        setEditForm({
          fullName: userData.fullName || '',
          email: userData.email || '',
          birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString().slice(0, 10) : '',
          password: '',
          profileImage: null,
          phone: userData.phone || '',
          role: userData.role || '',
          ipAddress: userData.ipAddress || '',
          deviceName: userData.deviceName || '',
          googleId: userData.googleId || '',
          isGoogleAccount: userData.isGoogleAccount || false,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu người dùng';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không có token, vui lòng đăng nhập lại');
      }

      const decodedToken: { id?: string } = jwtDecode(token);
      const userId = decodedToken.id;

      if (!userId) {
        throw new Error('Không thể lấy ID người dùng từ token');
      }

      const dataToUpdate: UpdateUserDto = {
        fullName: editForm.fullName,
        email: editForm.email,
        birthDate: editForm.birthDate ? new Date(editForm.birthDate).toISOString() : undefined,
        password: editForm.password?.trim() || undefined,
        phone: editForm.phone,
        role: editForm.role,
        ipAddress: editForm.ipAddress,
        deviceName: editForm.deviceName,
        googleId: editForm.googleId,
        isGoogleAccount: editForm.isGoogleAccount,
      };

      const updatedUser = await updateUserInfo(userId, dataToUpdate);
      let newProfileImage = user?.profileImage;

      if (editForm.profileImage && editForm.profileImage instanceof File) {
        const imageResponse = await uploadProfileImage(editForm.profileImage);
        newProfileImage = imageResponse.profileImage;
      }

      setUser((prev) => ({
        ...prev!,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        birthDate: updatedUser.birthDate,
        role: updatedUser.role || prev!.role,
        phone: updatedUser.phone || prev!.phone,
        profileImage: newProfileImage || prev!.profileImage,
        createdAt: updatedUser.createdAt || prev!.createdAt,
        ipAddress: updatedUser.ipAddress || prev!.ipAddress,
        deviceName: updatedUser.deviceName || prev!.deviceName,
        googleId: updatedUser.googleId || prev!.googleId,
        isGoogleAccount: updatedUser.isGoogleAccount ?? prev!.isGoogleAccount,
      }));

      setIsEditModalOpen(false);
      toast.success('Cập nhật hồ sơ thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Cập nhật hồ sơ thất bại';
      toast.error(message, {
        position: 'top-right',
        autoClose: 3000,
      });
      if (message.includes('token')) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Vui lòng chọn ảnh JPG hoặc PNG');
        return;
      }
      setEditForm((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleRetryLogin = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={handleRetryLogin}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Không có dữ liệu người dùng</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image and Name */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="relative">
              <div
                className="w-32 h-32 md:w-40 md:h-40 relative rounded-full border-4 border-blue-500 cursor-pointer transition-transform hover:scale-105"
                onClick={() => setIsImageModalOpen(true)}
              >
                <Image
                  src={
                    user.profileImage
                      ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`
                      : '/default-post-image.jpg'
                  }
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                  sizes="(min-width: 768px) 10rem, 8rem"
                />
              </div>
              <label className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors">
                <FaCamera />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <h1 className="mt-4 text-xl md:text-2xl font-bold text-blue-600">
              {user.fullName}
            </h1>
            <p className="text-gray-600">{user.role}</p>
            <button
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => setIsEditModalOpen(true)}
            >
              <FaEdit /> Chỉnh sửa hồ sơ
            </button>
          </div>

          {/* User Information */}
          <div className="md:w-2/3 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-blue-600">Thông tin cá nhân</h2>
              <ul className="mt-2 space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" />
                  <span>{user.email}</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaBirthdayCake className="text-blue-500" />
                  <span>
                    {user.birthDate
                      ? new Date(user.birthDate).toLocaleDateString('vi-VN')
                      : 'Chưa có ngày sinh'}
                  </span>
                </li>
                <li>
                  <span className="font-medium">Vai trò:</span> {user.role}
                </li>
                <li>
                  <span className="font-medium">Ngày tạo:</span>{' '}
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </li>
                <li>
                  <span className="font-medium">Tài khoản Google:</span>{' '}
                  {user.isGoogleAccount ? 'Có' : 'Không'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 z-50">
          <div className="relative max-w-md w-full">
            <Image
              src={
                user.profileImage
                  ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`
                  : '/default-post-image.jpg'
              }
              alt="Profile Enlarged"
              width={600}
              height={600}
              className="rounded-lg w-full object-cover"
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              onClick={() => setIsImageModalOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Chỉnh sửa hồ sơ</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={editForm.fullName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  name="birthDate"
                  value={editForm.birthDate || ''}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu mới (tùy chọn)"
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Ảnh đại diện</label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;