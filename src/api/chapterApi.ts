import { Chapter } from '@/types/chapter';

export const getChaptersByCourseId = async (
  courseId: string
): Promise<Chapter[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chapter/course/${courseId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || []; // Xử lý an toàn
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
};
