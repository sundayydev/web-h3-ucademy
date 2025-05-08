"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import LogoH3 from '@/public/images/logo-h3.png';
import { FaSearch } from 'react-icons/fa';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setUser, setIsLoggedIn, logout } from '@/lib/authReducer';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  search,
  getProfile,
  logout as logoutApi,
} from '../api/authApi';
import {
  LoginData,
  RegisterData,
  ResetPasswordData,
  SearchResult,
} from '@/types/auth';
import type { RootState } from '@/lib/store';

type PopupType = 'login' | 'register' | 'forgotPassword' | 'resetPassword' | null;

const LoginPopup = dynamic(() => import('./LoginPopup'), { ssr: false });
const RegisterPopup = dynamic(() => import('./RegisterPopup'), { ssr: false });
const ForgotPasswordPopup = dynamic(() => import('./ForgotPasswordPopup'), {
  ssr: false,
});
const ResetPasswordPopup = dynamic(() => import('./ResetPasswordPopup'), {
  ssr: false,
});

const Header = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [popup, setPopup] = useState<PopupType>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult>({
    courses: [],
    posts: [],
  });
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const openPopup = (type: PopupType) => setPopup(type);
  const closePopup = () => setPopup(null);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults({ courses: [], posts: [] });
      return;
    }
    setIsSearching(true);
    try {
      const data = await search(query);
      setSearchResults({
        courses: data.courses?.slice(0, 5) || [],
        posts: data.posts?.slice(0, 5) || [],
      });
    } catch (error: unknown) {
      const errorMessage =
          error instanceof Error ? error.message : 'Không thể tìm kiếm';
      toast.error(errorMessage);
      setSearchResults({ courses: [], posts: [] });
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    if (isClient) {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        dispatch(setUser(userData));
        dispatch(setIsLoggedIn(true));
      }
    }
  }, [dispatch, isClient]);

  const handleForgotPassword = async (email: string) => {
    setForgotEmail(email);
    try {
      await forgotPassword(email);
      toast.success('Mã OTP đã được gửi qua email!');
      openPopup('resetPassword');
    } catch (error: unknown) {
      const errorMessage =
          error instanceof Error ? error.message : 'Email không tồn tại';
      toast.error(errorMessage);
    }
  };

  const handleLogin = async (data: LoginData) => {
    try {
      await login(data);
      const userResponse = await getProfile();
      if (userResponse) {
        dispatch(setUser(userResponse));
        dispatch(setIsLoggedIn(true));
        localStorage.setItem('user', JSON.stringify(userResponse));
        toast.success('Đăng nhập thành công!');
        closePopup();
      }
    } catch (error: unknown) {
      const errorMessage =
          error instanceof Error ? error.message : 'Đăng nhập thất bại';
      toast.error(errorMessage);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      await register(data);
      const userResponse = await getProfile();
      if (userResponse) {
        dispatch(setUser(userResponse));
        dispatch(setIsLoggedIn(true));
        localStorage.setItem('user', JSON.stringify(userResponse));
        toast.success('Đăng ký thành công, bạn đã được đăng nhập!');
        closePopup();
      }
    } catch (error: unknown) {
      const errorMessage =
          error instanceof Error ? error.message : 'Đăng ký thất bại';
      toast.error(errorMessage);
    }
  };

  const handleResetPassword = async (data: ResetPasswordData) => {
    try {
      await resetPassword(data);
      toast.success('Mật khẩu đã được đặt lại thành công!');
      setTimeout(() => {
        closePopup();
        openPopup('login');
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
          error instanceof Error ? error.message : 'Lỗi đặt lại mật khẩu';
      toast.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem('user');
      toast.success('Đăng xuất thành công!');
      dispatch(logout());
      closePopup();
    } catch (error: unknown) {
      const errorMessage =
          error instanceof Error ? error.message : 'Đăng xuất thất bại';
      toast.error(errorMessage);
    }
  };

  if (!isClient) {
    return (
        <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md relative">
          <div className="w-38 h-38" />
          <div className="w-full md:max-w-lg mx-4 h-10" />
          <div className="w-20 h-10" />
        </header>
    );
  }

  return (
      <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md relative">
        <h1 className="flex items-center space-x-2">
          <Link href="/" className="rounded-lg">
            <Image
                src={LogoH3}
                alt="Logo H3"
                width={38}
                height={38}
                className="rounded-lg"
                onError={(e) => {
                  console.warn('Lỗi: Không thể tải hình ảnh logo-h3.png');
                  e.currentTarget.src = '/fallback.png';
                }}
            />
          </Link>
          <Link
              href="/"
              className="font-semibold text-base text-black hover:text-pink-600 hidden md:block"
          >
            Học Lập Trình Cùng H3
          </Link>
        </h1>

        <div className="relative flex-1 md:max-w-lg mx-4">
          <input
              type="text"
              placeholder="Tìm kiếm khóa học, bài viết, video, ..."
              className="w-full px-4 py-2 pl-10 border font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm khóa học, bài viết hoặc video"
          />
          <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              aria-hidden="true"
          />
          {searchQuery && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                    <p className="p-4 text-gray-500">Đang tải...</p>
                ) : searchResults.courses.length === 0 &&
                searchResults.posts.length === 0 ? (
                    <p className="p-4 text-gray-500">Không tìm thấy kết quả</p>
                ) : (
                    <>
                      {searchResults.courses.length > 0 && (
                          <div className="p-2">
                            <h4 className="font-semibold text-gray-700">KHÓA HỌC</h4>
                            {searchResults.courses.map((course) => (
                                <Link
                                    key={course.id}
                                    href={`/courses/${course.id}`}
                                    className="block p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <span>{course.title}</span>
                                </Link>
                            ))}
                          </div>
                      )}
                      {searchResults.posts.length > 0 && (
                          <div className="p-2">
                            <h4 className="font-semibold text-gray-700">BÀI VIẾT</h4>
                            {searchResults.posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/posts/${post.id}`}
                                    className="block p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <div className="flex justify-between">
                                    <span>{post.title}</span>
                                    <span className="text-gray-500">
                            {post.user?.fullName || 'Ẩn danh'}
                          </span>
                                  </div>
                                </Link>
                            ))}
                          </div>
                      )}
                    </>
                )}
              </div>
          )}
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div>
            <Link href="/my-courses" className="p-3 hover:text-pink-600">
              Khóa học của tôi
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoggedIn && (
                <>
                  <Button
                      variant="outline"
                      className="text-black font-semibold rounded-full"
                      onClick={() => openPopup('register')}
                  >
                    Đăng ký
                  </Button>
                  <Button
                      className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full font-semibold"
                      onClick={() => openPopup('login')}
                  >
                    Đăng nhập
                  </Button>
                </>
            )}
            {isLoggedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold shadow-xl hover:bg-blue-800"
                        aria-label="Menu người dùng"
                    >
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 p-2 shadow-lg rounded-2xl m-4">
                    <div className="flex items-center gap-3 p-3">
                      <Avatar className="w-10 h-10">
                        <Image
                            src={user?.avatarUrl || LogoH3}
                            alt="Ảnh đại diện người dùng"
                            width={40}
                            height={40}
                            className="rounded-full"
                            onError={(e) => {
                              console.warn('Lỗi: Không thể tải ảnh đại diện người dùng');
                              e.currentTarget.src = '/fallback.png';
                            }}
                        />
                        <AvatarFallback className="bg-blue-500 text-white font-bold">
                          {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user?.fullName || 'Người dùng'}</p>
                        <p className="text-gray-500 text-sm break-words">
                          {user?.email || 'email'}
                        </p>
                      </div>
                    </div>
                    <hr />
                    <DropdownMenuItem asChild>
                      <Link
                          href="user/edit-profile"
                          className="block p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        Trang cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                          href="/write-blog"
                          className="block p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        Viết blog
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                          href="/my-posts"
                          className="block p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        Bài viết của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                          href="/saved-posts"
                          className="block p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        Bài viết đã lưu
                      </Link>
                    </DropdownMenuItem>
                    <hr />
                    <DropdownMenuItem asChild>
                      <Link
                          href="/settings"
                          className="block p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer text-red-500"
                        onClick={handleLogout}
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            )}
          </div>
        </div>

        <LoginPopup
            isOpen={popup === 'login'}
            onClose={closePopup}
            loginData={{ email: '', password: '' }}
            showPassword={false}
            onLogin={handleLogin}
            onOpenRegister={() => openPopup('register')}
            onOpenForgotPassword={() => openPopup('forgotPassword')}
        />
        <RegisterPopup
            isOpen={popup === 'register'}
            onClose={closePopup}
            registerData={{ fullName: '', email: '', password: '', confirmPassword: '' }}
            showPassword={false}
            onRegister={handleRegister}
            onOpenLogin={() => openPopup('login')}
        />
        <ForgotPasswordPopup
            isOpen={popup === 'forgotPassword'}
            onClose={closePopup}
            forgotEmail={forgotEmail}
            onForgotPassword={handleForgotPassword}
        />
        <ResetPasswordPopup
            isOpen={popup === 'resetPassword'}
            onClose={closePopup}
            resetPasswordData={{
              email: forgotEmail,
              resetCode: '',
              newPassword: '',
              confirmNewPassword: ''
            }}
            showNewPassword={false}
            loading={false}
            onResetPassword={handleResetPassword}
        />
      </header>
  );
};

export default Header;