'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FaEnvelope, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import LogoH3 from '@/public/images/logo-h3.png';

interface ForgotPasswordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  forgotEmail: string;
  onForgotPassword: (email: string) => void; // Cập nhật để nhận email
}

const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({
  isOpen,
  onClose,
  forgotEmail,
  onForgotPassword,
}) => {
  // Quản lý trạng thái email
  const [email, setEmail] = useState<string>(forgotEmail);

  // Đồng bộ forgotEmail từ props
  useEffect(() => {
    setEmail(forgotEmail);
  }, [forgotEmail]);

  if (!isOpen) return null;

  // Xử lý gửi yêu cầu
  const handleForgotPassword = () => {
    if (!email) {
      alert('Vui lòng nhập email');
      return;
    }
    onForgotPassword(email);
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
        <h3 className="text-center text-lg font-bold text-gray-700 mb-3">Quên Mật Khẩu</h3>
        <div className="relative mb-3">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-9 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
            aria-label="Nhập email để khôi phục mật khẩu"
            required
          />
        </div>
        <Button
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
          onClick={handleForgotPassword}
        >
          Gửi Yêu Cầu
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;