import { Course } from '@/types/course';

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/course`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Không thể lấy danh sách khóa học');
  }
  return response.json();
}