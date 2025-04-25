'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import { ResetPasswordData } from '../types/auth';
import Image from 'next/image';
import LogoH3 from '@/public/images/logo-h3.png';

interface ResetPasswordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  resetPasswordData: ResetPasswordData;
  showNewPassword: boolean;
  loading: boolean;
  onResetPassword: (data: ResetPasswordData) => void; // Cập nhật để nhận form data
}

const ResetPasswordPopup: React.FC<ResetPasswordPopupProps> = ({
  isOpen,
  onClose,
  resetPasswordData,
  showNewPassword: initialShowNewPassword,
  loading,
  onResetPassword,
}) => {
  // Quản lý trạng thái form
  const [formData, setFormData] = useState<ResetPasswordData>(resetPasswordData);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(initialShowNewPassword);

  // Đồng bộ resetPasswordData từ props
  useEffect(() => {
    setFormData(resetPasswordData);
  }, [resetPasswordData]);

  if (!isOpen) return null;

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý đặt lại mật khẩu
  const handleResetPassword = () => {
    if (!formData.email || !formData.resetCode || !formData.newPassword) {
      alert('Vui lòng nhập đầy đủ email, mã xác nhận và mật khẩu mới');
      return;
    }
    onResetPassword(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          onClick={onClose}
          aria-label="Đóng popup"
        >
          <FaTimes size={20} />
        </button>
        <div className="flex justify-center mb-4 mt-4">
          <Image
            src={LogoH3}
            alt="Logo H3"
            className="rounded-lg"
            width={50}
            height={50}
            onError={(e) => {
              console.warn('Lỗi: Không thể tải hình ảnh logo-h3.png');
              e.currentTarget.src = '/fallback.png';
            }}
          />
        </div>
        <h3 className="text-center text-lg font-bold text-gray-700 mb-3">Đặt Lại Mật Khẩu</h3>
        <div className="relative mb-3">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-9 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
            aria-label="Nhập email"
            required
          />
        </div>
        <div className="relative mb-3">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="resetCode"
            placeholder="Nhập mã xác nhận"
            value={formData.resetCode}
            onChange={handleInputChange}
            className="w-full px-9 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
            aria-label="Nhập mã xác nhận"
            required
          />
        </div>
        <div className="relative mb-3">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            placeholder="Nhập mật khẩu mới"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full px-9 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
            aria-label="Nhập mật khẩu mới"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowNewPassword(!showNewPassword)}
            aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>
        <Button
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận đặt lại mật khẩu'}
        </Button>
      </div>
    </div>
  );
};

export default ResetPasswordPopup;