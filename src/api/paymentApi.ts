const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/payment`;

// Lấy token từ localStorage
const getAuthToken = (): string => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Không tìm thấy token');
  return token;
};

// Lấy tất cả thanh toán
export const getAllPayments = async () => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Không thể lấy tất cả thanh toán');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy tất cả thanh toán:', error);
    throw error;
  }
};

// Lấy thanh toán theo ID
export const getPaymentById = async (id: string) => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Không thể lấy thanh toán theo ID');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thanh toán theo ID:', error);
    throw error;
  }
};

// Lấy thanh toán theo người dùng
export const getPaymentsByUserId = async (userId: string) => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Không thể lấy thanh toán của người dùng');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thanh toán của người dùng:', error);
    throw error;
  }
};

// Lấy thanh toán theo khóa học
export const getPaymentsByCourseId = async (courseId: string) => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/course/${courseId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Không thể lấy thanh toán của khóa học');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thanh toán của khóa học:', error);
    throw error;
  }
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (id: string, status: string) => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error('Không thể cập nhật trạng thái thanh toán');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
    throw error;
  }
};

// Hoàn tiền
export const refundPayment = async (id: string, reason: string) => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/${id}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) throw new Error('Không thể hoàn tiền');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi hoàn tiền:', error);
    throw error;
  }
};

// Lấy thống kê thanh toán
export const getPaymentStatistics = async (period: string = 'month') => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_URL}/statistics?period=${period}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Không thể lấy thống kê thanh toán');
    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thống kê thanh toán:', error);
    throw error;
  }
};

// Xuất báo cáo thanh toán
export const exportPaymentReport = async (startDate: string, endDate: string) => {
  const token = getAuthToken();
  try {
    const queryParams = new URLSearchParams({ startDate, endDate }).toString();
    const response = await fetch(`${API_URL}/export?${queryParams}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Không thể xuất báo cáo thanh toán');
    const blob = await response.blob(); // Đọc blob dữ liệu
    return blob;  // Trả về dữ liệu blob của báo cáo thanh toán
  } catch (error) {
    console.error('Lỗi khi xuất báo cáo thanh toán:', error);
    throw error;
  }
};
