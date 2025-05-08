const API_URL = process.env.NEXT_PUBLIC_API_URL;

//Lấy danh sách danh mục theo ID
export const getCategoryById = async (categoryId: string) => {
  const response = await fetch(`${API_URL}/api/category/${categoryId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Lấy danh mục thất bại');
  }
  return response.json();
};
