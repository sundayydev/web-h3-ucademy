/* eslint-disable @typescript-eslint/no-explicit-any */

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

    const data = await response.json();
    console.log('API response:', data);
    return data;
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
        Authorization: `Bearer ${token}`,
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
