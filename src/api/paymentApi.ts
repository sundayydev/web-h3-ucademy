import { jwtDecode } from 'jwt-decode';
import { CreateOrderDto, CreatePaymentResponse, PaymentCallbackResponse } from '@/types/payment';
// Định nghĩa API URL từ biến môi trường
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Payment`;

// Hàm lấy token từ localStorage
export const getAuthToken = (): string => {
  const token = localStorage.getItem('authToken');
  if (!token) throw new Error('Không tìm thấy token');
  return token;
};

// Hàm giải mã token JWT
export const getDecodedToken = () => {
  const token = getAuthToken();
  return jwtDecode(token);
};
// Hàm gọi POST /api/Payment/create-payment-url
export const createPayment = async (order: CreateOrderDto): Promise<CreatePaymentResponse> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/create-payment-url`, {
      method: 'POST',
      headers: {
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
      },
      body: JSON.stringify(order),
      cache: 'no-store',
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
    console.error('Lỗi khi tạo URL thanh toán:', error);
    throw error;
  }
};

// Hàm gọi GET /api/Payment/payment-callback
export const paymentCallback = async (queryParams: Record<string, string>): Promise<PaymentCallbackResponse> => {
  try {
    const token = getAuthToken();
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${API_URL}/payment-callback?${queryString}`, {
      method: 'GET',
      headers: {
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
      },
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Không thể xuất báo cáo thanh toán');
    const blob = await response.blob(); // Đọc blob dữ liệu
    return blob;  // Trả về dữ liệu blob của báo cáo thanh toán
  } catch (error) {
    console.error('Lỗi khi xử lý callback thanh toán:', error);
    throw error;
  }
};