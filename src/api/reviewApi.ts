import { Review } from '@/types/review';

export async function getReviews(): Promise<Review[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/review`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Không thể lấy đánh giá');
  }
  return response.json();
}