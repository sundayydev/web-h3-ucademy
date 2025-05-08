'use client';

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setUser, setIsLoggedIn, logout } from '@/lib/authReducer';
import { RootState } from '@/lib/store';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string; // Thay đổi từ 'userId' sang 'id' dựa trên mã server
  exp: number;
  email?: string;
  role?: string;
  name?: string;
  profileImage?: string;
  birthDate?: string;
  [key: string]: any;
}

interface UserData {
  id: string;
  email?: string;
  role?: string;
  name?: string;
  profileImage?: string;
  birthDate?: string;
}

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  const checkAuth = useCallback(async () => {
    console.log('Kiểm tra trạng thái đăng nhập');
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
          throw new Error('Token đã hết hạn');
        }

        const userId = decoded.id;
        if (!userId) {
          throw new Error('Token không chứa thông tin ID người dùng');
        }

        const userData: UserData = {
          id: userId,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
          profileImage: decoded.profileImage,
          birthDate: decoded.birthDate,
        };

        dispatch(setIsLoggedIn(true));
        dispatch(setUser(userData));
        console.log('Người dùng đã đăng nhập:', userId);
      } catch (error: unknown) {
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Lỗi lấy thông tin người dùng';
        console.error('Lỗi kiểm tra đăng nhập:', errorMessage);
        localStorage.removeItem('token');
        dispatch(logout());
        toast.error('Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại.');
      }
    } else if (isLoggedIn) {
      dispatch(logout());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isLoggedIn, user };
};