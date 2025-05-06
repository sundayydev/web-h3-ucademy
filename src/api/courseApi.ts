
/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from 'jwt-decode';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/course`;

export const getCourses = async (): Promise<any> => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Không thể lấy danh sách khóa học');
    }
    return response.json();
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khóa học:', error);
    throw error;
  }
};

export const getCourseById = async (courseId: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin khóa học');
    }
    return response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khóa học:', error);
    throw error;
  }
};

export const createCourse = async (data: {
  title: string;
  description: string;
  price: number;
  contents: string;
}): Promise<any> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const decodedToken: any = jwtDecode(token);
  const newData = {
    title: data.title,
    description: data.description,
    price: data.price,
    instructorId: decodedToken.id,
    contents: data.contents.split('\n').filter((line: string) => line.trim() !== ''),
  };
  console.log('New Data:', newData);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    if (!response.ok) {
      throw new Error('Không thể tạo khóa học');
    }
    return response.json();
  } catch (error) {
    console.error('Lỗi khi tạo khóa học:', error);
    throw error;
  }
};

export const updateCourse = async (
  id: string,
  data: {
    title: string;
    description: string;
    price: number;
    contents: string;
  }
): Promise<any> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const decodedToken: any = jwtDecode(token);
  const updatedData = {
    title: data.title,
    description: data.description,
    price: data.price,
    instructorId: decodedToken.id,
    contents: data.contents.split('\n').filter((line: string) => line.trim() !== ''),
  };

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Không thể cập nhật khóa học');
    }
    return response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật khóa học:', error);
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<any> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Không thể xóa khóa học');
    }
    return response.json();
  } catch (error) {
    console.error('Lỗi khi xóa khóa học:', error);
    throw error;
  }
};

export const uploadImage = async (id: string, urlImage: File): Promise<any> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Không tìm thấy token');
  }

  const formData = new FormData();
  formData.append('file', urlImage);

  try {
    const response = await fetch(`${API_URL}/upload-image/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Không thể tải lên hình ảnh');
    }
    return response.json();
  } catch (error) {
    console.error('Lỗi khi tải lên hình ảnh:', error);
    throw error;
  }
};

export async function getCoursePaginated(pageNumber: number, pageSize: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/course/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    throw new Error('Không thể lấy thông tin khóa học');
  }

  const data = await res.json();
  console.log('data', data);
  return data;
}

