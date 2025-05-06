const API_URL = process.env.NEXT_PUBLIC_API_URL;

//Lấy thông tin của giảng viên
export const getInstructorById = async (instructorId: string) => {
  const res = await fetch(`${API_URL}/api/user/${instructorId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lấy thông tin giảng viên thất bại');
  }

  const data = await res.json();
  return data;
};
