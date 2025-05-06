'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setUser, setIsLoggedIn, logout } from '@/lib/authReducer';
import { getUserInfo } from '../api/authApi';
import { RootState } from '@/lib/store';

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Kiểm tra trạng thái đăng nhập');
      const storedUser = localStorage.getItem('user');
      if (storedUser && !isLoggedIn) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('Gọi getUserInfo với email:', userData.email);
          const userResponse = await getUserInfo(userData.email);
          dispatch(setUser(userResponse));
          dispatch(setIsLoggedIn(true));
          console.log('Đã cập nhật trạng thái đăng nhập:', userResponse);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Lỗi lấy thông tin người dùng';
          console.error('Lỗi kiểm tra đăng nhập:', errorMessage);
          localStorage.removeItem('user');
          dispatch(logout());
          toast.error('Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại.');
        }
      }
    };
    fetchUserData();
  }, [dispatch, isLoggedIn]);
};
