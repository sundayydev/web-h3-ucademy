'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LogoH3 from '@/public/images/logo-h3.png';
import { login, getProfile } from '../api/authApi';
import { useDispatch } from 'react-redux';
import { setUser, setIsLoggedIn } from '@/lib/authReducer';
import { LoginData } from '@/types/auth';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  loginData: LoginData;
  showPassword: boolean;
  onLogin: (data: LoginData) => void;
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
}

export default function LoginPopup({
  isOpen,
  onClose,
  loginData: initialData,
  showPassword: initialShowPassword,
  onOpenRegister,
  onOpenForgotPassword,
}: LoginPopupProps) {
  const [loginData, setLoginData] = useState<LoginData>(initialData);
  const [showPassword, setShowPassword] = useState(initialShowPassword);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      await login(loginData);
      const userResponse = await getProfile();
      if (userResponse) {
        dispatch(setUser(userResponse));
        dispatch(setIsLoggedIn(true));
        localStorage.setItem('user', JSON.stringify(userResponse));
        toast.success('Đăng nhập thành công!');
        onClose();
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Đăng nhập thất bại';
      toast.error(errorMessage);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-4 md:max-w-xl max-w-sm relative h-[500px] md:h-[550px]">
        <div className="flex justify-center mb-4 mt-4">
          <Image
            src={LogoH3}
            alt="Logo H3"
            className="h-10 rounded-lg"
            width={40}
            height={40}
          />
        </div>
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          onClick={onClose}
          aria-label="Đóng"
        >
          <FaTimes size={20} />
        </button>
        <div className="mx-4 md:mx-10">
          <h3 className="text-center text-lg md:text-2xl font-bold text-gray-700 mb-3">
            Đăng nhập vào H3
          </h3>
          <div className="relative mb-3">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
              aria-label="Email"
            />
          </div>
          <div className="relative mb-3">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="w-full px-9 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
              aria-label="Mật khẩu"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          <div className="flex justify-between items-center mb-4 text-xs md:text-sm">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-1" />
              <label htmlFor="remember" className="text-gray-900">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <button
              className="text-blue-500 hover:text-red-500"
              onClick={onOpenForgotPassword}
            >
              Quên mật khẩu?
            </button>
          </div>
          <Button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
            onClick={handleLogin}
          >
            Đăng nhập
          </Button>
          <div className="my-3 text-center text-gray-500 text-xs md:text-sm">
            HOẶC
          </div>
          <div className="flex flex-col gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg py-2 flex items-center justify-center text-sm md:text-base">
              <FcGoogle className="w-5 h-5 mr-2" />
              Tiếp tục với Google
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 flex items-center justify-center text-sm md:text-base">
              <FaFacebook className="w-5 h-5 mr-2" />
              Tiếp tục với Facebook
            </button>
          </div>
          <div className="mt-3 text-center mb-3">
            <span className="text-gray-600 text-xs md:text-sm">
              Chưa có tài khoản?
            </span>
            <button
              className="text-blue-500 hover:text-green-500 text-xs md:text-sm ml-1"
              onClick={onOpenRegister}
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
