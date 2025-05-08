/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from 'jwt-decode';
import { Lesson } from '@/types/lesson';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/lesson`;

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

// Lấy tất cả bài học
export const getLessons = async (): Promise<any> => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Không thể lấy danh sách bài học');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài học:', error);
    throw error;
  }
};

// Lấy bài học theo ID
export const getLessonById = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (response.status === 404) throw new Error('Không tìm thấy bài học');
    if (!response.ok) throw new Error('Lỗi khi lấy thông tin bài học');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy bài học theo ID:', error);
    throw error;
  }
};

// Lấy bài học theo ID chương
export const getLessonsByChapterId = async (
  chapterId: string
): Promise<Lesson[]> => {
  try {
    const response = await fetch(`${API_URL}/chapter/${chapterId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy bài học theo chương:', error);
    throw error;
  }
};

// Lấy bài học theo ID khóa học
export const getLessonsByCourseId = async (courseId: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/course/${courseId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok)
      throw new Error('Không thể lấy danh sách bài học của khóa học');

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Dữ liệu bài học không hợp lệ');
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy bài học theo khóa học:', error);
    throw error;
  }
};

// Tạo bài học mới
export const createLesson = async (data: {
  title: string;
  description: string;
  videoUrl: string;
  courseId: string;
}): Promise<any> => {
  const token = getAuthToken();
  const instructorId = getUserId();

  const payload = {
    ...data,
    instructorId,
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Không thể tạo bài học mới');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi tạo bài học:', error);
    throw error;
  }
};

// Cập nhật bài học
export const updateLesson = async (
  id: string,
  data: {
    title: string;
    description: string;
    videoUrl: string;
  }
): Promise<any> => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Không thể cập nhật bài học');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật bài học:', error);
    throw error;
  }
};

// Xóa bài học
export const deleteLesson = async (id: string): Promise<any> => {
  const token = getAuthToken();

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Không thể xóa bài học');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi xóa bài học:', error);
    throw error;
  }
};
