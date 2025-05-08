/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from 'jwt-decode';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/review`;
const ENROLLMENT_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment`;

const getAuthToken = (): string => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Không tìm thấy token');
  return token;
};

const getUserId = (): string => {
  const token = getAuthToken();
  const decoded: any = jwtDecode(token);
  return decoded.id;
};

// Public: Lấy review theo course
export const getPublicReviewsByCourseId = async (
  courseId: string
): Promise<any> => {
  try {
    const res = await fetch(`${API_URL}/course/${courseId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Không thể lấy đánh giá công khai');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi lấy đánh giá công khai:', err);
    throw err;
  }
};

// Public: Lấy số lượng enrollments theo course
export const getPublicEnrollmentsByCourseId = async (
  courseId: string
): Promise<any> => {
  try {
    const res = await fetch(`${ENROLLMENT_URL}/course/${courseId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Không thể lấy số người đăng ký');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi lấy số lượng đăng ký:', err);
    throw err;
  }
};

// Private: Lấy review có auth
export const getReviewsByCourseId = async (courseId: string): Promise<any> => {
  const token = getAuthToken();
  try {
    const res = await fetch(`${API_URL}/course/${courseId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Không thể lấy đánh giá');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi lấy đánh giá:', err);
    throw err;
  }
};

// Tạo review
export const createReview = async (reviewData: any): Promise<any> => {
  const token = getAuthToken();
  const userId = getUserId();

  const body = {
    ...reviewData,
    userId: userId,
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Không thể tạo đánh giá');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi tạo đánh giá:', err);
    throw err;
  }
};

// Cập nhật review
export const updateReview = async (
  reviewId: string,
  reviewData: any
): Promise<any> => {
  const token = getAuthToken();
  const userId = getUserId();

  const body = {
    ...reviewData,
    userId: userId,
  };

  try {
    const res = await fetch(`${API_URL}/${reviewId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Không thể cập nhật đánh giá');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi cập nhật đánh giá:', err);
    throw err;
  }
};

// Xóa review
export const deleteReview = async (reviewId: string): Promise<any> => {
  const token = getAuthToken();
  const userId = getUserId();

  try {
    const res = await fetch(`${API_URL}/${reviewId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Không thể xóa đánh giá');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi xóa đánh giá:', err);
    throw err;
  }
};
