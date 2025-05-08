'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setUser, setIsLoggedIn, logout } from '@/lib/authReducer';
import { RootState } from '@/lib/store';

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Kiểm tra trạng thái đăng nhập');
      const token = localStorage.getItem('token');
      if (token && !isLoggedIn) {
        try {
          // Token contains user ID, can use it to fetch user info
          console.log('Gọi getUserInfo với token:', token);
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
      }
    };
    fetchUserData();
  }, [dispatch, isLoggedIn]);
};
