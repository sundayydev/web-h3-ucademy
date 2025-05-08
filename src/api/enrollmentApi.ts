/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from 'jwt-decode';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/enrollment`;

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

// Lấy tất cả enrollments
export const getEnrollments = async (): Promise<any> => {
  try {
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Không thể lấy danh sách enrollments');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi lấy enrollments:', err);
    throw err;
  }
};

// Lấy enrollment theo ID người dùng
export const getEnrollmentByUserId = async (): Promise<any> => {
  const userId = getUserId();
  try {
    const res = await fetch(`${API_URL}/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Không thể lấy enrollments theo user');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi lấy enrollment theo user:', err);
    throw err;
  }
};

// Lấy enrollment theo ID khóa học
export const getEnrollmentsByCourseId = async (
  courseId: string
): Promise<any> => {
  try {
    const res = await fetch(`${API_URL}/course/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Không thể lấy enrollment theo khóa học');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi lấy enrollment theo course:', err);
    throw err;
  }
};

// Tạo mới enrollment
export const createEnrollment = async (courseId: string): Promise<any> => {
  const token = getAuthToken();
  const userId = getUserId();

  const payload = {
    UserId: userId,
    CourseId: courseId,
    Status: 'InProgress',
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Không thể tạo enrollment');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi tạo enrollment:', err);
    throw err;
  }
};

// Cập nhật enrollment
export const updateEnrollment = async (id: string, data: any): Promise<any> => {
  const token = getAuthToken();

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Không thể cập nhật enrollment');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi cập nhật enrollment:', err);
    throw err;
  }
};

// Xóa enrollment
export const deleteEnrollment = async (id: string): Promise<any> => {
  const token = getAuthToken();

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Không thể xóa enrollment');
    return res.json();
  } catch (err) {
    console.error('Lỗi khi xóa enrollment:', err);
    throw err;
  }
};
