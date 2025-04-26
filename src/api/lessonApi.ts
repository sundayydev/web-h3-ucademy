import { Lesson } from '@/types/lesson';

export async function getLessons(): Promise<Lesson[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lesson`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Không thể lấy bài học');
  }
  return response.json();
}